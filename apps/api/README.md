# 🚀 NestJS Modular Boilerplate

API boilerplate production-ready com autenticação JWT, autorização por roles e arquitetura modular baseada em Domain-Driven Design.

---

## 📦 Stack

| Tecnologia      | Versão |
| --------------- | ------ |
| NestJS          | ^10    |
| TypeORM         | ^0.3   |
| PostgreSQL      | ^15    |
| Passport + JWT  | -      |
| Bcrypt          | -      |
| Class-validator | -      |

---

## 🏗️ Arquitetura

Cada módulo segue a separação em três camadas:

```
src/
└── modules/
    └── example/
        ├── domain/               # Entidades, repositórios (interfaces), exceções
        ├── application/          # Casos de uso (UseCases)
        └── infrastructure/       # TypeORM, Controllers, Guards, Strategies
```

### Domain

Regras de negócio puras — sem dependência de ORM, framework ou biblioteca externa.

### Application

Orquestra os casos de uso, consumindo apenas interfaces do domínio.

### Infrastructure

Implementações concretas: entidades ORM, repositórios TypeORM, controllers HTTP, guards e strategies JWT.

> ⚠️ **Nunca misture regra de negócio com ORM.** Mantenha as camadas isoladas.

---

## 🔐 Autenticação & Autorização

- Autenticação via **JWT** (Bearer Token)
- Decorator `@CurrentUser()` — acesso ao usuário autenticado
- Decorator `@Roles()` — restrição por role
- `RolesGuard` — guard global para verificação de permissões
- Roles disponíveis: `ADMIN` | `STAFF`

**Exemplo de uso:**

```typescript
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Get('admin-only')
findAll() { ... }
```

---

## ⚙️ Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=nestjs_boilerplate

JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=7d
```

### 3. Rodar migrations

```bash
npm run migration:run
```

### 4. Popular o banco com seed

```bash
npm run seed
```

### 5. Iniciar a aplicação

```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3000/api/v1`.

---

## 🗄️ Migrations

| Comando                                             | Descrição                                     |
| --------------------------------------------------- | --------------------------------------------- |
| `npm run migration:generate --name=NomeDaMigration` | Gera uma nova migration baseada nas entidades |
| `npm run migration:run`                             | Executa migrations pendentes                  |
| `npm run migration:revert`                          | Reverte a última migration                    |

---

## 👤 Usuários padrão (Seed)

| Role  | Email           | Senha     |
| ----- | --------------- | --------- |
| Admin | admin@admin.com | Admin@123 |
| Staff | staff@staff.com | Staff@123 |

---

## 🧱 Criando um novo módulo

1. Crie a estrutura de pastas:

```
src/modules/novo-modulo/
├── domain/
│   ├── entities/
│   └── repositories/
├── application/
│   └── use-cases/
└── infrastructure/
    ├── typeorm/
    └── http/
```

2. Crie a entidade de domínio (sem decorators ORM):

```typescript
export class NovoModuloEntity {
  constructor(
    public readonly id: string,
    public name: string,
  ) {}
}
```

3. Defina a interface do repositório no domínio:

```typescript
export const NOVO_MODULO_REPOSITORY = 'NOVO_MODULO_REPOSITORY';

export interface INovoModuloRepository {
  create(entity: NovoModuloEntity): Promise<NovoModuloEntity>;
  findById(id: string): Promise<NovoModuloEntity | null>;
}
```

4. Implemente o repositório com TypeORM na camada de infraestrutura e registre o módulo no NestJS.

---

## 📁 Estrutura do projeto

```
src/
├── config/               # Configurações (TypeORM, JWT)
├── shared/
│   ├── database/
│   │   └── migrations/   # Arquivos de migration
│   ├── exceptions/       # Exceções base de domínio
│   └── filters/          # Exception filters globais
└── modules/
    ├── user/
    └── auth/
```

---

## 🛡️ Tratamento de erros

O boilerplate usa um sistema de exceções de domínio com um `ExceptionFilter` global. Basta lançar a exceção correta no use case — sem try/catch no controller.

```typescript
import { ConflictError } from '@shared/exceptions/conflict.error';

// Em qualquer use case:
throw new ConflictError('User already exists');
```

Exceções disponíveis:

| Classe                     | HTTP Status |
| -------------------------- | ----------- |
| `ConflictError`            | 409         |
| `NotFoundError`            | 404         |
| `UnauthorizedError`        | 401         |
| `ForbiddenError`           | 403         |
| `UnprocessableEntityError` | 422         |

---

## 📄 Licença

MIT
