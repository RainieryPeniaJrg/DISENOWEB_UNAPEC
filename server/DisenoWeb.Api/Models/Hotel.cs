namespace DisenoWeb.Api.Models;

public class Hotel : IEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nombre { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public decimal PrecioNoche { get; set; }
    public Guid SitioId { get; set; }
    public bool Activo { get; set; } = true;
}
