-- Seed: doadores + doações para testar frontend (filtros: cidade, tipo sanguíneo, elegível, busca, paginação)
-- Banco: PostgreSQL (doevida-db). BloodType = enum em string: OPositive, ANegative, BPositive, etc.
-- Executar: psql -U toch -d doevida-db -h localhost -p 5433 -f scripts/seed-donors-and-donations.sql
-- Ou rodar no DBeaver/pgAdmin conectado ao banco da API.

-- Limpar dados de teste (descomente para reexecutar o seed)
-- DELETE FROM "Donations";
-- DELETE FROM "Donors";

-- ========== DONORS ==========
-- Tipos sanguíneos: OPositive, ONegative, APositive, ANegative, BPositive, BNegative, ABPositive, ABNegative
-- Peso < 50 kg = não elegível. Última doação < 3 meses = não elegível.
INSERT INTO "Donors" ("Id", "Name", "Email", "Phone", "DateOfBirth", "City", "BloodType", "Weight", "CreatedAt") VALUES
-- Elegíveis (sem doação ou doação antiga) — testar filtro Eligible = true
('11111111-1111-1111-1111-111111111111', 'Ana Souza', 'ana@doevida.com', '11999990001', '1992-05-10', 'São Paulo', 'OPositive', 62.5, now()),
('11111111-1111-1111-1111-111111111112', 'Bruno Lima', 'bruno@doevida.com', '11999990002', '1988-03-21', 'Campinas', 'APositive', 78.0, now()),
('11111111-1111-1111-1111-111111111113', 'Carla Mendes', 'carla@doevida.com', '11999990003', '1995-11-02', 'Santos', 'BPositive', 55.2, now()),
('11111111-1111-1111-1111-111111111114', 'Diego Rocha', 'diego@doevida.com', '11999990004', '1990-01-15', 'São Paulo', 'ABPositive', 81.3, now()),
('11111111-1111-1111-1111-111111111115', 'Elisa Nunes', 'elisa@doevida.com', '11999990005', '1987-07-19', 'Guarulhos', 'ONegative', 59.8, now()),
-- Não elegíveis (peso < 50) — testar filtro Eligible = false
('11111111-1111-1111-1111-111111111116', 'Felipe Costa', 'felipe@doevida.com', '11999990006', '1999-04-12', 'Osasco', 'ANegative', 48.0, now()),
('11111111-1111-1111-1111-111111111117', 'Gabriela Pires', 'gabi@doevida.com', '11999990007', '2000-09-30', 'Barueri', 'BNegative', 47.5, now()),
-- Elegíveis
('11111111-1111-1111-1111-111111111118', 'Henrique Alves', 'henrique@doevida.com', '11999990008', '1985-06-18', 'Sorocaba', 'OPositive', 90.0, now()),
('11111111-1111-1111-1111-111111111119', 'Isabela Freitas', 'isa@doevida.com', '11999990009', '1993-12-08', 'São Paulo', 'ABNegative', 61.0, now()),
('11111111-1111-1111-1111-111111111120', 'João Pedro', 'joao@doevida.com', '11999990010', '1982-10-01', 'Jundiaí', 'APositive', 74.6, now()),
('11111111-1111-1111-1111-111111111121', 'Karen Silva', 'karen@doevida.com', '11999990011', '1996-08-14', 'São Paulo', 'OPositive', 52.0, now()),
('11111111-1111-1111-1111-111111111122', 'Lucas Martins', 'lucas@doevida.com', '11999990012', '1991-02-27', 'Cotia', 'BPositive', 69.4, now()),
('11111111-1111-1111-1111-111111111123', 'Marina Lopes', 'marina@doevida.com', '11999990013', '1989-05-06', 'Santo André', 'ONegative', 63.7, now()),
('11111111-1111-1111-1111-111111111124', 'Nelson Araújo', 'nelson@doevida.com', '11999990014', '1980-01-20', 'São Bernardo', 'ANegative', 82.9, now()),
('11111111-1111-1111-1111-111111111125', 'Paula Rangel', 'paula@doevida.com', '11999990015', '1994-09-11', 'São Paulo', 'ABPositive', 57.3, now()),
-- Elegíveis com histórico de doação (última > 3 meses)
('11111111-1111-1111-1111-111111111126', 'Rafael Teixeira', 'rafael@doevida.com', '11999990016', '1986-03-04', 'Mogi das Cruzes', 'OPositive', 77.0, now()),
('11111111-1111-1111-1111-111111111127', 'Sandra Melo', 'sandra@doevida.com', '11999990017', '1990-07-25', 'Suzano', 'BPositive', 66.5, now()),
-- Não elegíveis (doação recente < 3 meses)
('11111111-1111-1111-1111-111111111128', 'Tiago Barros', 'tiago@doevida.com', '11999990018', '1984-11-09', 'São Paulo', 'APositive', 71.2, now()),
('11111111-1111-1111-1111-111111111129', 'Vanessa Cruz', 'vanessa@doevida.com', '11999990019', '1997-02-16', 'Diadema', 'OPositive', 60.4, now()),
-- Elegíveis (variedade de cidades e tipos para filtros)
('11111111-1111-1111-1111-111111111130', 'William Duarte', 'will@doevida.com', '11999990020', '1983-06-22', 'São Paulo', 'ONegative', 85.1, now()),
('11111111-1111-1111-1111-111111111131', 'Yasmin Faria', 'yasmin@doevida.com', '11999990021', '2001-04-18', 'Guarulhos', 'APositive', 54.0, now()),
('11111111-1111-1111-1111-111111111132', 'Zeca Monteiro', 'zeca@doevida.com', '11999990022', '1979-12-30', 'São Paulo', 'BNegative', 73.8, now()),
('11111111-1111-1111-1111-111111111133', 'Amanda Queiroz', 'amanda@doevida.com', '11999990023', '1998-08-07', 'Osasco', 'ABPositive', 58.6, now()),
('11111111-1111-1111-1111-111111111134', 'Daniel Fonseca', 'daniel@doevida.com', '11999990024', '1992-01-03', 'São Paulo', 'OPositive', 68.9, now()),
('11111111-1111-1111-1111-111111111135', 'Eduarda Campos', 'eduarda@doevida.com', '11999990025', '1989-10-28', 'Campinas', 'ANegative', 64.2, now());

