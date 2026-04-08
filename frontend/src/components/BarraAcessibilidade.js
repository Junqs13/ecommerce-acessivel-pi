import React, { useState, useEffect } from 'react';

const BarraAcessibilidade = () => {
  const [contraste, setContraste] = useState(false);
  const [tamanhoFonte, setTamanhoFonte] = useState(16);

  useEffect(() => {
    // Aplica o alto contraste no body do site
    document.body.classList.toggle('alto-contraste', contraste);
    // Aplica o tamanho da fonte na raiz do site
    document.documentElement.style.fontSize = `${tamanhoFonte}px`;
  }, [contraste, tamanhoFonte]);

  return (
    <div style={{ background: '#222', color: '#fff', padding: '10px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
      <button onClick={() => setTamanhoFonte(tF => Math.min(tF + 2, 24))} style={btnStyle}>A +</button>
      <button onClick={() => setTamanhoFonte(tF => Math.max(tF - 2, 12))} style={btnStyle}>A -</button>
      <button onClick={() => setContraste(!contraste)} style={btnStyle}>Contraste ◐</button>
    </div>
  );
};

const btnStyle = { cursor: 'pointer', padding: '5px 10px', background: '#444', color: '#fff', border: 'none', borderRadius: '4px' };

export default BarraAcessibilidade;