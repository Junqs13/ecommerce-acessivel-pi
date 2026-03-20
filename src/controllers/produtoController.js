const db = require('../config/db');

const produtoController = {
    // Lista todos os produtos
    listarTodos: async (req, res) => {
        try {
            const [linhas] = await db.query('SELECT * FROM produtos');
            res.json(linhas);
        } catch (erro) {
            console.error('Erro ao buscar produtos:', erro);
            res.status(500).json({ erro: 'Erro interno ao buscar os instrumentos musicais.' });
        }
    },

    // NOVO: Busca estatísticas agrupadas para o Dashboard Analítico
    estatisticas: async (req, res) => {
        try {
            // Conta quantos produtos existem em cada categoria e soma o estoque
            const [linhas] = await db.query(`
                SELECT categoria, 
                       COUNT(*) as quantidade_modelos, 
                       SUM(estoque) as total_pecas_estoque 
                FROM produtos 
                GROUP BY categoria
            `);
            res.json(linhas);
        } catch (erro) {
            console.error('Erro ao buscar estatísticas:', erro);
            res.status(500).json({ erro: 'Erro interno ao gerar análises.' });
        }
    },

    // Busca um produto específico
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