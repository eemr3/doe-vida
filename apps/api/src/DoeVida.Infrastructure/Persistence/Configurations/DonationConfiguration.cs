using DoeVida.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoeVida.Infrastructure.Persistence.Configurations;

public class DonationConfiguration : IEntityTypeConfiguration<Donation>
{
    public void Configure(EntityTypeBuilder<Donation> builder)
    {
        builder.ToTable("Donations");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.Location).IsRequired().HasMaxLength(200);

        builder.HasOne<Donor>()
            .WithMany()
            .HasForeignKey(d => d.DonorId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
