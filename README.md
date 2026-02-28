# 🩸 DoeVida

> Sistema de doação de sangue — monorepo com backend NestJS e frontend React.

---

## 📁 Estrutura do monorepo

```
.
├── apps/
│   ├── api/        # Backend NestJS
│   └── web/        # Frontend React + Vite
├── docs/           # Documentação
├── docker-compose.yml
├── package.json    # Raiz — npm workspaces
└── README.md
```

---

## 🧱 Arquitetura da API

A API segue arquitetura modular baseada em domínio:

```
src/
└── modules/
    └── example/
        ├── domain/           # Entidades, repositórios (interfaces), exceções
        ├── application/      # Casos de uso (UseCases)
        └── infrastructure/   # TypeORM, Controllers, Guards, Strategies
```

---

## 🛠️ Tecnologias

| App     | Tecnologias                                                            |
| ------- | ---------------------------------------------------------------------- |
| **api** | NestJS, TypeORM, PostgreSQL, Redis, JWT, Passport, Bcrypt              |
| **web** | React 18, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS |

---

## 📦 Pré-requisitos

- Node.js >= 18
- Docker
- Docker Compose

---

## 🚀 Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd new-doesangue

# Instala as dependências
npm install
```

---

## ▶️ Como rodar

### 🐳 1. Banco de Dados e Redis (Docker)

Na **raiz do repositório**, suba os serviços em containers:

```bash
docker compose up -d
```

> **Portas não padrão** — para evitar conflito com serviços locais já em execução:

| Serviço    | Porta no host | Porta padrão |
| ---------- | ------------- | ------------ |
| PostgreSQL | **5433**      | 5432         |
| Redis      | **6380**      | 6379         |

---

### 🔐 2. Variáveis de ambiente

Copie o arquivo de exemplo e ajuste as variáveis conforme necessário:

```bash
cp .env.example .env
```

**PostgreSQL (desenvolvimento):**

| Variável | Valor padrão          |
| -------- | --------------------- |
| Host     | localhost             |
| Port     | 5433                  |
| User     | toch                  |
| Password | supersecretpassword   |
| Database | doevida-db            |

**Redis (desenvolvimento):**

| Variável | Valor padrão      |
| -------- | ----------------- |
| Host     | localhost         |
| Port     | 6380              |
| Password | redis-dev-secret  |

---

### 🗄️ 3. Migrations e Seed

Com o banco rodando, execute dentro de `apps/api`:

```bash
cd apps/api

# Roda as migrations
npm run migration:run

# Popula o banco com dados iniciais
npm run seed
```

Isso criará os seguintes usuários padrão:

| Papel     | E-mail             | Senha       |
| --------- | ------------------ | ----------- |
| 👤 Admin  | admin@admin.com    | Admin@123   |
| 👤 Staff  | staff@staff.com    | Staff@123   |

---

### 🖥️ 4. Rodando os serviços

**Frontend (web)** — na raiz do repositório:

```bash
npm run dev        # Servidor de desenvolvimento (Vite)
npm run build      # Build de produção
npm run preview    # Preview do build
```

Ou diretamente em `apps/web`:

```bash
cd apps/web && npm run dev
```

**Backend (API)** — na raiz do repositório:

```bash
npm run api:dev
```

Ou diretamente em `apps/api`:

```bash
cd apps/api && npm run start:dev
```

> ⚠️ Certifique-se de que o PostgreSQL está rodando (`docker compose up -d`) antes de subir a API. Caso contrário, a conexão será recusada na porta 5433.

A API estará disponível em:

```
http://localhost:3001
```

---

## 📄 Documentação da API (Swagger)

A documentação interativa da API é gerada automaticamente via **Swagger/OpenAPI** e fica disponível após subir o backend:

```
http://localhost:3001/api/docs
```

### O que você encontra lá:

- 📋 **Listagem de todos os endpoints** organizados por módulo
- 🔐 **Autenticação via JWT** — use o botão **Authorize** para inserir seu Bearer token e testar rotas protegidas
- 📥 **Schemas de request/response** com exemplos e validações
- ▶️ **Execução de requisições** diretamente pelo navegador, sem precisar de Postman ou Insomnia

### Como autenticar no Swagger:

1. Acesse `http://localhost:3001/api/docs`
2. Faça login em `POST /auth/login` com um dos usuários padrão
3. Copie o `accessToken` retornado
4. Clique no botão **🔒 Authorize** (canto superior direito)
5. Insira o token no formato: `Bearer <seu-token>`
6. Confirme e explore os endpoints protegidos

---

## 🔐 Autenticação e Controle de Acesso

A API utiliza **JWT + Passport** com controle de acesso baseado em roles.

| Recurso             | Descrição                                           |
| ------------------- | --------------------------------------------------- |
| `@CurrentUser()`    | Decorator para acessar o usuário autenticado        |
| `@Roles()`          | Decorator para restringir acesso por papel          |
| `RolesGuard`        | Guard que valida as roles na requisição             |

**Roles disponíveis:**

- `ADMIN` — acesso total ao sistema
- `STAFF` — acesso operacional

---

## 📜 Licença

Privado / uso interno.
