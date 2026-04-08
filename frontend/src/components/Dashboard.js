import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'react-toastify';

const CORES = ['#004494', '#218838', '#e1b12c', '#c0392b', '#8e44ad', '#d35400'];

const Dashboard = () => {
  const [abaAtiva, setAbaAtiva] = useState('estatisticas'); // Controle das abas
  const [dadosEstatisticos, setDadosEstatisticos] = useState({});
  const [produtosBaixoEstoque, setProdutosBaixoEstoque] = useState([]);
  const [todosProdutos, setTodosProdutos] = useState([]); // Lista completa para a tabela
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState(false);

  // Estado do formulário de novo produto
  const [novoProduto, setNovoProduto] = useState({
    nome: '', descricao: '', preco: '', categoria: 'Cordas', imagem_url: '', quantidade: ''
  });

  // Função centralizada para buscar dados da API
  const carregarDados = () => {
    setCarregando(true);
    const fetchEstatisticas = fetch('https://api-ecommerce-pi.onrender.com/api/produtos/estatisticas').then(res => res.json());
    const fetchProdutos = fetch('https://api-ecommerce-pi.onrender.com/api/produtos').then(res => res.json());

    Promise.all([fetchEstatisticas, fetchProdutos])
      .then(([estatisticas, listaProdutos]) => {
        if (estatisticas.geral && estatisticas.porCategoria) {
          setDadosEstatisticos(estatisticas);
        } else {
          setErroApi(true);
        }

        if (Array.isArray(listaProdutos)) {
          setTodosProdutos(listaProdutos);
          const baixoEstoque = listaProdutos.filter(p => {
            const qtd = p.quantidade !== undefined ? p.quantidade : (p.estoque !== undefined ? p.estoque : null);
            return qtd !== null && qtd < 5;
          });
          setProdutosBaixoEstoque(baixoEstoque);
        }
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar dados:", err);
        setErroApi(true);
        setCarregando(false);
      });
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Função para enviar o NOVO PRODUTO para a API
  const handleAdicionarProduto = async (e) => {
    e.preventDefault();
    try {
      const resposta = await fetch('https://api-ecommerce-pi.onrender.com/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto)
      });

      if (resposta.ok) {
        toast.success('Produto adicionado com sucesso ao catálogo!');
        // Limpa o formulário
        setNovoProduto({ nome: '', descricao: '', preco: '', categoria: 'Cordas', imagem_url: '', quantidade: '' });
        carregarDados(); // Recarrega os gráficos e tabelas atualizados
      } else {
        const erro = await resposta.json();
        toast.error(erro.erro || 'Erro ao adicionar produto.');
      }
    } catch (error) {
      toast.error('Erro de conexão ao comunicar com a API.');
    }
  };

  // Função para EXCLUIR um produto
  const handleDeletarProduto = async (id, nome) => {
    if (!window.confirm(`Tem a certeza que deseja excluir o instrumento "${nome}"? Esta ação não pode ser desfeita.`)) return;

    try {
      const resposta = await fetch(`https://api-ecommerce-pi.onrender.com/api/produtos/${id}`, {
        method: 'DELETE'
      });

      if (resposta.ok) {
        toast.success('Produto removido com sucesso!');
        carregarDados(); // Recarrega os dados sem o produto apagado
      } else {
        toast.error('Erro ao remover o produto.');
      }
    } catch (error) {
      toast.error('Erro de conexão ao remover produto.');
    }
  };

  if (carregando) return <p style={{ textAlign: 'center', marginTop: '50px' }}>A carregar análises e catálogo...</p>;
  
  if (erroApi) return (
    <div style={{ textAlign: 'center', marginTop: '50px', color: '#ff4d4d' }}>
      <h2>Erro de Comunicação</h2>
      <p>Não foi possível carregar os dados. Verifique o servidor.</p>
    </div>
  );

  const porCategoria = dadosEstatisticos.porCategoria || [];
  const geral = dadosEstatisticos.geral || {};

  return (
    <section aria-labelledby="titulo-dashboard" style={{ padding: '20px' }}>
      
      {/* CABEÇALHO DO PAINEL COM AS ABAS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border)', paddingBottom: '15px', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 id="titulo-dashboard" tabIndex="0" style={{ color: 'var(--primary)', margin: 0 }}>
          ⚙️ Painel de Administração
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setAbaAtiva('estatisticas')} 
            style={{ padding: '10px 20px', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer', background: abaAtiva === 'estatisticas' ? 'var(--primary)' : 'var(--bg-card)', color: abaAtiva === 'estatisticas' ? '#fff' : 'var(--text-main)', border: '1px solid var(--border)' }}
          >
            📊 Estatísticas
          </button>
          <button 
            onClick={() => setAbaAtiva('catalogo')} 
            style={{ padding: '10px 20px', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer', background: abaAtiva === 'catalogo' ? 'var(--primary)' : 'var(--bg-card)', color: abaAtiva === 'catalogo' ? '#fff' : 'var(--text-main)', border: '1px solid var(--border)' }}
          >
            📦 Gestão de Catálogo
          </button>
        </div>
      </div>

      {/* ================================================== */}
      {/* ABA 1: GRÁFICOS E ESTATÍSTICAS                     */}
      {/* ================================================== */}
      {abaAtiva === 'estatisticas' && (
        <div>
          {produtosBaixoEstoque.length > 0 && (
            <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '15px 20px', borderRadius: '8px', borderLeft: '5px solid #ffeeba', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                ⚠️ Atenção: Produtos com Estoque Crítico
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {produtosBaixoEstoque.map((p, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>
                    <strong>{p.nome}</strong> — Restam apenas <span style={{ color: '#c0392b', fontWeight: 'bold' }}>{p.quantidade !== undefined ? p.quantidade : p.estoque}</span> unidades.
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
            <div style={{ flex: '1', minWidth: '200px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', borderLeft: '5px solid #004494' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--text-muted)' }}>Modelos de Instrumentos</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{geral.total_produtos || 0}</p>
            </div>
            <div style={{ flex: '1', minWidth: '200px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', borderLeft: '5px solid #218838' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--text-muted)' }}>Volume Total no Armazém</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#218838' }}>{geral.total_itens || 0} peças</p>
            </div>
            <div style={{ flex: '1', minWidth: '200px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', borderLeft: '5px solid #e1b12c' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--text-muted)' }}>Património em Stock</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#d35400' }}>
                R$ {parseFloat(geral.patrimonio_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div role="img" aria-label="Gráfico de barras." style={{ flex: '2', minWidth: '300px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <h3 style={{ textAlign: 'center', marginTop: 0 }}>Volume de Peças por Categoria</h3>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <BarChart data={porCategoria} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="categoria" stroke="var(--text-main)" />
                    <YAxis stroke="var(--text-main)" />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Legend />
                    <Bar dataKey="total_pecas_estoque" name="Quantidade em Stock" fill="#004494" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div role="img" aria-label="Gráfico circular." style={{ flex: '1', minWidth: '300px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <h3 style={{ textAlign: 'center', marginTop: 0 }}>Distribuição de Capital</h3>
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
        </div>
      )}

      {/* ================================================== */}
      {/* ABA 2: CADASTRO E EXCLUSÃO DE PRODUTOS             */}
      {/* ================================================== */}
      {abaAtiva === 'catalogo' && (
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          
          {/* COLUNA ESQUERDA: Formulário */}
          <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', height: 'fit-content' }}>
            <h3 style={{ marginTop: 0 }}>Adicionar Novo Instrumento</h3>
            <form onSubmit={handleAdicionarProduto} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Nome do Produto (Ex: Guitarra Fender)" required value={novoProduto.nome} onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})} style={inputStyle} />
              
              <textarea placeholder="Breve descrição do instrumento..." required value={novoProduto.descricao} onChange={(e) => setNovoProduto({...novoProduto, descricao: e.target.value})} style={{...inputStyle, resize: 'vertical', minHeight: '80px'}} />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Preço (R$):</label>
                  <input type="number" step="0.01" min="0" required value={novoProduto.preco} onChange={(e) => setNovoProduto({...novoProduto, preco: e.target.value})} style={{...inputStyle, width: '100%', marginTop: '5px'}} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Qtd Estoque:</label>
                  <input type="number" min="0" required value={novoProduto.quantidade} onChange={(e) => setNovoProduto({...novoProduto, quantidade: e.target.value})} style={{...inputStyle, width: '100%', marginTop: '5px'}} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Categoria:</label>
                <select required value={novoProduto.categoria} onChange={(e) => setNovoProduto({...novoProduto, categoria: e.target.value})} style={{...inputStyle, width: '100%', marginTop: '5px'}}>
                  <option value="Cordas">Cordas (Guitarras, Baixos, etc)</option>
                  <option value="Teclas">Teclas (Pianos, Teclados)</option>
                  <option value="Sopro">Sopro (Sax, Flautas)</option>
                  <option value="Percussão">Percussão (Baterias)</option>
                  <option value="Áudio">Áudio Profissional</option>
                  <option value="Acessórios">Acessórios</option>
                </select>
              </div>

              <input type="url" placeholder="Link da Imagem (URL terminada em .png ou .jpg)" required value={novoProduto.imagem_url} onChange={(e) => setNovoProduto({...novoProduto, imagem_url: e.target.value})} style={inputStyle} />
              
              <button type="submit" className="btn btn-comprar" style={{ padding: '15px', fontSize: '1.1rem', marginTop: '10px' }}>
                ➕ Salvar no Catálogo
              </button>
            </form>
          </div>

          {/* COLUNA DIREITA: Tabela de Produtos */}
          <div style={{ flex: '2', minWidth: '350px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0 }}>Catálogo Atual</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '12px 10px' }}>ID</th>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th>Preço</th>
                    <th>Estoque</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {todosProdutos.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 'bold', color: 'var(--text-muted)' }}>#{p.id}</td>
                      <td style={{ fontWeight: '500' }}>{p.nome}</td>
                      <td><span className="categoria">{p.categoria}</span></td>
                      <td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>R$ {parseFloat(p.preco).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                      <td>
                        <span style={{ fontWeight: 'bold', color: (p.quantidade !== undefined ? p.quantidade : p.estoque) < 5 ? '#c0392b' : 'inherit' }}>
                          {p.quantidade !== undefined ? p.quantidade : p.estoque}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleDeletarProduto(p.id, p.nome)} 
                          style={{ background: '#ff4d4d', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                          title="Apagar Produto"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                  {todosProdutos.length === 0 && (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>Nenhum produto cadastrado no momento.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </section>
  );
};

const inputStyle = {
  padding: '12px', 
  borderRadius: '6px', 
  border: '1px solid var(--border)', 
  fontSize: '1rem', 
  background: 'transparent', 
  color: 'var(--text-main)'
};

export default Dashboard;