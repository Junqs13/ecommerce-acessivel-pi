import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';
import Vitrine from './components/Vitrine';
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

// O Menu recebe a quantidade de itens no carrinho
const MenuNavegacao = ({ qtdCarrinho }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token_pi');

  const fazerLogout = () => {
    localStorage.removeItem('token_pi');
    localStorage.removeItem('usuario_pi');
    navigate('/login');
  };

  return (
    <header role="banner" className="header-nav">
      <h2 style={{ margin: 0, color: '#f39c12', textShadow: '1px 1px 2px #000' }}>🎸 Kaio Music Store</h2>
      <nav aria-label="Navegação Principal">
        <ul style={{ listStyle: 'none', display: 'flex', gap: '20px', margin: 0, padding: 0, alignItems: 'center' }}>
          <li>
            <Link to="/" aria-label="Ir para a página da loja">🏪 Loja</Link>
          </li>
          
          <li>
            <Link to="/carrinho" style={{ color: 'var(--accent)' }}>
              🛒 Carrinho ({qtdCarrinho})
            </Link>
          </li>
          
          {!token ? (
            <li>
              <Link to="/login" style={{ color: '#fff', border: '1px solid #fff' }}>🔐 Entrar</Link>
            </li>
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
        {/* Barra de Acessibilidade */}
        <BarraAcessibilidade />
        
        {/* Container das Notificações Toastify */}
        <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
        
        <MenuNavegacao qtdCarrinho={carrinho.length} />
        
        {/* ÚNICO bloco de Rotas */}
        <div>
          <Routes>
            <Route path="/" element={<Vitrine carrinho={carrinho} setCarrinho={setCarrinho} />} />
            <Route path="/carrinho" element={<Carrinho carrinho={carrinho} setCarrinho={setCarrinho} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login-cliente" element={<LoginCliente />} />
            
            <Route path="/admin" element={
              <RotaProtegida>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                  <Dashboard />
                </div>
              </RotaProtegida>
            } />
          </Routes>
        </div>
        
        {/* Rodapé no final de todas as páginas */}
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;