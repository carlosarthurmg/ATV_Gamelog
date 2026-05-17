-- Tabela de categorias
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de jogos
CREATE TABLE jogos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  ano_lancamento INTEGER,
  plataforma VARCHAR(100),
  nota NUMERIC(3,1) CHECK (nota >= 0 AND nota <= 10),
  categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dados de exemplo
INSERT INTO categorias (nome) VALUES
  ('Ação'),
  ('RPG'),
  ('Aventura'),
  ('Esporte'),
  ('Terror'),
  ('Estratégia');

INSERT INTO jogos (titulo, descricao, ano_lancamento, plataforma, nota, categoria_id) VALUES
  ('The Last of Us', 'Jogo de sobrevivência pós-apocalíptico da Naughty Dog.', 2013, 'PlayStation', 9.5, 3),
  ('Elden Ring', 'RPG de mundo aberto da FromSoftware e George R.R. Martin.', 2022, 'PC / Console', 9.8, 2),
  ('FIFA 24', 'Simulador de futebol da EA Sports.', 2023, 'Multiplataforma', 7.2, 4),
  ('Resident Evil 4 Remake', 'Remake do clássico survival horror da Capcom.', 2023, 'Multiplataforma', 9.3, 5);
