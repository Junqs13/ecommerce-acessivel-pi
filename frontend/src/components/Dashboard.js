import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'react-toastify';

const CORES = ['#004494', '#218838', '#e1b12c', '#c0392b', '#8e44ad', '#d35400'];

const Dashboard = () => {
  const [abaAtiva, setAbaAtiva] = useState('estatisticas');
  const [dadosEstatisticos, setDadosEstatisticos] = useState({});
  const [produtosBaixoEstoque, setProdutosBaixoEstoque] = useState([]);
  const [todosProdutos, setTodosProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]); // NOVO: Estado para armazenar as vendas
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState(false);

  const [editandoId, setEditandoId] = useState(null);
  const [novoProduto, setNovoProduto] = useState({
    nome: '', descricao: '', preco: '', categoria: 'Cordas', imagem_url: '', quantidade: ''
  });

  const carregarDados = () => {
    setCarregando(true);
    const fetchEstatisticas = fetch('https://api-ecommerce-oficial.onrender.com/api/produtos/estatisticas').then(res => res.json());
    const fetchProdutos = fetch('https://api-ecommerce-oficial.onrender.com/api/produtos').then(res => res.json());
    
    // NOVO: Busca a lista de pedidos/vendas. Se a rota ainda não existir, retorna array vazio para não quebrar.
    const fetchPedidos = fetch('https://api-ecommerce-oficial.onrender.com/api/pedidos')
      .then(res => res.ok ? res.json() : [])
      .catch(() => []);

    Promise.all([fetchEstatisticas, fetchProdutos, fetchPedidos])
      .then(([estatisticas, listaProdutos, listaPedidos]) => {
        if (estatisticas.geral && estatisticas.porCategoria) setDadosEstatisticos(estatisticas);
        else setErroApi(true);

        if (Array.isArray(listaProdutos)) {
          setTodosProdutos(listaProdutos);
          const baixoEstoque = listaProdutos.filter(p => {
            const qtd = p.quantidade !== undefined ? p.quantidade : p.estoque;
            return qtd !== null && qtd < 5;
          });
          setProdutosBaixoEstoque(baixoEstoque);
        }

        // NOVO: Guarda os pedidos no estado
        if (Array.isArray(listaPedidos)) {
          setPedidos(listaPedidos);
        }

        setCarregando(false);
      })
      .catch(() => { setErroApi(true); setCarregando(false); });
  };

  useEffect(() => { carregarDados(); }, []);

  const handleImagemUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNovoProduto({ ...novoProduto, imagem_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalvarProduto = async (e) => {
    e.preventDefault();
    try {
      const url = editandoId 
        ? `https://api-ecommerce-oficial.onrender.com/api/produtos/${editandoId}` 
        : 'https://api-ecommerce-oficial.onrender.com/api/produtos';
      
      const method = editandoId ? 'PUT' : 'POST';

      const resposta = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto)
      });

      if (resposta.ok) {
        toast.success(editandoId ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!');
        setNovoProduto({ nome: '', descricao: '', preco: '', categoria: 'Cordas', imagem_url: '', quantidade: '' });
        setEditandoId(null);
        carregarDados();
      } else {
        const erro = await resposta.json();
        toast.error(erro.erro || 'Erro ao guardar produto.');
      }
    } catch (error) {
      toast.error('Erro de conexão ao comunicar com a API.');
    }
  };

  const handleEditar = (produto) => {
    setEditandoId(produto.id);
    setNovoProduto({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      categoria: produto.categoria,
      imagem_url: produto.imagem_url,
      quantidade: produto.quantidade !== undefined ? produto.quantidade : produto.estoque
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletar = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${nome}"?`)) return;
    try {
      const resposta = await fetch(`https://api-ecommerce-oficial.onrender.com/api/produtos/${id}`, { method: 'DELETE' });
      if (resposta.ok) { toast.success('Produto removido!'); carregarDados(); } 
      else { toast.error('Erro ao remover.'); }
    } catch (error) { toast.error('Erro de conexão.'); }
  };

  // NOVO: Função para atualizar o estado da encomenda (Aguardando Pagamento -> Enviado)
  const handleAtualizarStatusPedido = async (id, novoStatus) => {
    try {
      const resposta = await fetch(`https://api-ecommerce-oficial.onrender.com/api/pedidos/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
      });

      if (resposta.ok) {
        toast.success('Estado da encomenda atualizado!');
        carregarDados(); // Recarrega a tabela de vendas
      } else {
        toast.error('Erro ao atualizar o estado da encomenda.');
      }
    } catch (error) {
      toast.error('Erro de conexão com a API.');
    }
  };

  if (carregando) return <p style={{ textAlign: 'center', marginTop: '50px' }}>A carregar dados do painel...</p>;
  if (erroApi) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}><h2>Erro de Comunicação</h2></div>;

  const porCategoria = dadosEstatisticos.porCategoria || [];
  const geral = dadosEstatisticos.geral || {};

  return (
    <section aria-labelledby="titulo-dashboard" style={{ padding: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border)', paddingBottom: '15px', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 id="titulo-dashboard" style={{ color: 'var(--primary)', margin: 0 }}>⚙️ Painel de Administração</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setAbaAtiva('estatisticas')} style={{ padding: '10px 20px', fontWeight: 'bold', border: '1px solid var(--border)', borderRadius: '5px', cursor: 'pointer', background: abaAtiva === 'estatisticas' ? 'var(--primary)' : 'var(--bg-card)', color: abaAtiva === 'estatisticas' ? '#fff' : 'var(--text-main)' }}>
            📊 Estatísticas
          </button>
          <button onClick={() => { setAbaAtiva('catalogo'); setEditandoId(null); setNovoProduto({nome:'', descricao:'', preco:'', categoria:'Cordas', imagem_url:'', quantidade:''}); }} style={{ padding: '10px 20px', fontWeight: 'bold', border: '1px solid var(--border)', borderRadius: '5px', cursor: 'pointer', background: abaAtiva === 'catalogo' ? 'var(--primary)' : 'var(--bg-card)', color: abaAtiva === 'catalogo' ? '#fff' : 'var(--text-main)' }}>
            📦 Gestão de Catálogo
          </button>
          {/* NOVO BOTÃO DA ABA DE VENDAS */}
          <button onClick={() => setAbaAtiva('vendas')} style={{ padding: '10px 20px', fontWeight: 'bold', border: '1px solid var(--border)', borderRadius: '5px', cursor: 'pointer', background: abaAtiva === 'vendas' ? 'var(--primary)' : 'var(--bg-card)', color: abaAtiva === 'vendas' ? '#fff' : 'var(--text-main)' }}>
            🛍️ Gestão de Vendas
          </button>
        </div>
      </div>

      {/* ABA 1: ESTATÍSTICAS */}
      {abaAtiva === 'estatisticas' && (
        <div>
          {produtosBaixoEstoque.length > 0 && (
            <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '15px 20px', borderRadius: '8px', borderLeft: '5px solid #ffeeba', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>⚠️ Atenção: Produtos com Estoque Crítico</h3>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {produtosBaixoEstoque.map((p, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}><strong>{p.nome}</strong> — Restam apenas <span style={{ color: '#c0392b', fontWeight: 'bold' }}>{p.quantidade !== undefined ? p.quantidade : p.estoque}</span> unidades.</li>
                ))}
              </ul>
            </div>
          )}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
            <div style={{ flex: '1', minWidth: '200px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #004494' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--text-muted)' }}>Modelos de Instrumentos</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{geral.total_produtos || 0}</p>
            </div>
            <div style={{ flex: '1', minWidth: '200px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #218838' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--text-muted)' }}>Volume Total no Armazém</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#218838' }}>{geral.total_itens || 0} peças</p>
            </div>
            <div style={{ flex: '1', minWidth: '200px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #e1b12c' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--text-muted)' }}>Património em Stock</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#d35400' }}>R$ {parseFloat(geral.patrimonio_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: CATÁLOGO (Inalterado) */}
      {abaAtiva === 'catalogo' && (
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', height: 'fit-content' }}>
            <h3 style={{ marginTop: 0, color: editandoId ? '#d35400' : 'inherit' }}>
              {editandoId ? `✏️ A editar: ${novoProduto.nome}` : '➕ Adicionar Novo Instrumento'}
            </h3>
            
            <form onSubmit={handleSalvarProduto} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Nome do Produto" required value={novoProduto.nome} onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})} style={inputStyle} />
              <textarea placeholder="Descrição..." required value={novoProduto.descricao} onChange={(e) => setNovoProduto({...novoProduto, descricao: e.target.value})} style={{...inputStyle, minHeight: '80px'}} />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Preço (R$):</label><input type="number" step="0.01" required value={novoProduto.preco} onChange={(e) => setNovoProduto({...novoProduto, preco: e.target.value})} style={inputStyle} /></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Stock:</label><input type="number" required value={novoProduto.quantidade} onChange={(e) => setNovoProduto({...novoProduto, quantidade: e.target.value})} style={inputStyle} /></div>
              </div>

              <div>
                <label style={labelStyle}>Categoria:</label>
                <select required value={novoProduto.categoria} onChange={(e) => setNovoProduto({...novoProduto, categoria: e.target.value})} style={{...inputStyle, width: '100%'}}>
                  <option value="Cordas">Cordas</option><option value="Teclas">Teclas</option><option value="Sopro">Sopro</option><option value="Percussão">Percussão</option><option value="Áudio">Áudio</option><option value="Acessórios">Acessórios</option>
                </select>
              </div>

              <div style={{ border: '1px dashed var(--border)', padding: '10px', borderRadius: '6px' }}>
                <label style={labelStyle}>Imagem (Upload do teu PC):</label>
                <input type="file" accept="image/*" onChange={handleImagemUpload} style={{ width: '100%', padding: '5px' }} />
                <p style={{ textAlign: 'center', margin: '10px 0', fontSize: '0.9rem', fontWeight: 'bold' }}>OU</p>
                <label style={labelStyle}>Cola o Link da Imagem (URL):</label>
                <input type="url" placeholder="https://..." value={novoProduto.imagem_url} onChange={(e) => setNovoProduto({...novoProduto, imagem_url: e.target.value})} style={{...inputStyle, width: '100%'}} />
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-comprar" style={{ flex: 1, padding: '15px', fontSize: '1.1rem' }}>
                  {editandoId ? '💾 Atualizar Produto' : '➕ Guardar no Catálogo'}
                </button>
                {editandoId && (
                  <button type="button" onClick={() => { setEditandoId(null); setNovoProduto({nome:'', descricao:'', preco:'', categoria:'Cordas', imagem_url:'', quantidade:''}); }} style={{ padding: '15px', background: '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div style={{ flex: '2', minWidth: '350px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0 }}>Catálogo Atual</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th>Produto</th><th>Categoria</th><th>Preço</th><th>Stock</th><th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {todosProdutos.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 0', fontWeight: '500' }}>{p.nome}</td>
                      <td><span className="categoria">{p.categoria}</span></td>
                      <td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>R$ {parseFloat(p.preco).toLocaleString('pt-BR')}</td>
                      <td>{p.quantidade !== undefined ? p.quantidade : p.estoque}</td>
                      <td style={{ display: 'flex', gap: '5px', padding: '10px 0' }}>
                        <button onClick={() => handleEditar(p)} style={{ background: '#3498db', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }} title="Editar">✏️</button>
                        <button onClick={() => handleDeletar(p.id, p.nome)} style={{ background: '#ff4d4d', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }} title="Apagar">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* NOVO: ABA 3: GESTÃO DE VENDAS / PEDIDOS */}
      {abaAtiva === 'vendas' && (
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0 }}>Histórico de Encomendas</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '12px 10px' }}>ID</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Total</th>
                  <th>Método</th>
                  <th>Estado</th>
                  <th>Ações (Mudar Estado)</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map(p => {
                  // Define as cores das badges de estado
                  let corFundo = '#fff3cd'; let corTexto = '#856404'; // Amarelo padrão
                  if (p.status === 'Pago' || p.status === 'Enviado') { corFundo = '#cce5ff'; corTexto = '#004085'; } // Azul
                  if (p.status === 'Entregue') { corFundo = '#d4edda'; corTexto = '#155724'; } // Verde
                  if (p.status === 'Cancelado') { corFundo = '#f8d7da'; corTexto = '#721c24'; } // Vermelho

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 'bold', color: 'var(--text-muted)' }}>#{p.id}</td>
                      <td style={{ fontWeight: '500' }}>{p.nome_cliente}</td>
                      <td>{new Date(p.data_pedido).toLocaleDateString('pt-PT')}</td>
                      <td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>R$ {parseFloat(p.total).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                      <td style={{ textTransform: 'uppercase', fontSize: '0.9rem' }}>{p.metodo_pagamento}</td>
                      <td>
                        <span style={{ padding: '5px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', backgroundColor: corFundo, color: corTexto }}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <select 
                          value={p.status} 
                          onChange={(e) => handleAtualizarStatusPedido(p.id, e.target.value)}
                          style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
                        >
                          <option value="Aguardando Pagamento">Aguardando Pagamento</option>
                          <option value="Pago">Pago / A Processar</option>
                          <option value="Enviado">Enviado</option>
                          <option value="Entregue">Entregue</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
                {pedidos.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>Ainda não foram realizadas vendas na plataforma.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </section>
  );
};

const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '1rem', background: 'transparent', color: 'var(--text-main)', width: '100%', boxSizing: 'border-box' };
const labelStyle = { fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '5px' };

export default Dashboard;