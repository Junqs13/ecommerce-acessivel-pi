import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const Blog = () => {
  const { artigo } = useParams();
  const navigate = useNavigate();

  // Lista provisória de artigos (No futuro, virá do Banco de Dados)
  const [artigos] = useState([
    {
      slug: 'revolucao-beatles',
      titulo: '🎸 A Revolução dos Beatles no Estúdio',
      data: '10 de Abril de 2026',
      resumo: 'Como o quarteto de Liverpool mudou para sempre as técnicas de gravação e mixagem de áudio.',
      conteudo: 'Os Beatles não apenas compuseram grandes sucessos, mas revolucionaram o uso do estúdio como um instrumento musical. Álbuns como Sgt. Pepper\'s Lonely Hearts Club Band introduziram técnicas de gravação multicanal, loops de fita e efeitos psicodélicos que definiram o padrão para a produção de áudio profissional até os dias de hoje.',
      imagem: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&w=800&q=80'
    },
    {
      slug: 'som-the-doors',
      titulo: '🎹 O Som Sombrio e Poético do The Doors',
      data: '05 de Abril de 2026',
      resumo: 'A influência dos teclados marcantes e da poesia visceral no rock dos anos 60.',
      conteudo: 'Diferente da maioria das bandas de rock da sua época, o The Doors não possuía um baixista tradicional em suas apresentações ao vivo. O som denso e hipnótico era guiado pelas linhas de baixo tocadas no teclado Rhodes Piano Bass, criando uma atmosfera perfeita para as letras profundas e obscuras, tornando-os ícones do rock psicodélico.',
      imagem: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80'
    },
    {
      slug: 'legado-elvis',
      titulo: '🕺 O Legado Imortal de Elvis Presley',
      data: '28 de Março de 2026',
      resumo: 'Como a energia e o carisma do Rei do Rock continuam influenciando gerações de músicos.',
      conteudo: 'A energia crua das primeiras gravações na Sun Records e a presença de palco magnética fizeram dele uma força da natureza. A fusão de country, gospel e rhythm and blues criou um som revolucionário que abriu as portas para incontáveis artistas.',
      imagem: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=800&q=80'
    }
  ]);

  // Se houver um artigo na URL, mostra o post completo. Se não, mostra a lista.
  const postAtual = artigos.find(a => a.slug === artigo);

  if (artigo && postAtual) {
    return (
      <main className="container" style={{ marginTop: '40px', padding: '0 20px', minHeight: '60vh' }}>
        <button onClick={() => navigate('/blog')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', marginBottom: '20px' }}>
          ⬅ Voltar para todos os artigos
        </button>
        
        <article style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h1 style={{ color: 'var(--primary)', margin: '0 0 10px 0', fontSize: '2.2rem' }}>{postAtual.titulo}</h1>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'block', marginBottom: '20px' }}>Publicado em {postAtual.data}</span>
          
          <div style={{ width: '100%', height: '350px', borderRadius: '8px', overflow: 'hidden', marginBottom: '30px' }}>
            <img src={postAtual.imagem} alt={postAtual.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          
          <div style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-main)' }}>
            <p>{postAtual.conteudo}</p>
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
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '30px' }}>
        {artigos.map((post) => (
          <div key={post.slug} style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '200px', overflow: 'hidden' }}>
              <img src={post.imagem} alt={post.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} />
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '10px' }}>{post.data}</span>
              <h2 style={{ fontSize: '1.3rem', margin: '0 0 10px 0', color: 'var(--text-main)' }}>{post.titulo}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.5', flexGrow: 1 }}>{post.resumo}</p>
              <Link to={`/blog/${post.slug}`} className="btn btn-primary" style={{ textAlign: 'center', marginTop: '15px', padding: '10px' }}>
                Ler Artigo Completo
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Blog;