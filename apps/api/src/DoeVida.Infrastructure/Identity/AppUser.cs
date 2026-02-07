using Microsoft.AspNetCore.Identity;

namespace DoeVida.Infrastructure.Identity;

/// <summary>
/// Usuário do sistema (admin ou funcionário). Não confundir com a entidade Donor (doador de sangue).
/// </summary>
public class AppUser : IdentityUser
{
    /// <summary>Nome de exibição.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Desativado pelo admin; não pode fazer login.</summary>
    public bool IsActive { get; set; } = true;

    /// <summary>Data de criação do usuário.</summary>
    public DateTime CreatedAt { get; set; }
}
