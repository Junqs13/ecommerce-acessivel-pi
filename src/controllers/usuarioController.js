const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usuarioController = {
    // Método para cadastrar um novo usuário
    registrar: async (req, res) => {
        const { nome, email, senha, tipo } = req.body;

        try {
            // 1. Verifica se o email já existe no banco
            const [usuarioExistente] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
            if (usuarioExistente.length > 0) {
                return res.status(400).json({ erro: 'Este email já está cadastrado.' });
            }

            // 2. Criptografa a senha
            const salt = await bcrypt.genSalt(10);
            const senhaCriptografada = await bcrypt.hash(senha, salt);

            // 3. Salva no banco de dados
            const tipoUsuario = tipo || 'cliente'; // Se não vier tipo, o padrão é cliente
            await db.query(
                'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
                [nome, email, senhaCriptografada, tipoUsuario]
            );

            res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
        } catch (erro) {
            console.error('Erro ao registrar usuário:', erro);
            res.status(500).json({ erro: 'Erro interno ao cadastrar.' });
        }
    },

    // Método para fazer Login
    login: async (req, res) => {
        const { email, senha } = req.body;

        try {
            // 1. Busca o usuário pelo email
            const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
            const usuario = usuarios[0];

            if (!usuario) {
                return res.status(401).json({ erro: 'Email ou senha incorretos.' });
            }

            // 2. Compara a senha digitada com a senha criptografada do banco
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ erro: 'Email ou senha incorretos.' });
            }

            // 3. Cria o "crachá digital" (Token JWT)
            // Usamos a chave secreta do arquivo .env (se não existir, usa uma padrão)
            const token = jwt.sign(
                { id: usuario.id, tipo: usuario.tipo },
                process.env.JWT_SECRET || 'chave_super_secreta_pi_univesp',
                { expiresIn: '1h' } // O login dura 1 hora
            );

            // 4. Retorna os dados do usuário e o token
            res.json({
                mensagem: 'Login efetuado com sucesso!',
                token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    tipo: usuario.tipo
                }
            });
        } catch (erro) {
            console.error('Erro no login:', erro);
            res.status(500).json({ erro: 'Erro interno ao realizar login.' });
        }
    }
};

module.exports = usuarioController;