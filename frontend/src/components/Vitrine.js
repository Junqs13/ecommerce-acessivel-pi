import React, { useState, useEffect } from 'react';

const Vitrine = () => {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);
  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/produtos')
      .then((resposta) => {
        if (!resposta.ok) throw new Error('Erro ao buscar os produtos da API');
        return resposta.json();
      })
      .then((dados) => setProdutos(dados))
      .catch((err) => setErro(err.message));
  }, []);

  const adicionarAoCarrinho = (produto) => {
    setCarrinho([...carrinho, produto]);
  };

  const totalCarrinho = carrinho.reduce((total, item) => total + parseFloat(item.preco), 0);

  return (
    <main aria-labelledby="titulo-vitrine" className="container">
      
      {/* Seção do Carrinho */}
      <section aria-labelledby="titulo-carrinho" className="carrinho-section">
        <h2 id="titulo-carrinho" tabIndex="0">🛒 Meu Carrinho ({carrinho.length} itens)</h2>
        
        {carrinho.length > 0 ? (
          <>
            <ul aria-label="Itens no carrinho" className="carrinho-lista">
              {carrinho.map((item, index) => (
                <li key={index}>
                  <span>{item.nome}</span> 
                  <strong>R$ {parseFloat(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </li>
              ))}
            </ul>
            <h3 tabIndex="0" style={{ textAlign: 'right', color: 'var(--accent-color)' }}>
              Total: R$ {totalCarrinho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
            <button className="btn btn-success" aria-label="Finalizar compra dos itens do carrinho">
              Finalizar Compra
            </button>
          </>
        ) : (
          <p tabIndex="0">Seu carrinho ainda está vazio.</p>
        )}
      </section>

      <h1 id="titulo-vitrine" tabIndex="0">Catálogo de Instrumentos Musicais</h1>
      {erro && <div role="alert" style={{ color: 'red', fontWeight: 'bold' }}><p>Erro: {erro}</p></div>}

      {/* Grid da Vitrine */}
      <section aria-label="Lista de Produtos" className="vitrine-grid">
        {produtos.map((produto) => (
          <article key={produto.id} className="produto-card" tabIndex="0">
            <span className="categoria">{produto.categoria}</span>
            <h2>{produto.nome}</h2>
            <p aria-label={`Descrição: ${produto.descricao}`}>{produto.descricao}</p>
            <p className="preco">R$ {parseFloat(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            
            <button 
              className="btn btn-primary"
              onClick={() => adicionarAoCarrinho(produto)}
              aria-label={`Adicionar ${produto.nome} ao carrinho`} 
            >
              Adicionar ao Carrinho
            </button>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Vitrine;