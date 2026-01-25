using DisenoWeb.Api.Models;
using DisenoWeb.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DisenoWeb.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComentariosController(IRepository<Comentario> repo, IRepository<User> usuariosRepo, IRepository<SitioTuristico> sitiosRepo) : ControllerBase
{
    private readonly IRepository<Comentario> _repo = repo;
    private readonly IRepository<User> _usuariosRepo = usuariosRepo;
    private readonly IRepository<SitioTuristico> _sitiosRepo = sitiosRepo;

    [HttpGet]
    public async Task<IEnumerable<Comentario>> GetAll() => await _repo.GetAllAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Comentario>> Get(Guid id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<Comentario>> Create(Comentario comentario)
    {
        if (!await UsuarioExists(comentario.UsuarioId) || !await SitioExists(comentario.SitioId))
        {
            return BadRequest("Usuario o Sitio inválido");
        }
        var created = await _repo.AddAsync(comentario);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, Comentario comentario)
    {
        if (id != comentario.Id) return BadRequest();
        if (!await UsuarioExists(comentario.UsuarioId) || !await SitioExists(comentario.SitioId))
        {
            return BadRequest("Usuario o Sitio inválido");
        }
        var ok = await _repo.UpdateAsync(comentario);
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
