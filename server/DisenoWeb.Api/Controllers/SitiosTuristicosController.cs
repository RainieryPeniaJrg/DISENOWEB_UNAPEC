using DisenoWeb.Api.Models;
using DisenoWeb.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DisenoWeb.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SitiosTuristicosController(IRepository<SitioTuristico> repo) : ControllerBase
{
    private readonly IRepository<SitioTuristico> _repo = repo;

    [HttpGet]
    public async Task<IEnumerable<SitioTuristico>> GetAll() => await _repo.GetAllAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SitioTuristico>> Get(Guid id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<SitioTuristico>> Create(SitioTuristico sitio)
    {
        var created = await _repo.AddAsync(sitio);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, SitioTuristico sitio)
    {
        if (id != sitio.Id) return BadRequest();
        var ok = await _repo.UpdateAsync(sitio);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _repo.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
