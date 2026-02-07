
using DoeVida.Application.UseCases.GetDonorById;
using DoeVida.Application.UseCases.GetDonors;
using DoeVida.Application.UseCases.RegisterDonor;
using Microsoft.Extensions.DependencyInjection;

namespace DoeVida.Application.DependencyInjection;

public static class ApplicationDependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<RegisterDonorHandler>();
        services.AddScoped<GetDonorsHandler>();
        services.AddScoped<GetDonorByIdHandler>();
        return services;
    }
}
