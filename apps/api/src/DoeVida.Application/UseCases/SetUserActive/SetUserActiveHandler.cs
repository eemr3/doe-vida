using DoeVida.Application.Interfaces;

namespace DoeVida.Application.UseCases.SetUserActive;

public class SetUserActiveHandler
{
  private readonly IUserService _userService;

  public SetUserActiveHandler(IUserService userService)
  {
    _userService = userService;
  }

  public async Task Handle(Guid id, SetUserActiveCommand command, CancellationToken cancellationToken = default)
  {
    await _userService.SetActiveAsync(id, command.IsActive, cancellationToken);
  }
}
