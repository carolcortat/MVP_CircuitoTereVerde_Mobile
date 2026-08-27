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

// GET /api/trilhas — público
router.get('/', (req, res) => {
  const trilhas = db.prepare(`
    SELECT t.*, p.nome as parque_nome 
    FROM trilhas t 
    LEFT JOIN parques p ON t.parque_id = p.id
    ORDER BY t.nome ASC
  `).all();
  res.json(trilhas);
});

// GET /api/trilhas/:id — público
router.get('/:id', (req, res) => {
  const trilha = db.prepare(`
    SELECT t.*, p.nome as parque_nome 
    FROM trilhas t 
    LEFT JOIN parques p ON t.parque_id = p.id
    WHERE t.id = ?
  `).get(req.params.id);
  if (!trilha) return res.status(404).json({ erro: 'Trilha não encontrada' });
  res.json(trilha);
});

// POST /api/trilhas — só admin
router.post('/', autenticar, (req, res) => {
  const { parque_id, nome, dificuldade, distancia_km, descricao } = req.body;
  if (!nome || !parque_id) return res.status(400).json({ erro: 'Nome e parque são obrigatórios' });

  const resultado = db.prepare(
    'INSERT INTO trilhas (parque_id, nome, dificuldade, distancia_km, descricao) VALUES (?, ?, ?, ?, ?)'
  ).run(parque_id, nome, dificuldade, distancia_km, descricao);

  res.status(201).json({ id: resultado.lastInsertRowid, parque_id, nome, dificuldade, distancia_km, descricao });
});

// PUT /api/trilhas/:id — só admin
router.put('/:id', autenticar, (req, res) => {
  const { parque_id, nome, dificuldade, distancia_km, descricao } = req.body;
  const { id } = req.params;

  const trilha = db.prepare('SELECT id FROM trilhas WHERE id = ?').get(id);
  if (!trilha) return res.status(404).json({ erro: 'Trilha não encontrada' });

  db.prepare(
    'UPDATE trilhas SET parque_id = ?, nome = ?, dificuldade = ?, distancia_km = ?, descricao = ? WHERE id = ?'
  ).run(parque_id, nome, dificuldade, distancia_km, descricao, id);

  res.json({ mensagem: 'Trilha atualizada com sucesso' });
});

// DELETE /api/trilhas/:id — só admin
router.delete('/:id', autenticar, (req, res) => {
  const { id } = req.params;

  const trilha = db.prepare('SELECT id FROM trilhas WHERE id = ?').get(id);
  if (!trilha) return res.status(404).json({ erro: 'Trilha não encontrada' });

  db.prepare('DELETE FROM trilhas WHERE id = ?').run(id);
  res.json({ mensagem: 'Trilha deletada com sucesso' });
});

module.exports = router;