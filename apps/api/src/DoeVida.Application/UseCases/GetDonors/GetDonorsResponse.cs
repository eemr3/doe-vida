using DoeVida.Domain.Enums;

namespace DoeVida.Application.UseCases.GetDonors;

public class GetDonorsResponse
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
    /// Data da última doação (da tabela Donations). Null se nunca doou.
    /// </summary>
    public DateTime? LastDonation { get; set; }

    /// <summary>
    /// Data de cadastro do doador (CreatedAt).
    /// </summary>
    public DateTime RegisteredAt { get; set; }
}
