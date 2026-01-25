using DisenoWeb.Api.Models;
using DisenoWeb.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DisenoWeb.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ValoracionesController(IRepository<Valoracion> repo, IRepository<User> usuariosRepo, IRepository<SitioTuristico> sitiosRepo) : ControllerBase
{
    private readonly IRepository<Valoracion> _repo = repo;
    private readonly IRepository<User> _usuariosRepo = usuariosRepo;
    private readonly IRepository<SitioTuristico> _sitiosRepo = sitiosRepo;

    [HttpGet]
    public async Task<IEnumerable<Valoracion>> GetAll() => await _repo.GetAllAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Valoracion>> Get(Guid id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<Valoracion>> Create(Valoracion valoracion)
    {
        if (!await UsuarioExists(valoracion.UsuarioId) || !await SitioExists(valoracion.SitioId))
        {
            return BadRequest("Usuario o Sitio inválido");
        }
        if (valoracion.Puntuacion is < 1 or > 5)
        {
            return BadRequest("Puntuación debe estar entre 1 y 5");
        }

        var existing = (await _repo.GetAllAsync()).FirstOrDefault(v => v.UsuarioId == valoracion.UsuarioId && v.SitioId == valoracion.SitioId);
        if (existing is not null)
        {
            return Conflict("El usuario ya valoró este sitio");
        }

        var created = await _repo.AddAsync(valoracion);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, Valoracion valoracion)
    {
        if (id != valoracion.Id) return BadRequest();
        if (!await UsuarioExists(valoracion.UsuarioId) || !await SitioExists(valoracion.SitioId))
        {
            return BadRequest("Usuario o Sitio inválido");
        }
        if (valoracion.Puntuacion is < 1 or > 5)
        {
            return BadRequest("Puntuación debe estar entre 1 y 5");
        }
        var ok = await _repo.UpdateAsync(valoracion);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _repo.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    private async Task<bool> UsuarioExists(Guid id) => (await _usuariosRepo.GetByIdAsync(id)) is not null;
    private async Task<bool> SitioExists(Guid id) => (await _sitiosRepo.GetByIdAsync(id)) is not null;
}
