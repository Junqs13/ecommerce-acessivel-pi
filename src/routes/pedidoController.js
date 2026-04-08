const db = require('../config/db');

const pedidoController = {
    // Registra uma nova venda vinda do Carrinho
    criar: async (req, res) => {
        const { usuario_id, nome_cliente, total, metodo_pagamento } = req.body;
        try {
            const query = 'INSERT INTO pedidos (usuario_id, nome_cliente, total, metodo_pagamento, status) VALUES (?, ?, ?, ?, ?)';
            // Por padrão, toda compra nova entra como 'Aguardando Pagamento' (ou 'Pago' se for cartão aprovado na hora)
            const statusInicial = metodo_pagamento === 'cartao' ? 'Pago' : 'Aguardando Pagamento';
            
            await db.query(query, [usuario_id, nome_cliente, total, metodo_pagamento, statusInicial]);
            res.status(201).json({ mensagem: 'Pedido registrado com sucesso!' });
        } catch (erro) {
            console.error('Erro ao registrar pedido:', erro);
            res.status(500).json({ erro: 'Erro interno ao processar a venda.' });
        }
    },

    // Lista todos os pedidos para o Painel Admin
    listarTodos: async (req, res) => {
        try {
            const [linhas] = await db.query('SELECT * FROM pedidos ORDER BY data_pedido DESC');
            res.json(linhas);
        } catch (erro) {
            console.error('Erro ao buscar pedidos:', erro);
            res.status(500).json({ erro: 'Erro ao buscar a lista de vendas.' });
        }
    },

    // O Admin pode mudar o status (ex: "Enviado", "Entregue", "Cancelado")
    atualizarStatus: async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        try {
            await db.query('UPDATE pedidos SET status = ? WHERE id = ?', [status, id]);
            res.json({ mensagem: 'Status do pedido atualizado!' });
        } catch (erro) {
            console.error('Erro ao atualizar pedido:', erro);
            res.status(500).json({ erro: 'Erro interno ao atualizar o status.' });
        }
    }
};

module.exports = pedidoController;