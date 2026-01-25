using DisenoWeb.Api.Models;
using DisenoWeb.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DisenoWeb.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController(IRepository<User> repo, IRepository<Role> rolesRepo) : ControllerBase
{
    private readonly IRepository<User> _repo = repo;
    private readonly IRepository<Role> _rolesRepo = rolesRepo;

    [HttpGet]
    public async Task<IEnumerable<User>> GetAll() => await _repo.GetAllAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<User>> Get(Guid id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<User>> Create(User user)
    {
        if (!await RoleExists(user.RoleId)) return BadRequest("Role no existe");
        var created = await _repo.AddAsync(user);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, User user)
    {
        if (id != user.Id) return BadRequest();
        if (!await RoleExists(user.RoleId)) return BadRequest("Role no existe");
        var ok = await _repo.UpdateAsync(user);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _repo.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    private async Task<bool> RoleExists(Guid roleId) => (await _rolesRepo.GetByIdAsync(roleId)) is not null;
}
