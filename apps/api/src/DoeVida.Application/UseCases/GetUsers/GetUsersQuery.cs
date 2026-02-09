
namespace DoeVida.Application.UseCases.GetUsers;

public class GetUsersQuery
{
  public int Page { get; set; } = 1;
  public int PageSize { get; set; } = 10;
  public string? Search { get; set; } = string.Empty;
  public string? Sort { get; set; } = string.Empty;
  public string? SortDirection { get; set; } = "asc";
  public string? Role { get; set; } = string.Empty;
  public string? Status { get; set; } = string.Empty;
  public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
}
