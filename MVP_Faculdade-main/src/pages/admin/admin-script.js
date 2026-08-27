const API = '/api';

// Verifica se está logado
const token = localStorage.getItem('token');
if (!token) {
  alert('Acesso negado! Faça login primeiro.');
  window.location.href = '../login/index.html';
}

let eventoEditandoId = null;

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('add-event-btn');
  const cancelBtn = document.getElementById('cancel-add-event-btn');
  const cancelFormBtn = document.getElementById('cancel-form-btn');
  const overlay = document.getElementById('modal-overlay');
  const form = document.getElementById('event-form');

  // Logout
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminEmail');
    window.location.href = '../login/index.html';
  });

  // Carrega eventos
  carregarEventos();

  // Abre o modal pra cadastrar
  addBtn.addEventListener('click', () => {
    eventoEditandoId = null;
    document.getElementById('event-form-container').querySelector('h4').textContent = 'Cadastrar Evento';
    document.querySelector('.btn-salvar').textContent = 'Salvar Evento';
    form.reset();
    overlay.classList.add('ativo');
  });

  // Fecha o modal
  function fecharModal() {
    overlay.classList.remove('ativo');
    form.reset();
    eventoEditandoId = null;
  }

  cancelBtn.addEventListener('click', fecharModal);
  cancelFormBtn.addEventListener('click', fecharModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) fecharModal();
  });

  // Submete o formulário (cadastrar ou editar)
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('event-title').value.trim();
    const data = document.getElementById('event-date').value.trim();
    const horario = document.getElementById('event-horario').value.trim();
    const local = document.getElementById('event-local').value.trim();
    const descricao = document.getElementById('event-theme').value.trim();
    const imagem_url = document.getElementById('event-imagem').value.trim();

    if (!nome || !data || !local) {
      alert('Preencha pelo menos nome, data e local.');
      return;
    }

    const method = eventoEditandoId ? 'PUT' : 'POST';
    const url = eventoEditandoId ? `${API}/eventos/${eventoEditandoId}` : `${API}/eventos`;

    try {
      const resposta = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nome, data, horario, local, descricao, imagem_url })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.erro || 'Erro ao salvar evento.');
        return;
      }

      alert(eventoEditandoId ? 'Evento atualizado com sucesso!' : 'Evento cadastrado com sucesso!');
      fecharModal();
      carregarEventos();

    } catch (erro) {
      alert('Erro ao conectar com o servidor.');
      console.error(erro);
    }
  });
});

async function carregarEventos() {
  const container = document.querySelector('.container-cards-eventos');
  container.innerHTML = '<p>Carregando eventos...</p>';

  try {
    const resposta = await fetch(`${API}/eventos`);
    const eventos = await resposta.json();

    if (eventos.length === 0) {
      container.innerHTML = '<p>Nenhum evento cadastrado ainda.</p>';
      return;
    }

    container.innerHTML = eventos.map(evento => `
      <div class="card-evento" data-id="${evento.id}">
        ${evento.imagem_url ? `<img src="${evento.imagem_url}" alt="${evento.nome}" onerror="this.style.display='none'">` : ''}
        <h3>${evento.nome}</h3>
        ${evento.data ? `<p><strong>Data:</strong> ${formatarData(evento.data)}</p>` : ''}
        ${evento.horario ? `<p><strong>Horário:</strong> ${evento.horario}</p>` : ''}
        ${evento.local ? `<p><strong>Local:</strong> ${evento.local}</p>` : ''}
        ${evento.descricao ? `<p><strong>Descrição:</strong> ${evento.descricao}</p>` : ''}
        <div class="card-actions">
          <button class="edit-btn" onclick="abrirEdicao(${evento.id}, '${evento.nome.replace(/'/g, "\\'")}', '${evento.data}', '${evento.horario || ''}', '${evento.local.replace(/'/g, "\\'")}', '${(evento.descricao || '').replace(/'/g, "\\'")}', '${evento.imagem_url || ''}')">Editar</button>
          <button class="delete-btn" onclick="excluirEvento(${evento.id})">Excluir</button>
        </div>
      </div>
    `).join('');

  } catch (erro) {
    container.innerHTML = '<p>Erro ao carregar eventos.</p>';
    console.error(erro);
  }
}

function abrirEdicao(id, nome, data, horario, local, descricao, imagem_url) {
  eventoEditandoId = id;

  document.getElementById('event-form-container').querySelector('h4').textContent = 'Editar Evento';
  document.querySelector('.btn-salvar').textContent = 'Atualizar Evento';

  document.getElementById('event-title').value = nome;
  document.getElementById('event-date').value = data;
  document.getElementById('event-horario').value = horario;
  document.getElementById('event-local').value = local;
  document.getElementById('event-theme').value = descricao;
  document.getElementById('event-imagem').value = imagem_url;

  document.getElementById('modal-overlay').classList.add('ativo');
}

async function excluirEvento(id) {
  if (!confirm('Deseja realmente excluir este evento?')) return;

  try {
    const resposta = await fetch(`${API}/eventos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro || 'Erro ao excluir evento.');
      return;
    }

    carregarEventos();

  } catch (erro) {
    alert('Erro ao conectar com o servidor.');
    console.error(erro);
  }
}

function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}