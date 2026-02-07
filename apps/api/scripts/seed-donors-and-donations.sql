-- Seed: 25 doadores + doações para testes no frontend
-- Banco: PostgreSQL (timestamp with time zone, uuid)
-- Executar: psql -U postgres -d DoeVida -f scripts/seed-donors-and-donations.sql
-- Ou via IDE/ferramenta SQL no mesmo banco da API

-- Limpar dados de teste (opcional; descomente se quiser rodar o seed várias vezes)
-- DELETE FROM "Donations";
-- DELETE FROM "Donors";

-- 25 doadores (Id, Name, Email, Phone, DateOfBirth, City, BloodType, Weight, CreatedAt)
INSERT INTO "Donors" ("Id", "Name", "Email", "Phone", "DateOfBirth", "City", "BloodType", "Weight", "CreatedAt") VALUES
('a1000001-0000-4000-8000-000000000001', 'Ana Silva Santos', 'ana.silva@email.com', '11987654321', '1995-03-15T00:00:00Z', 'São Paulo', 'OPositive', 62.50, '2024-01-10T10:00:00Z'),
('a1000002-0000-4000-8000-000000000002', 'Bruno Oliveira Costa', 'bruno.costa@email.com', '21976543210', '1990-07-22T00:00:00Z', 'Rio de Janeiro', 'APositive', 78.00, '2024-02-20T11:30:00Z'),
('a1000003-0000-4000-8000-000000000003', 'Carla Mendes Lima', 'carla.lima@email.com', '31965432109', '1998-11-08T00:00:00Z', 'Belo Horizonte', 'ANegative', 55.20, '2024-03-05T09:15:00Z'),
('a1000004-0000-4000-8000-000000000004', 'Diego Pereira Souza', 'diego.souza@email.com', '41954321098', '1988-05-30T00:00:00Z', 'Curitiba', 'BPositive', 82.00, '2024-04-12T14:00:00Z'),
('a1000005-0000-4000-8000-000000000005', 'Elena Ferreira Rocha', 'elena.rocha@email.com', '51943210987', '2000-01-18T00:00:00Z', 'Porto Alegre', 'ABPositive', 58.00, '2024-05-01T08:45:00Z'),
('a1000006-0000-4000-8000-000000000006', 'Felipe Alves Martins', 'felipe.martins@email.com', '61932109876', '1992-09-25T00:00:00Z', 'Brasília', 'ONegative', 70.50, '2024-06-18T16:20:00Z'),
('a1000007-0000-4000-8000-000000000007', 'Gabriela Ribeiro Nunes', 'gabriela.nunes@email.com', '71921098765', '1996-12-03T00:00:00Z', 'Salvador', 'APositive', 65.00, '2024-07-22T12:00:00Z'),
('a1000008-0000-4000-8000-000000000008', 'Henrique Carvalho Dias', 'henrique.dias@email.com', '81910987654', '1985-04-14T00:00:00Z', 'Recife', 'BNegative', 75.30, '2024-08-30T09:30:00Z'),
('a1000009-0000-4000-8000-000000000009', 'Isabela Gomes Pinto', 'isabela.pinto@email.com', '11909876543', '1999-08-07T00:00:00Z', 'São Paulo', 'OPositive', 52.00, '2024-09-14T11:00:00Z'),
('a100000a-0000-4000-8000-00000000000a', 'João Pedro Santos Lima', 'joao.lima@email.com', '21998765432', '1993-02-28T00:00:00Z', 'Rio de Janeiro', 'ANegative', 68.00, '2024-10-01T14:45:00Z'),
('a100000b-0000-4000-8000-00000000000b', 'Larissa Costa Oliveira', 'larissa.oliveira@email.com', '31987654321', '1997-06-11T00:00:00Z', 'Belo Horizonte', 'ABNegative', 60.00, '2024-11-10T10:10:00Z'),
('a100000c-0000-4000-8000-00000000000c', 'Marcos Vinícius Araújo', 'marcos.araujo@email.com', '41976543210', '1991-10-19T00:00:00Z', 'Curitiba', 'OPositive', 73.50, '2024-12-05T08:00:00Z'),
('a100000d-0000-4000-8000-00000000000d', 'Natália Rodrigues Teixeira', 'natalia.teixeira@email.com', '51965432109', '1994-04-02T00:00:00Z', 'Porto Alegre', 'BPositive', 57.00, '2025-01-15T13:20:00Z'),
('a100000e-0000-4000-8000-00000000000e', 'Otávio Barbosa Castro', 'otavio.castro@email.com', '61954321098', '1989-07-30T00:00:00Z', 'Brasília', 'APositive', 80.00, '2025-02-01T09:00:00Z'),
('a100000f-0000-4000-8000-00000000000f', 'Patrícia Lopes Moreira', 'patricia.moreira@email.com', '71943210987', '1996-01-12T00:00:00Z', 'Salvador', 'ONegative', 54.50, '2025-03-10T15:30:00Z'),
('a1000010-0000-4000-8000-000000000010', 'Rafael Souza Fernandes', 'rafael.fernandes@email.com', '81932109876', '1992-11-23T00:00:00Z', 'Recife', 'ANegative', 71.00, '2025-04-08T11:45:00Z'),
('a1000011-0000-4000-8000-000000000011', 'Sandra Lima Carvalho', 'sandra.carvalho@email.com', '11921098765', '1987-03-09T00:00:00Z', 'São Paulo', 'ABPositive', 63.00, '2025-05-20T10:00:00Z'),
('a1000012-0000-4000-8000-000000000012', 'Thiago Mendes Pereira', 'thiago.pereira@email.com', '21910987654', '1998-08-16T00:00:00Z', 'Rio de Janeiro', 'BPositive', 69.20, '2025-06-02T14:00:00Z'),
('a1000013-0000-4000-8000-000000000013', 'Úrsula Almeida Gomes', 'ursula.gomes@email.com', '31909876543', '1995-12-27T00:00:00Z', 'Belo Horizonte', 'OPositive', 56.00, '2025-07-12T08:30:00Z'),
('a1000014-0000-4000-8000-000000000014', 'Vitor Hugo Nascimento', 'vitor.nascimento@email.com', '41998765432', '1990-05-04T00:00:00Z', 'Curitiba', 'BNegative', 76.00, '2025-08-25T12:15:00Z'),
('a1000015-0000-4000-8000-000000000015', 'Yasmin Ferreira Costa', 'yasmin.costa@email.com', '51987654321', '2001-09-14T00:00:00Z', 'Porto Alegre', 'APositive', 53.50, '2025-09-30T09:45:00Z'),
('a1000016-0000-4000-8000-000000000016', 'André Luiz Rocha Silva', 'andre.rocha@email.com', '61976543210', '1986-02-21T00:00:00Z', 'Brasília', 'ABNegative', 74.00, '2025-10-10T16:00:00Z'),
('a1000017-0000-4000-8000-000000000017', 'Beatriz Santos Oliveira', 'beatriz.oliveira@email.com', '71965432109', '1999-06-08T00:00:00Z', 'Salvador', 'ONegative', 59.00, '2025-11-05T11:00:00Z'),
('a1000018-0000-4000-8000-000000000018', 'Caio Martins Dias', 'caio.dias@email.com', '81954321098', '1993-10-31T00:00:00Z', 'Recife', 'OPositive', 67.50, '2025-12-01T13:30:00Z'),
('a1000019-0000-4000-8000-000000000019', 'Daniela Ribeiro Pinto', 'daniela.pinto@email.com', '11943210987', '1997-04-17T00:00:00Z', 'São Paulo', 'ANegative', 61.00, '2026-01-20T10:20:00Z'),
('a100001a-0000-4000-8000-00000000001a', 'Eduardo Gomes Araújo', 'eduardo.araujo@email.com', '21932109876', '1991-08-05T00:00:00Z', 'Rio de Janeiro', 'BPositive', 72.00, '2026-02-03T09:00:00Z');

