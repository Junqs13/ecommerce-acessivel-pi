const db = require('../config/db');

const produtoController = {
    // Método para listar todos os produtos (vitrine e dashboard)
    listarTodos: async (req, res) => {
        try {
            const [linhas] = await db.query('SELECT * FROM produtos');
            res.json(linhas);
        } catch (erro) {
            console.error('Erro ao buscar produtos:', erro);
            res.status(500).json({ erro: 'Erro interno ao buscar os instrumentos musicais.' });
        }
    },

    // Método para buscar apenas um produto específico (pelo ID)
    buscarPorId: async (req, res) => {
        const { id } = req.params;
        try {
            const [linhas] = await db.query('SELECT * FROM produtos WHERE id = ?', [id]);
            if (linhas.length === 0) {
                return res.status(404).json({ mensagem: 'Instrumento não encontrado.' });
            }
            res.json(linhas[0]);
        } catch (erro) {
            console.error('Erro ao buscar produto:', erro);
            res.status(500).json({ erro: 'Erro interno no servidor.' });
        }
    }
};

module.exports = produtoController;