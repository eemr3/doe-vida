using DoeVida.Domain.Enums;

namespace DoeVida.Application.UseCases.User;

public class RegisterUserCommand
{
  public string Name { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public string Password { get; set; } = string.Empty;
  public bool IsActive { get; set; } = true;
  public UserRole Role { get; set; } = UserRole.Staff;
}
