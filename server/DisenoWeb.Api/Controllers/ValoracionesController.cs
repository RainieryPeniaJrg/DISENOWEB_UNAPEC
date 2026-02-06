using DisenoWeb.Api.Models;
using DisenoWeb.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DisenoWeb.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ValoracionesController(
    IRepository<Valoracion> repo,
    IRepository<User> usuariosRepo,
    IRepository<SitioTuristico> sitiosRepo,
    IRepository<Hotel> hotelesRepo) : ControllerBase
{
    private readonly IRepository<Valoracion> _repo = repo;
    private readonly IRepository<User> _usuariosRepo = usuariosRepo;
    private readonly IRepository<SitioTuristico> _sitiosRepo = sitiosRepo;
    private readonly IRepository<Hotel> _hotelesRepo = hotelesRepo;

    [HttpGet]
    public async Task<IEnumerable<Valoracion>> GetAll() => await _repo.GetAllAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Valoracion>> Get(Guid id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpGet("sitio/{sitioId:guid}")]
    public async Task<ActionResult<IEnumerable<Valoracion>>> GetBySitio(Guid sitioId)
    {
        if (!await SitioExists(sitioId)) return NotFound("Sitio turístico no existe");
        var valoraciones = (await _repo.GetAllAsync())
            .Where(v => v.SitioId == sitioId)
            .OrderByDescending(v => v.Fecha);
        return Ok(valoraciones);
    }

    [HttpGet("hotel/{hotelId:guid}")]
    public async Task<ActionResult<IEnumerable<Valoracion>>> GetByHotel(Guid hotelId)
    {
        if (!await HotelExists(hotelId)) return NotFound("Hotel no existe");
        var valoraciones = (await _repo.GetAllAsync())
            .Where(v => v.HotelId == hotelId)
            .OrderByDescending(v => v.Fecha);
        return Ok(valoraciones);
    }

    [HttpGet("sitio/{sitioId:guid}/estadisticas")]
    public async Task<ActionResult<EstadisticasValoracion>> GetEstadisticasSitio(Guid sitioId)
    {
        if (!await SitioExists(sitioId)) return NotFound("Sitio turístico no existe");
        var stats = CalcularEstadisticas((await _repo.GetAllAsync()).Where(v => v.SitioId == sitioId));
        return Ok(stats);
    }

    [HttpGet("hotel/{hotelId:guid}/estadisticas")]
    public async Task<ActionResult<EstadisticasValoracion>> GetEstadisticasHotel(Guid hotelId)
    {
        if (!await HotelExists(hotelId)) return NotFound("Hotel no existe");
        var stats = CalcularEstadisticas((await _repo.GetAllAsync()).Where(v => v.HotelId == hotelId));
        return Ok(stats);
    }

    [HttpPost]
    public async Task<ActionResult<Valoracion>> Create(Valoracion valoracion)
    {
        var validation = await ValidateValoracionAsync(valoracion, valoracion.Id);
        if (validation is not null) return validation;

        var created = await _repo.AddAsync(valoracion);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, Valoracion valoracion)
    {
        if (id != valoracion.Id) return BadRequest();

        var validation = await ValidateValoracionAsync(valoracion, id);
        if (validation is not null) return validation;

        var ok = await _repo.UpdateAsync(valoracion);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _repo.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    private async Task<ActionResult?> ValidateValoracionAsync(Valoracion valoracion, Guid currentId)
    {
        if (valoracion.Puntuacion is < 1 or > 5)
        {
            return BadRequest("Puntuación debe estar entre 1 y 5");
        }

        if (valoracion.UsuarioId == Guid.Empty || !await UsuarioExists(valoracion.UsuarioId))
        {
            return BadRequest("Usuario inválido");
        }

        var destinoValido = await DestinoValidoAsync(valoracion.SitioId, valoracion.HotelId);
        if (destinoValido is not null) return destinoValido;

        var duplicada = (await _repo.GetAllAsync())
            .Any(v => v.Id != currentId && v.UsuarioId == valoracion.UsuarioId && v.SitioId == valoracion.SitioId && v.HotelId == valoracion.HotelId);
        if (duplicada) return Conflict("El usuario ya valoró este destino");

        return null;
    }

    private EstadisticasValoracion CalcularEstadisticas(IEnumerable<Valoracion> valoraciones)
    {
        var lista = valoraciones.ToList();
        var total = lista.Count;
        var promedio = total == 0 ? 0 : Math.Round(lista.Average(v => v.Puntuacion), 2);
        return new EstadisticasValoracion(total, promedio);
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

    public record EstadisticasValoracion(int Total, double Promedio);
}
