const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rota para cadastro de clientes e admins (POST /api/usuarios/registrar)
router.post('/registrar', usuarioController.registrar);

// Rota para login (POST /api/usuarios/login)
router.post('/login', usuarioController.login);

module.exports = router;