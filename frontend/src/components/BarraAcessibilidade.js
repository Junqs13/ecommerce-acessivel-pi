import React, { useState, useEffect } from 'react';

const BarraAcessibilidade = () => {
  const [contraste, setContraste] = useState(false);
  const [tamanhoFonte, setTamanhoFonte] = useState(16);
  
  // NOVO: Estado do Modo Escuro (já salva na memória do navegador!)
  const [temaEscuro, setTemaEscuro] = useState(() => {
    return localStorage.getItem('tema_pi') === 'escuro';
  });

  // Efeito do Contraste e Fonte
  useEffect(() => {
    document.body.classList.toggle('alto-contraste', contraste);
    document.documentElement.style.fontSize = `${tamanhoFonte}px`;
  }, [contraste, tamanhoFonte]);

  // NOVO: Efeito do Tema Escuro
  useEffect(() => {
    document.body.classList.toggle('tema-escuro', temaEscuro);
    localStorage.setItem('tema_pi', temaEscuro ? 'escuro' : 'claro');
  }, [temaEscuro]);

  return (
    <div style={{ background: '#222', color: '#fff', padding: '10px', display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
      <button onClick={() => setTamanhoFonte(tF => Math.min(tF + 2, 24))} style={btnStyle}>A +</button>
      <button onClick={() => setTamanhoFonte(tF => Math.max(tF - 2, 12))} style={btnStyle}>A -</button>
      <button onClick={() => setContraste(!contraste)} style={btnStyle}>Contraste ◐</button>
      
      {/* Botão do Modo Escuro */}
      <button onClick={() => setTemaEscuro(!temaEscuro)} style={{...btnStyle, background: temaEscuro ? '#e1b12c' : '#3498db', color: temaEscuro ? '#111' : '#fff'}}>
        {temaEscuro ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
      </button>
    </div>
  );
};

const btnStyle = { 
  cursor: 'pointer', 
  padding: '5px 12px', 
  background: '#444', 
  color: '#fff', 
  border: 'none', 
  borderRadius: '4px',
  fontWeight: 'bold',
  transition: '0.3s'
};

export default BarraAcessibilidade;