-- Doações: alguns doadores com 1 ou 2 doações (para variar última doação e elegibilidade)
-- Regra: última doação há mais de 3 meses = elegível; dentro de 3 meses = não elegível
INSERT INTO "Donations" ("Id", "DonorId", "DateDonation", "Location") VALUES
-- Ana: última doação há 4 meses -> elegível
(gen_random_uuid(), 'a1000001-0000-4000-8000-000000000001', '2025-10-01T10:00:00Z', 'Hemocentro São Paulo'),
-- Bruno: última há 2 meses -> não elegível
(gen_random_uuid(), 'a1000002-0000-4000-8000-000000000002', '2025-12-05T09:00:00Z', 'Hemorio - Rio de Janeiro'),
-- Carla: nunca doou (sem registro)
-- Diego: 2 doações (histórico)
(gen_random_uuid(), 'a1000004-0000-4000-8000-000000000004', '2024-06-15T14:00:00Z', 'Hemepar Curitiba'),
(gen_random_uuid(), 'a1000004-0000-4000-8000-000000000004', '2025-09-20T14:00:00Z', 'Hemepar Curitiba'),
-- Elena: última há 5 meses -> elegível
(gen_random_uuid(), 'a1000005-0000-4000-8000-000000000005', '2025-09-01T08:00:00Z', 'Hemocentro RS - Porto Alegre'),
-- Felipe: última há 1 mês -> não elegível
(gen_random_uuid(), 'a1000006-0000-4000-8000-000000000006', '2026-01-06T11:00:00Z', 'Hemocentro DF'),
-- Gabriela: última há 3+ meses -> elegível
(gen_random_uuid(), 'a1000007-0000-4000-8000-000000000007', '2025-10-25T12:00:00Z', 'Fundação Hemoba - Salvador'),
-- Henrique: 2 doações
(gen_random_uuid(), 'a1000008-0000-4000-8000-000000000008', '2024-11-10T10:00:00Z', 'Hemope Recife'),
(gen_random_uuid(), 'a1000008-0000-4000-8000-000000000008', '2025-08-15T10:00:00Z', 'Hemope Recife'),
-- Isabela: nunca doou
-- João Pedro: última há 4 meses
(gen_random_uuid(), 'a100000a-0000-4000-8000-00000000000a', '2025-10-10T14:00:00Z', 'Hemorio - Rio de Janeiro'),
-- Larissa: última há 2 meses -> não elegível
(gen_random_uuid(), 'a100000b-0000-4000-8000-00000000000b', '2025-12-01T10:00:00Z', 'Hemominas BH'),
-- Marcos: última há 5 meses
(gen_random_uuid(), 'a100000c-0000-4000-8000-00000000000c', '2025-09-05T08:00:00Z', 'Hemepar Curitiba'),
-- Natália: nunca doou
-- Otávio: última há 1 mês
(gen_random_uuid(), 'a100000e-0000-4000-8000-00000000000e', '2026-01-08T09:00:00Z', 'Hemocentro DF'),
-- Patrícia: última há 4 meses
(gen_random_uuid(), 'a100000f-0000-4000-8000-00000000000f', '2025-10-12T15:00:00Z', 'Fundação Hemoba - Salvador'),
-- Rafael: 2 doações
(gen_random_uuid(), 'a1000010-0000-4000-8000-000000000010', '2024-08-20T11:00:00Z', 'Hemope Recife'),
(gen_random_uuid(), 'a1000010-0000-4000-8000-000000000010', '2025-11-25T11:00:00Z', 'Hemope Recife'),
-- Sandra: última há 3+ meses
(gen_random_uuid(), 'a1000011-0000-4000-8000-000000000011', '2025-10-28T10:00:00Z', 'Hemocentro São Paulo'),
-- Thiago: nunca doou
-- Úrsula: última há 2 meses
(gen_random_uuid(), 'a1000013-0000-4000-8000-000000000013', '2025-12-10T08:00:00Z', 'Hemominas BH'),
-- Vitor: última há 5 meses
(gen_random_uuid(), 'a1000014-0000-4000-8000-000000000014', '2025-09-01T12:00:00Z', 'Hemepar Curitiba'),
-- Yasmin: nunca doou
-- André: última há 4 meses
(gen_random_uuid(), 'a1000016-0000-4000-8000-000000000016', '2025-10-05T16:00:00Z', 'Hemocentro DF'),
-- Beatriz: última há 1 mês
(gen_random_uuid(), 'a1000017-0000-4000-8000-000000000017', '2026-01-12T11:00:00Z', 'Fundação Hemoba - Salvador'),
-- Caio: última há 3+ meses
(gen_random_uuid(), 'a1000018-0000-4000-8000-000000000018', '2025-11-01T13:00:00Z', 'Hemope Recife'),
-- Daniela: cadastro recente (2026-01), sem doação
-- Eduardo: última há 2 meses
(gen_random_uuid(), 'a100001a-0000-4000-8000-00000000001a', '2025-12-03T09:00:00Z', 'Hemorio - Rio de Janeiro');
