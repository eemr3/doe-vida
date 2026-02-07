using DoeVida.Domain.Enums;

namespace DoeVida.Application.UseCases.GetDonors;

public class GetDonorsQuery
{
    public string? City { get; set; }
    public BloodType? BloodType { get; set; }
    public bool? Eligible { get; set; }

    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;

    public string? Search { get; set; }
}
