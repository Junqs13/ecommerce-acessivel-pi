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

    // NOVO: Busca estatísticas avançadas para o Dashboard Analítico
    estatisticas: async (req, res) => {
        try {
            // 1. Agrupamento por Categoria (para os gráficos)
            const [porCategoria] = await db.query(`
                SELECT categoria, 
                       COUNT(*) as quantidade_modelos, 
                       SUM(estoque) as total_pecas_estoque,
                       SUM(preco * estoque) as valor_total_estoque
                FROM produtos 
                GROUP BY categoria
            `);

            // 2. Totais Gerais (para os cartões de resumo)
            const [geral] = await db.query(`
                SELECT COUNT(*) as total_produtos, 
                       SUM(estoque) as total_itens,
                       SUM(preco * estoque) as patrimonio_total
                FROM produtos
            `);

            // Retorna um objeto complexo com as duas informações
            res.json({
                porCategoria,
                geral: geral[0]
            });
        } catch (erro) {
            console.error('Erro ao buscar estatísticas:', erro);
            res.status(500).json({ erro: 'Erro interno ao gerar análises.' });
        }
    },
// Método para Adicionar um Novo Produto
    criar: async (req, res) => {
        const { nome, descricao, preco, categoria, imagem_url, quantidade } = req.body;
        try {
            // Insere o novo produto no banco de dados (Aiven)
            const query = 'INSERT INTO produtos (nome, descricao, preco, categoria, imagem_url, quantidade) VALUES (?, ?, ?, ?, ?, ?)';
            await db.query(query, [nome, descricao, preco, categoria, imagem_url, quantidade]);
            
            res.status(201).json({ mensagem: 'Produto adicionado com sucesso ao catálogo!' });
        } catch (erro) {
            console.error('Erro ao criar produto:', erro);
            res.status(500).json({ erro: 'Erro interno ao adicionar produto no banco de dados.' });
        }
    },

    // Método para Apagar um Produto
    deletar: async (req, res) => {
        const { id } = req.params;
        try {
            // Remove o produto do banco de dados (Aiven)
            await db.query('DELETE FROM produtos WHERE id = ?', [id]);
            res.json({ mensagem: 'Produto removido com sucesso do sistema!' });
        } catch (erro) {
            console.error('Erro ao apagar produto:', erro);
            res.status(500).json({ erro: 'Erro interno ao tentar remover o produto.' });
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