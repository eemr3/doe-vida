# DoeSangue

Monorepo do projeto DoeSangue (DoeVida) — sistema de doação de sangue.

## Estrutura do monorepo

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

🧱 Arquitetura da API

A API segue arquitetura modular:

```
src/
└── modules/
    └── example/
        ├── domain/               # Entidades, repositórios (interfaces), exceções
        ├── application/          # Casos de uso (UseCases)
        └── infrastructure/       # TypeORM, Controllers, Guards, Strategies
```

| App     | Tecnologias                                                            |
| ------- | ---------------------------------------------------------------------- |
| **api** | NestJS, TypeORM, PostgreSQL, Redis, JWT, Passport, Bcrypt              |
| **web** | React 18, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS |

📦 Pré-requisitos

Node.js >= 18

Docker

Docker Compose

## Instalação

```bash
# Clone o repositório (se ainda não clonou)
git clone <url-do-repositorio>
cd new-doesangue

# Instala dependências do frontend (na raiz)
npm install
```

## Como rodar

🐳 Banco de Dados e Redis (Docker)

Na **raiz do repositório**, suba PostgreSQL e Redis em containers:

```bash
docker compose up -d
```

**Portas não padrão** — Para evitar conflito com Postgres ou Redis já rodando na sua máquina (que costumam usar 5432 e 6379), este projeto usa:

| Serviço    | Porta no host | Porta padrão |
| ---------- | ------------- | ------------ |
| PostgreSQL | **5433**      | 5432         |
| Redis      | **6380**      | 6379         |

Isso evita conflito com serviços locais já rodando.

🔐 Credenciais padrão (desenvolvimento)

PostgreSQL:

```yml
Host: localhost
Port: 5433
User: toch
Password: supersecretpassword
Database: doevida-db
```

Redis:

```yml
Host: localhost
Port: 6380
Password: redis-dev-secret
```

Você pode alterar copiando:

```bash
cp .env.example .env
```

🗄️ Backend (API)

Antes de subir a API, certifique-se que o banco está rodando:

```bash
cd apps/api
npm run migration:run
```

```bash
npm run seed
```

Isso criará:

👤 Admin

- Email: admin@admin.com

- Senha: Admin@123

👤 Staff

- Email: staff@staff.com

- Senha: Staff@123

## Rodar API em desenvolvimento

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

Ou **dentro de apps/api**:

```bash
npm run start:dev
```

A API estará disponível em:

```arduino
http://localhost:3001
```

🔐 Autenticação

A API utiliza:

- JWT

- Passport

- Decorator @CurrentUser()

- Decorator @Roles()

- RolesGuard

Controle de acesso baseado em role:

- ADMIN

- STAFF

## Documentação

- [Identity e design minimal](docs/IDENTITY-MINIMAL-DESIGN.md)
- [Notas de implementação](docs/IMPLEMENTATION_NOTES.md)
- [Arquitetura do frontend](apps/web/docs/ARCHITECTURE.md)

## Licença

Privado / uso interno.
