const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Inicializa o app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importa a conexão com o banco
const db = require('./src/config/db');

// Importa as rotas
const produtoRoutes = require('./src/routes/produtoRoutes');

// Rota de teste
app.get('/', (req, res) => {
    res.json({ mensagem: 'API do E-commerce de Instrumentos Musicais rodando perfeitamente!' });
});

// Configura o uso das rotas de produtos
app.use('/api/produtos', produtoRoutes);

// Define a porta e inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});