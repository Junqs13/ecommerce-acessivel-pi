import React from 'react';

const BannersDestaque = () => {
  return (
    <section aria-label="Informações úteis e Newsletter" style={{ backgroundColor: 'var(--bg-card)', padding: '50px 20px', marginTop: '60px', borderTop: '2px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'space-between', textAlign: 'center' }}>
        
        {/* Frete Grátis */}
        <div style={{ flex: '1 1 200px', padding: '10px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🚚</div>
          <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-main)' }}>Frete Grátis</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Em compras acima de R$ 299 para as regiões Sul e Sudeste.</p>
        </div>

        {/* Promoções */}
        <div style={{ flex: '1 1 200px', padding: '10px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏷️</div>
          <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-main)' }}>Ofertas Exclusivas</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Descontos imbatíveis em instrumentos selecionados toda semana.</p>
        </div>

        {/* Newsletter */}
        <div style={{ flex: '1 1 250px', padding: '10px', backgroundColor: 'rgba(243, 156, 18, 0.05)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✉️</div>
          <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary)' }}>Assine a Newsletter</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '15px' }}>Ganhe 10% de desconto na sua primeira compra.</p>
          <div style={{ display: 'flex' }}>
            <input type="email" placeholder="Seu melhor e-mail" style={{ flex: 1, padding: '10px', borderRadius: '4px 0 0 4px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-main)' }} />
            <button style={{ padding: '10px 15px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer', fontWeight: 'bold' }}>Assinar</button>
          </div>
        </div>

        {/* Redes Sociais */}
        <div style={{ flex: '1 1 200px', padding: '10px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📱</div>
          <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-main)' }}>Siga-nos</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Acompanhe dicas, novidades e os bastidores nas redes.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '15px', fontSize: '1.5rem', cursor: 'pointer' }}>
            <span title="Instagram">📸</span>
            <span title="Facebook">📘</span>
            <span title="Twitter">🐦</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BannersDestaque;