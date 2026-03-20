const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// Rota para listar todos os produtos (GET /api/produtos)
router.get('/', produtoController.listarTodos);

// Rota para buscar um produto específico pelo ID (GET /api/produtos/:id)
router.get('/:id', produtoController.buscarPorId);

module.exports = router;