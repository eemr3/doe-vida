
using DoeVida.Domain.Enums;

namespace DoeVida.Application.UseCases.GetUsers;

public class GetUsersResponse
{
  public int Page { get; set; } = 1;
  public int PageSize { get; set; } = 10;
  public string? Search { get; set; }
  public string? Status { get; set; }
}
