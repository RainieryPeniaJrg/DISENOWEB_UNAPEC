namespace DisenoWeb.Api.Models;

public class Comentario : IEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Texto { get; set; } = string.Empty;
    public DateTime Fecha { get; set; } = DateTime.UtcNow;
    public Guid UsuarioId { get; set; }
    public Guid SitioId { get; set; }
}
