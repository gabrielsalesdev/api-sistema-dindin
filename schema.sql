CREATE DATABASE dindin;

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL
);

CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL
);

INSERT INTO categorias (descricao)
VALUES
	('Alimentação'),
  ('Assinaturas e Serviços'),
  ('Casa'),
  ('Mercado'),
  ('Cuidados Pessoais'),
  ('Educação'),
  ('Família'),
  ('Lazer'),
  ('Pets'),
  ('Presentes'),
  ('Roupas'),
  ('Saúde'),
  ('Transporte'),
  ('Salário'),
  ('Vendas'),
  ('Outras receitas'),
  ('Outras despesas');

CREATE TABLE transacoes (
  id SERIAL PRIMARY KEY,
  tipo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  valor INT NOT NULL,
  data TIMESTAMPTZ NOT NULL,
  usuario_id INT REFERENCES usuarios(id),
  categoria_id INT REFERENCES categorias(id)
);