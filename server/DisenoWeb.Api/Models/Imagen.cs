namespace DisenoWeb.Api.Models;

public class Imagen : IEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Url { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public bool EsPrincipal { get; set; } = false;
    public Guid? SitioId { get; set; }
    public Guid? HotelId { get; set; }
    public Guid? UsuarioId { get; set; }
}
