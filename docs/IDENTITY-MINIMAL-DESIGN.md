# Identity mínimo para o Doe Vida

Desenho do uso mínimo de **ASP.NET Core Identity** no Doe Vida: apenas usuários do sistema (admin/funcionários), login com email/senha e JWT. Sem 2FA, logins externos ou claims avançados no primeiro momento.

---

## 1. Escopo

| Incluído | Fora do escopo (por enquanto) |
|----------|-------------------------------|
| Usuário: Email, Nome, Senha (hash), Role, Ativo | Claims customizados além de role |
| Roles: **Admin**, **Staff** | Two-factor authentication (2FA) |
| Login (email + senha) → JWT | Login externo (Google, etc.) |
| Proteção de endpoints por autenticação + role | Recuperação de senha por email |
| Lockout após N falhas (configurável) | AspNetUserLogins, AspNetUserTokens (external) |
| Hash de senha (Identity) | Tabelas de claims/roles complexas (podemos simplificar) |

---

## 2. Modelo de dados

### 2.1 Entidade de usuário (Identity “enxuto”)

Uma única entidade de usuário do sistema, com o mínimo de campos:

- **Id** (string, GUID como string — padrão Identity)
- **UserName** (string): mesmo valor que **Email** (Identity exige UserName; usamos email para login)
- **Email** (string), único, normalizado
- **NormalizedUserName** / **NormalizedEmail**: Identity usa para buscas case-insensitive
- **PasswordHash** (string): preenchido pelo Identity (PBKDF2)
- **Name** (string): nome de exibição (ex.: "Maria Admin")
- **Role** (string ou enum): `"Admin"` ou `"Staff"` — ver opções abaixo
- **IsActive** (bool): desativar usuário sem apagar (auditoria)
- **CreatedAt** (DateTime), opcional
- **SecurityStamp** (string): Identity usa para invalidar sessões ao trocar senha

**Onde fica:**  
- **Opção A (recomendada):** classe que herda de `IdentityUser` (pacote Identity), com propriedades extras: `Name`, `IsActive`, `CreatedAt`. Role via **uma única role por usuário** na tabela de roles do Identity.  
- **Opção B:** classe própria (ex.: `AppUser`) que implementa `IUserStore` etc.; mais trabalho e menos benefício para o “mínimo”.

Recomendação: **Opção A** — herdar `IdentityUser`, adicionar `Name`, `IsActive`, `CreatedAt`; usar **roles nativas do Identity** (tabela `AspNetRoles` com "Admin" e "Staff").

### 2.2 Roles

- Duas roles fixas: **Admin**, **Staff**.
- Tabela: `AspNetRoles` (Id, Name, NormalizedName). Apenas duas linhas: Admin, Staff.
- Relação N:N usuário–role: `AspNetUserRoles` (UserId, RoleId). Cada usuário tem **uma** role (um registro por usuário).

### 2.3 Tabelas que vamos usar (mínimo Identity)

| Tabela | Uso |
|--------|-----|
| **AspNetUsers** | Um registro por usuário do sistema (admin/funcionário). Colunas extras: Name, IsActive, CreatedAt. |
| **AspNetRoles** | Dois registros: "Admin", "Staff". |
| **AspNetUserRoles** | Qual role cada usuário tem (UserId, RoleId). |

Não precisamos (ou deixamos vazias/para depois):

- AspNetUserClaims, AspNetRoleClaims: não usar no mínimo.
- AspNetUserLogins, AspNetUserTokens: não usar (sem login externo nem 2FA).

Podemos configurar o Identity para **não** criar tabelas de Logins/Tokens, ou criá-las e ignorar.

---

## 3. Onde fica no solution (API)

