using DoeVida.Domain.Entities;
using DoeVida.Domain.Enums;

namespace DoeVida.Application.Interfaces;

public interface IDonorRepository
{
    Task<Donor?> GetByIdAsync(Guid id);
    Task<IEnumerable<Donor>> GetAllAsync();
    Task AddAsync(Donor donor, CancellationToken cancellationToken = default);
    Task UpdateAsync(Donor donor);
    Task DeleteAsync(Guid id);
    /// <summary>
    /// Retorna doadores paginados com a data da última doação (da tabela Donations) para cálculo de elegibilidade.
    /// </summary>
    Task<(IReadOnlyList<(Donor Donor, DateTime? LastDonationDate)> Items, int TotalCount)> GetPagedAsync(
        string? city,
        BloodType? bloodType,
        bool? eligible,
        string? search,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);
}
