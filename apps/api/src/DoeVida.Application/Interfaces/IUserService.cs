using DoeVida.Application.UseCases.GetDonors;
using DoeVida.Application.UseCases.GetUsers;
using DoeVida.Application.UseCases.User;

namespace DoeVida.Application.Interfaces;

public interface IUserService
{
  Task<RegisterUserResponse> CreateAsync(RegisterUserCommand command, CancellationToken ct);

  Task<PagedResult<GetUsersResponse>> GetAllAsync(GetUsersQuery query, CancellationToken ct);

  Task SetActiveAsync(Guid id, bool isActive, CancellationToken ct);
}
