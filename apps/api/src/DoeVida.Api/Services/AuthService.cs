using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DoeVida.Application.Contracts.Auth;
using DoeVida.Application.Interfaces;
using DoeVida.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace DoeVida.Api.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IConfiguration _configuration;

    public AuthService(UserManager<AppUser> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    public async Task<AuthLoginResult?> LoginAsync(string email, string password, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null || !user.IsActive)
            return null;

        if (!await _userManager.CheckPasswordAsync(user, password))
            return null;

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "Staff";

        var token = GenerateJwt(user.Id, user.Email!, user.Name, role);
        var expiresAt = DateTime.UtcNow.AddMinutes(GetTokenExpirationMinutes());

        return new AuthLoginResult
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = new AuthUserInfo
            {
                Id = user.Id,
                Email = user.Email!,
                Name = user.Name,
                Role = role,
            },
        };
    }

    private string GenerateJwt(string userId, string email, string name, string role)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(GetSecret()));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(GetTokenExpirationMinutes());

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(ClaimTypes.Name, name),
            new Claim(ClaimTypes.Role, role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var token = new JwtSecurityToken(
            issuer: GetIssuer(),
            audience: GetAudience(),
            claims,
            expires: expires,
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GetSecret() =>
        _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured.");
    private string GetIssuer() => _configuration["Jwt:Issuer"] ?? "DoeVida.Api";
    private string GetAudience() => _configuration["Jwt:Audience"] ?? "DoeVida.Web";
    private int GetTokenExpirationMinutes() => int.TryParse(_configuration["Jwt:ExpirationMinutes"], out var m) ? m : 60;
}
