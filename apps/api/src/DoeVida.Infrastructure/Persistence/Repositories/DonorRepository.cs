using DoeVida.Application.Interfaces;
using DoeVida.Domain.Entities;
using DoeVida.Domain.Enums;
using DoeVida.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace DoeVida.Infrastructure.Persistence.Repositories;

public class DonorRepository : IDonorRepository
{
    private readonly DoeVidaDbContext _context;

    public DonorRepository(DoeVidaDbContext context)
    {
        _context = context;
    }

    public async Task<(IReadOnlyList<(Donor Donor, DateTime? LastDonationDate)> Items, int TotalCount)> GetPagedAsync(
        string? city,
        BloodType? bloodType,
        bool? eligible,
        string? search,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var baseQuery = _context.Donors.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            baseQuery = baseQuery.Where(d =>
                d.Name.ToLower().Contains(term) ||
                d.Email.ToLower().Contains(term));
        }
        if (!string.IsNullOrWhiteSpace(city))
            baseQuery = baseQuery.Where(d => d.City == city);

        if (bloodType.HasValue)
            baseQuery = baseQuery.Where(d => d.BloodType == bloodType.Value);

        var queryWithLastDonation = baseQuery.Select(d => new
        {
            Donor = d,
            LastDonationDate = _context.Donations
                .Where(dn => dn.DonorId == d.Id)
                .Max(dn => (DateTime?)dn.DateDonation)
        });

        if (eligible.HasValue)
        {
            var today = DateTime.UtcNow.Date;
            var minBirthDateForAge16 = today.AddYears(-16);
            var maxLastDonationForEligible = today.AddMonths(-3);

            if (eligible.Value)
            {
                queryWithLastDonation = queryWithLastDonation.Where(x =>
                    x.Donor.Weight >= 50 &&
                    x.Donor.DateOfBirth <= minBirthDateForAge16 &&
                    (x.LastDonationDate == null || x.LastDonationDate <= maxLastDonationForEligible));
            }
            else
            {
                queryWithLastDonation = queryWithLastDonation.Where(x =>
                    x.Donor.Weight < 50 ||
                    x.Donor.DateOfBirth > minBirthDateForAge16 ||
                    (x.LastDonationDate != null && x.LastDonationDate > maxLastDonationForEligible));
            }
        }

        var totalCount = await queryWithLastDonation.CountAsync(cancellationToken);

        var list = await queryWithLastDonation
            .OrderBy(x => x.Donor.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = list.Select(x => (x.Donor, x.LastDonationDate)).ToList();
        return (items, totalCount);
    }

    public async Task AddAsync(Donor donor, CancellationToken cancellationToken = default)
    {
        await _context.Donors.AddAsync(donor, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<Donor>> GetAllAsync()
    {
        return await _context.Donors.ToListAsync();
    }

    public async Task<Donor?> GetByIdAsync(Guid id)
    {
        return await _context.Donors.FindAsync(id);
    }

    public async Task UpdateAsync(Donor donor)
    {
        _context.Donors.Update(donor);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var donor = await GetByIdAsync(id);
        if (donor != null)
        {
            _context.Donors.Remove(donor);
            await _context.SaveChangesAsync();
        }
    }
}
