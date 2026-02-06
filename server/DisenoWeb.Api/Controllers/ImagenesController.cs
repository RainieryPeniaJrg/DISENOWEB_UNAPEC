using DisenoWeb.Api.Models;
using DisenoWeb.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DisenoWeb.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImagenesController(
    IRepository<Imagen> repo,
    IRepository<SitioTuristico> sitiosRepo,
    IRepository<Hotel> hotelesRepo,
    IRepository<User> usuariosRepo,
    IWebHostEnvironment env) : ControllerBase
{
    private readonly IRepository<Imagen> _repo = repo;
    private readonly IRepository<SitioTuristico> _sitiosRepo = sitiosRepo;
    private readonly IRepository<Hotel> _hotelesRepo = hotelesRepo;
    private readonly IRepository<User> _usuariosRepo = usuariosRepo;
    private readonly IWebHostEnvironment _env = env;

    [HttpGet]
    public async Task<IEnumerable<Imagen>> GetAll() => await _repo.GetAllAsync();

    [HttpGet("sitio/{sitioId:guid}")]
    public async Task<ActionResult<IEnumerable<Imagen>>> GetBySitio(Guid sitioId)
    {
        if (!await SitioExists(sitioId)) return NotFound("Sitio no existe");
        var items = (await _repo.GetAllAsync()).Where(i => i.SitioId == sitioId);
        return Ok(items);
    }

    [HttpGet("hotel/{hotelId:guid}")]
    public async Task<ActionResult<IEnumerable<Imagen>>> GetByHotel(Guid hotelId)
    {
        if (!await HotelExists(hotelId)) return NotFound("Hotel no existe");
        var items = (await _repo.GetAllAsync()).Where(i => i.HotelId == hotelId);
        return Ok(items);
    }

    [HttpGet("usuario/{usuarioId:guid}")]
    public async Task<ActionResult<IEnumerable<Imagen>>> GetByUsuario(Guid usuarioId)
    {
        if (!await UsuarioExists(usuarioId)) return NotFound("Usuario no existe");
        var items = (await _repo.GetAllAsync()).Where(i => i.UsuarioId == usuarioId);
        return Ok(items);
    }

    [HttpPost("sitio/{sitioId:guid}")]
    public async Task<ActionResult<IEnumerable<Imagen>>> UploadSitio(Guid sitioId, [FromForm] IList<IFormFile> files)
    {
        if (!await SitioExists(sitioId)) return NotFound("Sitio no existe");
        var created = await SaveFilesForEntity(files, sitioId, null, null);
        return Created(nameof(GetBySitio), created);
    }

    [HttpPost("hotel/{hotelId:guid}")]
    public async Task<ActionResult<IEnumerable<Imagen>>> UploadHotel(Guid hotelId, [FromForm] IList<IFormFile> files)
    {
        if (!await HotelExists(hotelId)) return NotFound("Hotel no existe");
        var created = await SaveFilesForEntity(files, null, hotelId, null);
        return Created(nameof(GetByHotel), created);
    }

    [HttpPost("usuario/{usuarioId:guid}")]
    public async Task<ActionResult<IEnumerable<Imagen>>> UploadUsuario(Guid usuarioId, [FromForm] IList<IFormFile> files)
    {
        if (!await UsuarioExists(usuarioId)) return NotFound("Usuario no existe");
        var created = await SaveFilesForEntity(files, null, null, usuarioId);
        return Created(nameof(GetByUsuario), created);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var imagen = await _repo.GetByIdAsync(id);
        if (imagen is null) return NotFound();

        await DeletePhysicalFile(imagen);
        var ok = await _repo.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    private async Task<IEnumerable<Imagen>> SaveFilesForEntity(IList<IFormFile> files, Guid? sitioId, Guid? hotelId, Guid? usuarioId)
    {
        if (files.Count == 0) return Enumerable.Empty<Imagen>();

        var uploadsRoot = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "uploads");
        var entityFolder = sitioId.HasValue ? "sitios" : hotelId.HasValue ? "hoteles" : "usuarios";
        var targetDir = Path.Combine(uploadsRoot, entityFolder);
        Directory.CreateDirectory(targetDir);

        var existentes = await _repo.GetAllAsync();
        var result = new List<Imagen>();

        foreach (var file in files)
        {
            if (file.Length == 0) continue;
            var ext = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{ext}";
            var savePath = Path.Combine(targetDir, fileName);

            await using (var stream = System.IO.File.Create(savePath))
            {
                await file.CopyToAsync(stream);
            }

            var relativeUrl = $"/uploads/{entityFolder}/{fileName}";
            var imagen = new Imagen
            {
                Url = relativeUrl,
                FileName = file.FileName,
                Descripcion = Path.GetFileNameWithoutExtension(file.FileName),
                EsPrincipal = false,
                SitioId = sitioId,
                HotelId = hotelId,
                UsuarioId = usuarioId
            };

            // si no hay principal previa para la entidad, marca la primera como principal
            var tienePrincipal = existentes.Any(i =>
                i.EsPrincipal &&
                i.SitioId == sitioId &&
                i.HotelId == hotelId &&
                i.UsuarioId == usuarioId);
            if (!tienePrincipal && result.Count == 0)
            {
                imagen.EsPrincipal = true;
            }

            var created = await _repo.AddAsync(imagen);
            result.Add(created);
            existentes = existentes.Append(created);
        }

        return result;
    }

    private async Task DeletePhysicalFile(Imagen imagen)
    {
        if (string.IsNullOrWhiteSpace(imagen.Url)) return;
        var root = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var physical = Path.Combine(root, imagen.Url.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
        if (System.IO.File.Exists(physical))
        {
            try { System.IO.File.Delete(physical); } catch { /* ignore */ }
        }
    }

    private async Task<bool> SitioExists(Guid id) => (await _sitiosRepo.GetByIdAsync(id)) is not null;
    private async Task<bool> HotelExists(Guid id) => (await _hotelesRepo.GetByIdAsync(id)) is not null;
    private async Task<bool> UsuarioExists(Guid id) => (await _usuariosRepo.GetByIdAsync(id)) is not null;
}
