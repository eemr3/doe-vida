-- Seed de ~20 doadores para testar filtros (cidade, tipo sanguíneo, elegível) e paginação.
-- Elegível: idade >= 16, peso >= 50 kg, última doação há >= 3 meses ou nunca doou.

INSERT INTO "Donors" ("Id", "Name", "Email", "Phone", "DateOfBirth", "City", "BloodType", "Weight", "DateOfLastDonation")
VALUES
  (gen_random_uuid(), 'Ana Silva', 'ana.silva@email.com', '11987654321', '1995-03-15'::timestamptz, 'São Paulo', 'OPositive', 65.00, NULL),
  (gen_random_uuid(), 'Bruno Santos', 'bruno.santos@email.com', '21976543210', '1990-07-22'::timestamptz, 'Rio de Janeiro', 'APositive', 78.50, '2024-08-01'::timestamptz),
  (gen_random_uuid(), 'Carla Oliveira', 'carla.oliveira@email.com', '31965432109', '2002-01-10'::timestamptz, 'Belo Horizonte', 'BNegative', 55.00, NULL),
  (gen_random_uuid(), 'Diego Lima', 'diego.lima@email.com', '41954321098', '1988-11-30'::timestamptz, 'Curitiba', 'ABPositive', 82.00, '2024-06-15'::timestamptz),
  (gen_random_uuid(), 'Elena Costa', 'elena.costa@email.com', '51943210987', '2008-05-05'::timestamptz, 'Porto Alegre', 'ONegative', 48.00, NULL),
  (gen_random_uuid(), 'Felipe Souza', 'felipe.souza@email.com', '11932109876', '1992-09-18'::timestamptz, 'São Paulo', 'ANegative', 70.00, NULL),
  (gen_random_uuid(), 'Gabriela Rocha', 'gabriela.rocha@email.com', '21921098765', '1998-12-03'::timestamptz, 'Rio de Janeiro', 'BPositive', 58.00, '2026-01-10'::timestamptz),
  (gen_random_uuid(), 'Henrique Alves', 'henrique.alves@email.com', '31910987654', '1985-04-25'::timestamptz, 'Belo Horizonte', 'ABNegative', 90.00, '2024-05-20'::timestamptz),
  (gen_random_uuid(), 'Isabela Martins', 'isabela.martins@email.com', '41909876543', '2000-08-12'::timestamptz, 'Curitiba', 'OPositive', 52.00, NULL),
  (gen_random_uuid(), 'João Pereira', 'joao.pereira@email.com', '51998765432', '1993-02-28'::timestamptz, 'Porto Alegre', 'APositive', 75.00, '2024-10-01'::timestamptz),
  (gen_random_uuid(), 'Larissa Ferreira', 'larissa.ferreira@email.com', '11987654321', '2005-06-14'::timestamptz, 'São Paulo', 'BNegative', 54.00, NULL),
  (gen_random_uuid(), 'Marcos Ribeiro', 'marcos.ribeiro@email.com', '21976543210', '1987-10-07'::timestamptz, 'Rio de Janeiro', 'OPositive', 88.00, NULL),
  (gen_random_uuid(), 'Natália Dias', 'natalia.dias@email.com', '31965432109', '1999-03-21'::timestamptz, 'Belo Horizonte', 'ANegative', 60.00, '2024-09-15'::timestamptz),
  (gen_random_uuid(), 'Otávio Carvalho', 'otavio.carvalho@email.com', '41954321098', '1991-07-09'::timestamptz, 'Curitiba', 'BPositive', 72.00, NULL),
  (gen_random_uuid(), 'Patricia Nunes', 'patricia.nunes@email.com', '51943210987', '2003-11-25'::timestamptz, 'Porto Alegre', 'ABPositive', 56.00, '2026-01-20'::timestamptz),
  (gen_random_uuid(), 'Rafael Mendes', 'rafael.mendes@email.com', '11932109876', '1989-01-17'::timestamptz, 'São Paulo', 'ONegative', 68.00, NULL),
  (gen_random_uuid(), 'Sandra Teixeira', 'sandra.teixeira@email.com', '21921098765', '1996-04-08'::timestamptz, 'Rio de Janeiro', 'ABNegative', 62.00, '2024-07-22'::timestamptz),
  (gen_random_uuid(), 'Thiago Barbosa', 'thiago.barbosa@email.com', '31910987654', '1994-08-30'::timestamptz, 'Belo Horizonte', 'APositive', 80.00, NULL),
  (gen_random_uuid(), 'Úrsula Castro', 'ursula.castro@email.com', '41909876543', '2001-12-12'::timestamptz, 'Curitiba', 'OPositive', 51.00, NULL),
  (gen_random_uuid(), 'Vinicius Gomes', 'vinicius.gomes@email.com', '51998765432', '1997-06-03'::timestamptz, 'Porto Alegre', 'BNegative', 77.00, '2024-04-10'::timestamptz);
