import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Vitrine from './components/Vitrine';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

// Componente para proteger as rotas do lojista
const RotaProtegida = ({ children }) => {
  const token = localStorage.getItem('token_pi');
  // Se não tem token, redireciona para a tela de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // Se tem token, deixa a pessoa acessar o painel (children)
  return children;
};

// Componente do Menu para lidar com o botão de Sair (Logout)
const MenuNavegacao = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token_pi');

  const fazerLogout = () => {
    localStorage.removeItem('token_pi');
    localStorage.removeItem('usuario_pi');
    navigate('/login');
  };

  return (
    <header role="banner" className="header-nav">
      <h2>E-commerce Acessível - PI</h2>
      <nav aria-label="Navegação Principal">
        <ul style={{ listStyle: 'none', display: 'flex', gap: '20px', margin: 0, padding: 0, alignItems: 'center' }}>
          <li>
            <Link to="/" aria-label="Ir para a página da loja">🏪 Loja (Cliente)</Link>
          </li>
          
          {!token ? (
            <li>
              <Link to="/login" style={{ color: 'var(--focus-ring)' }} aria-label="Fazer login no painel">🔐 Entrar</Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/admin" style={{ color: 'var(--focus-ring)' }} aria-label="Ir para o painel de controle">⚙️ Painel Admin</Link>
              </li>
              <li>
                <button onClick={fazerLogout} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
                  Sair
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <MenuNavegacao />
        
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Vitrine />} />
            <Route path="/login" element={<Login />} />
            
            {/* A rota /admin agora está envolvida pela RotaProtegida */}
            <Route path="/admin" element={
              <RotaProtegida>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                  <Dashboard />
                </div>
              </RotaProtegida>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;