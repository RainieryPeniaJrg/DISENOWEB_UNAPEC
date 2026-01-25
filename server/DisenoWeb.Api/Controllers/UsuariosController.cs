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
    private const string RolUsuarioNombre = "USER";

    [HttpGet]
    public async Task<IEnumerable<User>> GetAll() => await _repo.GetAllAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<User>> Get(Guid id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var (roleId, roleError) = await GetUserRoleIdAsync();
        if (roleError is not null) return roleError;

        var existing = (await _repo.GetAllAsync()).FirstOrDefault(u => u.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase));
        if (existing is not null) return Conflict("El correo ya está registrado");

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = request.Password, // plaintext según requerimiento
            RoleId = roleId!.Value,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _repo.AddAsync(user);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, ToAuthResponse(created));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = (await _repo.GetAllAsync()).FirstOrDefault(u => u.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase));
        if (user is null) return Unauthorized("Credenciales inválidas");
        if (!string.Equals(user.PasswordHash, request.Password, StringComparison.Ordinal))
            return Unauthorized("Credenciales inválidas");

        return Ok(ToAuthResponse(user));
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

    private async Task<(Guid? roleId, ActionResult? error)> GetUserRoleIdAsync()
    {
        var roles = await _rolesRepo.GetAllAsync();
        var role = roles.FirstOrDefault(r => r.Name.Equals(RolUsuarioNombre, StringComparison.OrdinalIgnoreCase));
        if (role is null) return (null, BadRequest("Role USER no está configurado"));
        return (role.Id, null);
    }

    private static AuthResponse ToAuthResponse(User user) =>
        new(user.Id, user.Name, user.Email, user.RoleId, user.CreatedAt);

    public record RegisterRequest(string Name, string Email, string Password);
    public record LoginRequest(string Email, string Password);
    public record AuthResponse(Guid UserId, string Name, string Email, Guid RoleId, DateTime CreatedAt);
}
