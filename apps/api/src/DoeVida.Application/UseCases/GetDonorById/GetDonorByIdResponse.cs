using DoeVida.Domain.Enums;

namespace DoeVida.Application.UseCases.GetDonorById;

/// <summary>
/// Resposta completa do detalhe do doador (tela admin).
/// Alinhado ao que o frontend DonorDetailsPage espera: lastDonation, registrationDate, nextDonationDate, donationHistory.
/// </summary>
public class GetDonorByIdResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public int Age { get; set; }
    public BloodType BloodType { get; set; }
    public decimal Weight { get; set; }
    public bool Eligible { get; set; }

    /// <summary>
    /// Data de cadastro do doador (CreatedAt).
    /// </summary>
    public DateTime RegisteredAt { get; set; }

    /// <summary>
    /// Data da última doação (da tabela Donations), ou null se nunca doou.
    /// </summary>
    public DateTime? LastDonation { get; set; }

    /// <summary>
    /// Data a partir da qual o doador pode doar novamente (última doação + 3 meses). Null se nunca doou.
    /// </summary>
    public DateTime? NextDonationDate { get; set; }

    /// <summary>
    /// Histórico de doações ordenado da mais recente para a mais antiga.
    /// </summary>
    public IReadOnlyList<DonationRecordDto> DonationHistory { get; set; } = [];
}
