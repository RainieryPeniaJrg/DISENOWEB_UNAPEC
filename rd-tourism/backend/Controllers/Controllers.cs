using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RDTourism.API.Models;
using RDTourism.API.Services;

namespace RDTourism.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TouristSitesController : ControllerBase
{
    private readonly ITouristSiteService _siteService;

    public TouristSitesController(ITouristSiteService siteService)
    {
        _siteService = siteService;
    }

    [HttpGet]
    public ActionResult<List<TouristSite>> GetAll(
        [FromQuery] string? category = null,
        [FromQuery] string? province = null)
    {
        return Ok(_siteService.GetAll(category, province));
    }

    [HttpGet("{id}")]
    public ActionResult<TouristSite> GetById(int id)
    {
        var site = _siteService.GetById(id);
        if (site == null) return NotFound();
        return Ok(site);
    }

    [HttpGet("categories")]
    public ActionResult<List<string>> GetCategories()
    {
        return Ok(_siteService.GetCategories());
    }
}

// ──────────────────────────────────────────────────────────────────────────────

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public ActionResult<LoginResponse> Login([FromBody] LoginRequest request)
    {
        var result = _authService.Login(request);
        if (result == null) return Unauthorized(new { message = "Credenciales incorrectas" });
        return Ok(result);
    }

    [HttpPost("register")]
    public ActionResult Register([FromBody] RegisterRequest request)
    {
        if (!_authService.Register(request))
            return Conflict(new { message = "El correo ya está registrado" });
        return Ok(new { message = "Usuario registrado exitosamente" });
    }
}
