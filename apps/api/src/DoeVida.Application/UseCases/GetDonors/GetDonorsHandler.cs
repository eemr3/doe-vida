using DoeVida.Application.Interfaces;

namespace DoeVida.Application.UseCases.GetDonors;

public class GetDonorsHandler
{
    private readonly IDonorRepository _repository;

    public GetDonorsHandler(IDonorRepository repository)
    {
        _repository = repository;
    }

    public async Task<PagedResult<GetDonorsResponse>> Handle(GetDonorsQuery query, CancellationToken cancellationToken = default)
    {
        var (items, totalCount) = await _repository.GetPagedAsync(
            query.City,
            query.BloodType,
            query.Eligible,
            query.Search,
            query.Page,
            query.PageSize,
            cancellationToken);

        return new PagedResult<GetDonorsResponse>
        {
            TotalCount = totalCount,
            Items = items.Select(x => new GetDonorsResponse
            {
                Id = x.Donor.Id,
                Name = x.Donor.Name,
                Email = x.Donor.Email,
                Phone = x.Donor.Phone,
                Age = x.Donor.GetAge(),
                City = x.Donor.City,
                Weight = x.Donor.Weight,
                BloodType = x.Donor.BloodType,
                Eligible = x.Donor.CanDonate(x.LastDonationDate),
                LastDonation = x.LastDonationDate,
                RegisteredAt = x.Donor.CreatedAt
            }).ToList()
        };
    }
}
