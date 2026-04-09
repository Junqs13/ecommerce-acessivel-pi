import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';
import BannersDestaque from './components/BannersDestaque';
import Vitrine from './components/Vitrine';
import Blog from './components/Blog';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Carrinho from './components/Carrinho';
import LoginCliente from './components/LoginCliente';
import BarraAcessibilidade from './components/BarraAcessibilidade';

const RotaProtegida = ({ children }) => {
  const token = localStorage.getItem('token_pi');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const MenuNavegacao = ({ qtdCarrinho }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token_pi');

  const fazerLogout = () => {
    localStorage.removeItem('token_pi');
    localStorage.removeItem('usuario_pi');
    navigate('/login');
  };

  return (
    <header role="banner" className="header-nav" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', gap: '15px' }}>
      
      <h2 style={{ margin: 0, color: '#f39c12', textShadow: '1px 1px 2px #000', flex: '1 1 250px', textAlign: 'center' }}>
        🎸 Kaio Music Store
      </h2>
      
      <nav aria-label="Navegação Principal" style={{ flex: '1 1 auto' }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '15px', margin: 0, padding: 0, alignItems: 'center', justifyContent: 'center' }}>
          <li><Link to="/" aria-label="Ir para a página da loja">🏪 Loja</Link></li>
          <li><Link to="/blog" aria-label="Acessar o Blog">📰 Blog</Link></li>
          <li>
            <Link to="/carrinho" style={{ color: 'var(--accent)' }}>
              🛒 Carrinho ({qtdCarrinho})
            </Link>
          </li>
          
          {!token ? (
            <li><Link to="/login" style={{ color: '#fff', border: '1px solid #fff' }}>🔐 Entrar</Link></li>
          ) : (
            <>
              <li><Link to="/admin">⚙️ Painel Admin</Link></li>
              <li><button onClick={fazerLogout} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>Sair</button></li>
            </>
          )}
        </ul>
      </nav>
      
    </header>
  );
};

function App() {
  const [carrinho, setCarrinho] = useState([]);

  return (
    <Router>
      <div className="App">
        <BarraAcessibilidade />
        <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
        <MenuNavegacao qtdCarrinho={carrinho.length} />
        
        <div>
          <Routes>
            <Route path="/" element={<Vitrine carrinho={carrinho} setCarrinho={setCarrinho} />} />
            <Route path="/carrinho" element={<Carrinho carrinho={carrinho} setCarrinho={setCarrinho} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login-cliente" element={<LoginCliente />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:artigo" element={<Blog />} /> 
            
            <Route path="/admin" element={
              <RotaProtegida>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                  <Dashboard />
                </div>
              </RotaProtegida>
            } />
          </Routes>
        </div>
        <BannersDestaque />
        <Footer />
      </div>
    </Router>
  );
}

export default App;