using System.Text;
using System.Text.Json;
using DoeVida.Api.Contract;
using DoeVida.Api.Identity;
using DoeVida.Api.Middlewares;
using DoeVida.Application.DependencyInjection;
using DoeVida.Infrastructure.Identity;
using DoeVida.Infrastructure.Persistence.Context;
using DoeVida.Infrastructure.Persistence.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "API Doe Vida",           // ← Título
        Description = "API para gerenciamento de doações de sangue e cadastro de doadores.",  // ← Descrição
        Version = "1.0.0",
        Contact = new()
        {
            Name = "Emerson Moreira",
            Email = "emerson@empresa.com",
            Url = new("https://linkedin.com/emerson-moreira")
        }
    });
});


// Cors
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Identity (só core: UserManager/RoleManager, sem cookies → sem redirect para /Account/Login)
builder.Services.AddIdentityCore<AppUser>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<DoeVidaDbContext>()
.AddDefaultTokenProviders();

// JWT (API retorna 401, nunca redirect)
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key must be set.");
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "DoeVida.Api",
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "DoeVida.Web",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
        };
        options.Events = new JwtBearerEvents
        {
            OnChallenge = context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                var body = JsonSerializer.Serialize(new ApiErrorResponse
                {
                    Type = "Unauthorized",
                    Message = "Não autorizado. Faça login ou verifique seu token.",
                    Errors = null,
                });
                return context.Response.WriteAsync(body);
            },
            OnForbidden = context =>
            {
                context.Response.StatusCode = 403;
                context.Response.ContentType = "application/json";
                var body = JsonSerializer.Serialize(new ApiErrorResponse
                {
                    Type = "Forbidden",
                    Message = "Acesso negado. Você não tem permissão para este recurso.",
                    Errors = null,
                });
                return context.Response.WriteAsync(body);
            },
        };
    });

builder.Services.AddAuthorization();

// Dependency Injection das camadas
builder.Services.AddApplication().AddInfrastructure(builder.Configuration);

var app = builder.Build();

app.UseStaticFiles();

// Seed Identity (roles + admin)
await IdentitySeed.SeedAsync(app.Services, app.Configuration, app.Logger);

