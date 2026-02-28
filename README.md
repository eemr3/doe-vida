# 🩸 DoeVida

Sistema de doação de sangue desenvolvido como monorepo. Inclui backend em .NET (API) e frontend em React/Vite.

> Observação: este repositório é privado / uso interno.

---

## 📑 Sumário

1. [Visão geral](#visão-geral)
2. [Pré‑requisitos](#pré-requisitos)
3. [Instalação](#instalação)
4. [Banco de dados & Redis](#banco-de-dados--redis)
5. [Rodando o projeto](#rodando-o-projeto)
   - [API (backend)](#api-backend)
   - [Web (frontend)](#web-frontend)
6. [Stack](#stack)
7. [Documentação adicional](#documentação-adicional)
8. [Licença](#licença)

---

## 🔍 Visão geral

Monorepo que contém:

```
.
├── apps/
│   ├── api/     # API .NET (backend)
│   └── web/     # Frontend React + Vite
├── docs/       # Documentação do projeto
├── docker-compose.yml  # PostgreSQL + Redis (dev)
└── package.json    # Raiz – npm workspaces
```

---

## 🛠 Pré‑requisitos

- **Node.js** ≥18 (frontend)
- **.NET SDK** (backend) — https://dotnet.microsoft.com/download
- **Docker & Docker Compose** (para PostgreSQL/Redis em dev)

> Use `.env.example` como base se precisar customizar credenciais.

---

## ⚙️ Instalação

```bash
# clone e entre na pasta
git clone <url-do-repositorio>
cd doe-vida

# instalar dependências do frontend
npm install
```

---

## 🐘 Banco de dados & Redis (Dev)

```bash
# na raiz do repo
docker compose up -d
```

> **Portas não‑padrão**
> | Serviço | Host | Padrão |
> |------------|------|--------|
> | PostgreSQL | 5433 | 5432 |
> | Redis | 6380 | 6379 |

🔑 **Redis** exige senha: `redis-dev-secret`.
📌 Passe `REDIS_PASSWORD` no `.env` para trocar.

**Credenciais Postgres** (configuradas em `appsettings.json`):

```
user: toch
pass: supersecretpassword
db: doevida-db
```

### Migrations (API)

```bash
cd apps/api
dotnet ef database update \
	--project src/DoeVida.Infrastructure/DoeVida.Infrastructure.csproj \
	--startup-project src/DoeVida.Api/DoeVida.Api.csproj
```

---

## ▶️ Rodando o projeto

### 🧩 API (backend)

> Antes: garanta que o PostgreSQL esteja escutando em `localhost:5433`.

```bash
# opção 1 (npm script na raiz)
npm run api:dev

# opção 2 (diretamente na pasta)
cd apps/api
dotnet run --project src/DoeVida.Api/DoeVida.Api.csproj
```

Ou abra a solução `DoeVida.sln` no Visual Studio/Rider e execute o projeto **DoeVida.Api**.

### 🌐 Web (frontend)

```bash
# na raiz
npm run dev       # dev server (Vite)
npm run build     # build prod
npm run preview   # preview build

# ou internamente
cd apps/web && npm run dev
```

---

## 🧱 Stack

| App     | Tecnologias                                                                 |
| ------- | --------------------------------------------------------------------------- |
| **api** | .NET, ASP.NET Core, EF Core, Identity                                       |
| **web** | React 18, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS, Zod |

## 📘 Documentação da API

- **Swagger / OpenAPI**: ao rodar a API localmente, a documentação interativa normalmente fica disponível em `/swagger`. Exemplo: `http://localhost:5000/swagger` (substitua a porta conforme configurada no projeto ou conforme os logs do `dotnet run`).

- **Coleção HTTP**: há um arquivo de coleções/requests em `apps/api/src/DoeVida.Api/DoeVida.Api.http` que pode ser usado com a extensão REST Client do VS Code ou importado no Postman.

- **Como usar (exemplo rápido)**:

```bash
cd apps/api
dotnet run --project src/DoeVida.Api/DoeVida.Api.csproj
# abra o Swagger no navegador: http://localhost:5192/swagger
# ou
# abra o Scalar no navegador: http://localhost:5192/scalar/v1
```

- **Observações**: verifique `src/DoeVida.Api/Properties/launchSettings.json` se precisar confirmar portas HTTPS/HTTP usadas em ambiente de desenvolvimento.

---

## 📚 Documentação adicional

- [Identity e design minimal](docs/IDENTITY-MINIMAL-DESIGN.md)
- [Notas de implementação](docs/IMPLEMENTATION_NOTES.md)
- [Arquitetura do frontend](apps/web/docs/ARCHITECTURE.md)

- Documentação da API: veja a seção abaixo para detalhes.

---

## 📝 Licença

Privado / uso interno.
