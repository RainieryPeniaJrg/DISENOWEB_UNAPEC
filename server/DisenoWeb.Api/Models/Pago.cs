namespace DisenoWeb.Api.Models;

public class Pago : IEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string MetodoPago { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public DateTime FechaPago { get; set; } = DateTime.UtcNow;
    public string Estado { get; set; } = "pendiente";
    public Guid ReservacionId { get; set; }
}
