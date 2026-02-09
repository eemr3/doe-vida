using DoeVida.Application.Interfaces;
using DoeVida.Application.UseCases.GetDonors;
using DoeVida.Application.UseCases.GetUsers;
using DoeVida.Application.UseCases.User;
using DoeVida.Domain.Exceptions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DoeVida.Infrastructure.Identity;

public class UserService : IUserService
{
  private readonly UserManager<AppUser> _userManager;

  public UserService(UserManager<AppUser> userManager)
  {
    _userManager = userManager;
  }

  public async Task<RegisterUserResponse> CreateAsync(RegisterUserCommand command, CancellationToken cancellation)
  {
    var existing = await _userManager.FindByEmailAsync(command.Email);

    if (existing != null)
    {
      throw new InvalidOperationException("Email já cadastrado.");
    }

    var user = new AppUser
    {
      UserName = command.Email,
      Email = command.Email,
      NormalizedUserName = command.Email.ToUpperInvariant(),
      NormalizedEmail = command.Email.ToUpperInvariant(),
      Name = command.Name,
      IsActive = command.IsActive,
      CreatedAt = DateTime.UtcNow,
      EmailConfirmed = true,
    };

    var result = await _userManager.CreateAsync(user, command.Password);

    if (!result.Succeeded)
    {
      var message = string.Join("; ", result.Errors.Select(e => e.Description));
      throw new DomainException(message);
    }

    await _userManager.AddToRoleAsync(user, command.Role.ToString());

    return new RegisterUserResponse
    {
      Id = user.Id,
      Name = user.Name,
      Email = user.Email!,
      IsActive = user.IsActive,
      Role = command.Role,
      CreatedAt = user.CreatedAt,
    };
  }

  public async Task<PagedResult<GetUsersResponse>> GetAllAsync(GetUsersQuery query, CancellationToken ct)
  {
    var baseQuery = _userManager.Users.AsQueryable();

    if (!string.IsNullOrWhiteSpace(query.Search))
    {
      var term = query.Search.Trim();
      baseQuery = baseQuery.Where(x =>
        (x.Name != null && x.Name.Contains(term, StringComparison.OrdinalIgnoreCase)) ||
        (x.Email != null && x.Email.Contains(term, StringComparison.OrdinalIgnoreCase)) ||
        (x.UserName != null && x.UserName.Contains(term, StringComparison.OrdinalIgnoreCase)));
    }


    if (!string.IsNullOrWhiteSpace(query.Status))
    {
      baseQuery = baseQuery.Where(x =>
       x.IsActive == (query.Status == "active" ? true : false));
    }

    if (!string.IsNullOrWhiteSpace(query.Sort))
    {
      var descending = string.Equals(query.SortDirection, "desc", StringComparison.OrdinalIgnoreCase);

      baseQuery = query.Sort.Trim().ToLowerInvariant() switch
      {
        "email" => descending ? baseQuery.OrderByDescending(x => x.Email) : baseQuery.OrderBy(x => x.Email),
        "name" => descending ? baseQuery.OrderByDescending(x => x.Name) : baseQuery.OrderBy(x => x.Name),
        "createdat" => descending ? baseQuery.OrderByDescending(x => x.CreatedAt) : baseQuery.OrderBy(x => x.CreatedAt),
        _ => baseQuery.OrderBy(x => x.Name),
      };
    }

    var totalCount = await baseQuery.CountAsync(ct);
    var items = await baseQuery.Skip((query.Page - 1) * query.PageSize)
    .Take(query.PageSize)
    .ToListAsync(ct);

    var response = new List<GetUsersResponse>();
    foreach (var item in items)
    {
      response.Add(new GetUsersResponse
      {
        Page = query.Page,
        PageSize = query.PageSize,
        Search = query.Search,
        Status = query.Status,
      });
    }

    return new PagedResult<GetUsersResponse>
    {
      TotalCount = totalCount,
      Items = response,
    };
  }
}
