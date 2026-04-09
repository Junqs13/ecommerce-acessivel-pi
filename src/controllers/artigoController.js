const db = require('../config/db');

const artigoController = {
    // Busca todos os artigos para a página inicial do Blog
    listarTodos: async (req, res) => {
        try {
            const [linhas] = await db.query('SELECT * FROM artigos ORDER BY data_publicacao DESC');
            res.json(linhas);
        } catch (erro) {
            console.error('Erro ao buscar artigos:', erro);
            res.status(500).json({ erro: 'Erro interno ao buscar os artigos.' });
        }
    },

    // Busca um artigo específico pelo link (slug)
    buscarPorSlug: async (req, res) => {
        const { slug } = req.params;
        try {
            const [linhas] = await db.query('SELECT * FROM artigos WHERE slug = ?', [slug]);
            if (linhas.length === 0) return res.status(404).json({ mensagem: 'Artigo não encontrado.' });
            res.json(linhas[0]);
        } catch (erro) {
            console.error('Erro ao buscar artigo:', erro);
            res.status(500).json({ erro: 'Erro interno no servidor.' });
        }
    },

    // Salva um novo artigo escrito no Painel Admin
    criar: async (req, res) => {
        const { titulo, resumo, conteudo, imagem_url } = req.body;
        
        // Mágica para criar o link (slug): Transforma "A História!" em "a-historia"
        const slug = titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        try {
            const query = 'INSERT INTO artigos (slug, titulo, resumo, conteudo, imagem_url) VALUES (?, ?, ?, ?, ?)';
            await db.query(query, [slug, titulo, resumo, conteudo, imagem_url]);
            res.status(201).json({ mensagem: 'Artigo publicado com sucesso!' });
        } catch (erro) {
            console.error('Erro ao criar artigo:', erro);
            // Se o slug já existir, o banco de dados (Aiven) vai avisar
            if (erro.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ erro: 'Já existe um artigo com um título muito parecido.' });
            }
            res.status(500).json({ erro: 'Erro ao adicionar artigo.' });
        }
    },

    // Apaga um artigo do banco
    deletar: async (req, res) => {
        const { id } = req.params;
        try {
            await db.query('DELETE FROM artigos WHERE id = ?', [id]);
            res.json({ mensagem: 'Artigo removido com sucesso!' });
        } catch (erro) {
            console.error('Erro ao apagar artigo:', erro);
            res.status(500).json({ erro: 'Erro interno ao tentar remover o artigo.' });
        }
    }
};

module.exports = artigoController;