namespace DisenoWeb.Api.Models;

public class Reservacion : IEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public string Estado { get; set; } = "pendiente";
    public decimal Total { get; set; }
    public Guid UsuarioId { get; set; }
    public Guid HotelId { get; set; }
}
