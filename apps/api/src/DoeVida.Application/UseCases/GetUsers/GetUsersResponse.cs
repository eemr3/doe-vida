namespace DoeVida.Application.UseCases.GetUsers;

/// <summary>
/// Representa um item da listagem de usuários (um usuário por item).
/// </summary>
public class GetUsersResponse
{
  public string Id { get; set; } = string.Empty;
  public string Name { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public string Role { get; set; } = string.Empty;
  public bool IsActive { get; set; }
  public DateTime CreatedAt { get; set; }
}
