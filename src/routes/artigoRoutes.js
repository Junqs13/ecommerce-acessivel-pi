const express = require('express');
const router = express.Router();
const artigoController = require('../controllers/artigoController');

router.get('/', artigoController.listarTodos);
router.get('/:slug', artigoController.buscarPorSlug);
router.post('/', artigoController.criar);
router.put('/:id', artigoController.atualizar); // <-- NOVA ROTA DE EDIÇÃO
router.delete('/:id', artigoController.deletar);

module.exports = router;