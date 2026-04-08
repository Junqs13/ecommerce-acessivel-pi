const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Inicializa o app
const app = express();

// --- CONFIGURAÇÃO DE SEGURANÇA E CAPACIDADE ---

// 1. Middlewares de Limite (Essencial para Imagens em Base64)
// Aumentamos para 50mb para que o banco aceite as fotos enviadas pelo Dashboard
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 2. Middleware de CORS (Garante que o Frontend acesse o Backend sem erros)
app.use(cors({
    origin: '*', // Em produção, você pode trocar '*' pela sua URL da Vercel
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- CONEXÃO E ROTAS ---

// Importa a conexão com o banco
const db = require('./src/config/db');

// Importa as rotas
const produtoRoutes = require('./src/routes/produtoRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes'); 
const pedidoRoutes = require('./src/routes/pedidoRoutes');

// Configura o uso das rotas
app.use('/api/produtos', produtoRoutes);
app.use('/api/usuarios', usuarioRoutes); 
app.use('/api/pedidos', pedidoRoutes);

// Rota de teste para verificar se o servidor de Ohio está respondendo
app.get('/', (req, res) => {
    res.json({ mensagem: 'API de Ohio rodando perfeitamente e preparada para grandes volumes de dados!' });
});

// Define a porta e inicia o servidor
const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app;