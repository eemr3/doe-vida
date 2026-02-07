namespace DoeVida.Domain.Entities;

public class Donation
{
  public Guid Id { get; private set; }
  public Guid DonorId { get; private set; }
  public DateTime DateDonation { get; private set; }
  public string Location { get; private set; } = string.Empty;

  protected Donation() { }

  public Donation(Guid donorId, DateTime dateDonation, string location)
  {
    if (string.IsNullOrWhiteSpace(location))
      throw new ArgumentException("Location is required.", nameof(location));

    Id = Guid.NewGuid();
    DonorId = donorId;
    DateDonation = DateTime.SpecifyKind(dateDonation, DateTimeKind.Utc);
    Location = location.Trim();
  }
}
