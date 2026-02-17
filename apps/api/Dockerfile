# Build da API .NET 8 (contexto: raiz do monorepo ou apps/api)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar projetos para restauração
COPY apps/api/src/DoeVida.Api/DoeVida.Api.csproj DoeVida.Api/
COPY apps/api/src/DoeVida.Application/DoeVida.Application.csproj DoeVida.Application/
COPY apps/api/src/DoeVida.Infrastructure/DoeVida.Infrastructure.csproj DoeVida.Infrastructure/
COPY apps/api/src/DoeVida.Domain/DoeVida.Domain.csproj DoeVida.Domain/
RUN dotnet restore DoeVida.Api/DoeVida.Api.csproj

# Copiar código e publicar
COPY apps/api/src/ .
RUN dotnet publish DoeVida.Api/DoeVida.Api.csproj -c Release -o /app/publish --no-restore

# Imagem final
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
ENTRYPOINT ["dotnet", "DoeVida.Api.dll"]
