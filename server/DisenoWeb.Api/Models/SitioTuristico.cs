namespace DisenoWeb.Api.Models;

public class SitioTuristico : IEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nombre { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string Ubicacion { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
}
