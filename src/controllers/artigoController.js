const db = require('../config/db');

const artigoController = {
    listarTodos: async (req, res) => {
        try {
            const [linhas] = await db.query('SELECT * FROM artigos ORDER BY data_publicacao DESC');
            res.json(linhas);
        } catch (erro) { res.status(500).json({ erro: 'Erro interno.' }); }
    },

    buscarPorSlug: async (req, res) => {
        const { slug } = req.params;
        try {
            const [linhas] = await db.query('SELECT * FROM artigos WHERE slug = ?', [slug]);
            if (linhas.length === 0) return res.status(404).json({ mensagem: 'Artigo não encontrado.' });
            res.json(linhas[0]);
        } catch (erro) { res.status(500).json({ erro: 'Erro interno.' }); }
    },

    criar: async (req, res) => {
        const { titulo, resumo, conteudo, imagem_url } = req.body;
        const slug = titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        try {
            const query = 'INSERT INTO artigos (slug, titulo, resumo, conteudo, imagem_url) VALUES (?, ?, ?, ?, ?)';
            await db.query(query, [slug, titulo, resumo, conteudo, imagem_url]);
            res.status(201).json({ mensagem: 'Artigo publicado!' });
        } catch (erro) { res.status(500).json({ erro: 'Erro ao adicionar artigo.' }); }
    },

    // =====================================
    // NOVO: Função para Editar o Artigo
    // =====================================
    atualizar: async (req, res) => {
        const { id } = req.params;
        const { titulo, resumo, conteudo, imagem_url } = req.body;
        const slug = titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        try {
            const query = 'UPDATE artigos SET slug = ?, titulo = ?, resumo = ?, conteudo = ?, imagem_url = ? WHERE id = ?';
            await db.query(query, [slug, titulo, resumo, conteudo, imagem_url, id]);
            res.json({ mensagem: 'Artigo atualizado com sucesso!' });
        } catch (erro) {
            console.error('Erro ao atualizar artigo:', erro);
            res.status(500).json({ erro: 'Erro ao atualizar o artigo.' });
        }
    },

    deletar: async (req, res) => {
        const { id } = req.params;
        try {
            await db.query('DELETE FROM artigos WHERE id = ?', [id]);
            res.json({ mensagem: 'Artigo removido!' });
        } catch (erro) { res.status(500).json({ erro: 'Erro ao remover.' }); }
    }
};

module.exports = artigoController;