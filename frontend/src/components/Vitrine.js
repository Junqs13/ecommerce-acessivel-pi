import React, { useState, useEffect } from 'react';

const Vitrine = () => {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);
  
  // Novo "estado" para guardar os itens que o usuário colocar no carrinho
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

  // Função disparada ao clicar no botão de adicionar
  const adicionarAoCarrinho = (produto) => {
    setCarrinho([...carrinho, produto]);
  };

  // Matemática simples para somar o valor de todos os itens no carrinho
  const totalCarrinho = carrinho.reduce((total, item) => total + parseFloat(item.preco), 0);

  return (
    <main aria-labelledby="titulo-vitrine" style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 id="titulo-vitrine">Catálogo de Instrumentos Musicais</h1>
      
      {erro && <div role="alert" style={{ color: 'red' }}><p>Erro: {erro}</p></div>}

      {/* --- INÍCIO DA SEÇÃO DO CARRINHO --- */}
      <section 
        aria-labelledby="titulo-carrinho" 
        style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f4f4f4', border: '1px solid #ddd', borderRadius: '8px' }}
      >
        <h2 id="titulo-carrinho" tabIndex="0">🛒 Meu Carrinho ({carrinho.length} itens)</h2>
        
        {carrinho.length > 0 ? (
          <>
            <ul aria-label="Itens no carrinho" style={{ listStyleType: 'none', padding: 0 }}>
              {carrinho.map((item, index) => (
                <li key={index} style={{ padding: '5px 0', borderBottom: '1px solid #ccc' }}>
                  {item.nome} - <strong>R$ {parseFloat(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </li>
              ))}
            </ul>
            <h3 tabIndex="0">Total: R$ {totalCarrinho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            <button 
              aria-label="Finalizar compra dos itens do carrinho"
              style={{ padding: '12px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Finalizar Compra
            </button>
          </>
        ) : (
          <p tabIndex="0">Seu carrinho ainda está vazio.</p>
        )}
      </section>
      {/* --- FIM DA SEÇÃO DO CARRINHO --- */}

      <section aria-label="Lista de Produtos" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {produtos.map((produto) => (
          <article key={produto.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }} tabIndex="0">
            <h2>{produto.nome}</h2>
            <p><strong>Categoria:</strong> {produto.categoria}</p>
            <p><strong>Preço:</strong> R$ {parseFloat(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p aria-label={`Descrição: ${produto.descricao}`}>{produto.descricao}</p>
            
            {/* O onClick aqui chama a nossa função de adicionar ao carrinho */}
            <button 
              onClick={() => adicionarAoCarrinho(produto)}
              aria-label={`Adicionar ${produto.nome} ao carrinho`} 
              style={{ padding: '10px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', width: '100%' }}
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