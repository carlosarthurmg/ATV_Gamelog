# GameLog — Catálogo de Jogos

Sistema web completo para gerenciar seu catálogo pessoal de jogos. Desenvolvido com Node.js, Express e Supabase como atividade prática de desenvolvimento Full Stack.

---

##  Descrição do Sistema

O **GameLog** permite:
- Cadastrar, editar, excluir e listar jogos
- Organizar jogos por categorias (RPG, Ação, Terror, etc.)
- Filtrar jogos por título (busca em tempo real) e por categoria
- Registrar nota, plataforma e ano de lançamento de cada jogo

---

## Tecnologias Utilizadas

| Camada     | Tecnologia                    |
|------------|-------------------------------|
| Back-end   | Node.js, Express              |
| Banco      | Supabase (PostgreSQL)         |
| Front-end  | HTML5, CSS3, JavaScript (ES6+)|
| Requisições| fetch() + async/await + JSON  |

---

## Estrutura do Projeto

```
gamelog/
│
├── index.js          # Servidor Express + rotas da API REST
├── package.json
├── .env.example      # Variáveis de ambiente (modelo)
├── supabase.sql      # Script SQL para criar as tabelas
│
└── Front/
    ├── index.html    # Interface principal
    ├── style.css     # Estilos
    └── script.js     # Lógica front-end (fetch, CRUD, DOM)
```

---

##  Como Executar o Projeto

### 1. Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com)

### 2. Configurar o Supabase

1. Crie um projeto no Supabase
2. Vá em **SQL Editor** e execute o conteúdo do arquivo `supabase.sql`
3. Execute também:
```sql
ALTER TABLE jogos DISABLE ROW LEVEL SECURITY;
ALTER TABLE categorias DISABLE ROW LEVEL SECURITY;
```
4. Copie a **URL** e a **anon key** do projeto em `Settings > API`

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env`:

```env
SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
SUPABASE_KEY=sua_anon_key_aqui
PORT=3000
```

### 4. Instalar dependências e rodar

```bash
npm install
npm run dev
```

### 5. Acessar

Abra `http://localhost:3000` no navegador.

---

##  Endpoints da API

### Jogos
| Método | Rota               | Descrição                                         |
|--------|--------------------|---------------------------------------------------|
| GET    | /api/jogos         | Listar todos (aceita ?search e ?categoria_id)     |
| GET    | /api/jogos/:id     | Buscar um jogo por ID                             |
| POST   | /api/jogos         | Criar novo jogo                                   |
| PUT    | /api/jogos/:id     | Atualizar jogo                                    |
| DELETE | /api/jogos/:id     | Excluir jogo                                      |

### Categorias
| Método | Rota                | Descrição             |
|--------|---------------------|-----------------------|
| GET    | /api/categorias     | Listar categorias     |
| POST   | /api/categorias     | Criar categoria       |
| PUT    | /api/categorias/:id | Atualizar categoria   |
| DELETE | /api/categorias/:id | Excluir categoria     |

---

##  Banco de Dados

Duas tabelas no Supabase:

```
categorias          jogos
──────────          ─────────────────────
id (PK)             id (PK)
nome                titulo
created_at          descricao
                    ano_lancamento
                    plataforma
                    nota
                    categoria_id (FK → categorias)
                    created_at
```

---

##  Prints do Sistema

### Catálogo de Jogos
![Catálogo de Jogos](prints/jogos.png)

### Filtro por Categoria
![Filtro por Categoria](prints/filtro.png)

### Cadastro de Novo Jogo
![Novo Jogo](prints/novo-jogo.png)

### Editar Jogo
![Editar Jogo](prints/editar-jogo.png)

### Categorias
![Categorias](prints/categorias.png)

### Nova Categoria
![Nova Categoria](prints/nova-categoria.png)

### Banco de Dados no Supabase
![Banco de Dados](prints/supabase-tabelas.png)

### Schema do Banco
![Schema](prints/supabase-schema.png)

---

##  Requisitos Atendidos

- [x] API REST com Node.js + Express
- [x] Integração com Supabase
- [x] CRUD completo (Listar, Cadastrar, Editar, Excluir)
- [x] Mínimo de 2 tabelas (`categorias` + `jogos`)
- [x] Uso de `fetch()`, `async/await` e JSON
- [x] Pesquisa/filtro por título e categoria *(bônus)*
- [x] Responsividade *(bônus)*

---

## Autor

Carlos Arthur Moraes Gonçalves — @carlosarthurmg
Data: 17/05/2026