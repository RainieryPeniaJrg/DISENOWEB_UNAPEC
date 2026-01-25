using DisenoWeb.Api.Models;
using DisenoWeb.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DisenoWeb.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComentariosController(
    IRepository<Comentario> repo,
    IRepository<User> usuariosRepo,
    IRepository<SitioTuristico> sitiosRepo,
    IRepository<Hotel> hotelesRepo) : ControllerBase
{
    private readonly IRepository<Comentario> _repo = repo;
    private readonly IRepository<User> _usuariosRepo = usuariosRepo;
    private readonly IRepository<SitioTuristico> _sitiosRepo = sitiosRepo;
    private readonly IRepository<Hotel> _hotelesRepo = hotelesRepo;

    [HttpGet]
    public async Task<IEnumerable<Comentario>> GetAll() => await _repo.GetAllAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Comentario>> Get(Guid id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpGet("sitio/{sitioId:guid}")]
    public async Task<ActionResult<IEnumerable<Comentario>>> GetBySitio(Guid sitioId)
    {
        if (!await SitioExists(sitioId)) return NotFound("Sitio turístico no existe");
        var comentarios = (await _repo.GetAllAsync())
            .Where(c => c.SitioId == sitioId)
            .OrderBy(c => c.Fecha);
        return Ok(comentarios);
    }

    [HttpGet("hotel/{hotelId:guid}")]
    public async Task<ActionResult<IEnumerable<Comentario>>> GetByHotel(Guid hotelId)
    {
        if (!await HotelExists(hotelId)) return NotFound("Hotel no existe");
        var comentarios = (await _repo.GetAllAsync())
            .Where(c => c.HotelId == hotelId)
            .OrderBy(c => c.Fecha);
        return Ok(comentarios);
    }

    [HttpPost]
    public async Task<ActionResult<Comentario>> Create(Comentario comentario)
    {
        var validation = await ValidateComentarioAsync(comentario, comentario.Id);
        if (validation is not null) return validation;

        var created = await _repo.AddAsync(comentario);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPost("{id:guid}/responder")]
    public async Task<ActionResult<Comentario>> Responder(Guid id, [FromBody] ResponderComentarioRequest request)
    {
        var parent = await _repo.GetByIdAsync(id);
        if (parent is null) return NotFound("Comentario padre no existe");

        var respuesta = new Comentario
        {
            Texto = request.Texto,
            UsuarioId = request.UsuarioId,
            SitioId = parent.SitioId,
            HotelId = parent.HotelId,
            ParentComentarioId = id
        };

        var validation = await ValidateComentarioAsync(respuesta, respuesta.Id);
        if (validation is not null) return validation;

        var created = await _repo.AddAsync(respuesta);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, Comentario comentario)
    {
        if (id != comentario.Id) return BadRequest();

        var validation = await ValidateComentarioAsync(comentario, id);
        if (validation is not null) return validation;

        var ok = await _repo.UpdateAsync(comentario);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _repo.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    private async Task<ActionResult?> ValidateComentarioAsync(Comentario comentario, Guid currentId)
    {
        if (comentario.UsuarioId == Guid.Empty || !await UsuarioExists(comentario.UsuarioId))
        {
            return BadRequest("Usuario inválido");
        }

        if (comentario.ParentComentarioId.HasValue)
        {
            if (comentario.ParentComentarioId == currentId)
            {
                return BadRequest("Un comentario no puede responderse a sí mismo");
            }

            var parent = await _repo.GetByIdAsync(comentario.ParentComentarioId.Value);
            if (parent is null) return BadRequest("Comentario padre no existe");

            if (!comentario.SitioId.HasValue && !comentario.HotelId.HasValue)
            {
                comentario.SitioId = parent.SitioId;
                comentario.HotelId = parent.HotelId;
            }

            var destinoPadreValido = await DestinoValidoAsync(comentario.SitioId, comentario.HotelId);
            if (destinoPadreValido is not null) return destinoPadreValido;

            if (parent.SitioId != comentario.SitioId || parent.HotelId != comentario.HotelId)
            {
                return BadRequest("El comentario padre debe pertenecer al mismo destino");
            }
        }
        else
        {
            var destinoValido = await DestinoValidoAsync(comentario.SitioId, comentario.HotelId);
            if (destinoValido is not null) return destinoValido;
        }

        return null;
    }

    private async Task<ActionResult?> DestinoValidoAsync(Guid? sitioId, Guid? hotelId)
    {
        var tieneSitio = sitioId.HasValue && sitioId != Guid.Empty;
        var tieneHotel = hotelId.HasValue && hotelId != Guid.Empty;

        if (tieneSitio == tieneHotel)
        {
            return BadRequest("Debe especificar solo SitioId o HotelId");
        }

        if (tieneSitio && !await SitioExists(sitioId!.Value))
        {
            return BadRequest("Sitio turístico no existe");
        }

        if (tieneHotel && !await HotelExists(hotelId!.Value))
        {
            return BadRequest("Hotel no existe");
        }

        return null;
    }

    private async Task<bool> UsuarioExists(Guid id) => (await _usuariosRepo.GetByIdAsync(id)) is not null;
    private async Task<bool> SitioExists(Guid? id) => id.HasValue && (await _sitiosRepo.GetByIdAsync(id.Value)) is not null;
    private async Task<bool> HotelExists(Guid? id) => id.HasValue && (await _hotelesRepo.GetByIdAsync(id.Value)) is not null;

    public record ResponderComentarioRequest(Guid UsuarioId, string Texto);
}
