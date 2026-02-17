# Deploy no Render.com

Este guia descreve como publicar a aplicação DoeVida (monorepo: API .NET + frontend React) no [Render](https://render.com/).

## Visão geral

Você precisará de **3 serviços** no Render:

1. **Render Postgres** – banco de dados PostgreSQL.
2. **Web Service** – API .NET 8 (`apps/api`).
3. **Static Site** – frontend React/Vite (`apps/web`).

---

## 1. Preparar o repositório

- Código no **GitHub** (ou GitLab) conectado ao Render.
- **Não** commitar senhas ou chaves; usar variáveis de ambiente no Render.

---

## 2. Criar o banco PostgreSQL no Render

1. No [Dashboard do Render](https://dashboard.render.com/), clique em **New +** → **PostgreSQL**.
2. Escolha nome, região e plano (Free para testes).
3. Após criar, anote:
   - **Internal Database URL** (uso entre serviços na rede interna).
   - **External Database URL** (para conectar de fora; a API pode usar esta na Web Service).

Na Web Service você vai usar a **External Database URL** como connection string (ou Internal se estiver na mesma conta e rede privada).

---

## 3. Deploy da API (.NET 8)

1. **New +** → **Web Service**.
2. Conecte o repositório e configure:
   - **Name:** `doevida-api` (ou outro).
   - **Region:** mesma do Postgres.
   - **Branch:** `main`.
   - **Root Directory:** deixe em branco (monorepo: use build/start abaixo).
   - **Runtime:** **Docker** (recomendado) ou **Native** (ver seção 3.1).

### Opção A – Deploy com Docker (recomendado)

O repositório já inclui `apps/api/Dockerfile`. No Render:

- **Runtime:** Docker.
- **Dockerfile Path:** `apps/api/Dockerfile`.
- **Docker Context:** raiz do repositório (padrão quando o Dockerfile está em subpasta).
- **Build Command / Start Command:** deixe em branco (build e start são feitos pela imagem).

### Opção B – Native (sem Docker)

- **Build Command:**
  ```bash
  dotnet restore apps/api/src/DoeVida.Api/DoeVida.Api.csproj && dotnet publish apps/api/src/DoeVida.Api/DoeVida.Api.csproj -c Release -o out
  ```
- **Start Command:**
  ```bash
  ./out/DoeVida.Api
  ```

No Render, em **Environment** (variáveis de ambiente), adicione:

| Key | Descrição |
|-----|-----------|
| `ConnectionStrings__DefaultConnection` | URL do Postgres (External ou Internal) no formato: `Host=...;Port=5432;Database=...;Username=...;Password=...;SSL Mode=Require` |
| `Jwt__Key` | Chave secreta com pelo menos 32 caracteres (ex.: gerar com `openssl rand -base64 32`) |
| `Jwt__Issuer` | Ex.: `DoeVida.Api` |
| `Jwt__Audience` | Ex.: `DoeVida.Web` |
| `Jwt__ExpirationMinutes` | Ex.: `60` |
| `Seed__AdminEmail` | Email do admin (ex.: `admin@doevida.local`) |
| `Seed__AdminPassword` | Senha do admin (forte) |
| `ASPNETCORE_URLS` | Ex.: `http://0.0.0.0:8080` (Render usa porta 8080 por padrão) |
| `ASPNETCORE_ENVIRONMENT` | `Production` |

Se você usar **Render Postgres**, na aba do banco há **Environment Variables** que podem ser vinculadas ao Web Service; use a variável sugerida (ex.: `DATABASE_URL`) e, se for preciso, mapeie para `ConnectionStrings__DefaultConnection` (alguns runtimes aceitam `DATABASE_URL`; .NET costuma usar `ConnectionStrings:DefaultConnection`).

Aplicar migrações após o primeiro deploy (ver seção 5).

---

## 4. CORS na API

No código da API, inclua a URL do frontend no Render nas origens permitidas. Exemplo em `Program.cs`:

```csharp
policy.WithOrigins(
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://SEU-APP-WEB.onrender.com"  // URL do Static Site no Render
)
```

Ou use uma variável de ambiente, por exemplo `CORS_ORIGINS`, e faça `WithOrigins(builder.Configuration["CORS_ORIGINS"].Split(','))`.

---

## 5. Migrações do Entity Framework

Após o primeiro deploy da API, rode as migrações no banco do Render. Opções:

- **Render Shell:** no serviço da API, abra **Shell** e execute:
  ```bash
  dotnet ef database update --project apps/api/src/DoeVida.Api/DoeVida.Api.csproj
  ```
  (exige EF Tools instalado no ambiente de build).

- **Script no startup (temporário):** no `Program.cs`, em ambiente de produção, chamar `context.Database.Migrate()` na inicialização (apenas se você aceitar rodar migrações no startup; depois pode remover).

- **Job ou máquina local:** configurar connection string para o Postgres externo e rodar `dotnet ef database update` a partir do projeto da API.

---

## 6. Deploy do frontend (Static Site)

1. **New +** → **Static Site**.
2. Repositório e branch (ex.: `main`).
3. Configuração:
   - **Name:** `doevida-web`.
   - **Root Directory:** `apps/web`.
   - **Build Command:** `npm install && npm run build` (ou `npm ci && npm run build`).
   - **Publish Directory:** `apps/web/dist` (saída padrão do Vite).

4. **Environment** (variáveis de ambiente do build):

| Key | Value |
|-----|--------|
| `VITE_API_URL` | URL pública da API no Render (ex.: `https://doevida-api.onrender.com`) |

Importante: no Vite, variáveis precisam do prefixo `VITE_` para serem embutidas no build. Sem isso, o frontend não saberá onde chamar a API em produção.

Após o deploy, a URL do site será algo como `https://doevida-web.onrender.com`.

---

## 7. Resumo de variáveis

### API (Web Service)

- `ConnectionStrings__DefaultConnection` – connection string do Postgres (SSL Mode=Require).
- `Jwt__Key`, `Jwt__Issuer`, `Jwt__Audience`, `Jwt__ExpirationMinutes`.
- `Seed__AdminEmail`, `Seed__AdminPassword`.
- `ASPNETCORE_URLS=http://0.0.0.0:8080`.
- `ASPNETCORE_ENVIRONMENT=Production`.
- (Opcional) `CORS_ORIGINS` com a URL do Static Site.

### Frontend (Static Site)

- `VITE_API_URL` – URL da API (ex.: `https://doevida-api.onrender.com`).

---

## 8. Checklist final

- [ ] Postgres criado e connection string configurada na API.
- [ ] Variáveis de ambiente da API definidas (ConnectionString, JWT, Seed, URLs).
- [ ] CORS da API permitindo a URL do frontend no Render.
- [ ] Migrações aplicadas no banco.
- [ ] Static Site com `VITE_API_URL` apontando para a API.
- [ ] Testar login e fluxos principais (admin, doadores, etc.).

Documentação oficial: [Render Docs](https://render.com/docs).
