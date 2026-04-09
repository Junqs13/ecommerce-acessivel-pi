import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; 

const Vitrine = ({ carrinho, setCarrinho }) => {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);
  
  const [ordenacao, setOrdenacao] = useState('padrao');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtosPorPagina = 12;

  // ESTADOS DOS BANNERS DINÂMICOS
  const [banners, setBanners] = useState([]);
  const [bannerAtivo, setBannerAtivo] = useState(0);
  const imagemPadrao = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80';
  
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Busca os Produtos do Catálogo
    fetch('https://api-ecommerce-oficial.onrender.com/api/produtos')
      .then((resposta) => resposta.json())
      .then((dados) => {
        if (Array.isArray(dados)) { setProdutos(dados); setErro(null); } 
        else { setErro(dados.erro || 'A API não retornou a lista de instrumentos.'); }
      })
      .catch((err) => setErro('Falha de conexão com o servidor.'));

    // 2. Busca os Artigos do Blog para gerar o Banner Aleatório
    fetch('https://api-ecommerce-oficial.onrender.com/api/artigos')
      .then(res => res.json())
      .then(dados => {
        if (Array.isArray(dados) && dados.length > 0) {
          // Embaralha a ordem dos artigos magicamente
          const artigosEmbaralhados = [...dados].sort(() => 0.5 - Math.random());
          // Pega apenas os 3 primeiros para o banner
          setBanners(artigosEmbaralhados.slice(0, 3));
        }
      })
      .catch(console.error);
  }, []);

  // Faz o Banner rodar sozinho a cada 5 segundos
  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setBannerAtivo((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const adicionarAoCarrinho = (produto) => {
    if (Array.isArray(carrinho)) setCarrinho([...carrinho, produto]);
    else setCarrinho([produto]);
    toast.success(`${produto.nome} foi para o carrinho! 🛒`);
  };

  const carrinhoSeguro = Array.isArray(carrinho) ? carrinho : [];
  const totalCarrinho = carrinhoSeguro.reduce((total, item) => total + parseFloat(item.preco), 0);

  // FILTROS E PAGINAÇÃO DOS PRODUTOS
  let produtosFiltrados = Array.isArray(produtos) ? [...produtos] : [];
  if (categoriaFiltro !== 'Todas') produtosFiltrados = produtosFiltrados.filter(p => p.categoria === categoriaFiltro);
  if (busca.trim() !== '') produtosFiltrados = produtosFiltrados.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));

  if (ordenacao === 'az') produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
  else if (ordenacao === 'za') produtosFiltrados.sort((a, b) => b.nome.localeCompare(a.nome));
  else if (ordenacao === 'menor_preco') produtosFiltrados.sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco));
  else if (ordenacao === 'maior_preco') produtosFiltrados.sort((a, b) => parseFloat(b.preco) - parseFloat(a.preco));

  const indiceUltimoProduto = paginaAtual * produtosPorPagina;
  const indicePrimeiroProduto = indiceUltimoProduto - produtosPorPagina;
  const produtosPaginados = produtosFiltrados.slice(indicePrimeiroProduto, indiceUltimoProduto);
  const totalPaginas = Math.ceil(produtosFiltrados.length / produtosPorPagina);

  useEffect(() => { setPaginaAtual(1); }, [busca, categoriaFiltro, ordenacao]);

  const categoriasUnicas = ['Todas', ...new Set((Array.isArray(produtos) ? produtos : []).map(p => p.categoria))];

  return (
    <main className="container" style={{ padding: '0 15px' }}>
      
      {/* ================= BANNER DINÂMICO ALEATÓRIO ================= */}
      {banners.length > 0 && (
        <section style={{ margin: '20px 0', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden', height: '280px' }}>
          <Link to={`/blog/${banners[bannerAtivo].slug}`} style={{ textDecoration: 'none' }}>
            
            {/* Imagem de Fundo Escurecida para destacar o texto */}
            <img 
              src={banners[bannerAtivo].imagem_url || imagemPadrao} 
              onError={(e) => { e.target.onerror = null; e.target.src = imagemPadrao; }}
              alt={banners[bannerAtivo].titulo}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35)', transition: 'opacity 0.5s ease' }}
            />
            
            {/* Textos do Banner */}
            <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: 'white', padding: '0 20px' }}>
              <span style={{ backgroundColor: 'var(--primary)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px' }}>Destaque do Blog</span>
              <h2 style={{ fontSize: '2.2rem', margin: '0 0 10px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{banners[bannerAtivo].titulo}</h2>
              <p style={{ fontSize: '1.2rem', margin: 0, maxWidth: '800px', textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>{banners[bannerAtivo].resumo}</p>
              <span style={{ display: 'inline-block', marginTop: '20px', padding: '10px 25px', border: '2px solid white', borderRadius: '25px', fontSize: '1rem', fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.4)', transition: '0.3s' }}>Ler Artigo Completo ➔</span>
            </div>
          </Link>
          
          {/* Indicadores do Carrossel (Bolinhas) */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', position: 'absolute', bottom: '15px', width: '100%', zIndex: 2 }}>
            {banners.map((_, index) => (
              <div key={index} onClick={(e) => { e.preventDefault(); setBannerAtivo(index); }} 
                style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: index === bannerAtivo ? '#f39c12' : 'rgba(255,255,255,0.5)', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.5)', transition: '0.3s' }}
              />
            ))}
          </div>
        </section>
      )}
      {/* =============================================================== */}

      {/* BARRA DE FILTROS */}
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', backgroundColor: 'var(--bg-card)', padding: '15px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Pesquisar:</label>
          <input type="text" placeholder="🔍 Buscar instrumentos..." value={busca} onChange={(e) => setBusca(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
        </div>
        <div style={{ flex: '1 1 150px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Categoria:</label>
          <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}>
            {categoriasUnicas.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div style={{ flex: '1 1 150px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Ordenar por:</label>
          <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <option value="padrao">Relevância</option>
            <option value="az">Letra (A-Z)</option>
            <option value="menor_preco">Menor Preço</option>
            <option value="maior_preco">Maior Preço</option>
          </select>
        </div>
      </section>

      {erro && <div style={{ backgroundColor: '#ff7675', color: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' }}>⚠️ Aviso: {erro}</div>}

      {/* GRID DE PRODUTOS RESPONSIVO */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {produtosPaginados.length === 0 && !erro ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}><h3>Nenhum instrumento encontrado.</h3></div>
        ) : (
          produtosPaginados.map((produto) => (
            <article key={produto.id} className="produto-card" style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card)', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <div style={{ width: '100%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '6px' }}>
                <img src={produto.imagem_url || 'https://via.placeholder.com/500?text=Sem+Imagem'} alt={produto.nome} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} loading="lazy"/>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', marginTop: '15px' }}>{produto.categoria}</span>
              <h2 style={{ fontSize: '1.2rem', margin: '5px 0 flex-grow: 1' }}>{produto.nome}</h2>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '10px 0' }}>R$ {parseFloat(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              
              <button className="btn btn-comprar" onClick={() => adicionarAoCarrinho(produto)} style={{ width: '100%', padding: '12px', marginTop: 'auto' }}>
                Comprar
              </button>
            </article>
          ))
        )}
      </section>

      {/* CONTROLES DA PAGINAÇÃO */}
      {totalPaginas > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', paddingBottom: '40px' }}>
          <button disabled={paginaAtual === 1} onClick={() => setPaginaAtual(paginaAtual - 1)} style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: paginaAtual === 1 ? 'var(--border)' : 'var(--primary)', color: 'white', cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>⬅ Anterior</button>
          <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Página {paginaAtual} de {totalPaginas}</span>
          <button disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual(paginaAtual + 1)} style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: paginaAtual === totalPaginas ? 'var(--border)' : 'var(--primary)', color: 'white', cursor: paginaAtual === totalPaginas ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>Próxima ➔</button>
        </div>
      )}

      {/* CARRINHO FLUTUANTE */}
      {carrinhoSeguro.length > 0 && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: 'var(--primary)', color: 'white', padding: '15px 20px', borderRadius: '30px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '15px', zIndex: 1000 }}>
          <span style={{ fontWeight: 'bold' }}>🛒 {carrinhoSeguro.length} itens</span>
          <button onClick={() => navigate('/carrinho')} style={{ padding: '8px 15px', border: 'none', borderRadius: '20px', backgroundColor: '#fff', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}>
            Ver Carrinho
          </button>
        </div>
      )}
    </main>
  );
};

export default Vitrine;