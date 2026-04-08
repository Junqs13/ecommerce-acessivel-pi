const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// Rotas públicas (Vitrine e Dashboard)
router.get('/', produtoController.listarTodos);
router.get('/estatisticas', produtoController.estatisticas);
router.get('/:id', produtoController.buscarPorId);

// NOVAS ROTAS DE ADMINISTRAÇÃO (Gerir Produtos)
router.post('/', produtoController.criar);
router.delete('/:id', produtoController.deletar);

module.exports = router;