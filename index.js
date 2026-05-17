const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('front'));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ─── CATEGORIAS ───────────────────────────────────────────────

// Listar todas as categorias
app.get('/api/categorias', async (req, res) => {
  const { data, error } = await supabase.from('categorias').select('*').order('nome');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Criar categoria
app.post('/api/categorias', async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
  const { data, error } = await supabase.from('categorias').insert([{ nome }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Atualizar categoria
app.put('/api/categorias/:id', async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  const { data, error } = await supabase.from('categorias').update({ nome }).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// Deletar categoria
app.delete('/api/categorias/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('categorias').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Categoria removida' });
});

// ─── JOGOS ────────────────────────────────────────────────────

// Listar todos os jogos (com nome da categoria)
app.get('/api/jogos', async (req, res) => {
  const { search, categoria_id } = req.query;
  let query = supabase
    .from('jogos')
    .select('*, categorias(nome)')
    .order('titulo');

  if (search) query = query.ilike('titulo', `%${search}%`);
  if (categoria_id) query = query.eq('categoria_id', categoria_id);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Buscar jogo por ID
app.get('/api/jogos/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('jogos')
    .select('*, categorias(nome)')
    .eq('id', id)
    .single();
  if (error) return res.status(404).json({ error: 'Jogo não encontrado' });
  res.json(data);
});

// Criar jogo
app.post('/api/jogos', async (req, res) => {
  const { titulo, descricao, ano_lancamento, plataforma, nota, categoria_id } = req.body;
  if (!titulo) return res.status(400).json({ error: 'Título é obrigatório' });
  const { data, error } = await supabase
    .from('jogos')
    .insert([{ titulo, descricao, ano_lancamento, plataforma, nota, categoria_id }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Atualizar jogo
app.put('/api/jogos/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, ano_lancamento, plataforma, nota, categoria_id } = req.body;
  const { data, error } = await supabase
    .from('jogos')
    .update({ titulo, descricao, ano_lancamento, plataforma, nota, categoria_id })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// Deletar jogo
app.delete('/api/jogos/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('jogos').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Jogo removido' });
});

// ─── START ────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🎮 Servidor rodando em http://localhost:${PORT}`));
