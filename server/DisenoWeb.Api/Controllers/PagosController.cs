using DisenoWeb.Api.Models;
using DisenoWeb.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DisenoWeb.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PagosController(IRepository<Pago> repo, IRepository<Reservacion> reservacionesRepo) : ControllerBase
{
    private readonly IRepository<Pago> _repo = repo;
    private readonly IRepository<Reservacion> _reservacionesRepo = reservacionesRepo;

    [HttpGet]
    public async Task<IEnumerable<Pago>> GetAll() => await _repo.GetAllAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Pago>> Get(Guid id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<Pago>> Create(Pago pago)
    {
        if (!await ReservacionExists(pago.ReservacionId)) return BadRequest("Reservación no existe");
        var created = await _repo.AddAsync(pago);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, Pago pago)
    {
        if (id != pago.Id) return BadRequest();
        if (!await ReservacionExists(pago.ReservacionId)) return BadRequest("Reservación no existe");
        var ok = await _repo.UpdateAsync(pago);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _repo.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    private async Task<bool> ReservacionExists(Guid id) => (await _reservacionesRepo.GetByIdAsync(id)) is not null;
}
