using DisenoWeb.Api.Models;
using DisenoWeb.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DisenoWeb.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HotelesController(IRepository<Hotel> repo, IRepository<SitioTuristico> sitiosRepo, IRepository<Imagen> imagenesRepo) : ControllerBase
{
    private readonly IRepository<Hotel> _repo = repo;
    private readonly IRepository<SitioTuristico> _sitiosRepo = sitiosRepo;
    private readonly IRepository<Imagen> _imagenesRepo = imagenesRepo;

    [HttpGet]
    public async Task<IEnumerable<HotelConImagenes>> GetAll()
    {
        var hoteles = await _repo.GetAllAsync();
        var imgs = await _imagenesRepo.GetAllAsync();
        return hoteles.Select(h => new HotelConImagenes(h, imgs.Where(i => i.HotelId == h.Id)));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<HotelConImagenes>> Get(Guid id)
    {
        var item = await _repo.GetByIdAsync(id);
        if (item is null) return NotFound();
        var imgs = (await _imagenesRepo.GetAllAsync()).Where(i => i.HotelId == id);
        return Ok(new HotelConImagenes(item, imgs));
    }

    [HttpPost]
    public async Task<ActionResult<HotelConImagenes>> Create(Hotel hotel)
    {
        if (!await SitioExists(hotel.SitioId)) return BadRequest("Sitio turístico no existe");
        var created = await _repo.AddAsync(hotel);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, new HotelConImagenes(created, Enumerable.Empty<Imagen>()));
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

    public record HotelConImagenes(Hotel Hotel, IEnumerable<Imagen> Imagenes);
}
