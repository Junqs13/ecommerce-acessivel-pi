import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 

const Carrinho = ({ carrinho, setCarrinho }) => {
  const [cep, setCep] = useState('');
  const [frete, setFrete] = useState(null);
  
  // NOVO: Estado para guardar o endereço de entrega
  const [endereco, setEndereco] = useState({ rua: '', numero: '', bairro: '', cep_entrega: '' });
  
  // Controle das etapas e do pagamento
  const [etapa, setEtapa] = useState('carrinho'); // pode ser 'carrinho' ou 'pagamento'
  const [metodoPagamento, setMetodoPagamento] = useState('pix'); // 'pix' ou 'cartao'
  
  const navigate = useNavigate();

  const totalProdutos = carrinho.reduce((total, item) => total + parseFloat(item.preco), 0);
  const totalGeral = totalProdutos + (frete || 0);

  const removerItem = (indexParaRemover) => {
    setCarrinho(carrinho.filter((_, index) => index !== indexParaRemover));
  };

  const simularFrete = () => {
    if (cep.length >= 8) {
        setFrete(50.00);
        setEndereco({ ...endereco, cep_entrega: cep }); // Já preenche o CEP no endereço
    }
  };

  // Passo 1: Valida se pode ir para a tela de pagamento
  const irParaPagamento = () => {
    if (carrinho.length === 0) {
      toast.error('O seu carrinho está vazio!'); 
      return;
    }
    
    const dadosUtilizador = localStorage.getItem('usuario_pi');
    
    if (!dadosUtilizador) {
      toast.warning('Para finalizar a encomenda, precisamos que se identifique.'); 
      navigate('/login-cliente');
      return;
    }

    // Se estiver tudo ok, muda a tela para o checkout
    setEtapa('pagamento');
  };

  // Passo 2: O clique final depois de preencher o cartão ou escanear o PIX
  const processarPagamentoFinal = async (e) => {
    if (e) e.preventDefault(); // Evita recarregar a página se for form de cartão

    // Validação para garantir que o endereço foi preenchido
    if (!endereco.rua || !endereco.numero || !endereco.bairro || !endereco.cep_entrega) {
      toast.warning('Por favor, preencha todos os campos do endereço de entrega.');
      return;
    }

    const dadosUtilizador = localStorage.getItem('usuario_pi');
    const utilizador = JSON.parse(dadosUtilizador);
    
    // Monta o endereço bonitinho em uma linha só
    const enderecoCompleto = `${endereco.rua}, ${endereco.numero} - ${endereco.bairro} (CEP: ${endereco.cep_entrega})`;

    // Prepara o "pacote" de dados para enviar para Ohio
    const dadosPedido = {
      usuario_id: utilizador.id,
      nome_cliente: utilizador.nome,
      total: totalGeral,
      metodo_pagamento: metodoPagamento,
      endereco: enderecoCompleto
    };

    try {
      // Faz a chamada para a sua API no Render salvar no banco Aiven
      const resposta = await fetch('https://api-ecommerce-oficial.onrender.com/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosPedido)
      });

      if (!resposta.ok) {
          throw new Error('Falha ao registrar o pedido no banco de dados.');
      }

      // Sucesso!
      toast.success(`🎉 Pagamento Aprovado! Parabéns, ${utilizador.nome}. A sua encomenda foi registada e o endereço salvo.`); 
      setCarrinho([]); 
      navigate('/'); 

    } catch (erro) {
      toast.error('Erro ao processar a venda. Verifique a conexão com o servidor.');
      console.error(erro);
    }
  };

  // ==========================================================
  // TELA 1: O CARRINHO DE COMPRAS PADRÃO
  // ==========================================================
  if (etapa === 'carrinho') {
    return (
      <main className="container" aria-labelledby="titulo-checkout" style={{ marginTop: '30px' }}>
        <h1 id="titulo-checkout" style={{ color: 'var(--primary)', borderBottom: '2px solid var(--border)', paddingBottom: '10px' }}>
          🛒 Seu Carrinho
        </h1>

        {carrinho.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <h2>Seu carrinho está vazio.</h2>
            <Link to="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '20px', width: 'auto' }}>
              Voltar para a Loja
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginTop: '20px' }}>
            <section style={{ flex: '2', minWidth: '300px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <h2 style={{ marginTop: 0 }}>Seus Itens</h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {carrinho.map((item, index) => (
                  <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <strong>{item.nome}</strong>
                      <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.categoria}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>R$ {parseFloat(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      <button onClick={() => removerItem(index)} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }} aria-label={`Remover ${item.nome}`}>X</button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section style={{ flex: '1', minWidth: '280px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', height: 'fit-content' }}>
              <h2 style={{ marginTop: 0 }}>Resumo do Pedido</h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="cep" style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Calcular Frete (CEP):</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input id="cep" type="text" placeholder="00000-000" value={cep} onChange={(e) => setCep(e.target.value)} style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-main)' }} />
                  <button onClick={simularFrete} className="btn btn-primary" style={{ width: 'auto', padding: '8px 15px' }}>OK</button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Subtotal:</span>
                <strong>R$ {totalProdutos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: 'var(--text-muted)' }}>
                <span>Frete:</span>
                <strong>{frete !== null ? `R$ ${frete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'A calcular'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', color: 'var(--primary)', borderTop: '2px solid var(--border)', paddingTop: '15px', marginBottom: '20px' }}>
                <strong>Total:</strong>
                <strong>R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              </div>

              <button onClick={irParaPagamento} className="btn btn-comprar" style={{ fontSize: '1.2rem', padding: '15px' }}>
                Ir para Pagamento ➔
              </button>
            </section>
          </div>
        )}
      </main>
    );
  }

  // ==========================================================
  // TELA 2: O CHECKOUT (PAGAMENTO E ENDEREÇO)
  // ==========================================================
  return (
    <main className="container" aria-labelledby="titulo-pagamento" style={{ marginTop: '30px', maxWidth: '800px' }}>
      <button onClick={() => setEtapa('carrinho')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}>
        ⬅ Voltar ao Carrinho
      </button>

      <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        
        <h1 id="titulo-pagamento" style={{ marginTop: 0, color: 'var(--primary)', borderBottom: '2px solid var(--border)', paddingBottom: '10px' }}>
          Finalizar Compra
        </h1>

        {/* =============== NOVO: FORMULÁRIO DE ENDEREÇO =============== */}
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.02)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📍 Endereço de Entrega
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Rua / Avenida" required value={endereco.rua} onChange={(e) => setEndereco({...endereco, rua: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-main)' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="Número" required value={endereco.numero} onChange={(e) => setEndereco({...endereco, numero: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid var(--border)', width: '30%', background: 'transparent', color: 'var(--text-main)' }} />
              <input type="text" placeholder="Bairro" required value={endereco.bairro} onChange={(e) => setEndereco({...endereco, bairro: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid var(--border)', width: '70%', background: 'transparent', color: 'var(--text-main)' }} />
            </div>
            <input type="text" placeholder="CEP" required value={endereco.cep_entrega} onChange={(e) => setEndereco({...endereco, cep_entrega: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-main)' }} />
          </div>
        </div>
        {/* ========================================================== */}

        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>💳 Método de Pagamento</h3>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <button 
            onClick={() => setMetodoPagamento('pix')} 
            style={{ flex: 1, padding: '15px', borderRadius: '8px', border: `2px solid ${metodoPagamento === 'pix' ? 'var(--accent)' : 'var(--border)'}`, backgroundColor: metodoPagamento === 'pix' ? 'rgba(225, 177, 44, 0.1)' : 'transparent', color: 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            Pagar com PIX
          </button>
          <button 
            onClick={() => setMetodoPagamento('cartao')} 
            style={{ flex: 1, padding: '15px', borderRadius: '8px', border: `2px solid ${metodoPagamento === 'cartao' ? 'var(--accent)' : 'var(--border)'}`, backgroundColor: metodoPagamento === 'cartao' ? 'rgba(225, 177, 44, 0.1)' : 'transparent', color: 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            Cartão de Crédito
          </button>
        </div>

        {/* OPÇÃO PIX */}
        {metodoPagamento === 'pix' && (
          <div style={{ textAlign: 'center', padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Abra o app do seu banco e escaneie o código abaixo:</p>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PagamentoPIXEcommercePI_R$${totalGeral}`} alt="QR Code PIX" style={{ borderRadius: '10px', marginBottom: '15px' }} />
            <p style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--primary)' }}>
              Total: R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <button onClick={processarPagamentoFinal} className="btn btn-comprar" style={{ width: 'auto', padding: '10px 30px', marginTop: '10px' }}>
              Confirmar PIX Realizado
            </button>
          </div>
        )}

        {/* OPÇÃO CARTÃO DE CRÉDITO */}
        {metodoPagamento === 'cartao' && (
          <form onSubmit={processarPagamentoFinal} style={{ display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid var(--border)', padding: '20px', borderRadius: '8px' }}>
            <div>
              <label style={{ fontWeight: 'bold' }}>Número do Cartão:</label>
              <input type="text" placeholder="0000 0000 0000 0000" required maxLength="19" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-main)' }} />
            </div>
            <div>
              <label style={{ fontWeight: 'bold' }}>Nome Impresso no Cartão:</label>
              <input type="text" placeholder="JOÃO DA SILVA" required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid var(--border)', textTransform: 'uppercase', background: 'transparent', color: 'var(--text-main)' }} />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 'bold' }}>Validade:</label>
                <input type="text" placeholder="MM/AA" required maxLength="5" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-main)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 'bold' }}>CVV:</label>
                <input type="text" placeholder="123" required maxLength="4" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-main)' }} />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '2px solid var(--border)' }}>
               <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Total a pagar:</span>
               <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--primary)' }}>R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            <button type="submit" className="btn btn-comprar" style={{ marginTop: '10px', padding: '15px', fontSize: '1.1rem' }}>
              Confirmar Pagamento
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default Carrinho;