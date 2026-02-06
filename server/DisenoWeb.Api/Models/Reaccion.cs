namespace DisenoWeb.Api.Models;

public class Reaccion : IEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public bool MeGusta { get; set; }
    public DateTime Fecha { get; set; } = DateTime.UtcNow;
    public Guid UsuarioId { get; set; }
    public Guid? SitioId { get; set; }
    public Guid? HotelId { get; set; }
}
