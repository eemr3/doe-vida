
using DoeVida.Application.UseCases.GetDonorById;
using DoeVida.Application.UseCases.GetDonors;
using DoeVida.Application.UseCases.GetUsers;
using DoeVida.Application.UseCases.RegisterDonor;
using DoeVida.Application.UseCases.RegisterUser;
using DoeVida.Application.UseCases.SetUserActive;
using Microsoft.Extensions.DependencyInjection;

namespace DoeVida.Application.DependencyInjection;

public static class ApplicationDependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<RegisterDonorHandler>();
        services.AddScoped<GetDonorsHandler>();
        services.AddScoped<GetDonorByIdHandler>();
        services.AddScoped<RegisterUserHandler>();
        services.AddScoped<GetUsersHandler>();
        services.AddScoped<SetUserActiveHandler>();

        return services;
    }
}
