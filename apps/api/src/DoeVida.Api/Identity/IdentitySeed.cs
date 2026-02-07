using DoeVida.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DoeVida.Api.Identity;

public static class IdentitySeed
{
    public const string RoleAdmin = "Admin";
    public const string RoleStaff = "Staff";

    public static async Task SeedAsync(
        IServiceProvider serviceProvider,
        IConfiguration configuration,
        ILogger? logger = null)
    {
        using var scope = serviceProvider.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        await EnsureRolesAsync(roleManager, logger);
        await EnsureAdminUserAsync(userManager, configuration, logger);
    }

    private static async Task EnsureRolesAsync(RoleManager<IdentityRole> roleManager, ILogger? logger)
    {
        foreach (var roleName in new[] { RoleAdmin, RoleStaff })
        {
            if (await roleManager.RoleExistsAsync(roleName))
                continue;
            await roleManager.CreateAsync(new IdentityRole(roleName));
            logger?.LogInformation("Role criada: {Role}", roleName);
        }
    }

    private static async Task EnsureAdminUserAsync(
        UserManager<AppUser> userManager,
        IConfiguration configuration,
        ILogger? logger)
    {
        var email = configuration["Seed:AdminEmail"]?.Trim();
        var password = configuration["Seed:AdminPassword"];

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
            logger?.LogDebug("Seed:AdminEmail ou Seed:AdminPassword não configurados; pulando criação do admin.");
            return;
        }

        var existing = await userManager.FindByEmailAsync(email);
        if (existing != null)
            return;

        var admin = new AppUser
        {
            UserName = email,
            Email = email,
            NormalizedUserName = email.ToUpperInvariant(),
            NormalizedEmail = email.ToUpperInvariant(),
            Name = "Administrador",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            EmailConfirmed = true,
        };

        var result = await userManager.CreateAsync(admin, password);
        if (!result.Succeeded)
        {
            logger?.LogWarning("Falha ao criar usuário admin: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
            return;
        }

        await userManager.AddToRoleAsync(admin, RoleAdmin);
        logger?.LogInformation("Usuário admin criado: {Email}", email);
    }
}
