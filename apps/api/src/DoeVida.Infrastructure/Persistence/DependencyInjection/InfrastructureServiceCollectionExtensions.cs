using DoeVida.Application.Interfaces;
using DoeVida.Infrastructure.Identity;
using DoeVida.Infrastructure.Persistence.Context;
using DoeVida.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DoeVida.Infrastructure.Persistence.DependencyInjection;

public static class InfrastructureServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<DoeVidaDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IDonorRepository, DonorRepository>();
        services.AddScoped<IDonationRepository, DonationRepository>();
        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}
