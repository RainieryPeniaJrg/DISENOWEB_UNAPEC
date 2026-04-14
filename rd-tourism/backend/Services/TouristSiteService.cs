using RDTourism.API.Models;

namespace RDTourism.API.Services;

public interface ITouristSiteService
{
    List<TouristSite> GetAll(string? category = null, string? province = null);
    TouristSite? GetById(int id);
    List<string> GetCategories();
}

public class TouristSiteService : ITouristSiteService
{
    private readonly List<TouristSite> _sites = new()
    {
        new TouristSite
        {
            Id = 1,
            Name = "Playa Bávaro",
            Location = "Bávaro, Punta Cana",
            Province = "La Altagracia",
            Description = "Una de las playas más hermosas del mundo, con arena blanca coralina y aguas turquesas de color esmeralda. Reconocida internacionalmente como destino paradisíaco.",
            Category = "Playa",
            Rating = 4.9,
            ImageUrl = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
            IsFree = true,
            Activities = new List<string> { "Snorkeling", "Windsurf", "Kitesurf", "Catamarán", "Buceo" },
            BestTimeToVisit = "Diciembre - Abril"
        },
        new TouristSite
        {
            Id = 2,
            Name = "Ciudad Colonial de Santo Domingo",
            Location = "Santo Domingo",
            Province = "Distrito Nacional",
            Description = "Primera ciudad europea del Nuevo Mundo, declarada Patrimonio de la Humanidad por la UNESCO en 1990. Hogar de la primera catedral, universidad y hospital de América.",
            Category = "Histórico",
            Rating = 4.8,
            ImageUrl = "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=800",
            IsFree = true,
            EntryFee = null,
            Activities = new List<string> { "Tours Históricos", "Gastronomía", "Museos", "Fortaleza Ozama", "Parque Colón" },
            BestTimeToVisit = "Todo el año"
        },
        new TouristSite
        {
            Id = 3,
            Name = "Cascadas de Agua Blanca",
            Location = "Constanza",
            Province = "La Vega",
            Description = "Impresionante cascada de 80 metros en las montañas de la Cordillera Central. Un paraíso natural con agua cristalina y fresca, rodeado de exuberante vegetación.",
            Category = "Naturaleza",
            Rating = 4.7,
            ImageUrl = "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800",
            IsFree = false,
            EntryFee = 5,
            Activities = new List<string> { "Senderismo", "Natación", "Fotografía", "Picnic" },
            BestTimeToVisit = "Marzo - Noviembre"
        },
        new TouristSite
        {
            Id = 4,
            Name = "Bahía de las Águilas",
            Location = "Pedernales",
            Province = "Pedernales",
            Description = "Considerada la playa más virgen y espectacular de República Dominicana. Solo accesible en bote, con kilómetros de arena blanca intocada dentro del Parque Jaragua.",
            Category = "Playa",
            Rating = 4.9,
            ImageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
            IsFree = false,
            EntryFee = 15,
            Activities = new List<string> { "Snorkeling", "Buceo", "Senderismo", "Observación de Aves", "Camping" },
            BestTimeToVisit = "Diciembre - Abril"
        },
        new TouristSite
        {
            Id = 5,
            Name = "Pico Duarte",
            Location = "La Ciénaga, Jarabacoa",
            Province = "La Vega",
            Description = "El pico más alto de toda la cuenca del Caribe con 3,098 metros sobre el nivel del mar. Una aventura épica de senderismo con vistas incomparables.",
            Category = "Naturaleza",
            Rating = 4.8,
            ImageUrl = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
            IsFree = false,
            EntryFee = 25,
            Activities = new List<string> { "Montañismo", "Senderismo", "Camping", "Fotografía" },
            BestTimeToVisit = "Diciembre - Mayo"
        },
        new TouristSite
        {
            Id = 6,
            Name = "Altos de Chavón",
            Location = "La Romana",
            Province = "La Romana",
            Description = "Réplica de un pueblo medieval mediterráneo construido en los años 70 sobre el río Chavón. Alberga el famoso anfiteatro con capacidad para 5,000 personas y escuelas de arte.",
            Category = "Cultural",
            Rating = 4.6,
            ImageUrl = "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800",
            IsFree = false,
            EntryFee = 10,
            Activities = new List<string> { "Conciertos", "Gastronomía", "Compras", "Museo Arqueológico", "Fotografía" },
            BestTimeToVisit = "Todo el año"
        },
        new TouristSite
        {
            Id = 7,
            Name = "Playa Rincón",
            Location = "Las Galeras, Samaná",
            Province = "Samaná",
            Description = "Votada repetidamente como una de las mejores playas del Caribe. Kilómetros de arena dorada virgen bordeados de palmeras con agua de color turquesa espectacular.",
            Category = "Playa",
            Rating = 4.8,
            ImageUrl = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
            IsFree = true,
            Activities = new List<string> { "Snorkeling", "Natación", "Kayak", "Avistamiento de Ballenas (ene-mar)" },
            BestTimeToVisit = "Enero - Abril"
        },
        new TouristSite
        {
            Id = 8,
            Name = "Lago Enriquillo",
            Location = "Jimaní",
            Province = "Independencia",
            Description = "El lago más grande del Caribe insular y el punto más bajo de las Antillas. Hogar de cocodrilos, iguanas y flamencos. Un ecosistema único en el mundo.",
            Category = "Naturaleza",
            Rating = 4.5,
            ImageUrl = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
            IsFree = false,
            EntryFee = 8,
            Activities = new List<string> { "Avistamiento de Cocodrilos", "Observación de Aves", "Tours en Bote", "Fotografía" },
            BestTimeToVisit = "Noviembre - Abril"
        },
        new TouristSite
        {
            Id = 9,
            Name = "Carnaval de La Vega",
            Location = "La Vega",
            Province = "La Vega",
            Description = "El carnaval más antiguo y colorido de América. Declarado Patrimonio Cultural Inmaterial. Diablos Cojuelos con trajes de espejo y vejigazos en un espectáculo único.",
            Category = "Cultural",
            Rating = 4.9,
            ImageUrl = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
            IsFree = true,
            Activities = new List<string> { "Desfile de Carnaval", "Música", "Gastronomía", "Artesanía" },
            BestTimeToVisit = "Febrero - Marzo"
        }
    };

    public List<TouristSite> GetAll(string? category = null, string? province = null)
    {
        var query = _sites.AsQueryable();
        if (!string.IsNullOrEmpty(category))
            query = query.Where(s => s.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
        if (!string.IsNullOrEmpty(province))
            query = query.Where(s => s.Province.Contains(province, StringComparison.OrdinalIgnoreCase));
        return query.OrderByDescending(s => s.Rating).ToList();
    }

    public TouristSite? GetById(int id) => _sites.FirstOrDefault(s => s.Id == id);

    public List<string> GetCategories() => _sites.Select(s => s.Category).Distinct().OrderBy(c => c).ToList();
}
