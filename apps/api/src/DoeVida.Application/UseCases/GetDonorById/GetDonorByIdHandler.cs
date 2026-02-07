using DoeVida.Application.Interfaces;
using DoeVida.Domain.Entities;

namespace DoeVida.Application.UseCases.GetDonorById;

/// <summary>
/// Obtém um doador por id com dados completos para a tela de detalhe:
/// dados pessoais, data de cadastro, última doação, próxima doação possível e histórico de doações.
/// </summary>
public class GetDonorByIdHandler
{
    private readonly IDonorRepository _donorRepository;
    private readonly IDonationRepository _donationRepository;

    public GetDonorByIdHandler(IDonorRepository donorRepository, IDonationRepository donationRepository)
    {
        _donorRepository = donorRepository;
        _donationRepository = donationRepository;
    }

    public async Task<GetDonorByIdResponse?> Handle(Guid id, CancellationToken cancellationToken = default)
    {
        var donor = await _donorRepository.GetByIdAsync(id);
        if (donor == null)
            return null;

        var donations = await _donationRepository.GetByDonorIdAsync(id, cancellationToken);
        var lastDonationDate = donations.Count > 0 ? donations[0].DateDonation : (DateTime?)null;
        var eligible = donor.CanDonate(lastDonationDate);

        // Próxima doação possível: 3 meses após a última (regra de negócio)
        DateTime? nextDonationDate = null;
        if (lastDonationDate.HasValue)
            nextDonationDate = lastDonationDate.Value.AddMonths(3);

        return new GetDonorByIdResponse
        {
            Id = donor.Id,
            Name = donor.Name,
            Email = donor.Email,
            Phone = donor.Phone,
            City = donor.City,
            Age = donor.GetAge(),
            BloodType = donor.BloodType,
            Weight = donor.Weight,
            Eligible = eligible,
            RegisteredAt = donor.CreatedAt,
            LastDonation = lastDonationDate,
            NextDonationDate = nextDonationDate,
            DonationHistory = donations.Select(d => new DonationRecordDto
            {
                Date = d.DateDonation,
                Location = d.Location
            }).ToList()
        };
    }
}
