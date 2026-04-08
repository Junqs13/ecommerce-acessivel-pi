const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.post('/', pedidoController.criar); // Cliente faz o pedido
router.get('/', pedidoController.listarTodos); // Admin vê os pedidos
router.put('/:id/status', pedidoController.atualizarStatus); // Admin atualiza o pedido

module.exports = router;