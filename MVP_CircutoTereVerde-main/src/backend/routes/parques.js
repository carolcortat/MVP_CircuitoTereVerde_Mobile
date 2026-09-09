const express = require('express');
const router = express.Router();
const db = require('../database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'circuito-tere-verde-secret';

// Middleware de autenticação
function autenticar(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ erro: 'Token não fornecido' });

  const token = auth.split(' ')[1];
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido' });
  }
}

// GET /api/parques — público
router.get('/', (req, res) => {
  const parques = db.prepare('SELECT * FROM parques ORDER BY nome ASC').all();
  res.json(parques);
});

// GET /api/parques/:id — público
router.get('/:id', (req, res) => {
  const parque = db.prepare('SELECT * FROM parques WHERE id = ?').get(req.params.id);
  if (!parque) return res.status(404).json({ erro: 'Parque não encontrado' });
  res.json(parque);
});

// POST /api/parques — só admin
router.post('/', autenticar, (req, res) => {
  const { nome, descricao, localizacao, horario_funcionamento } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' });

  const resultado = db.prepare(
    'INSERT INTO parques (nome, descricao, localizacao, horario_funcionamento) VALUES (?, ?, ?, ?)'
  ).run(nome, descricao, localizacao, horario_funcionamento);

  res.status(201).json({ id: resultado.lastInsertRowid, nome, descricao, localizacao, horario_funcionamento });
});

// PUT /api/parques/:id — só admin
router.put('/:id', autenticar, (req, res) => {
  const { nome, descricao, localizacao, horario_funcionamento } = req.body;
  const { id } = req.params;

  const parque = db.prepare('SELECT id FROM parques WHERE id = ?').get(id);
  if (!parque) return res.status(404).json({ erro: 'Parque não encontrado' });

  db.prepare(
    'UPDATE parques SET nome = ?, descricao = ?, localizacao = ?, horario_funcionamento = ? WHERE id = ?'
  ).run(nome, descricao, localizacao, horario_funcionamento, id);

  res.json({ mensagem: 'Parque atualizado com sucesso' });
});

// DELETE /api/parques/:id — só admin
router.delete('/:id', autenticar, (req, res) => {
  const { id } = req.params;

  const parque = db.prepare('SELECT id FROM parques WHERE id = ?').get(id);
  if (!parque) return res.status(404).json({ erro: 'Parque não encontrado' });

  db.prepare('DELETE FROM parques WHERE id = ?').run(id);
  res.json({ mensagem: 'Parque deletado com sucesso' });
});

module.exports = router;