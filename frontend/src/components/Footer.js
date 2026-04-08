import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: '#1e272e', 
      color: '#d2dae2', 
      padding: '50px 20px 20px', 
      marginTop: '60px', 
      borderTop: '5px solid #f39c12',
      boxShadow: '0 -4px 10px rgba(0,0,0,0.2)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        gap: '30px' 
      }}>
        
        {/* Coluna 1: Marca e Sobre */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <h3 style={{ color: '#f39c12', fontSize: '1.5rem', marginBottom: '15px' }}>🎸 Kaio Music Store</h3>
          <p style={{ lineHeight: '1.6' }}>
            A sua jornada musical começa aqui. Oferecemos os melhores instrumentos, áudio profissional e acessórios para músicos de todos os níveis.
          </p>
        </div>
        
        {/* Coluna 2: Endereço (Fictício/PI) */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <h4 style={{ color: '#fff', borderBottom: '2px solid #f39c12', paddingBottom: '10px', display: 'inline-block' }}>📍 Onde Estamos</h4>
          <p style={{ marginTop: '15px', lineHeight: '1.6' }}>
            Av. das Nações Unidas, 1234<br />
            Conjunto Nacional, Loja 42<br />
            São Paulo - SP, 01000-000
          </p>
        </div>

        {/* Coluna 3: Fale Conosco */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <h4 style={{ color: '#fff', borderBottom: '2px solid #f39c12', paddingBottom: '10px', display: 'inline-block' }}>📞 Fale Conosco</h4>
          <div style={{ marginTop: '15px', lineHeight: '1.6' }}>
            <p><strong>E-mail:</strong> contato@kaiomusicstore.com.br</p>
            <p><strong>WhatsApp:</strong> (11) 99999-8888</p>
            <p><strong>Horário:</strong> Seg. a Sex. das 09h às 18h</p>
          </div>
        </div>

      </div>

      {/* Faixa de Direitos Autorais */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '40px', 
        paddingTop: '20px', 
        borderTop: '1px solid #485460', 
        fontSize: '0.9rem' 
      }}>
        &copy; {new Date().getFullYear()} Kaio Music Store. Desenvolvido para o Projeto Integrador. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;