using DoeVida.Domain.Entities;
using DoeVida.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DoeVida.Infrastructure.Persistence.Context;

public class DoeVidaDbContext : IdentityDbContext<AppUser, IdentityRole, string>
{
    public DoeVidaDbContext(DbContextOptions<DoeVidaDbContext> options) : base(options) { }

    public DbSet<Donor> Donors => Set<Donor>();
    public DbSet<Donation> Donations => Set<Donation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(DoeVidaDbContext).Assembly);
    }
}
