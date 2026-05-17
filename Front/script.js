// ── Configuração ──────────────────────────────────────────────
const API = '';  // string vazia = mesmo domínio (Express serve o front)

// ── Utilitários ───────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = 'toast hidden'; }, 3000);
}

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

// Fechar modal pelo botão ✕ e "Cancelar"
document.querySelectorAll('.close-modal, .btn-secondary[data-modal]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.modal));
});
// Fechar clicando fora
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(modal.id); });
});

// ── Navegação entre abas ──────────────────────────────────────
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// ══════════════════════════════════════════════════════════════
// CATEGORIAS
// ══════════════════════════════════════════════════════════════

async function fetchCategorias() {
  const res = await fetch(`${API}/api/categorias`);
  return await res.json();
}

async function renderCategorias() {
  const list = document.getElementById('categorias-list');
  list.innerHTML = '<div class="loading">Carregando...</div>';
  try {
    const res = await fetch(`${API}/api/categorias`);
    const cats = await res.json();
    if (!cats.length) { 
      list.innerHTML = '<div class="empty">Nenhuma categoria cadastrada.</div>'; 
      return; 
    }
    list.innerHTML = cats.map(c => `
      <div class="cat-item">
        <span class="cat-name">${c.nome}</span>
        <div class="cat-actions">
          <button class="btn-icon" onclick="editarCategoria(${c.id}, '${c.nome.replace(/'/g, "\\'")}')">✏️ Editar</button>
          <button class="btn-icon" onclick="deletarCategoria(${c.id})">🗑️ Excluir</button>
        </div>
      </div>
    `).join('');
  } catch(e) {
    console.error(e);
    list.innerHTML = '<div class="empty">Erro ao carregar categorias.</div>';
  }
}

async function popularSelectCategorias() {
  const cats = await fetchCategorias();
  // filtro de jogos
  const filtro = document.getElementById('filter-categoria');
  filtro.innerHTML = '<option value="">Todas as categorias</option>' +
    cats.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
  // select do modal de jogo
  const sel = document.getElementById('jogo-categoria');
  sel.innerHTML = '<option value="">— sem categoria —</option>' +
    cats.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
}

// Novo / Editar categoria
document.getElementById('btn-nova-categoria').addEventListener('click', () => {
  document.getElementById('cat-id').value = '';
  document.getElementById('cat-nome').value = '';
  document.getElementById('modal-cat-title').textContent = 'Nova Categoria';
  openModal('modal-categoria');
});

function editarCategoria(id, nome) {
  document.getElementById('cat-id').value = id;
  document.getElementById('cat-nome').value = nome;
  document.getElementById('modal-cat-title').textContent = 'Editar Categoria';
  openModal('modal-categoria');
}

document.getElementById('btn-salvar-categoria').addEventListener('click', async () => {
  const id   = document.getElementById('cat-id').value;
  const nome = document.getElementById('cat-nome').value.trim();
  if (!nome) { showToast('Informe o nome da categoria.', 'error'); return; }

  try {
    const url    = id ? `${API}/api/categorias/${id}` : `${API}/api/categorias`;
    const method = id ? 'PUT' : 'POST';
    const res    = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    closeModal('modal-categoria');
    showToast(id ? 'Categoria atualizada!' : 'Categoria criada!');
    await renderCategorias();
    await popularSelectCategorias();
  } catch (e) {
    showToast(e.message || 'Erro ao salvar categoria.', 'error');
  }
});