app.UseCors();
app.UseMiddleware<ExceptionMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapScalarApiReference(options =>
    {
        options.ShowDeveloperTools = DeveloperToolsVisibility.Never;
        options.WithTitle("Doe Vida API")
               .WithOpenApiRoutePattern("/swagger/{documentName}/swagger.json")
               //    .WithTheme(ScalarTheme.Mars)
               .HideSearch()
               .HideClientButton();
        options.Title = "DoeVida API";
        options.Favicon = "/favicon.ico";
        options.WithCustomCss(@"
            /* ============================================================
   Scalar Theme – Blood Donation App
   Adaptado do esquema de cores do React/Vite App
   ============================================================ */

/* === LIGHT MODE === */
.light-mode {
  /* Text colors */
  --theme-color-1: #1a0a0e;           /* quase preto com tom quente */
  --theme-color-2: #6b3040;           /* vermelho escuro acinzentado */
  --theme-color-3: #9b5060;           /* vermelho médio para textos secundários */
  --theme-color-accent: #c41e3a;      /* --primary */

  /* Backgrounds – warm off-white com toque rosado */
  --theme-background-1: #fdf5f6;      /* branco levemente rosado */
  --theme-background-2: #f7e8eb;      /* rosa muito suave */
  --theme-background-3: #f0d4d9;      /* rosa claro mais pronunciado */
  --theme-background-accent: rgba(196, 30, 58, 0.1);

  /* Border */
  --theme-border-color: rgba(196, 30, 58, 0.15); /* borda com toque vermelho */

  /* Code block overrides */
  --theme-code-languages-background-supersede: #f0d4d9;
  --theme-code-language-color-supersede: #1a0a0e;
}

/* === DARK MODE === */
.dark-mode {
  /* Text colors */
  --theme-color-1: rgba(255, 255, 255, 0.9);  /* --foreground (dark) */
  --theme-color-2: rgba(255, 255, 255, 0.62); /* tom médio */
  --theme-color-3: oklch(0.708 0 0);           /* --muted-foreground (dark) */
  --theme-color-accent: #dc2626;               /* --primary (dark) */

  /* Backgrounds */
  --theme-background-1: oklch(0.145 0 0);     /* --background (dark) */
  --theme-background-2: oklch(0.205 0 0);     /* --sidebar (dark) */
  --theme-background-3: oklch(0.269 0 0);     /* --secondary / --muted (dark) */
  --theme-background-accent: rgba(220, 38, 38, 0.12); /* --primary dark com opacidade */

  /* Border */
  --theme-border-color: oklch(0.269 0 0);     /* --border (dark) */

  /* Code block overrides */
  --theme-code-languages-background-supersede: linear-gradient(
    to bottom right,
    rgb(255 255 255 / 0.075),
    rgb(255 255 255 / 0.075),
    rgb(255 255 255 / 0.2)
  );
}

/* ============================================================
   Document Sidebar
   ============================================================ */
.light-mode .t-doc__sidebar,
.dark-mode .t-doc__sidebar {
  --sidebar-background-1: var(--theme-background-1);
  --sidebar-item-hover-color: currentColor;
  --sidebar-item-hover-background: var(--theme-background-2);
  --sidebar-item-active-background: var(--theme-background-accent);
  --sidebar-border-color: var(--theme-border-color);
  --sidebar-color-1: var(--theme-color-1);
  --sidebar-color-2: var(--theme-color-2);
  --sidebar-color-active: var(--theme-color-accent);
  --sidebar-search-background: transparent;
  --sidebar-search-border-color: var(--theme-border-color);
  --sidebar-search--color: var(--theme-color-3);
}

.light-mode .t-doc__sidebar {
  --sidebar-search-background: #f0d4d9;
  --sidebar-search-border-color: #f0d4d9;
}

/* ============================================================
   Advanced / Buttons / Status Colors
   ============================================================ */

/* --- Light --- */
.light-mode {
  --theme-button-1: #c41e3a;           /* botão primário vermelho */
  --theme-button-1-color: #ffffff;
  --theme-button-1-hover: #a01628;

  --theme-color-green: #16a34a;        /* --success */
  --theme-color-red: #c41e3a;          /* --primary / --destructive */
  --theme-color-yellow: #f59e0b;       /* --warning */
  --theme-color-blue: #3b82f6;         /* --info */
  --theme-color-orange: #f59e0b;
  --theme-color-purple: #c41e3a;       /* remapeado para primary vermelho */

  --theme-scrollbar-color: rgba(196, 30, 58, 0.2);
  --theme-scrollbar-color-active: rgba(196, 30, 58, 0.4);
}

/* --- Dark --- */
.dark-mode {
  --theme-button-1: #f3f3f5;           /* claro sobre fundo escuro */
  --theme-button-1-color: #030213;
  --theme-button-1-hover: #e0e0e4;

  --theme-color-green: #22c55e;        /* --success (dark) */
  --theme-color-red: #dc2626;          /* --primary / --destructive (dark) */
  --theme-color-yellow: #fbbf24;       /* --warning (dark) */
  --theme-color-blue: #60a5fa;         /* --info (dark) */
  --theme-color-orange: #fbbf24;
  --theme-color-purple: #dc2626;       /* remapeado para primary vermelho escuro */

  --theme-scrollbar-color: rgba(255, 255, 255, 0.24);
  --theme-scrollbar-color-active: rgba(255, 255, 255, 0.48);
}

/* ============================================================
   Section Flare (decoração de fundo)
   ============================================================ */
.section-flare {
  background-size: cover;
  width: 100%;
  height: 100%;
  max-height: 500px;
  opacity: 0.25;
}

.light-mode .section-flare {
  display: block;
  opacity: 0.08; /* bem sutil no light para não poluir */
}

/* Blobs com tons vermelhos do tema */
.section-flare-item:nth-of-type(1) {
  width: 29%;
  aspect-ratio: 1;
  background: rgba(196, 30, 58, 0.7);   /* --primary light */
  border-radius: 50%;
  bottom: -30%;
  position: absolute;
  left: 20%;
  filter: blur(100px);
}

.section-flare-item:nth-of-type(2) {
  width: 54%;
  height: 39%;
  transform: rotate(30deg);
  background: rgba(160, 22, 40, 0.6);   /* --primary-hover light */
  border-radius: 40%;
  top: 30%;
  position: absolute;
  left: 10%;
  filter: blur(100px);
}

.section-flare-item:nth-of-type(3) {
  width: 29%;
  aspect-ratio: 1;
  background: rgba(220, 38, 38, 0.7);   /* --primary dark */
  border-radius: 50%;
  bottom: 30%;
  position: absolute;
  right: 10%;
  filter: blur(100px);
}

.section-flare-item:nth-of-type(4) {
  width: 54%;
  height: 39%;
  transform: rotate(30deg);
  background: rgba(185, 28, 28, 0.6);   /* --primary-hover dark */
  border-radius: 40%;
  bottom: -30%;
  position: absolute;
  right: -30%;
  filter: blur(100px);
}

/* ============================================================
   Links dentro de seções
   ============================================================ */
.section .download-cta a,
.section .markdown a {
  color: var(--theme-color-3) !important;
}

.light-mode .section .download-cta a,
.light-mode .section .markdown a {
  color: var(--theme-color-3) !important;
  text-decoration: underline !important;
}

.download-cta a:hover,
.section .markdown a:hover {
  color: var(--theme-color-accent) !important;
}

/* ============================================================
   Scalar Card (dark mode overrides)
   ============================================================ */
.dark-mode .scalar-card {
  --theme-background-1: var(--theme-background-2);
}

.scalar-card .show-api-client-button:before,
.dark-mode .scalar-card .code-languages-background {
  background: transparent;
  box-shadow: 0 0 0 1px rgb(255 255 255 / 0.25);
}

.dark-mode .scalar-card .code-languages-background:hover,
.scalar-card .show-api-client-button:hover:before {
  box-shadow: inset 0 0 6px rgba(220, 38, 38, 0.25), /* vermelho sutil no hover */
              0 0 0 1px rgb(255 255 255 / 0.25);
  background: transparent;
}

.scalar-card .show-api-client-button {
  background: transparent;
}

.scalar-card .show-api-client-button:before {
  background: linear-gradient(
    to bottom right,
    rgb(255 255 255 / 0.075),
    rgb(255 255 255 / 0.075),
    rgb(255 255 255 / 0.2)
  );
}

.scalar-card .code-languages-icon {
  padding: 11px;
}
        ");
    });

}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();