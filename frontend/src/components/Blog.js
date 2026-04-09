import React from 'react';
import { useParams, Link } from 'react-router-dom';

const Blog = () => {
  const { artigo } = useParams(); // Pega o link do banner para saber qual texto mostrar

  // Aqui você pode criar vários textos. O React escolhe qual mostrar.
  const conteudos = {
    'historia-guitarras': {
      titulo: '🎸 A História das Guitarras Clássicas',
      texto: 'Desde a Fender Stratocaster até a Gibson Les Paul, as guitarras elétricas moldaram a música no século XX. Grandes lendas como Jimi Hendrix e Eric Clapton imortalizaram esses instrumentos em solos inesquecíveis...'
    },
    'home-studio': {
      titulo: '🎙️ Como montar seu Home Studio',
      texto: 'Para começar a gravar em casa, você não precisa de muito. Uma boa interface de áudio, um microfone condensador e fones de referência são o kit básico para tirar suas composições do papel...'
    },
    'escolher-bateria': {
      titulo: '🔥 Bateria Acústica vs Eletrônica',
      texto: 'Mora em apartamento? A bateria eletrônica é sua melhor amiga graças às peles em mesh e fones de ouvido. Quer sentir a vibração em um palco? Nada substitui o peso de uma bateria acústica...'
    }
  };

  // Se o usuário tentar acessar um link que não existe, mostra um padrão
  const artigoAtual = conteudos[artigo] || { 
    titulo: 'Bem-vindo ao Blog da Kaio Music', 
    texto: 'Fique por dentro das novidades do mundo musical e dicas de instrumentos.' 
  };

  return (
    <main className="container" style={{ marginTop: '40px', padding: '0 20px', minHeight: '60vh' }}>
      <Link to="/" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>⬅ Voltar para a Loja</Link>
      
      <article style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '12px', marginTop: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: 'var(--primary)', borderBottom: '2px solid var(--border)', paddingBottom: '15px' }}>
          {artigoAtual.titulo}
        </h1>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-main)', marginTop: '20px' }}>
          {artigoAtual.texto}
        </p>
        
        {/* Espaço para colocar uma imagem no futuro */}
        <div style={{ width: '100%', height: '300px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', color: 'var(--text-muted)' }}>
          [Espaço reservado para a Imagem do Artigo]
        </div>
      </article>
    </main>
  );
};

export default Blog;