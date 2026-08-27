const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const JWT_SECRET = 'circuito-tere-verde-secret';

// Cria admin padrão se não existir
const adminExiste = db.prepare('SELECT id FROM admins WHERE email = ?').get('admin@tere.com');
if (!adminExiste) {
  const senhaCriptografada = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO admins (email, senha) VALUES (?, ?)').run('admin@tere.com', senhaCriptografada);
  console.log('Admin padrão criado: admin@tere.com / admin123');
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);

  if (!admin || !bcrypt.compareSync(senha, admin.senha)) {
    return res.status(401).json({ erro: 'Email ou senha inválidos' });
  }

  const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '8h' });

  res.json({ token, email: admin.email });
});

module.exports = router;