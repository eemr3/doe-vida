using DoeVida.Domain.Enums;
using DoeVida.Domain.Exceptions;

namespace DoeVida.Domain.Entities;

public class Donor
{
  public Guid Id { get; private set; }
  public string Name { get; private set; } = string.Empty;
  public string Email { get; private set; } = string.Empty;
  public string Phone { get; private set; } = string.Empty;
  public DateTime DateOfBirth { get; private set; }
  public string City { get; private set; } = string.Empty;
  public BloodType BloodType { get; private set; }
  public decimal Weight { get; private set; }
  public DateTime CreatedAt { get; private set; }
  protected Donor() { }

  public Donor(
    string name,
    string email,
    string phone,
    DateTime dateOfBirth,
    string city,
    BloodType bloodType,
    decimal weight
  )
  {
    if (CalculateAge(dateOfBirth) < 16)
    {
      throw new DomainException("Donor must be at least 16 years old.");
    }

    if (weight < 50)
    {
      throw new DomainException("Donor must weigh at least 50kg.");
    }

    Id = Guid.NewGuid();
    Name = name;
    Email = email;
    Phone = phone;
    DateOfBirth = DateTime.SpecifyKind(dateOfBirth, DateTimeKind.Utc);
    City = city;
    BloodType = bloodType;
    Weight = weight;
    CreatedAt = DateTime.UtcNow;
  }

  /// <summary>
  /// Verifica se o doador está elegível para doar com base na data da última doação (vinda da entidade Donation).
  /// </summary>
  public bool CanDonate(DateTime? lastDonationDate)
  {
    if (CalculateAge(DateOfBirth) < 16) return false;
    if (Weight < 50) return false;
    if (lastDonationDate == null) return true;
    return lastDonationDate.Value <= DateTime.UtcNow.AddMonths(-3);
  }

  public int GetAge()
  {
    return CalculateAge(DateOfBirth);
  }
  private static int CalculateAge(DateTime birthDate)
  {
    var today = DateTime.Today;
    var age = today.Year - birthDate.Year;

    if (birthDate.Date > today.AddYears(-age))
    {
      age--;
    }

    return age;
  }

}
