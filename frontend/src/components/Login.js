import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [modoLogin, setModoLogin] = useState(true); // Alterna entre Login e Cadastro
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    // Define para qual rota da API vamos mandar os dados
    const endpoint = modoLogin ? '/api/usuarios/login' : '/api/usuarios/registrar';
    
    // Monta os dados. No cadastro, vamos forçar o tipo 'admin' para testarmos o painel
    const corpoRequisicao = modoLogin 
      ? { email, senha } 
      : { nome, email, senha, tipo: 'admin' };

    try {
      const resposta = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpoRequisicao)
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro ao processar a requisição.');
      }

      if (modoLogin) {
        // Sucesso no Login: Salva o token no navegador e vai para o painel
        localStorage.setItem('token_pi', dados.token);
        localStorage.setItem('usuario_pi', JSON.stringify(dados.usuario));
        navigate('/admin');
      } else {
        // Sucesso no Cadastro: Avisa o usuário e muda para a tela de entrar
        setSucesso('Cadastro realizado com sucesso! Agora você pode fazer o login.');
        setModoLogin(true);
        setNome('');
        setSenha('');
      }
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <main aria-labelledby="titulo-auth" className="container" style={{ maxWidth: '500px', marginTop: '50px' }}>
      <section style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)' }}>
        <h2 id="titulo-auth" style={{ textAlign: 'center', color: 'var(--primary-color)' }}>
          {modoLogin ? 'Acesso Restrito' : 'Cadastrar Novo Administrador'}
        </h2>

        {erro && <div role="alert" style={{ color: 'white', backgroundColor: '#dc3545', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{erro}</div>}
        {sucesso && <div role="alert" style={{ color: 'white', backgroundColor: 'var(--accent-color)', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{sucesso}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {!modoLogin && (
            <div>
              <label htmlFor="nome" style={{ fontWeight: 'bold' }}>Nome Completo:</label>
              <input 
                id="nome" 
                type="text" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                required={!modoLogin}
                style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" style={{ fontWeight: 'bold' }}>E-mail:</label>
            <input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label htmlFor="senha" style={{ fontWeight: 'bold' }}>Senha:</label>
            <input 
              id="senha" 
              type="password" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              required
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
            {modoLogin ? 'Entrar no Painel' : 'Finalizar Cadastro'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            onClick={() => setModoLogin(!modoLogin)} 
            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', textDecoration: 'underline', cursor: 'pointer', fontSize: '1rem' }}
          >
            {modoLogin ? 'Não tem conta? Cadastre-se aqui.' : 'Já tem conta? Faça login.'}
          </button>
        </div>
      </section>
    </main>
  );
};

export default Login;