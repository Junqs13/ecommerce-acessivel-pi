const db = require('../config/db');

const pedidoController = {
    // Registra uma nova venda vinda do Carrinho (Checkout)
    criar: async (req, res) => {
        const { usuario_id, nome_cliente, total, metodo_pagamento } = req.body;
        
        try {
            // Define o status inicial: Se for cartão, simulamos que já foi aprovado ('Pago')
            // Se for PIX, entra como 'Aguardando Pagamento'
            const statusInicial = metodo_pagamento === 'cartao' ? 'Pago' : 'Aguardando Pagamento';

            const query = 'INSERT INTO pedidos (usuario_id, nome_cliente, total, metodo_pagamento, status) VALUES (?, ?, ?, ?, ?)';
            
            await db.query(query, [usuario_id, nome_cliente, total, metodo_pagamento, statusInicial]);
            
            res.status(201).json({ mensagem: 'Pedido registrado com sucesso no sistema!' });
        } catch (erro) {
            console.error('Erro ao registrar pedido:', erro);
            res.status(500).json({ erro: 'Erro interno ao processar a venda no banco de dados.' });
        }
    },

    // Lista todos os pedidos para o Painel Administrativo
    listarTodos: async (req, res) => {
        try {
            // Busca os pedidos do mais recente para o mais antigo
            const [linhas] = await db.query('SELECT * FROM pedidos ORDER BY data_pedido DESC');
            res.json(linhas);
        } catch (erro) {
            console.error('Erro ao buscar pedidos:', erro);
            res.status(500).json({ erro: 'Erro ao buscar a lista de vendas para o Dashboard.' });
        }
    },

    // Permite ao Administrador atualizar o status (Ex: de 'Pago' para 'Enviado')
    atualizarStatus: async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        
        try {
            const query = 'UPDATE pedidos SET status = ? WHERE id = ?';
            await db.query(query, [status, id]);
            
            res.json({ mensagem: 'Status do pedido atualizado com sucesso!' });
        } catch (erro) {
            console.error('Erro ao atualizar status do pedido:', erro);
            res.status(500).json({ erro: 'Erro interno ao tentar atualizar o status da venda.' });
        }
    }
};

module.exports = pedidoController;