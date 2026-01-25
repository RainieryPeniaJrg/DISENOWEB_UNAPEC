using DisenoWeb.Api.Models;
using DisenoWeb.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DisenoWeb.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SitiosTuristicosController(IRepository<SitioTuristico> repo, IRepository<Imagen> imagenesRepo) : ControllerBase
{
    private readonly IRepository<SitioTuristico> _repo = repo;
    private readonly IRepository<Imagen> _imagenesRepo = imagenesRepo;

    [HttpGet]
    public async Task<IEnumerable<SitioConImagenes>> GetAll()
    {
        var sitios = await _repo.GetAllAsync();
        var imgs = await _imagenesRepo.GetAllAsync();
        return sitios.Select(s => new SitioConImagenes(s, imgs.Where(i => i.SitioId == s.Id)));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SitioConImagenes>> Get(Guid id)
    {
        var item = await _repo.GetByIdAsync(id);
        if (item is null) return NotFound();
        var imgs = (await _imagenesRepo.GetAllAsync()).Where(i => i.SitioId == id);
        return Ok(new SitioConImagenes(item, imgs));
    }

    [HttpPost]
    public async Task<ActionResult<SitioConImagenes>> Create(SitioTuristico sitio)
    {
        var created = await _repo.AddAsync(sitio);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, new SitioConImagenes(created, Enumerable.Empty<Imagen>()));
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

    public record SitioConImagenes(SitioTuristico Sitio, IEnumerable<Imagen> Imagenes);
}