- **DoeVida.Domain**  
  - Não obrigatório colocar a entidade de Identity aqui; Identity costuma ficar na Infra ou em um projeto “Identity”. Para manter mínimo, podemos colocar a classe do usuário (herdada de IdentityUser) em **DoeVida.Infrastructure** ou em **DoeVida.Api** (se quiser tudo junto).  
  - Alternativa: **DoeVida.Domain** contém apenas um enum `SystemRole { Admin, Staff }` e a API/Infra referenciam; a entidade de usuário fica na Infra.

- **DoeVida.Infrastructure**  
  - DbContext: estender o existente (`DoeVidaDbContext`) para incluir `DbSet<AppUser>` e configurar Identity com `AddIdentity<AppUser, IdentityRole>()` e store no mesmo SQL (PostgreSQL).  
  - Migrations: nova migration para tabelas AspNetUsers, AspNetRoles, AspNetUserRoles (e colunas extras em AspNetUsers).  
  - **AppUser:** classe que herda `IdentityUser`, com `Name`, `IsActive`, `CreatedAt`.

- **DoeVida.Application**  
  - Interfaces: `IAuthService` ou `ILoginService` (Login(email, password) → resultado com token ou falha).  
  - Handlers/commands: “Login” (valida credenciais, retorna JWT com userId + role). Opcional: “Alterar minha senha”, “Listar usuários” (Admin), “Criar funcionário” (Admin).  
  - Não precisa referenciar Identity diretamente; a aplicação depende de `IAuthService` e a implementação fica na API ou na Infra.

- **DoeVida.Api**  
  - Pacotes: Identity + JWT Bearer.  
  - Configuração: `AddIdentity<AppUser, IdentityRole>()`, `AddEntityFrameworkStores<DoeVidaDbContext>()`, políticas de lockout (opcional).  
  - Geração de JWT: após validar senha com `UserManager.CheckPasswordAsync`, gerar token (JWT) com claims: sub (userId), email, role (Admin ou Staff).  
  - Controller: `POST /api/auth/login` (email, senha) → 200 + { token, expiresAt, user: { id, email, name, role } } ou 401.  
  - Middleware: `UseAuthentication()` (JWT Bearer), `UseAuthorization()`; endpoints protegidos com `[Authorize]` e `[Authorize(Roles = "Admin")]` onde fizer sentido.

Resumo sugerido:

- **Domain:** enum `SystemRole` (opcional).  
- **Infrastructure:** `AppUser` (herda IdentityUser), DbContext com Identity, migrations.  
- **Application:** `IAuthService`, use case Login (e depois CriarFuncionário, ListarUsuários).  
- **Api:** configuração Identity + JWT, controller Auth, proteção de rotas.

---

## 4. Fluxo de login (visão geral)

1. Front envia `POST /api/auth/login` com `{ "email": "...", "password": "..." }`.
2. API busca usuário por email (UserName = email ou NormalizedEmail).
3. Verifica se usuário existe, está ativo (`IsActive`) e senha está correta (`UserManager.CheckPasswordAsync`).
4. Se lockout estiver ativo: verifica se não está bloqueado; em caso de falha, incrementa contador e pode bloquear.
5. Gera JWT com claims: `sub` (Id do usuário), `email`, `role` (nome da role: "Admin" ou "Staff"), `exp`, `iss`, etc.
6. Retorna 200 com `{ "token": "...", "expiresAt": "...", "user": { "id", "email", "name", "role" } }`.
7. Front guarda o token (ex.: memória ou localStorage) e envia no header `Authorization: Bearer <token>` nas requisições.
8. API, em cada request protegida, valida o JWT e preenche `User` (claims); políticas `[Authorize(Roles = "Admin")]` restringem por role.

---

## 5. Autorização nos endpoints

- **Públicos (sem token):**  
  - `POST /api/donors` (cadastro público de doador), `GET /api/donors` (se quiser listagem pública; hoje pode ser só admin).  
  - No Doe Vida atual, a listagem e o restante são admin; então podemos deixar apenas o cadastro público sem token.

