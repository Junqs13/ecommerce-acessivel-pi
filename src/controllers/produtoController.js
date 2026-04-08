const db = require('../config/db');

const produtoController = {
    listarTodos: async (req, res) => {
        try {
            const [linhas] = await db.query('SELECT * FROM produtos');
            res.json(linhas);
        } catch (erro) {
            console.error('Erro ao buscar produtos:', erro);
            res.status(500).json({ erro: 'Erro interno ao buscar os instrumentos musicais.' });
        }
    },

   estatisticas: async (req, res) => {
        try {
            const [porCategoria] = await db.query(`
                SELECT categoria, COUNT(*) as quantidade_modelos, SUM(estoque) as total_pecas_estoque, SUM(preco * estoque) as valor_total_estoque
                FROM produtos GROUP BY categoria
            `);
            const [geral] = await db.query(`
                SELECT COUNT(*) as total_produtos, SUM(estoque) as total_itens, SUM(preco * estoque) as patrimonio_total
                FROM produtos
            `);
            res.json({ porCategoria, geral: geral[0] });
        } catch (erro) {
            console.error('Erro ao buscar estatísticas:', erro);
            res.status(500).json({ erro: 'Erro interno ao gerar análises.' });
        }
    },

    criar: async (req, res) => {
        const { nome, descricao, preco, categoria, imagem_url, quantidade } = req.body;
        try {
            const query = 'INSERT INTO produtos (nome, descricao, preco, categoria, imagem_url, quantidade) VALUES (?, ?, ?, ?, ?, ?)';
            await db.query(query, [nome, descricao, preco, categoria, imagem_url, quantidade]);
            res.status(201).json({ mensagem: 'Produto adicionado com sucesso!' });
        } catch (erro) {
            console.error('Erro ao criar produto:', erro);
            res.status(500).json({ erro: 'Erro ao adicionar produto.' });
        }
    },

    // ==========================================
    // NOVO: MÉTODO PARA EDITAR PRODUTO EXISTENTE
    // ==========================================
    atualizar: async (req, res) => {
        const { id } = req.params;
        const { nome, descricao, preco, categoria, imagem_url, quantidade } = req.body;
        try {
            const query = 'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, categoria = ?, imagem_url = ?, quantidade = ? WHERE id = ?';
            await db.query(query, [nome, descricao, preco, categoria, imagem_url, quantidade, id]);
            res.json({ mensagem: 'Produto atualizado com sucesso!' });
        } catch (erro) {
            console.error('Erro ao atualizar produto:', erro);
            res.status(500).json({ erro: 'Erro ao atualizar o produto.' });
        }
    },

    deletar: async (req, res) => {
        const { id } = req.params;
        try {
            await db.query('DELETE FROM produtos WHERE id = ?', [id]);
            res.json({ mensagem: 'Produto removido com sucesso!' });
        } catch (erro) {
            console.error('Erro ao apagar produto:', erro);
            res.status(500).json({ erro: 'Erro interno ao tentar remover o produto.' });
        }
    },

    buscarPorId: async (req, res) => {
        const { id } = req.params;
        try {
            const [linhas] = await db.query('SELECT * FROM produtos WHERE id = ?', [id]);
            if (linhas.length === 0) return res.status(404).json({ mensagem: 'Instrumento não encontrado.' });
            res.json(linhas[0]);
        } catch (erro) {
            console.error('Erro ao buscar produto:', erro);
            res.status(500).json({ erro: 'Erro interno no servidor.' });
        }
    }
};

module.exports = produtoController;