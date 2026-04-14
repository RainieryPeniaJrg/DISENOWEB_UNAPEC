namespace RDTourism.API.Models;

public class Hotel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double Rating { get; set; }
    public int Stars { get; set; }
    public decimal PricePerNight { get; set; }
    public string Currency { get; set; } = "USD";
    public string ImageUrl { get; set; } = string.Empty;
    public List<string> Amenities { get; set; } = new();
    public string Category { get; set; } = string.Empty; // Resort, Boutique, Business, etc.
    public bool IsAllInclusive { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
}

public class TouristSite
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // Playa, Naturaleza, Cultural, Histórico
    public double Rating { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsFree { get; set; }
    public decimal? EntryFee { get; set; }
    public List<string> Activities { get; set; } = new();
    public string BestTimeToVisit { get; set; } = string.Empty;
}

public class ReservationRequest
{
    public int HotelId { get; set; }
    public DateTime CheckIn { get; set; }
    public DateTime CheckOut { get; set; }
    public int Guests { get; set; }
    public string RoomType { get; set; } = string.Empty;
    public string GuestName { get; set; } = string.Empty;
    public string GuestEmail { get; set; } = string.Empty;
}

public class ReservationResponse
{
    public string ConfirmationCode { get; set; } = string.Empty;
    public Hotel Hotel { get; set; } = new();
    public DateTime CheckIn { get; set; }
    public DateTime CheckOut { get; set; }
    public int Nights { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = "Pending";
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}

public class RegisterRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
