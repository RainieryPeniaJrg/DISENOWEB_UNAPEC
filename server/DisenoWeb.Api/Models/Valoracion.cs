namespace DisenoWeb.Api.Models;

public class Valoracion : IEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public int Puntuacion { get; set; }
    public DateTime Fecha { get; set; } = DateTime.UtcNow;
    public Guid UsuarioId { get; set; }
    public Guid SitioId { get; set; }
}
