using RDTourism.API.Models;

namespace RDTourism.API.Services;

public interface IHotelService
{
    List<Hotel> GetAll(string? province = null, string? category = null, int? stars = null);
    Hotel? GetById(int id);
    List<string> GetProvinces();
}

public class HotelService : IHotelService
{
    private readonly List<Hotel> _hotels = new()
    {
        new Hotel
        {
            Id = 1,
            Name = "Hard Rock Hotel & Casino Punta Cana",
            Location = "Playa Arena Gorda, Punta Cana",
            Province = "La Altagracia",
            Description = "Icónico resort todo incluido con amplia playa privada, múltiples piscinas y el mejor entretenimiento de Punta Cana. Experiencia rock & roll de lujo frente al mar Caribe.",
            Rating = 4.6,
            Stars = 5,
            PricePerNight = 420,
            Currency = "USD",
            ImageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
            Amenities = new List<string> { "Todo Incluido", "Casino", "Spa", "Golf", "5 Piscinas", "Playa Privada", "WiFi", "Gym" },
            Category = "Resort",
            IsAllInclusive = true,
            Phone = "+1 809-731-0099",
            Website = "https://www.hardrockhotels.com"
        },
        new Hotel
        {
            Id = 2,
            Name = "Barceló Bávaro Grand Resort",
            Location = "Playa Bávaro, Punta Cana",
            Province = "La Altagracia",
            Description = "Uno de los complejos hoteleros más grandes del Caribe con 7 hoteles integrados. Playas de arena blanca y aguas turquesas con todo el lujo que mereces.",
            Rating = 4.5,
            Stars = 5,
            PricePerNight = 380,
            Currency = "USD",
            ImageUrl = "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
            Amenities = new List<string> { "Todo Incluido", "Teatro", "Spa", "Tennis", "Playa Privada", "WiFi", "Kids Club" },
            Category = "Resort",
            IsAllInclusive = true,
            Phone = "+1 809-686-5797",
            Website = "https://www.barcelo.com"
        },
        new Hotel
        {
            Id = 3,
            Name = "Casa de Campo Resort & Villas",
            Location = "La Romana",
            Province = "La Romana",
            Description = "El resort más exclusivo de República Dominicana. Campo de golf Teeth of the Dog, marina privada, polo y playa Minitas. Lujo sin igual en el Caribe.",
            Rating = 4.8,
            Stars = 5,
            PricePerNight = 650,
            Currency = "USD",
            ImageUrl = "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
            Amenities = new List<string> { "Campo de Golf", "Marina", "Polo", "Tiro al Pichón", "Spa", "Playa Privada", "Restaurantes Gourmet" },
            Category = "Resort de Lujo",
            IsAllInclusive = false,
            Phone = "+1 809-523-3333",
            Website = "https://www.casadecampo.com.do"
        },
        new Hotel
        {
            Id = 4,
            Name = "Hotel Embajador",
            Location = "Av. Sarasota, Santo Domingo",
            Province = "Distrito Nacional",
            Description = "Ícono histórico de Santo Domingo desde 1944. El hotel más elegante de la capital dominicana con vistas panorámicas, casino y piscina espectacular.",
            Rating = 4.3,
            Stars = 5,
            PricePerNight = 180,
            Currency = "USD",
            ImageUrl = "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
            Amenities = new List<string> { "Casino", "Piscina", "Spa", "Restaurante Gourmet", "Business Center", "WiFi", "Gym" },
            Category = "Business & Lujo",
            IsAllInclusive = false,
            Phone = "+1 809-221-2131",
            Website = "https://www.hotelembajador.com"
        },
        new Hotel
        {
            Id = 5,
            Name = "Secrets Royal Beach Punta Cana",
            Location = "Playa Bávaro, Punta Cana",
            Province = "La Altagracia",
            Description = "Adults-only luxury resort en la mejor playa de Punta Cana. Lujo sin límites, gastronomía internacional de primer nivel y spa de clase mundial.",
            Rating = 4.7,
            Stars = 5,
            PricePerNight = 520,
            Currency = "USD",
            ImageUrl = "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
            Amenities = new List<string> { "Solo Adultos", "Todo Incluido", "Spa", "5 Restaurantes", "Playa Privada", "Butler Service" },
            Category = "Adults Only",
            IsAllInclusive = true,
            Phone = "+1 809-469-7000",
            Website = "https://www.secretsresorts.com"
        },
        new Hotel
        {
            Id = 6,
            Name = "Hodelpa Gran Almirante",
            Location = "Santiago de los Caballeros",
            Province = "Santiago",
            Description = "El hotel más sofisticado de Santiago, ciudad corazón del Cibao. Perfecto para viajes de negocios y turismo cultural, con excelente gastronomía dominicana.",
            Rating = 4.2,
            Stars = 4,
            PricePerNight = 120,
            Currency = "USD",
            ImageUrl = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
            Amenities = new List<string> { "Casino", "Piscina", "Restaurante", "Business Center", "WiFi", "Gym", "Bar" },
            Category = "Business",
            IsAllInclusive = false,
            Phone = "+1 809-580-1992",
            Website = "https://www.hodelpa.com"
        },
        new Hotel
        {
            Id = 7,
            Name = "Bahia Principe Grand Samana",
            Location = "Las Galeras, Samaná",
            Province = "Samaná",
            Description = "Paraíso escondido en la mágica Península de Samaná. Naturaleza exuberante, ballenas jorobadas (temporada), cascadas y playas vírgenes de ensueño.",
            Rating = 4.4,
            Stars = 5,
            PricePerNight = 310,
            Currency = "USD",
            ImageUrl = "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
            Amenities = new List<string> { "Todo Incluido", "Piscinas", "Deportes Acuáticos", "Kids Club", "WiFi", "Playa Privada", "Excursiones" },
            Category = "Resort Natural",
            IsAllInclusive = true,
            Phone = "+1 809-538-3232",
            Website = "https://www.bahia-principe.com"
        },
        new Hotel
        {
            Id = 8,
            Name = "Hodelpa Caribe Colonial",
            Location = "Ciudad Colonial, Santo Domingo",
            Province = "Distrito Nacional",
            Description = "Boutique hotel en el corazón de la Ciudad Colonial, Patrimonio de la Humanidad. Arquitectura colonial dominicana con todo el confort moderno.",
            Rating = 4.1,
            Stars = 4,
            PricePerNight = 95,
            Currency = "USD",
            ImageUrl = "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800",
            Amenities = new List<string> { "Desayuno Incluido", "WiFi", "Terraza", "Bar", "Tour Colonial" },
            Category = "Boutique",
            IsAllInclusive = false,
            Phone = "+1 809-688-7799",
            Website = "https://www.hodelpa.com"
        }
    };

    public List<Hotel> GetAll(string? province = null, string? category = null, int? stars = null)
    {
        var query = _hotels.AsQueryable();
        if (!string.IsNullOrEmpty(province))
            query = query.Where(h => h.Province.Contains(province, StringComparison.OrdinalIgnoreCase));
        if (!string.IsNullOrEmpty(category))
            query = query.Where(h => h.Category.Contains(category, StringComparison.OrdinalIgnoreCase));
        if (stars.HasValue)
            query = query.Where(h => h.Stars == stars.Value);
        return query.OrderByDescending(h => h.Rating).ToList();
    }

    public Hotel? GetById(int id) => _hotels.FirstOrDefault(h => h.Id == id);

    public List<string> GetProvinces() => _hotels.Select(h => h.Province).Distinct().OrderBy(p => p).ToList();
}
