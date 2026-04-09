const express = require('express');
const router = express.Router();
const artigoController = require('../controllers/artigoController');

// Rotas públicas (Qualquer pessoa pode ler o blog)
router.get('/', artigoController.listarTodos);
router.get('/:slug', artigoController.buscarPorSlug);

// Rotas de Administração (Para você publicar/apagar no Painel Admin)
router.post('/', artigoController.criar);
router.delete('/:id', artigoController.deletar);

module.exports = router;