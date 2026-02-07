# Notas de implementação – Doe Sangue

Documentação das partes implementadas na ordem sugerida, com explicação de cada uma.

---

## Parte 1: GET /api/donors/{id} (detalhe do doador)

**Objetivo:** Permitir que o front busque um doador por ID na API e exiba dados completos (incluindo última doação, data de cadastro, próxima doação e histórico).

### Backend (API)

1. **IDonationRepository – `GetByDonorIdAsync(Guid donorId)`**  
   - Interface para obter as doações de um doador.  
   - Retorno: lista de doações ordenadas da mais recente para a mais antiga (para calcular última doação e histórico).

2. **DonationRepository – implementação**  
   - Consulta `Donations` com `Where(d.DonorId == donorId)`, `OrderByDescending(d.DateDonation)` e `ToListAsync()`.  
   - Garante que o handler receba as doações já ordenadas.

3. **Use case GetDonorById**  
   - **DonationRecordDto:** DTO com `Date` e `Location` de cada doação (para o histórico).  
   - **GetDonorByIdResponse:** resposta com dados do doador + `RegisteredAt`, `LastDonation`, `NextDonationDate`, `DonationHistory`.  
   - **GetDonorByIdHandler:**  
     - Busca o doador por ID.  
     - Busca doações com `GetByDonorIdAsync`.  
     - Calcula última doação (primeira da lista ordenada), elegibilidade com `CanDonate(lastDonationDate)` e próxima data (última + 3 meses).  
     - Monta a resposta com histórico como lista de `DonationRecordDto`.

4. **DonorController**  
   - `[HttpGet("{id:guid}")]` chama o handler; retorna 404 se o doador não existir.

5. **DI**  
   - `GetDonorByIdHandler` registrado em `ApplicationDependencyInjection`.

### Frontend

1. **Tipos**  
   - `GetDonorByIdApiResponse` em `donor.ts`: espelha a resposta da API em camelCase (ex.: `registeredAt`, `lastDonation`, `nextDonationDate`, `donationHistory` com `date` e `location`).

2. **donors-service**  
   - `mapGetDonorByIdToDonor(data)`: mapeia a resposta do GET por id para o tipo `Donor` (incluindo `lastDonation`, `registrationDate`, `nextDonationDate`, `donationHistory`).  
   - `getById(id)`: chama `GET /api/donors/${id}`; em 404 retorna `null`; em sucesso usa o mapeamento acima. Uso de `axios.isAxiosError` para tratar 404.

Com isso, a tela de detalhe do doador passa a usar dados reais da API (última doação, cadastro, próxima doação, histórico).

---

## Parte 2: LastDonation e RegisteredAt na listagem (GET /api/donors)

**Objetivo:** A listagem paginada de doadores deve vir da API já com “última doação” e “data de cadastro”, para exibir a coluna “Última Doação” e o card “Novos este mês” com dados reais.

### Backend (API)

1. **GetDonorsResponse**  
   - Novas propriedades:  
     - `LastDonation` (DateTime?): data da última doação (vinda da tabela Donations); `null` se nunca doou.  
     - `RegisteredAt` (DateTime): data de cadastro do doador (CreatedAt).

2. **GetDonorsHandler**  
   - O repositório já devolve `(Donor, DateTime? LastDonationDate)` por item.  
   - No mapeamento para `GetDonorsResponse`, passa a preencher:  
     - `LastDonation = x.LastDonationDate`  
     - `RegisteredAt = x.Donor.CreatedAt`  
   - Assim, cada item da listagem inclui última doação e data de cadastro sem consultas extras.

### Frontend

1. **DonorsApiItem** (`donor.ts`)  
   - Novos campos opcionais:  
     - `lastDonation?: string | null` (ISO).  
     - `registeredAt?: string` (ISO).

2. **mapApiItemToDonor** (donors-service)  
   - Passa a preencher:  
     - `lastDonation: item.lastDonation ?? null`  
     - `registrationDate: item.registeredAt ?? ''`  
   - A tabela já usava `donor.lastDonation` e `formatDate(donor.lastDonation)` (retornando "Nunca" quando null).  
   - O card “Novos este mês” já usava `donor.registrationDate` (filtro por mês/ano atual).  
   - Com o mapeamento acima, a listagem e os cards passam a refletir os dados da API.

Resumo: a API enriquece cada item da listagem com `lastDonation` e `registeredAt`; o front apenas consome e mapeia para o tipo `Donor`, sem alterar a UI da tabela/cards.

---

## Parte 3 (backend): Identity + JWT + login

**Objetivo:** Autenticação real na API: usuários do sistema (Admin/Staff), login com email/senha e JWT.

### Backend (API)

1. **Pacotes:** Identity.EntityFrameworkCore (Infrastructure + Api), JwtBearer (Api).
2. **AppUser** (Infrastructure/Identity): herda `IdentityUser`; propriedades extras: `Name`, `IsActive`, `CreatedAt`.
3. **DoeVidaDbContext:** passa a herdar `IdentityDbContext<AppUser, IdentityRole, string>`; tabelas Identity (AspNetUsers, AspNetRoles, AspNetUserRoles) + Donors/Donations.
4. **Migration:** `AddIdentityTables` — criada pelo comando `dotnet ef migrations add AddIdentityTables --project ../DoeVida.Infrastructure --startup-project .` (rodar `dotnet ef database update` para aplicar).
5. **Application:** `IAuthService` (LoginAsync); DTOs `AuthLoginResult`, `AuthUserInfo`.
6. **Api:** `AuthService` (usa `UserManager<AppUser>`, gera JWT); `AuthController` com `POST /api/auth/login` (body: email, password); `IdentitySeed` (roles Admin/Staff + usuário admin se `Seed:AdminEmail` e `Seed:AdminPassword` em appsettings).
7. **Program.cs:** AddIdentity, AddAuthentication(JwtBearer), AddAuthorization, UseAuthentication/UseAuthorization; seed na subida.
8. **appsettings:** seção `Jwt` (Key, Issuer, Audience, ExpirationMinutes) e `Seed` (AdminEmail, AdminPassword). Primeiro acesso: admin@doevida.local / Admin@123 (trocar em produção).
9. **DonorController:** `[Authorize(Roles = "Admin,Staff")]` em GET lista e GET por id; `[AllowAnonymous]` em POST Register (cadastro público).

### Próximo passo (front)

- Substituir auth mock por `POST /api/auth/login`; guardar token e user; enviar `Authorization: Bearer <token>` em todas as requisições à API; proteger rotas e menu por autenticação/role.

---

## Próximos passos (ordem sugerida)

1. **Parte 3 (front):** Login real no front, token no client HTTP, rotas protegidas.  
2. **Parte 4:** Edição de doador (PUT/PATCH + tela de edição).  
3. **Parte 5:** Registro de nova doação pelo admin (POST em doações + UI).  
4. **Parte 6 (opcional):** Export CSV completo e totais agregados; gestão de usuários (Admin).
