const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// Rota para listar todos os produtos
router.get('/', produtoController.listarTodos);

// NOVO: Rota para as estatísticas do Dashboard
router.get('/estatisticas', produtoController.estatisticas);

// Rota para buscar um produto específico pelo ID
router.get('/:id', produtoController.buscarPorId);

module.exports = router;