import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [dadosEstatisticos, setDadosEstatisticos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/produtos/estatisticas')
      .then((resposta) => resposta.json())
      .then((dados) => setDadosEstatisticos(dados))
      .catch((err) => console.error("Erro ao carregar dados do painel:", err));
  }, []);

  return (
    <section 
      aria-labelledby="titulo-dashboard" 
      style={{ padding: '20px', backgroundColor: '#e9ecef', marginTop: '20px', borderRadius: '8px' }}
    >
      <h2 id="titulo-dashboard" tabIndex="0">📊 Painel Analítico de Estoque</h2>
      <p tabIndex="0">Visão geral do volume de peças disponíveis na loja, separadas por categoria de instrumento.</p>

      {/* Container responsivo e acessível para o gráfico */}
      <div 
        role="img" 
        aria-label="Gráfico de barras mostrando a quantidade total de peças no estoque por categoria de instrumentos musicais."
        style={{ width: '100%', height: 400, marginTop: '20px', backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}
      >
        <ResponsiveContainer>
          <BarChart data={dadosEstatisticos} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Barra azul para mostrar a soma do estoque */}
            <Bar dataKey="total_pecas_estoque" name="Total de Peças no Estoque" fill="#0056b3" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default Dashboard;