async function deletarCategoria(id) {
  if (!confirm('Remover esta categoria?')) return;
  try {
    const res = await fetch(`${API}/api/categorias/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    showToast('Categoria removida.');
    await renderCategorias();
    await popularSelectCategorias();
    await renderJogos();
  } catch {
    showToast('Erro ao remover categoria.', 'error');
  }
}

// ══════════════════════════════════════════════════════════════
// JOGOS
// ══════════════════════════════════════════════════════════════

async function renderJogos() {
  const grid = document.getElementById('jogos-grid');
  grid.innerHTML = '<div class="loading">Carregando jogos...</div>';

  const search   = document.getElementById('search-jogo').value.trim();
  const catId    = document.getElementById('filter-categoria').value;
  let url        = `${API}/api/jogos?`;
  if (search) url += `search=${encodeURIComponent(search)}&`;
  if (catId)  url += `categoria_id=${catId}`;

  try {
    const res   = await fetch(url);
    const jogos = await res.json();
    if (!jogos.length) {
      grid.innerHTML = '<div class="empty">Nenhum jogo encontrado.</div>';
      return;
    }
    grid.innerHTML = jogos.map(j => {
      const nota    = j.nota != null ? `<span class="card-nota">★ ${Number(j.nota).toFixed(1)}</span>` : '';
      const cat     = j.categorias ? `<span class="badge badge--cat">${j.categorias.nome}</span>` : '';
      const plat    = j.plataforma ? `<span class="badge">${j.plataforma}</span>` : '';
      const ano     = j.ano_lancamento ? `<span class="badge">${j.ano_lancamento}</span>` : '';
      const desc    = j.descricao ? `<p class="card-desc">${j.descricao}</p>` : '';
      return `
        <div class="game-card">
          <div class="card-top">
            <h3 class="card-title">${j.titulo}</h3>
            ${nota}
          </div>
          <div class="card-meta">${cat}${plat}${ano}</div>
          ${desc}
          <div class="card-actions">
            <button class="btn-icon" onclick="editarJogo(${j.id})">✏️ Editar</button>
            <button class="btn-icon" onclick="deletarJogo(${j.id})">🗑️ Excluir</button>
          </div>
        </div>
      `;
    }).join('');
  } catch {
    grid.innerHTML = '<div class="empty">Erro ao carregar jogos.</div>';
  }
}

// Filtros com debounce
let searchTimer;
document.getElementById('search-jogo').addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(renderJogos, 350);
});
document.getElementById('filter-categoria').addEventListener('change', renderJogos);

// Novo jogo
document.getElementById('btn-novo-jogo').addEventListener('click', async () => {
  await popularSelectCategorias();
  document.getElementById('jogo-id').value        = '';
  document.getElementById('jogo-titulo').value     = '';
  document.getElementById('jogo-descricao').value  = '';
  document.getElementById('jogo-ano').value        = '';
  document.getElementById('jogo-plataforma').value = '';
  document.getElementById('jogo-nota').value       = '';
  document.getElementById('jogo-categoria').value  = '';
  document.getElementById('modal-jogo-title').textContent = 'Novo Jogo';
  openModal('modal-jogo');
});

// Editar jogo
async function editarJogo(id) {
  await popularSelectCategorias();
  try {
    const res  = await fetch(`${API}/api/jogos/${id}`);
    const jogo = await res.json();
    document.getElementById('jogo-id').value        = jogo.id;
    document.getElementById('jogo-titulo').value     = jogo.titulo || '';
    document.getElementById('jogo-descricao').value  = jogo.descricao || '';
    document.getElementById('jogo-ano').value        = jogo.ano_lancamento || '';
    document.getElementById('jogo-plataforma').value = jogo.plataforma || '';
    document.getElementById('jogo-nota').value       = jogo.nota != null ? jogo.nota : '';
    document.getElementById('jogo-categoria').value  = jogo.categoria_id || '';
    document.getElementById('modal-jogo-title').textContent = 'Editar Jogo';
    openModal('modal-jogo');
  } catch {
    showToast('Erro ao carregar jogo.', 'error');
  }
}

// Salvar jogo (criar ou atualizar)
document.getElementById('btn-salvar-jogo').addEventListener('click', async () => {
  const id         = document.getElementById('jogo-id').value;
  const titulo     = document.getElementById('jogo-titulo').value.trim();
  const descricao  = document.getElementById('jogo-descricao').value.trim();
  const ano        = document.getElementById('jogo-ano').value;
  const plataforma = document.getElementById('jogo-plataforma').value.trim();
  const nota       = document.getElementById('jogo-nota').value;
  const catId      = document.getElementById('jogo-categoria').value;

  if (!titulo) { showToast('Título é obrigatório.', 'error'); return; }

  const body = {
    titulo,
    descricao:       descricao  || null,
    ano_lancamento:  ano        ? parseInt(ano)     : null,
    plataforma:      plataforma || null,
    nota:            nota       ? parseFloat(nota)  : null,
    categoria_id:    catId      ? parseInt(catId)   : null,
  };

  try {
    const url    = id ? `${API}/api/jogos/${id}` : `${API}/api/jogos`;
    const method = id ? 'PUT' : 'POST';
    const res    = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    closeModal('modal-jogo');
    showToast(id ? 'Jogo atualizado!' : 'Jogo cadastrado!');
    await renderJogos();
  } catch (e) {
    showToast(e.message || 'Erro ao salvar jogo.', 'error');
  }
});

// Deletar jogo
async function deletarJogo(id) {
  if (!confirm('Remover este jogo do catálogo?')) return;
  try {
    const res = await fetch(`${API}/api/jogos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    showToast('Jogo removido.');
    await renderJogos();
  } catch {
    showToast('Erro ao remover jogo.', 'error');
  }
}

// ══════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════
(async () => {
  await popularSelectCategorias();
  await renderJogos();
  await renderCategorias();
})();