using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RDTourism.API.Models;
using RDTourism.API.Services;

namespace RDTourism.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HotelsController : ControllerBase
{
    private readonly IHotelService _hotelService;

    public HotelsController(IHotelService hotelService)
    {
        _hotelService = hotelService;
    }

    [HttpGet]
    public ActionResult<List<Hotel>> GetAll(
        [FromQuery] string? province = null,
        [FromQuery] string? category = null,
        [FromQuery] int? stars = null)
    {
        var hotels = _hotelService.GetAll(province, category, stars);
        return Ok(hotels);
    }

    [HttpGet("{id}")]
    public ActionResult<Hotel> GetById(int id)
    {
        var hotel = _hotelService.GetById(id);
        if (hotel == null) return NotFound();
        return Ok(hotel);
    }

    [HttpGet("provinces")]
    public ActionResult<List<string>> GetProvinces()
    {
        return Ok(_hotelService.GetProvinces());
    }

    [HttpPost("{id}/reserve")]
    public ActionResult<ReservationResponse> Reserve(int id, [FromBody] ReservationRequest request)
    {
        var hotel = _hotelService.GetById(id);
        if (hotel == null) return NotFound();

        var nights = (request.CheckOut - request.CheckIn).Days;
        if (nights <= 0) return BadRequest("Fechas inválidas.");

        var response = new ReservationResponse
        {
            ConfirmationCode = $"RD{DateTime.Now:yyyyMMdd}{new Random().Next(1000, 9999)}",
            Hotel = hotel,
            CheckIn = request.CheckIn,
            CheckOut = request.CheckOut,
            Nights = nights,
            TotalPrice = hotel.PricePerNight * nights,
            Status = "Confirmada"
        };

        return Ok(response);
    }
}
