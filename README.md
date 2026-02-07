# DoeSangue

Monorepo do projeto DoeSangue (DoeVida) — sistema de doação de sangue.

## Estrutura do monorepo

```
.
├── apps/
│   ├── api/     # API .NET (backend)
│   └── web/     # Frontend React + Vite
├── docs/        # Documentação
├── package.json # Raiz — npm workspaces
└── README.md
```

## Pré-requisitos

- **Node.js** >= 18 (para o frontend)
- **.NET SDK** (para a API) — [download](https://dotnet.microsoft.com/download)

## Instalação

```bash
# Clone o repositório (se ainda não clonou)
git clone <url-do-repositorio>
cd new-doesangue

# Instala dependências do frontend (na raiz)
npm install
```

## Como rodar

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

```bash
cd apps/api
dotnet run --project src/DoeVida.Api/DoeVida.Api.csproj
```

Ou abra a solution no Visual Studio / Rider e execute o projeto **DoeVida.Api**.

A API usa arquivos de configuração em `src/DoeVida.Api/` (`appsettings.json`, `appsettings.Development.json`). Ajuste connection strings e demais opções conforme o ambiente.

## Stack

| App | Tecnologias |
|-----|-------------|
| **api** | .NET, ASP.NET Core, Entity Framework Core, Identity |
| **web** | React 18, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS, Zod |

## Documentação

- [Identity e design minimal](docs/IDENTITY-MINIMAL-DESIGN.md)
- [Notas de implementação](docs/IMPLEMENTATION_NOTES.md)
- [Arquitetura do frontend](apps/web/docs/ARCHITECTURE.md)

## Licença

Privado / uso interno.
