import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginCliente = () => {
  const [modoLogin, setModoLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    const endpoint = modoLogin ? '/api/usuarios/login' : '/api/usuarios/registrar';
    // Repare que não enviamos o 'tipo'. O backend assume 'cliente' por defeito.
    const corpoRequisicao = modoLogin ? { email, senha } : { nome, email, senha };

    try {
      const resposta = await fetch(`$https://api-ecommerce-pi-ohio.onrender.com{endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpoRequisicao)
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro ao processar a requisição.');
      }

      if (modoLogin) {
        // Guarda as credenciais e volta para o carrinho
        localStorage.setItem('token_pi', dados.token);
        localStorage.setItem('usuario_pi', JSON.stringify(dados.usuario));
        navigate('/carrinho');
      } else {
        alert('Conta criada com sucesso! Por favor, inicie sessão para continuar.');
        setModoLogin(true);
      }
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <main className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
      <section style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '25px' }}>
          {modoLogin ? 'Identificação' : 'Criar Nova Conta'}
        </h2>

        {erro && <div role="alert" style={{ color: 'white', backgroundColor: '#e74c3c', padding: '12px', borderRadius: '6px', marginBottom: '20px', textAlign: 'center' }}>{erro}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {!modoLogin && (
            <div>
              <label htmlFor="nomeCliente" style={{ fontWeight: 'bold' }}>Nome Completo:</label>
              <input 
                id="nomeCliente" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required={!modoLogin}
                style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid var(--border)' }}
              />
            </div>
          )}

          <div>
            <label htmlFor="emailCliente" style={{ fontWeight: 'bold' }}>Correio Eletrónico (E-mail):</label>
            <input 
              id="emailCliente" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid var(--border)' }}
            />
          </div>

          <div>
            <label htmlFor="senhaCliente" style={{ fontWeight: 'bold' }}>Palavra-passe:</label>
            <input 
              id="senhaCliente" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid var(--border)' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '15px', padding: '12px' }}>
            {modoLogin ? 'Iniciar Sessão e Continuar' : 'Registar Conta'}
          </button>
        </form>

        <button 
          onClick={() => setModoLogin(!modoLogin)} 
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer', width: '100%', marginTop: '20px', fontSize: '0.95rem' }}
        >
          {modoLogin ? 'Ainda não é cliente? Crie a sua conta aqui.' : 'Já tem conta? Inicie sessão.'}
        </button>
      </section>
    </main>
  );
};

export default LoginCliente;