using DoeVida.Domain.Entities;

namespace DoeVida.Application.Interfaces;

public interface IDonationRepository
{
    Task AddAsync(Donation donation, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retorna as doações de um doador ordenadas da mais recente para a mais antiga (para detalhe e histórico).
    /// </summary>
    Task<IReadOnlyList<Donation>> GetByDonorIdAsync(Guid donorId, CancellationToken cancellationToken = default);
}
