import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Vitrine = ({ carrinho, setCarrinho }) => {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);
  
  const [ordenacao, setOrdenacao] = useState('padrao');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://api-ecommerce-pi.onrender.com')
      .then((resposta) => resposta.json())
      .then((dados) => setProdutos(dados))
      .catch((err) => setErro(err.message));
  }, []);

  const adicionarAoCarrinho = (produto) => {
    setCarrinho([...carrinho, produto]);
  };

  const totalCarrinho = carrinho.reduce((total, item) => total + parseFloat(item.preco), 0);

  // Lógica de Filtragem e Ordenação
  let produtosFiltrados = [...produtos];

  if (categoriaFiltro !== 'Todas') {
    produtosFiltrados = produtosFiltrados.filter(p => p.categoria === categoriaFiltro);
  }

  if (ordenacao === 'az') {
    produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
  } else if (ordenacao === 'za') {
    produtosFiltrados.sort((a, b) => b.nome.localeCompare(a.nome));
  } else if (ordenacao === 'menor_preco') {
    produtosFiltrados.sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco));
  } else if (ordenacao === 'maior_preco') {
    produtosFiltrados.sort((a, b) => parseFloat(b.preco) - parseFloat(a.preco));
  }

  // Pegar categorias únicas para o Select
  const categoriasUnicas = ['Todas', ...new Set(produtos.map(p => p.categoria))];

  return (
    <main className="container">
      
      {/* SEÇÃO DE BANNERS / DESTAQUES */}
      <section className="banner-container" aria-label="Promoções em destaque">
        <div className="banner">
          <h3>🎸 Lendas do Rock</h3>
          <p>Guitarras e baixos com o timbre perfeito para tocar os maiores clássicos da história.</p>
        </div>
        <div className="banner" style={{ background: 'linear-gradient(135deg, #8c7ae6, #4cd137)' }}>
          <h3>🎙️ Áudio Profissional</h3>
          <p>Microfones e interfaces com qualidade de estúdio.</p>
        </div>
        <div className="banner" style={{ background: 'linear-gradient(135deg, #e1b12c, #e84118)' }}>
          <h3>🔥 Oferta Especial</h3>
          <p>Compre sua bateria com frete grátis para todo o estado.</p>
        </div>
      </section>

      {/* BARRA DE FILTROS E ORDENAÇÃO */}
      <section className="filtros-bar" aria-label="Controles de filtragem">
        <div>
          <label htmlFor="filtro-categoria" style={{ fontWeight: 'bold', marginRight: '10px' }}>Categoria:</label>
          <select id="filtro-categoria" value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
            {categoriasUnicas.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        
        <div>
          <label htmlFor="ordem" style={{ fontWeight: 'bold', marginRight: '10px' }}>Ordenar por:</label>
          <select id="ordem" value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)}>
            <option value="padrao">Relevância (Padrão)</option>
            <option value="az">Ordem Alfabética (A-Z)</option>
            <option value="za">Ordem Alfabética (Z-A)</option>
            <option value="menor_preco">Menor Preço</option>
            <option value="maior_preco">Maior Preço</option>
          </select>
        </div>
      </section>

      {erro && <div role="alert" style={{ color: 'red' }}><p>Erro: {erro}</p></div>}

      {/* GRID DA VITRINE */}
      <section aria-label="Lista de Produtos" className="vitrine-grid">
        {produtosFiltrados.map((produto) => (
          <article key={produto.id} className="produto-card" tabIndex="0">
            <img 
              src={produto.imagem_url || 'https://via.placeholder.com/500?text=Sem+Imagem'} 
              alt={`Fotografia de ${produto.nome}`} 
              className="produto-imagem"
              loading="lazy"
            />
            <span className="categoria">{produto.categoria}</span>
            <h2 style={{ marginTop: '10px' }}>{produto.nome}</h2>
            <p className="preco">R$ {parseFloat(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            
            <button className="btn btn-comprar" onClick={() => adicionarAoCarrinho(produto)}>
              Adicionar ao Carrinho
            </button>
          </article>
        ))}
      </section>

      {/* CARRINHO FLUTUANTE */}
      {carrinho.length > 0 && (
        <div className="carrinho-flutuante" aria-label="Resumo do carrinho de compras">
          <div>
            <span style={{ display: 'block', fontWeight: 'bold', fontSize: '1.2rem' }}>🛒 {carrinho.length} itens</span>
            <span>Total: R$ {totalCarrinho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <button 
            onClick={() => navigate('/carrinho')} 
            style={{ padding: '8px 15px', border: 'none', borderRadius: '4px', backgroundColor: '#fff', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Finalizar Compra
          </button>
        </div>
      )}

    </main>
  );
};

export default Vitrine;