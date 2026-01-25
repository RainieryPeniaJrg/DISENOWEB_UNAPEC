using DisenoWeb.Api.Models;
using DisenoWeb.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DisenoWeb.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservacionesController(IRepository<Reservacion> repo, IRepository<User> usuariosRepo, IRepository<Hotel> hotelesRepo) : ControllerBase
{
    private readonly IRepository<Reservacion> _repo = repo;
    private readonly IRepository<User> _usuariosRepo = usuariosRepo;
    private readonly IRepository<Hotel> _hotelesRepo = hotelesRepo;

    [HttpGet]
    public async Task<IEnumerable<Reservacion>> GetAll() => await _repo.GetAllAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Reservacion>> Get(Guid id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<Reservacion>> Create(Reservacion reservacion)
    {
        if (!await UsuarioExists(reservacion.UsuarioId) || !await HotelExists(reservacion.HotelId))
        {
            return BadRequest("Usuario o Hotel inválido");
        }
        if (reservacion.FechaInicio > reservacion.FechaFin)
        {
            return BadRequest("Fecha de inicio debe ser anterior o igual a fecha fin");
        }
        var created = await _repo.AddAsync(reservacion);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, Reservacion reservacion)
    {
        if (id != reservacion.Id) return BadRequest();
        if (!await UsuarioExists(reservacion.UsuarioId) || !await HotelExists(reservacion.HotelId))
        {
            return BadRequest("Usuario o Hotel inválido");
        }
        if (reservacion.FechaInicio > reservacion.FechaFin)
        {
            return BadRequest("Fecha de inicio debe ser anterior o igual a fecha fin");
        }
        var ok = await _repo.UpdateAsync(reservacion);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _repo.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    private async Task<bool> UsuarioExists(Guid id) => (await _usuariosRepo.GetByIdAsync(id)) is not null;
    private async Task<bool> HotelExists(Guid id) => (await _hotelesRepo.GetByIdAsync(id)) is not null;
}
