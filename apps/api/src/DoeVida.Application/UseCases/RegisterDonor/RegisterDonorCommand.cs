using DoeVida.Domain.Enums;

namespace DoeVida.Application.UseCases.RegisterDonor;

public class RegisterDonorCommand
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string City { get; set; } = string.Empty;
    public BloodType BloodType { get; set; }
    public decimal Weight { get; set; }

    /// <summary>
    /// Opcional. Quando informado, é criado um registro em Donations (última doação antes do cadastro).
    /// </summary>
    public DateTime? DateOfLastDonation { get; set; }

    /// <summary>
    /// Opcional. Local da última doação (usado quando DateOfLastDonation é informado).
    /// </summary>
    public string? LastDonationLocation { get; set; }
}
