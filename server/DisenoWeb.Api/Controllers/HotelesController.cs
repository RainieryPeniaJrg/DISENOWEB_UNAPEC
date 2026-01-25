using DisenoWeb.Api.Models;
using DisenoWeb.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DisenoWeb.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HotelesController(IRepository<Hotel> repo, IRepository<SitioTuristico> sitiosRepo) : ControllerBase
{
    private readonly IRepository<Hotel> _repo = repo;
    private readonly IRepository<SitioTuristico> _sitiosRepo = sitiosRepo;

    [HttpGet]
    public async Task<IEnumerable<Hotel>> GetAll() => await _repo.GetAllAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Hotel>> Get(Guid id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<Hotel>> Create(Hotel hotel)
    {
        if (!await SitioExists(hotel.SitioId)) return BadRequest("Sitio turístico no existe");
        var created = await _repo.AddAsync(hotel);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, Hotel hotel)
    {
        if (id != hotel.Id) return BadRequest();
        if (!await SitioExists(hotel.SitioId)) return BadRequest("Sitio turístico no existe");
        var ok = await _repo.UpdateAsync(hotel);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _repo.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    private async Task<bool> SitioExists(Guid sitioId) => (await _sitiosRepo.GetByIdAsync(sitioId)) is not null;
}