-- ========== DONATIONS ==========
-- Regra: última doação há mais de 3 meses = elegível; dentro de 3 meses = não elegível.
-- Data de referência: use now() - 4 meses para elegível, now() - 1 mês para não elegível.
INSERT INTO "Donations" ("Id", "DonorId", "DateDonation", "Location") VALUES
-- Rafael: última há 4 meses -> elegível (com histórico)
(gen_random_uuid(), '11111111-1111-1111-1111-111111111126', (now() - interval '4 months'), 'Hemocentro São Paulo'),
-- Sandra: última há 5 meses
(gen_random_uuid(), '11111111-1111-1111-1111-111111111127', (now() - interval '5 months'), 'Hemocentro Unicamp'),
-- Tiago: última há 1 mês -> NÃO elegível
(gen_random_uuid(), '11111111-1111-1111-1111-111111111128', (now() - interval '1 month'), 'Hemocentro São Paulo'),
-- Vanessa: última há 2 meses -> NÃO elegível
(gen_random_uuid(), '11111111-1111-1111-1111-111111111129', (now() - interval '2 months'), 'Hemocentro São Paulo'),
-- Diego: 2 doações (histórico), última há 4 meses -> elegível
(gen_random_uuid(), '11111111-1111-1111-1111-111111111114', (now() - interval '6 months'), 'Hemocentro São Paulo'),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111114', (now() - interval '4 months'), 'Hemocentro São Paulo'),
-- Henrique: 1 doação antiga -> elegível
(gen_random_uuid(), '11111111-1111-1111-1111-111111111118', (now() - interval '5 months'), 'Hemocentro Campinas'),
-- João Pedro: 1 doação antiga
(gen_random_uuid(), '11111111-1111-1111-1111-111111111120', (now() - interval '4 months'), 'Hemocentro Jundiaí');

-- Resumo para testes no frontend:
-- Filtro por cidade: São Paulo (vários), Campinas (2), Santos (1), Guarulhos (2), Osasco (2), etc.
-- Filtro por tipo: OPositive (6), APositive (4), BPositive (3), ONegative (2), ANegative (4), BNegative (2), ABPositive (3), ABNegative (2).
-- Filtro elegível: true = maioria; false = Felipe, Gabriela (peso), Tiago, Vanessa (doação recente).
-- Busca: nomes e emails variados (Ana, Bruno, carla@..., São Paulo, etc.).
-- Paginação: 25 registros; testar page=1, pageSize=10 e page=2.
