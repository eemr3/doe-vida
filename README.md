# DoeSangue

Monorepo do projeto DoeSangue (DoeVida) — sistema de doação de sangue.

## Estrutura do monorepo

```
.
├── apps/
│   ├── api/     # API .NET (backend)
│   └── web/     # Frontend React + Vite
├── docs/            # Documentação
├── docker-compose.yml  # PostgreSQL + Redis (dev, portas 5433 e 6380)
├── package.json    # Raiz — npm workspaces
└── README.md
```

## Pré-requisitos

- **Node.js** >= 18 (para o frontend)
- **.NET SDK** (para a API) — [download](https://dotnet.microsoft.com/download)
- **Docker** e **Docker Compose** (para subir o PostgreSQL em desenvolvimento)

## Instalação

```bash
# Clone o repositório (se ainda não clonou)
git clone <url-do-repositorio>
cd new-doesangue

# Instala dependências do frontend (na raiz)
npm install
```

## Como rodar

### Banco de dados e Redis (Docker Compose)

Na **raiz do repositório**, suba PostgreSQL e Redis em containers:

```bash
docker compose up -d
```

**Portas não padrão** — Para evitar conflito com Postgres ou Redis já rodando na sua máquina (que costumam usar 5432 e 6379), este projeto usa:

| Serviço    | Porta no host | Porta padrão |
| ---------- | ------------- | ------------ |
| PostgreSQL | **5433**      | 5432         |
| Redis      | **6380**      | 6379         |

Assim você pode ter outro Postgres/Redis na porta padrão sem conflito. O `appsettings.json` da API já está configurado para `Port=5433`. **Redis** exige senha: padrão `redis-dev-secret` (sobrescreva com `REDIS_PASSWORD` no `.env`). Ao conectar o app ao Redis, use `localhost:6380` e essa senha.

Credenciais do Postgres (batem com o `appsettings.json`): usuário `toch`, senha `supersecretpassword`, database `doevida-db`. Para mudar, copie `.env.example` para `.env` e ajuste.

Para aplicar as migrations da API (primeira vez ou após mudanças), na raiz do repo:

```bash
cd apps/api && dotnet ef database update --project src/DoeVida.Infrastructure/DoeVida.Infrastructure.csproj --startup-project src/DoeVida.Api/DoeVida.Api.csproj
```

### Frontend (web)

Na **raiz do repositório**:

```bash
npm run dev        # Servidor de desenvolvimento (Vite)
npm run build      # Build de produção
npm run preview    # Preview do build
```

Ou dentro de `apps/web`:

```bash
cd apps/web && npm run dev
```

### Backend (API)

**Antes de subir a API**, certifique-se de que o PostgreSQL está rodando (`docker compose up -d` na raiz). Caso contrário a API falhará ao conectar (connection refused na porta 5433).

Na **raiz do repositório**:

```bash
npm run api:dev
```

Ou dentro de `apps/api`:

```bash
cd apps/api
dotnet run --project src/DoeVida.Api/DoeVida.Api.csproj
```

Ou abra a solution no Visual Studio / Rider e execute o projeto **DoeVida.Api**.

A API usa arquivos de configuração em `src/DoeVida.Api/` (`appsettings.json`, `appsettings.Development.json`). Ajuste connection strings e demais opções conforme o ambiente.

## Stack

| App     | Tecnologias                                                                 |
| ------- | --------------------------------------------------------------------------- |
| **api** | .NET, ASP.NET Core, Entity Framework Core, Identity                         |
| **web** | React 18, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS, Zod |

## Documentação

- [Identity e design minimal](docs/IDENTITY-MINIMAL-DESIGN.md)
- [Notas de implementação](docs/IMPLEMENTATION_NOTES.md)
- [Arquitetura do frontend](apps/web/docs/ARCHITECTURE.md)

## Licença

Privado / uso interno.
