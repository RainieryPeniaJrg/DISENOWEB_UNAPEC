using DisenoWeb.Api.Models;
using DisenoWeb.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DisenoWeb.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReaccionesController(
    IRepository<Reaccion> repo,
    IRepository<User> usuariosRepo,
    IRepository<SitioTuristico> sitiosRepo,
    IRepository<Hotel> hotelesRepo) : ControllerBase
{
    private readonly IRepository<Reaccion> _repo = repo;
    private readonly IRepository<User> _usuariosRepo = usuariosRepo;
    private readonly IRepository<SitioTuristico> _sitiosRepo = sitiosRepo;
    private readonly IRepository<Hotel> _hotelesRepo = hotelesRepo;

    [HttpGet]
    public async Task<IEnumerable<Reaccion>> GetAll() => await _repo.GetAllAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Reaccion>> Get(Guid id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpGet("sitio/{sitioId:guid}")]
    public async Task<ActionResult<IEnumerable<Reaccion>>> GetBySitio(Guid sitioId)
    {
        if (!await SitioExists(sitioId)) return NotFound("Sitio turístico no existe");
        var reacciones = (await _repo.GetAllAsync())
            .Where(r => r.SitioId == sitioId)
            .OrderByDescending(r => r.Fecha);
        return Ok(reacciones);
    }

    [HttpGet("hotel/{hotelId:guid}")]
    public async Task<ActionResult<IEnumerable<Reaccion>>> GetByHotel(Guid hotelId)
    {
        if (!await HotelExists(hotelId)) return NotFound("Hotel no existe");
        var reacciones = (await _repo.GetAllAsync())
            .Where(r => r.HotelId == hotelId)
            .OrderByDescending(r => r.Fecha);
        return Ok(reacciones);
    }

    [HttpGet("sitio/{sitioId:guid}/estadisticas")]
    public async Task<ActionResult<EstadisticasReaccion>> GetEstadisticasSitio(Guid sitioId)
    {
        if (!await SitioExists(sitioId)) return NotFound("Sitio turístico no existe");
        var stats = CalcularEstadisticas((await _repo.GetAllAsync()).Where(r => r.SitioId == sitioId));
        return Ok(stats);
    }

    [HttpGet("hotel/{hotelId:guid}/estadisticas")]
    public async Task<ActionResult<EstadisticasReaccion>> GetEstadisticasHotel(Guid hotelId)
    {
        if (!await HotelExists(hotelId)) return NotFound("Hotel no existe");
        var stats = CalcularEstadisticas((await _repo.GetAllAsync()).Where(r => r.HotelId == hotelId));
        return Ok(stats);
    }

    [HttpPost]
    public async Task<ActionResult<Reaccion>> Create(Reaccion reaccion)
    {
        var validation = await ValidateReaccionAsync(reaccion, reaccion.Id);
        if (validation is not null) return validation;

        var created = await _repo.AddAsync(reaccion);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, Reaccion reaccion)
    {
        if (id != reaccion.Id) return BadRequest();

        var validation = await ValidateReaccionAsync(reaccion, id);
        if (validation is not null) return validation;

        var ok = await _repo.UpdateAsync(reaccion);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _repo.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    private async Task<ActionResult?> ValidateReaccionAsync(Reaccion reaccion, Guid currentId)
    {
        if (reaccion.UsuarioId == Guid.Empty || !await UsuarioExists(reaccion.UsuarioId))
        {
            return BadRequest("Usuario inválido");
        }

        var destinoValido = await DestinoValidoAsync(reaccion.SitioId, reaccion.HotelId);
        if (destinoValido is not null) return destinoValido;

        var duplicada = (await _repo.GetAllAsync())
            .Any(r => r.Id != currentId && r.UsuarioId == reaccion.UsuarioId && r.SitioId == reaccion.SitioId && r.HotelId == reaccion.HotelId);
        if (duplicada) return Conflict("El usuario ya reaccionó a este destino");

        return null;
    }

    private EstadisticasReaccion CalcularEstadisticas(IEnumerable<Reaccion> reacciones)
    {
        var lista = reacciones.ToList();
        var likes = lista.Count(r => r.MeGusta);
        var dislikes = lista.Count - likes;
        var promedioMeGusta = lista.Count == 0 ? 0 : Math.Round((double)likes / lista.Count, 2);

        return new EstadisticasReaccion(lista.Count, likes, dislikes, promedioMeGusta);
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
    private async Task<bool> SitioExists(Guid id) => (await _sitiosRepo.GetByIdAsync(id)) is not null;
    private async Task<bool> HotelExists(Guid id) => (await _hotelesRepo.GetByIdAsync(id)) is not null;

    public record EstadisticasReaccion(int Total, int Likes, int Dislikes, double PromedioMeGusta);
}
