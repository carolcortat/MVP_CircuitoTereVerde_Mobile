const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve o frontend estático
app.use(express.static(path.join(__dirname, '../')));

// Rotas da API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/parques', require('./routes/parques'));
app.use('/api/trilhas', require('./routes/trilhas'));
app.use('/api/eventos', require('./routes/eventos'));

// Qualquer rota não encontrada cai no index.html
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});