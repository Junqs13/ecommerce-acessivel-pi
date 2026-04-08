const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// Rotas públicas
router.get('/', produtoController.listarTodos);
router.get('/estatisticas', produtoController.estatisticas);
router.get('/:id', produtoController.buscarPorId);

// Rotas de Administração
router.post('/', produtoController.criar);
router.put('/:id', produtoController.atualizar); // <--- NOVA ROTA DE EDIÇÃO
router.delete('/:id', produtoController.deletar);

module.exports = router;