import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [abaAtiva, setAbaAtiva] = useState('estatisticas');
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState(false);

  const [dadosEstatisticos, setDadosEstatisticos] = useState({});
  const [produtosBaixoEstoque, setProdutosBaixoEstoque] = useState([]);
  const [todosProdutos, setTodosProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [artigos, setArtigos] = useState([]);
  
  const [editandoId, setEditandoId] = useState(null);
  const [novoProduto, setNovoProduto] = useState({ nome: '', descricao: '', preco: '', categoria: 'Cordas', imagem_url: '', quantidade: '' });
  
  // NOVO: Controle de Edição de Artigos
  const [editandoArtigoId, setEditandoArtigoId] = useState(null);
  const [novoArtigo, setNovoArtigo] = useState({ titulo: '', resumo: '', conteudo: '', imagem_url: '' });

  const carregarDados = () => {
    setCarregando(true);
    const fetchEstatisticas = fetch('https://api-ecommerce-oficial.onrender.com/api/produtos/estatisticas').then(res => res.json()).catch(() => ({}));
    const fetchProdutos = fetch('https://api-ecommerce-oficial.onrender.com/api/produtos').then(res => res.json()).catch(() => []);
    const fetchPedidos = fetch('https://api-ecommerce-oficial.onrender.com/api/pedidos').then(res => res.ok ? res.json() : []).catch(() => []);
    const fetchArtigos = fetch('https://api-ecommerce-oficial.onrender.com/api/artigos').then(res => res.ok ? res.json() : []).catch(() => []);

    Promise.all([fetchEstatisticas, fetchProdutos, fetchPedidos, fetchArtigos])
      .then(([estatisticas, listaProdutos, listaPedidos, listaArtigos]) => {
        if (estatisticas.geral) setDadosEstatisticos(estatisticas); else setErroApi(true);
        if (Array.isArray(listaProdutos)) {
          setTodosProdutos(listaProdutos);
          setProdutosBaixoEstoque(listaProdutos.filter(p => (p.quantidade !== undefined ? p.quantidade : p.estoque) !== null && (p.quantidade !== undefined ? p.quantidade : p.estoque) < 5));
        }
        if (Array.isArray(listaPedidos)) setPedidos(listaPedidos);
        if (Array.isArray(listaArtigos)) setArtigos(listaArtigos);
        setCarregando(false);
      })
      .catch(() => { setErroApi(true); setCarregando(false); });
  };

  useEffect(() => { carregarDados(); }, []);

  // --- Funções de Catálogo (Resumidas) ---
  const handleImagemUpload = (e) => {
    const file = e.target.files[0];
    if (file) { const reader = new FileReader(); reader.onloadend = () => setNovoProduto({ ...novoProduto, imagem_url: reader.result }); reader.readAsDataURL(file); }
  };
  const handleSalvarProduto = async (e) => {
    e.preventDefault();
    try {
      const url = editandoId ? `https://api-ecommerce-oficial.onrender.com/api/produtos/${editandoId}` : 'https://api-ecommerce-oficial.onrender.com/api/produtos';
      const method = editandoId ? 'PUT' : 'POST';
      const resposta = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(novoProduto) });
      if (resposta.ok) { toast.success(editandoId ? 'Produto atualizado!' : 'Produto adicionado!'); setNovoProduto({ nome: '', descricao: '', preco: '', categoria: 'Cordas', imagem_url: '', quantidade: '' }); setEditandoId(null); carregarDados(); } 
      else { toast.error('Erro ao guardar produto.'); }
    } catch (error) { toast.error('Erro de conexão.'); }
  };
  const handleEditar = (produto) => { setEditandoId(produto.id); setNovoProduto({ nome: produto.nome, descricao: produto.descricao, preco: produto.preco, categoria: produto.categoria, imagem_url: produto.imagem_url, quantidade: produto.quantidade !== undefined ? produto.quantidade : produto.estoque }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleDeletar = async (id, nome) => { if (!window.confirm(`Tem certeza que deseja excluir "${nome}"?`)) return; try { const resposta = await fetch(`https://api-ecommerce-oficial.onrender.com/api/produtos/${id}`, { method: 'DELETE' }); if (resposta.ok) { toast.success('Removido!'); carregarDados(); } } catch (error) {} };
  const handleAtualizarStatusPedido = async (id, novoStatus) => { try { const resposta = await fetch(`https://api-ecommerce-oficial.onrender.com/api/pedidos/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: novoStatus }) }); if (resposta.ok) { toast.success('Status atualizado!'); carregarDados(); } } catch (error) {} };

  // --- Funções do Blog ---
  const handleSalvarArtigo = async (e) => {
    e.preventDefault();
    try {
      const url = editandoArtigoId ? `https://api-ecommerce-oficial.onrender.com/api/artigos/${editandoArtigoId}` : 'https://api-ecommerce-oficial.onrender.com/api/artigos';
      const method = editandoArtigoId ? 'PUT' : 'POST';

      const resposta = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoArtigo)
      });
      if (resposta.ok) {
        toast.success(editandoArtigoId ? 'Artigo atualizado!' : 'Artigo publicado!');
        setNovoArtigo({ titulo: '', resumo: '', conteudo: '', imagem_url: '' });
        setEditandoArtigoId(null);
        carregarDados(); 
      } else {
        toast.error('Erro. Verifique se o título já não existe.');
      }
    } catch (error) { toast.error('Erro de conexão com a API do Blog.'); }
  };

  // NOVO: Função para preencher o formulário para edição
  const handleEditarArtigo = (artigo) => {
    setEditandoArtigoId(artigo.id);
    setNovoArtigo({
      titulo: artigo.titulo,
      resumo: artigo.resumo,
      conteudo: artigo.conteudo,
      imagem_url: artigo.imagem_url || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletarArtigo = async (id, titulo) => {
    if (!window.confirm(`Tem certeza que deseja apagar o artigo "${titulo}"?`)) return;
    try {
      const resposta = await fetch(`https://api-ecommerce-oficial.onrender.com/api/artigos/${id}`, { method: 'DELETE' });
      if (resposta.ok) { toast.success('Artigo apagado!'); carregarDados(); }
    } catch (error) { toast.error('Erro de conexão.'); }
  };

  if (carregando) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>⏳ A carregar a Central de Comando...</div>;
  if (erroApi) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}><h2>⚠️ Erro de Comunicação com a API</h2></div>;

  const geral = dadosEstatisticos.geral || {};
  const porCategoria = dadosEstatisticos.porCategoria || [];

  return (
    <section aria-labelledby="titulo-dashboard" style={{ padding: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border)', paddingBottom: '15px', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 id="titulo-dashboard" style={{ color: 'var(--primary)', margin: 0 }}>⚙️ Painel de Administração</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setAbaAtiva('estatisticas')} style={{ padding: '10px 20px', fontWeight: 'bold', border: '1px solid var(--border)', borderRadius: '5px', cursor: 'pointer', background: abaAtiva === 'estatisticas' ? 'var(--primary)' : 'var(--bg-card)', color: abaAtiva === 'estatisticas' ? '#fff' : 'var(--text-main)' }}>📊 Estatísticas</button>
          <button onClick={() => { setAbaAtiva('catalogo'); setEditandoId(null); setNovoProduto({nome:'', descricao:'', preco:'', categoria:'Cordas', imagem_url:'', quantidade:''}); }} style={{ padding: '10px 20px', fontWeight: 'bold', border: '1px solid var(--border)', borderRadius: '5px', cursor: 'pointer', background: abaAtiva === 'catalogo' ? 'var(--primary)' : 'var(--bg-card)', color: abaAtiva === 'catalogo' ? '#fff' : 'var(--text-main)' }}>📦 Catálogo</button>
          <button onClick={() => setAbaAtiva('vendas')} style={{ padding: '10px 20px', fontWeight: 'bold', border: '1px solid var(--border)', borderRadius: '5px', cursor: 'pointer', background: abaAtiva === 'vendas' ? 'var(--primary)' : 'var(--bg-card)', color: abaAtiva === 'vendas' ? '#fff' : 'var(--text-main)' }}>🛍️ Vendas</button>
          <button onClick={() => { setAbaAtiva('blog'); setEditandoArtigoId(null); setNovoArtigo({titulo:'', resumo:'', conteudo:'', imagem_url:''}); }} style={{ padding: '10px 20px', fontWeight: 'bold', border: '1px solid var(--border)', borderRadius: '5px', cursor: 'pointer', background: abaAtiva === 'blog' ? 'var(--primary)' : 'var(--bg-card)', color: abaAtiva === 'blog' ? '#fff' : 'var(--text-main)' }}>📝 Blog</button>
        </div>
      </div>

      {/* ABA 1: ESTATÍSTICAS */}
      {abaAtiva === 'estatisticas' && (
        <div>
          {produtosBaixoEstoque.length > 0 && (<div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '15px 20px', borderRadius: '8px', borderLeft: '5px solid #ffeeba', marginBottom: '20px' }}><h3 style={{ margin: '0 0 10px 0' }}>⚠️ Produtos com Estoque Crítico</h3><ul style={{ margin: 0, paddingLeft: '20px' }}>{produtosBaixoEstoque.map((p, index) => (<li key={index}><strong>{p.nome}</strong> — Restam <span style={{ color: '#c0392b', fontWeight: 'bold' }}>{p.quantidade !== undefined ? p.quantidade : p.estoque}</span> unidades.</li>))}</ul></div>)}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}><div style={{ flex: '1', minWidth: '200px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #004494' }}><h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--text-muted)' }}>Modelos de Instrumentos</h3><p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{geral.total_produtos || 0}</p></div><div style={{ flex: '1', minWidth: '200px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #218838' }}><h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--text-muted)' }}>Volume em Armazém</h3><p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#218838' }}>{geral.total_itens || 0} peças</p></div><div style={{ flex: '1', minWidth: '200px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #e1b12c' }}><h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--text-muted)' }}>Patrimônio Projetado</h3><p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#d35400' }}>R$ {parseFloat(geral.patrimonio_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div></div>
          {porCategoria.length > 0 && (<div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}><h3 style={{ marginTop: 0, marginBottom: '20px' }}>Distribuição do Catálogo</h3><div style={{ width: '100%', height: '300px' }}><ResponsiveContainer width="100%" height="100%"><BarChart data={porCategoria} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="categoria" stroke="var(--text-main)" /><YAxis stroke="var(--text-main)" /><Tooltip cursor={{fill: 'rgba(0,0,0,0.1)'}} /><Legend /><Bar dataKey="quantidade_modelos" name="Qtd. Modelos" fill="#004494" radius={[5, 5, 0, 0]} /><Bar dataKey="total_pecas_estoque" name="Peças Físicas" fill="#e1b12c" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></div>)}
        </div>
      )}

      {/* ABA 2: CATÁLOGO */}
      {abaAtiva === 'catalogo' && (
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px' }}><h3 style={{ marginTop: 0, color: editandoId ? '#d35400' : 'inherit' }}>{editandoId ? `✏️ A editar: ${novoProduto.nome}` : '➕ Novo Instrumento'}</h3><form onSubmit={handleSalvarProduto} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}><input type="text" placeholder="Nome" required value={novoProduto.nome} onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})} style={inputStyle} /><textarea placeholder="Descrição..." required value={novoProduto.descricao} onChange={(e) => setNovoProduto({...novoProduto, descricao: e.target.value})} style={{...inputStyle, minHeight: '80px'}} /><div style={{ display: 'flex', gap: '10px' }}><div style={{ flex: 1 }}><label style={labelStyle}>Preço (R$):</label><input type="number" step="0.01" required value={novoProduto.preco} onChange={(e) => setNovoProduto({...novoProduto, preco: e.target.value})} style={inputStyle} /></div><div style={{ flex: 1 }}><label style={labelStyle}>Estoque:</label><input type="number" required value={novoProduto.quantidade} onChange={(e) => setNovoProduto({...novoProduto, quantidade: e.target.value})} style={inputStyle} /></div></div><div><label style={labelStyle}>Categoria:</label><select required value={novoProduto.categoria} onChange={(e) => setNovoProduto({...novoProduto, categoria: e.target.value})} style={{...inputStyle, width: '100%'}}><option value="Cordas">Cordas</option><option value="Teclas">Teclas</option><option value="Sopro">Sopro</option><option value="Percussão">Percussão</option><option value="Acessórios">Acessórios</option></select></div><div style={{ border: '1px dashed var(--border)', padding: '10px', borderRadius: '6px' }}><label style={labelStyle}>Imagem (Upload):</label><input type="file" accept="image/*" onChange={handleImagemUpload} style={{ width: '100%', padding: '5px', marginBottom:'10px' }} /><label style={labelStyle}>Ou Link da Imagem (URL):</label><input type="url" placeholder="https://..." value={novoProduto.imagem_url} onChange={(e) => setNovoProduto({...novoProduto, imagem_url: e.target.value})} style={{...inputStyle, width: '100%'}} /></div><div style={{ display: 'flex', gap: '10px' }}><button type="submit" className="btn btn-comprar" style={{ flex: 1, padding: '15px' }}>{editandoId ? '💾 Atualizar Produto' : '➕ Guardar Produto'}</button>{editandoId && (<button type="button" onClick={() => { setEditandoId(null); setNovoProduto({nome:'', descricao:'', preco:'', categoria:'Cordas', imagem_url:'', quantidade:''}); }} style={{ padding: '15px', background: '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>)}</div></form></div>
          <div style={{ flex: '2', minWidth: '350px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px' }}><h3 style={{ marginTop: 0 }}>Catálogo Atual</h3><div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}><thead><tr style={{ borderBottom: '2px solid var(--border)' }}><th>Produto</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Ações</th></tr></thead><tbody>{todosProdutos.map(p => (<tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '12px 0', fontWeight: '500' }}>{p.nome}</td><td><span className="categoria">{p.categoria}</span></td><td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>R$ {parseFloat(p.preco).toLocaleString('pt-BR')}</td><td>{p.quantidade !== undefined ? p.quantidade : p.estoque}</td><td style={{ display: 'flex', gap: '5px', padding: '10px 0' }}><button onClick={() => handleEditar(p)} style={{ background: '#3498db', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>✏️</button><button onClick={() => handleDeletar(p.id, p.nome)} style={{ background: '#ff4d4d', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button></td></tr>))}</tbody></table></div></div>
        </div>
      )}

      {/* ABA 3: VENDAS */}
      {abaAtiva === 'vendas' && (
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{ marginTop: 0 }}>Histórico de Encomendas</h3>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}><thead><tr style={{ borderBottom: '2px solid var(--border)' }}><th style={{ padding: '12px 10px' }}>ID</th><th>Cliente</th><th>Data</th><th>Total</th><th>Método</th><th>Estado Atual</th><th>Alterar Estado</th></tr></thead><tbody>{pedidos.map(p => {let corFundo = '#fff3cd'; let corTexto = '#856404'; if (p.status === 'Pago' || p.status === 'Enviado') { corFundo = '#cce5ff'; corTexto = '#004085'; } if (p.status === 'Entregue') { corFundo = '#d4edda'; corTexto = '#155724'; } if (p.status === 'Cancelado') { corFundo = '#f8d7da'; corTexto = '#721c24'; } return (<tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '12px 10px', fontWeight: 'bold', color: 'var(--text-muted)' }}>#{p.id}</td><td style={{ fontWeight: '500' }}>{p.nome_cliente}</td><td>{new Date(p.data_pedido).toLocaleDateString('pt-BR')}</td><td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>R$ {parseFloat(p.total).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td><td style={{ textTransform: 'uppercase', fontSize: '0.9rem' }}>{p.metodo_pagamento}</td><td><span style={{ padding: '5px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', backgroundColor: corFundo, color: corTexto }}>{p.status}</span></td><td><select value={p.status} onChange={(e) => handleAtualizarStatusPedido(p.id, e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}><option value="Aguardando Pagamento">Aguardando Pagamento</option><option value="Pago">Pago</option><option value="Enviado">Enviado</option><option value="Entregue">Entregue</option><option value="Cancelado">Cancelado</option></select></td></tr>);})}{pedidos.length === 0 && (<tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>Nenhuma venda registrada.</td></tr>)}</tbody></table></div>
        </div>
      )}

      {/* ================= ABA 4: BLOG COM EDIÇÃO ================= */}
      {abaAtiva === 'blog' && (
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          
          {/* Formulário de Blog */}
          <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', height: 'fit-content' }}>
            <h3 style={{ marginTop: 0, color: editandoArtigoId ? '#d35400' : 'inherit' }}>
              {editandoArtigoId ? `✏️ Editando: ${novoArtigo.titulo}` : '✍️ Escrever Novo Artigo'}
            </h3>
            
            <form onSubmit={handleSalvarArtigo} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div><label style={labelStyle}>Título do Artigo:</label><input type="text" required value={novoArtigo.titulo} onChange={(e) => setNovoArtigo({...novoArtigo, titulo: e.target.value})} placeholder="Ex: A História do Rock" style={inputStyle} /></div>
              <div><label style={labelStyle}>Resumo (Para a vitrine):</label><textarea required value={novoArtigo.resumo} onChange={(e) => setNovoArtigo({...novoArtigo, resumo: e.target.value})} placeholder="Pequeno texto para chamar atenção..." style={{...inputStyle, minHeight: '60px'}} /></div>
              <div><label style={labelStyle}>Conteúdo Completo:</label><textarea required value={novoArtigo.conteudo} onChange={(e) => setNovoArtigo({...novoArtigo, conteudo: e.target.value})} placeholder="Escreva seu texto completo aqui..." style={{...inputStyle, minHeight: '150px'}} /></div>
              <div><label style={labelStyle}>Link da Imagem de Capa:</label><input type="url" value={novoArtigo.imagem_url} onChange={(e) => setNovoArtigo({...novoArtigo, imagem_url: e.target.value})} placeholder="https://..." style={inputStyle} /></div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '15px', fontSize: '1.1rem' }}>
                  {editandoArtigoId ? '💾 Atualizar Artigo' : '🚀 Publicar Artigo'}
                </button>
                {editandoArtigoId && (
                  <button type="button" onClick={() => { setEditandoArtigoId(null); setNovoArtigo({titulo:'', resumo:'', conteudo:'', imagem_url:''}); }} style={{ padding: '15px', background: '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Tabela do Blog */}
          <div style={{ flex: '2', minWidth: '350px', backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0 }}>Artigos Publicados ({artigos.length})</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead><tr style={{ borderBottom: '2px solid var(--border)' }}><th style={{ padding: '10px 0' }}>Título</th><th>Data</th><th>Ações</th></tr></thead>
              <tbody>
                {artigos.map(artigo => (
                  <tr key={artigo.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '15px 0', fontWeight: 'bold' }}>{artigo.titulo}</td>
                    <td>{new Date(artigo.data_publicacao).toLocaleDateString('pt-BR')}</td>
                    <td style={{ display: 'flex', gap: '5px', padding: '10px 0' }}>
                      <button onClick={() => handleEditarArtigo(artigo)} style={{ background: '#3498db', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }} title="Editar Artigo">✏️</button>
                      <button onClick={() => handleDeletarArtigo(artigo.id, artigo.titulo)} style={{ background: '#ff4d4d', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }} title="Apagar Artigo">🗑️</button>
                    </td>
                  </tr>
                ))}
                {artigos.length === 0 && <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>Nenhum artigo publicado no blog.</td></tr>}
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