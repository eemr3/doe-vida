using DoeVida.Application.Interfaces;
using DoeVida.Application.UseCases.User;

namespace DoeVida.Application.UseCases.RegisterUser;

public class RegisterUserHandler
{
  private readonly IUserService _userService;

  public RegisterUserHandler(IUserService userService)
  {
    _userService = userService;
  }

  public async Task<RegisterUserResponse> Handle(RegisterUserCommand command, CancellationToken cancellationToken = default)
  {
    return await _userService.CreateAsync(command, cancellationToken);
  }
}