- **Requer autenticação (qualquer role Admin ou Staff):**  
  - `GET /api/donors`, `GET /api/donors/{id}`, dashboard (se tiver endpoint), etc.  
  - Uso: `[Authorize]` (sem role) ou `[Authorize(Roles = "Admin,Staff")]`.

- **Somente Admin:**  
  - `GET /api/users` (listar usuários do sistema), `POST /api/users` (criar funcionário), `PATCH /api/users/{id}/deactivate`, etc.  
  - Uso: `[Authorize(Roles = "Admin")]`.

---

## 6. Configuração Identity (checklist mínimo)

- Registrar `AddIdentity<AppUser, IdentityRole>()` com opções:
  - Password: requisitos (tamanho, maiúscula, número, etc.) — definir um padrão razoável.
  - Lockout: ativar após N falhas, tempo de bloqueio (ex.: 5 tentativas, 15 min).
  - User: exigir email único; UserName = Email.
- Store: `AddEntityFrameworkStores<DoeVidaDbContext>()`.
- JWT: `AddAuthentication(JwtBearerDefaults.AuthenticationScheme)`, validar Issuer, Audience, Key, validade do token.
- Seed inicial: um usuário Admin (email/senha definidos em config ou seed) para primeiro acesso.

---

## 7. Front-end (resumo)

- Login: chamar `POST /api/auth/login` com email/senha; em sucesso, guardar token e dados do usuário (id, email, name, role).
- Enviar token em todas as requisições à API: header `Authorization: Bearer <token>`.
- Rotas protegidas: verificar se há token e, se não houver, redirecionar para `/login`.
- UI condicional por role: exibir "Usuários" / "Funcionários" apenas se `user.role === 'Admin'`.
- Logout: remover token e redirecionar para login ou home.

---

## 8. Ordem sugerida de implementação

1. **Backend**  
   - Pacotes: Identity + Identity.EntityFrameworkCore + JwtBearer.  
   - `AppUser` + configuração Identity no DbContext; migration (AspNetUsers com colunas extras, AspNetRoles, AspNetUserRoles).  
   - Seed: role Admin e Staff, um usuário Admin.  
   - `IAuthService` + implementação (login + geração JWT).  
   - Controller `POST /api/auth/login`.  
   - `[Authorize]` e `[Authorize(Roles = "Admin")]` nos controllers existentes (Donors, etc.) e futuros (Users).  

2. **Front**  
   - Substituir auth mock por chamada real ao login; guardar token e user; enviar token no client HTTP (axios/interceptor).  
   - Proteger rotas (ex.: redirect se não autenticado); esconder itens de menu por role.  

3. **Fase seguinte**  
   - Endpoints e tela de gestão de usuários (listar, criar funcionário, desativar); apenas Admin.

---

## 9. Diagrama resumido (fluxo e camadas)

```
[Front]
  Login (email, senha)
    → POST /api/auth/login
      [Api] AuthController
        → IAuthService.Login
          [Application] LoginHandler / AuthService
            → UserManager.FindByEmailAsync, CheckPasswordAsync
            → Geração JWT (userId, email, role)
        ← token + user
  Request protegida
    → Authorization: Bearer <token>
      [Api] Middleware JWT
        → User.Claims (sub, role, etc.)
      [Api] [Authorize(Roles = "Admin,Staff")] DonorController
        → 200 / 401 / 403
```

---

## 10. Resumo em tópicos

- **Identity mínimo:** uma entidade de usuário (herda IdentityUser) com Name, IsActive, CreatedAt; duas roles (Admin, Staff); tabelas AspNetUsers, AspNetRoles, AspNetUserRoles.
- **Login:** email + senha → JWT com userId e role; lockout opcional.
- **API:** AuthController (login); demais endpoints protegidos com JWT + role; Admin só para gestão de usuários.
- **Front:** login real, token no header, rotas e menu por autenticação e role.

Com isso o Doe Vida fica com Identity “enxuto” e pronto para evoluir (2FA, recuperação de senha, mais roles) quando precisar.
