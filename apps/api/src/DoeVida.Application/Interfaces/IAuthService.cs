using DoeVida.Application.Contracts.Auth;

namespace DoeVida.Application.Interfaces;

public interface IAuthService
{
    /// <summary>
    /// Valida email e senha; retorna token JWT e dados do usuário se válido.
    /// Retorna null se credenciais inválidas ou usuário inativo.
    /// </summary>
    Task<AuthLoginResult?> LoginAsync(string email, string password, CancellationToken cancellationToken = default);
}
