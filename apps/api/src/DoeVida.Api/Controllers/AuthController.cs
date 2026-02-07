using System.Text.Json.Serialization;
using DoeVida.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DoeVida.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Login com email e senha. Retorna token JWT e dados do usuário.
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Email e senha são obrigatórios." });

        var result = await _authService.LoginAsync(request.Email.Trim(), request.Password, cancellationToken);
        if (result == null)
            return Unauthorized(new { message = "Email ou senha inválidos, ou usuário inativo." });

        return Ok(result);
    }
}

/// <summary>Request de login; propriedades em minúsculo para o JSON do front (email, password).</summary>
public record LoginRequest(
    [property: JsonPropertyName("email")] string Email,
    [property: JsonPropertyName("password")] string Password);
