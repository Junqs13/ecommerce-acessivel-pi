import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 

const Vitrine = ({ carrinho, setCarrinho }) => {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);
  
  const [ordenacao, setOrdenacao] = useState('padrao');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [busca, setBusca] = useState(''); // NOVO: Estado para a barra de pesquisa
  
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://api-ecommerce-oficial.onrender.com/api/produtos')
      .then((resposta) => resposta.json())
      .then((dados) => {
        if (Array.isArray(dados)) {
          setProdutos(dados);
          setErro(null);
        } else {
          setErro(dados.erro || 'A API não retornou a lista de instrumentos.');
        }
      })
      .catch((err) => setErro('Falha de conexão: A API pode estar desligada. ' + err.message));
  }, []);

  const adicionarAoCarrinho = (produto) => {
    if (Array.isArray(carrinho)) {
      setCarrinho([...carrinho, produto]);
    } else {
      setCarrinho([produto]);
    }
    toast.success(`${produto.nome} foi para o carrinho! 🛒`);
  };

  const carrinhoSeguro = Array.isArray(carrinho) ? carrinho : [];
  const totalCarrinho = carrinhoSeguro.reduce((total, item) => total + parseFloat(item.preco), 0);

  let produtosFiltrados = Array.isArray(produtos) ? [...produtos] : [];

  // Filtro 1: Por Categoria
  if (categoriaFiltro !== 'Todas') {
    produtosFiltrados = produtosFiltrados.filter(p => p.categoria === categoriaFiltro);
  }

  // Filtro 2: Por Pesquisa de Texto (NOVO)
  if (busca.trim() !== '') {
    produtosFiltrados = produtosFiltrados.filter(p => 
      p.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }

  // Filtro 3: Ordenação
  if (ordenacao === 'az') {
    produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
  } else if (ordenacao === 'za') {
    produtosFiltrados.sort((a, b) => b.nome.localeCompare(a.nome));
  } else if (ordenacao === 'menor_preco') {
    produtosFiltrados.sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco));
  } else if (ordenacao === 'maior_preco') {
    produtosFiltrados.sort((a, b) => parseFloat(b.preco) - parseFloat(a.preco));
  }

  const categoriasUnicas = ['Todas', ...new Set((Array.isArray(produtos) ? produtos : []).map(p => p.categoria))];

  return (
    <main className="container">
      
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

      {/* Barra de Filtros Atualizada com a Pesquisa */}
      <section className="filtros-bar" aria-label="Controles de filtragem" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <label htmlFor="filtro-categoria" style={{ fontWeight: 'bold', marginRight: '10px' }}>Categoria:</label>
          <select id="filtro-categoria" value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
            {categoriasUnicas.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        
        {/* NOVO: Campo de Busca */}
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label htmlFor="busca-texto" className="sr-only" style={{ display: 'none' }}>Buscar produto</label>
          <input 
            id="busca-texto"
            type="text" 
            placeholder="🔍 Buscar instrumentos..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '1rem' }}
          />
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

      {erro && (
        <div role="alert" style={{ backgroundColor: '#ff7675', color: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
          ⚠️ Aviso: {erro}
        </div>
      )}

      <section aria-label="Lista de Produtos" className="vitrine-grid">
        {produtosFiltrados.length === 0 && !erro ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <h3>Nenhum instrumento encontrado para "{busca}"</h3>
          </div>
        ) : (
          produtosFiltrados.map((produto) => (
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
          ))
        )}
      </section>

      {carrinhoSeguro.length > 0 && (
        <div className="carrinho-flutuante" aria-label="Resumo do carrinho de compras">
          <div>
            <span style={{ display: 'block', fontWeight: 'bold', fontSize: '1.2rem' }}>🛒 {carrinhoSeguro.length} itens</span>
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