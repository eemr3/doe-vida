using DoeVida.Domain.Enums;

namespace DoeVida.Application.UseCases.User;

public class RegisterUserResponse
{
  public string Id { get; set; } = string.Empty;
  public string Name { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public bool IsActive { get; set; }
  public UserRole Role { get; set; }
  public DateTime CreatedAt { get; set; }
}
