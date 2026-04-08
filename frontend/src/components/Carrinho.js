import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Importando o Toastify

const Carrinho = ({ carrinho, setCarrinho }) => {
  const [cep, setCep] = useState('');
  const [frete, setFrete] = useState(null);
  const navigate = useNavigate();

  const totalProdutos = carrinho.reduce((total, item) => total + parseFloat(item.preco), 0);
  const totalGeral = totalProdutos + (frete || 0);

  const removerItem = (indexParaRemover) => {
    setCarrinho(carrinho.filter((_, index) => index !== indexParaRemover));
  };

  const simularFrete = () => {
    if (cep.length >= 8) setFrete(50.00);
  };

  const finalizarCompra = () => {
    if (carrinho.length === 0) {
      toast.error('O seu carrinho está vazio!'); // Alerta vermelho
      return;
    }
    
    const dadosUtilizador = localStorage.getItem('usuario_pi');
    
    if (!dadosUtilizador) {
      toast.warning('Para finalizar a encomenda, precisamos que se identifique.'); // Alerta amarelo
      navigate('/login-cliente');
      return;
    }

    const utilizador = JSON.parse(dadosUtilizador);
    toast.success(`🎉 Parabéns, ${utilizador.nome}! A sua encomenda foi registada com sucesso.`); // Alerta verde
    setCarrinho([]); 
    navigate('/'); 
  };

  return (
    <main className="container" aria-labelledby="titulo-checkout" style={{ marginTop: '30px' }}>
      <h1 id="titulo-checkout" style={{ color: 'var(--primary)', borderBottom: '2px solid var(--border)', paddingBottom: '10px' }}>
        🛒 Finalizar Compra
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
                    <button onClick={() => removerItem(index)} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }} aria-label={`Remover ${item.nome}`}>
                      X
                    </button>
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
                <input id="cep" type="text" placeholder="00000-000" value={cep} onChange={(e) => setCep(e.target.value)} style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid var(--border)' }} />
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

            <button onClick={finalizarCompra} className="btn btn-comprar" style={{ fontSize: '1.2rem', padding: '15px' }}>
              Finalizar Compra
            </button>
          </section>
        </div>
      )}
    </main>
  );
};

export default Carrinho;