import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const Blog = () => {
  const { artigo } = useParams();
  const navigate = useNavigate();
  const [artigos, setArtigos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Busca os artigos reais do Banco de Dados
  useEffect(() => {
    fetch('https://api-ecommerce-oficial.onrender.com/api/artigos')
      .then(res => res.json())
      .then(data => {
        setArtigos(data);
        setCarregando(false);
      })
      .catch(erro => {
        console.error('Erro ao carregar o blog:', erro);
        setCarregando(false);
      });
  }, []);

  if (carregando) {
    return <main className="container" style={{ marginTop: '40px', textAlign: 'center' }}><h2>Carregando artigos...</h2></main>;
  }

  // Se houver um artigo na URL, mostra o post completo.
  const postAtual = artigos.find(a => a.slug === artigo);

  if (artigo && postAtual) {
    return (
      <main className="container" style={{ marginTop: '40px', padding: '0 20px', minHeight: '60vh' }}>
        <button onClick={() => navigate('/blog')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', marginBottom: '20px' }}>
          ⬅ Voltar para todos os artigos
        </button>
        
        <article style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h1 style={{ color: 'var(--primary)', margin: '0 0 10px 0', fontSize: '2.2rem' }}>{postAtual.titulo}</h1>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'block', marginBottom: '20px' }}>
            Publicado em {new Date(postAtual.data_publicacao).toLocaleDateString('pt-BR')}
          </span>
          
          {postAtual.imagem_url && (
            <div style={{ width: '100%', height: '350px', borderRadius: '8px', overflow: 'hidden', marginBottom: '30px' }}>
              <img src={postAtual.imagem_url} alt={postAtual.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          
          <div style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
            {postAtual.conteudo}
          </div>
        </article>
      </main>
    );
  }

  // Tela principal do Blog (Lista de Artigos)
  return (
    <main className="container" style={{ marginTop: '40px', padding: '0 20px', minHeight: '60vh' }}>
      <h1 style={{ color: 'var(--primary)', borderBottom: '2px solid var(--border)', paddingBottom: '15px' }}>
        📰 Blog Kaio Music
      </h1>
      
      {artigos.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '40px', fontSize: '1.2rem' }}>Nenhum artigo publicado ainda. Fique de olho!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '30px' }}>
          {artigos.map((post) => (
            <div key={post.id} style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
              {post.imagem_url && (
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={post.imagem_url} alt={post.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '10px' }}>
                  {new Date(post.data_publicacao).toLocaleDateString('pt-BR')}
                </span>
                <h2 style={{ fontSize: '1.3rem', margin: '0 0 10px 0', color: 'var(--text-main)' }}>{post.titulo}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.5', flexGrow: 1 }}>{post.resumo}</p>
                <Link to={`/blog/${post.slug}`} className="btn btn-primary" style={{ textAlign: 'center', marginTop: '15px', padding: '10px' }}>
                  Ler Artigo Completo
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Blog;