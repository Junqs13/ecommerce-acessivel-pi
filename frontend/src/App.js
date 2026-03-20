import React from 'react';
import Vitrine from './components/Vitrine';

function App() {
  return (
    <div className="App">
      <header role="banner" style={{ backgroundColor: '#222', color: 'white', padding: '10px 20px' }}>
        <h2>E-commerce Acessível - PI</h2>
      </header>
      <Vitrine />
    </div>
  );
}

export default App;