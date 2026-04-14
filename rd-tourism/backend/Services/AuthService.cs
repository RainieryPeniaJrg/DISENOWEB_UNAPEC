using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using RDTourism.API.Models;

namespace RDTourism.API.Services;

public interface IAuthService
{
    LoginResponse? Login(LoginRequest request);
    bool Register(RegisterRequest request);
}

public class AuthService : IAuthService
{
    private readonly IConfiguration _config;

    // In-memory users (in production use a DB)
    private readonly List<(string Name, string Email, string PasswordHash)> _users = new()
    {
        ("Admin RD", "admin@rdturismo.com", BCrypt.Net.BCrypt.HashPassword("Admin123!")),
        ("Demo User", "demo@rdturismo.com", BCrypt.Net.BCrypt.HashPassword("Demo123!"))
    };

    public AuthService(IConfiguration config)
    {
        _config = config;
    }

    public LoginResponse? Login(LoginRequest request)
    {
        var user = _users.FirstOrDefault(u => u.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase));
        if (user == default || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return null;

        var token = GenerateToken(user.Email, user.Name);
        return new LoginResponse
        {
            Token = token,
            UserName = user.Name,
            Email = user.Email,
            ExpiresAt = DateTime.UtcNow.AddHours(8)
        };
    }

    public bool Register(RegisterRequest request)
    {
        if (_users.Any(u => u.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase)))
            return false;

        _users.Add((request.Name, request.Email, BCrypt.Net.BCrypt.HashPassword(request.Password)));
        return true;
    }

    private string GenerateToken(string email, string name)
    {
        var key = _config["Jwt:Key"] ?? "RDTourism_SuperSecretKey_2024!";
        var secKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var creds = new SigningCredentials(secKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Name, name),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: "RDTourismAPI",
            audience: "RDTourismApp",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
