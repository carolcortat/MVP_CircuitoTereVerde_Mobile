const BASE_URL = 'http://localhost:3000/api';
let token = '';
let eventoId = null;

describe('Autenticação', () => {
  test('Login com credenciais corretas retorna token', async () => {
    const resposta = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@tere.com', senha: 'admin123' })
    });

    const dados = await resposta.json();
    expect(resposta.status).toBe(200);
    expect(dados.token).toBeDefined();
    token = dados.token;
  });

  test('Login com credenciais erradas retorna 401', async () => {
    const resposta = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@tere.com', senha: 'senhaerrada' })
    });

    expect(resposta.status).toBe(401);
  });
});

describe('Eventos', () => {
  test('Listar eventos retorna array', async () => {
    const resposta = await fetch(`${BASE_URL}/eventos`);
    const dados = await resposta.json();
    expect(resposta.status).toBe(200);
    expect(Array.isArray(dados)).toBe(true);
  });

  test('Cadastrar evento com token válido', async () => {
    const resposta = await fetch(`${BASE_URL}/eventos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nome: 'Evento de Teste',
        data: '2026-12-01',
        horario: '10:00',
        local: 'Parque Teste',
        descricao: 'Evento criado pelo teste automatizado'
      })
    });

    const dados = await resposta.json();
    expect(resposta.status).toBe(201);
    expect(dados.id).toBeDefined();
    eventoId = dados.id;
  });

  test('Cadastrar evento sem token retorna 401', async () => {
    const resposta = await fetch(`${BASE_URL}/eventos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: 'Sem token', data: '2026-12-01', local: 'Lugar' })
    });

    expect(resposta.status).toBe(401);
  });

  test('Deletar evento cadastrado no teste', async () => {
    if (!eventoId) return;

    const resposta = await fetch(`${BASE_URL}/eventos/${eventoId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    expect(resposta.status).toBe(200);
  });
});

describe('Parques', () => {
  test('Listar parques retorna array', async () => {
    const resposta = await fetch(`${BASE_URL}/parques`);
    const dados = await resposta.json();
    expect(resposta.status).toBe(200);
    expect(Array.isArray(dados)).toBe(true);
  });
});