using DoeVida.Application.Interfaces;
using DoeVida.Domain.Entities;

namespace DoeVida.Application.UseCases.RegisterDonor;

public class RegisterDonorHandler
{
    private readonly IDonorRepository _donorRepository;
    private readonly IDonationRepository _donationRepository;

    public RegisterDonorHandler(IDonorRepository donorRepository, IDonationRepository donationRepository)
    {
        _donorRepository = donorRepository;
        _donationRepository = donationRepository;
    }

    public async Task<RegisterDonorResponse> Handle(RegisterDonorCommand command, CancellationToken cancellationToken = default)
    {
        var donor = new Donor(
            command.Name,
            command.Email,
            command.Phone,
            command.DateOfBirth,
            command.City,
            command.BloodType,
            command.Weight
        );

        await _donorRepository.AddAsync(donor, cancellationToken);

        if (command.DateOfLastDonation.HasValue)
        {
            var location = string.IsNullOrWhiteSpace(command.LastDonationLocation)
                ? "Não informado"
                : command.LastDonationLocation.Trim();
            var donation = new Donation(donor.Id, command.DateOfLastDonation.Value, location);
            await _donationRepository.AddAsync(donation, cancellationToken);
        }

        return new RegisterDonorResponse
        {
            Id = donor.Id
        };
    }
}
