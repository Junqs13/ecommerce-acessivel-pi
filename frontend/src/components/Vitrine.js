import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; 

const Vitrine = ({ carrinho, setCarrinho }) => {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);
  
  const [ordenacao, setOrdenacao] = useState('padrao');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [busca, setBusca] = useState('');
  
  // ESTADOS DA PAGINAÇÃO
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtosPorPagina = 10;

  // ESTADOS DO BANNER DINÂMICO
  const [bannerAtivo, setBannerAtivo] = useState(0);
  const navigate = useNavigate();

  // CONTEÚDO DOS BANNERS (Levando para o Blog)
  const banners = [
    { 
      id: 1, 
      titulo: "🎸 Lendas do Rock", 
      texto: "Conheça a história das guitarras que mudaram o mundo.", 
      cor: "linear-gradient(135deg, #2c3e50, #000000)",
      link: "/blog/historia-guitarras" 
    },
    { 
      id: 2, 
      titulo: "🎙️ Áudio Profissional", 
      texto: "Dicas essenciais para montar seu primeiro Home Studio.", 
      cor: "linear-gradient(135deg, #8c7ae6, #4cd137)",
      link: "/blog/home-studio" 
    },
    { 
      id: 3, 
      titulo: "🔥 Escolhendo a Bateria", 
      texto: "Acústica ou Eletrônica? Descubra a melhor para você.", 
      cor: "linear-gradient(135deg, #e1b12c, #e84118)",
      link: "/blog/escolher-bateria" 
    }
  ];

  // EFEITO DO CARROSSEL (Roda a cada 5 segundos)
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerAtivo((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // BUSCA PRODUTOS DA API
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
      .catch((err) => setErro('Falha de conexão com o servidor.'));
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

  // FILTROS E ORDENAÇÃO
  let produtosFiltrados = Array.isArray(produtos) ? [...produtos] : [];

  if (categoriaFiltro !== 'Todas') {
    produtosFiltrados = produtosFiltrados.filter(p => p.categoria === categoriaFiltro);
  }

  if (busca.trim() !== '') {
    produtosFiltrados = produtosFiltrados.filter(p => 
      p.nome.toLowerCase().includes(busca.toLowerCase())
    );
  }

  if (ordenacao === 'az') produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
  else if (ordenacao === 'za') produtosFiltrados.sort((a, b) => b.nome.localeCompare(a.nome));
  else if (ordenacao === 'menor_preco') produtosFiltrados.sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco));
  else if (ordenacao === 'maior_preco') produtosFiltrados.sort((a, b) => parseFloat(b.preco) - parseFloat(a.preco));

  // LÓGICA DA PAGINAÇÃO
  const indiceUltimoProduto = paginaAtual * produtosPorPagina;
  const indicePrimeiroProduto = indiceUltimoProduto - produtosPorPagina;
  const produtosPaginados = produtosFiltrados.slice(indicePrimeiroProduto, indiceUltimoProduto);
  const totalPaginas = Math.ceil(produtosFiltrados.length / produtosPorPagina);

  // Voltar para a página 1 sempre que o usuário digitar na busca ou mudar filtro
  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, categoriaFiltro, ordenacao]);

  const categoriasUnicas = ['Todas', ...new Set((Array.isArray(produtos) ? produtos : []).map(p => p.categoria))];

  return (
    <main className="container" style={{ padding: '0 15px' }}>
      
      {/* BANNER DINÂMICO CLICKÁVEL */}
      <section style={{ margin: '20px 0', overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
        <Link to={banners[bannerAtivo].link} style={{ textDecoration: 'none' }}>
          <div style={{ 
            background: banners[bannerAtivo].cor, 
            color: 'white', 
            padding: '40px 20px', 
            textAlign: 'center',
            transition: 'background 0.5s ease-in-out'
          }}>
            <h2 style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>{banners[bannerAtivo].titulo}</h2>
            <p style={{ fontSize: '1.2rem', margin: 0 }}>{banners[bannerAtivo].texto}</p>
            <span style={{ display: 'inline-block', marginTop: '15px', padding: '8px 15px', border: '1px solid white', borderRadius: '20px', fontSize: '0.9rem' }}>Ler no Blog ➔</span>
          </div>
        </Link>
        {/* Indicadores do Carrossel */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '-30px', paddingBottom: '15px', position: 'relative' }}>
          {banners.map((_, index) => (
            <div key={index} onClick={(e) => { e.preventDefault(); setBannerAtivo(index); }} 
              style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: index === bannerAtivo ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
            />
          ))}
        </div>
      </section>

      {/* BARRA DE FILTROS RESPONSIVA */}
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', backgroundColor: 'var(--bg-card)', padding: '15px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Pesquisar:</label>
          <input type="text" placeholder="🔍 Buscar instrumentos..." value={busca} onChange={(e) => setBusca(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
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

      {erro && (
        <div style={{ backgroundColor: '#ff7675', color: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
          ⚠️ Aviso: {erro}
        </div>
      )}

      {/* GRID DE PRODUTOS RESPONSIVO (O Segredo do Mobile) */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginBottom: '40px' 
      }}>
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
          <button 
            disabled={paginaAtual === 1} 
            onClick={() => setPaginaAtual(paginaAtual - 1)}
            style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: paginaAtual === 1 ? 'var(--border)' : 'var(--primary)', color: 'white', cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            ⬅ Anterior
          </button>
          
          <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            Página {paginaAtual} de {totalPaginas}
          </span>
          
          <button 
            disabled={paginaAtual === totalPaginas} 
            onClick={() => setPaginaAtual(paginaAtual + 1)}
            style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: paginaAtual === totalPaginas ? 'var(--border)' : 'var(--primary)', color: 'white', cursor: paginaAtual === totalPaginas ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            Próxima ➔
          </button>
        </div>
      )}

      {/* CARRINHO FLUTUANTE NO CELULAR */}
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