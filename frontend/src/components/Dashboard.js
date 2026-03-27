import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CORES = ['#004494', '#218838', '#e1b12c', '#c0392b', '#8e44ad', '#d35400'];

const Dashboard = () => {
  const [dadosEstatisticos, setDadosEstatisticos] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState(false);

  useEffect(() => {
    fetch('https://api-ecommerce-pi.onrender.com/api/produtos/estatisticas')
      .then((resposta) => resposta.json())
      .then((dados) => {
        // Verifica se o backend mandou o formato novo corretamente
        if (dados.geral && dados.porCategoria) {
          setDadosEstatisticos(dados);
        } else {
          setErroApi(true); // Backend mandou formato antigo ou erro
        }
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar dados:", err);
        setErroApi(true);
        setCarregando(false);
      });
  }, []);

  if (carregando) return <p style={{ textAlign: 'center', marginTop: '50px' }}>A carregar análises...</p>;
  
  if (erroApi) return (
    <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
      <h2>Erro de Comunicação</h2>
      <p>O formato dos dados recebidos da API está incorreto. Reinicie o servidor Node.js.</p>
    </div>
  );

  // Trava de segurança: Se vier vazio, assume arrays e objetos vazios
  const porCategoria = dadosEstatisticos.porCategoria || [];
  const geral = dadosEstatisticos.geral || {};

  return (
    <section aria-labelledby="titulo-dashboard" style={{ padding: '20px' }}>
      <h2 id="titulo-dashboard" tabIndex="0" style={{ color: 'var(--primary)', borderBottom: '2px solid var(--border)', paddingBottom: '10px' }}>
        📈 Painel Analítico de Gestão
      </h2>
      
      {/* CARTÕES DE RESUMO (KPIs) */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px', marginTop: '20px' }}>
        <div style={{ flex: '1', minWidth: '200px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', borderLeft: '5px solid #004494' }} tabIndex="0">
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--text-muted)' }}>Modelos de Instrumentos</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{geral.total_produtos || 0}</p>
        </div>
        
        <div style={{ flex: '1', minWidth: '200px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', borderLeft: '5px solid #218838' }} tabIndex="0">
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--text-muted)' }}>Volume Total no Armazém</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#218838' }}>{geral.total_itens || 0} peças</p>
        </div>

        <div style={{ flex: '1', minWidth: '200px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', borderLeft: '5px solid #e1b12c' }} tabIndex="0">
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--text-muted)' }}>Património em Stock</h3>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#d35400' }}>
            R$ {parseFloat(geral.patrimonio_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* ÁREA DOS GRÁFICOS */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        <div role="img" aria-label="Gráfico de barras: Volume de peças por categoria." style={{ flex: '2', minWidth: '300px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ textAlign: 'center', marginTop: 0 }}>Volume de Peças por Categoria</h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={porCategoria} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="total_pecas_estoque" name="Quantidade em Stock" fill="#004494" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div role="img" aria-label="Gráfico circular: Distribuição do valor financeiro por categoria." style={{ flex: '1', minWidth: '300px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ textAlign: 'center', marginTop: 0 }}>Distribuição de Capital (R$)</h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={porCategoria} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="valor_total_estoque" nameKey="categoria" label>
                  {porCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Dashboard;