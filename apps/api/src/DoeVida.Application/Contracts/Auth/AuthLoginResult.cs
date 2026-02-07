namespace DoeVida.Application.Contracts.Auth;

public class AuthLoginResult
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public AuthUserInfo User { get; set; } = null!;
}
