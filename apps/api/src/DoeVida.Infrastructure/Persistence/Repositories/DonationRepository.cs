using DoeVida.Application.Interfaces;
using DoeVida.Domain.Entities;
using DoeVida.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace DoeVida.Infrastructure.Persistence.Repositories;

public class DonationRepository : IDonationRepository
{
    private readonly DoeVidaDbContext _context;

    public DonationRepository(DoeVidaDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Donation donation, CancellationToken cancellationToken = default)
    {
        await _context.Donations.AddAsync(donation, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Donation>> GetByDonorIdAsync(Guid donorId, CancellationToken cancellationToken = default)
    {
        return await _context.Donations
            .Where(d => d.DonorId == donorId)
            .OrderByDescending(d => d.DateDonation)
            .ToListAsync(cancellationToken);
    }
}
