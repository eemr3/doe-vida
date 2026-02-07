using DoeVida.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoeVida.Infrastructure.Persistence.Configurations;

public class DonorConfiguration : IEntityTypeConfiguration<Donor>
{
    public void Configure(EntityTypeBuilder<Donor> builder)
    {
        builder.HasKey(d => d.Id);

        builder.Property(d => d.Name).IsRequired().HasMaxLength(150);

        builder.Property(d => d.Email).IsRequired().HasMaxLength(150);

        builder.Property(d => d.Phone).IsRequired().HasMaxLength(20);

        builder.Property(d => d.City).IsRequired().HasMaxLength(100);

        builder.Property(d => d.Weight).HasPrecision(5, 2);

        builder.Property(d => d.BloodType).HasConversion<string>();

        builder.Property(d => d.CreatedAt).IsRequired();
    }
}
