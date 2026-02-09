using DoeVida.Application.Interfaces;
using DoeVida.Application.UseCases.GetDonors;

namespace DoeVida.Application.UseCases.GetUsers;

public class GetUsersHandler
{
  private readonly IUserService _userService;

  public GetUsersHandler(IUserService userService)
  {
    _userService = userService;
  }

  public async Task<PagedResult<GetUsersResponse>> Handle(GetUsersQuery query, CancellationToken cancellationToken)
  {
    return await _userService.GetAllAsync(query, cancellationToken);
  }
}
