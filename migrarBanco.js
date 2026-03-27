const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function fazerMudanca() {
    try {
        console.log('Iniciando a criação das tabelas na nuvem...');

        // 1. Cria a tabela de Produtos
        await db.query(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                categoria VARCHAR(50) NOT NULL,
                preco DECIMAL(10, 2) NOT NULL,
                estoque INT NOT NULL,
                descricao TEXT,
                imagem_url VARCHAR(255)
            )
        `);
        console.log('✅ Tabela de produtos criada!');

        // 2. Cria a tabela de Usuários
        await db.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                senha VARCHAR(255) NOT NULL,
                tipo ENUM('admin', 'cliente') DEFAULT 'cliente'
            )
        `);
        console.log('✅ Tabela de usuários criada!');

        // 3. Verifica se já existem produtos. Se não, insere os 24 instrumentos.
        const [produtosExistentes] = await db.query('SELECT COUNT(*) as total FROM produtos');
        
        if (produtosExistentes[0].total === 0) {
            console.log('Injetando os 24 instrumentos musicais...');
            await db.query(`
                INSERT INTO produtos (nome, categoria, preco, estoque, descricao, imagem_url) VALUES
                ('Guitarra Stratocaster Fender', 'Cordas', 4500.00, 5, 'Guitarra clássica com timbre brilhante e estojo.', '/imagens/guitarra.jpg'),
                ('Bateria Acústica Pearl', 'Percussão', 6200.00, 3, 'Bateria completa com ferragens e pratos inclusos.', '/imagens/bateria.jpg'),
                ('Teclado Sintetizador Yamaha', 'Teclas', 3100.00, 8, 'Teclado arranjador profissional com centenas de timbres.', '/imagens/teclado.jpg'),
                ('Microfone Condensador Shure', 'Áudio', 1200.00, 15, 'Microfone ideal para gravação de voz em estúdio.', '/imagens/microfone.jpg'),
                ('Violão Acústico Yamaha', 'Cordas', 1500.00, 12, 'Violão clássico com cordas de nylon, ideal para iniciantes.', '/imagens/violao.jpg'),
                ('Baixo Elétrico Tagima 4 Cordas', 'Cordas', 1800.00, 7, 'Baixo versátil com excelente captação ativa.', '/imagens/baixo.jpg'),
                ('Piano Digital Casio', 'Teclas', 4200.00, 4, 'Piano digital com 88 teclas sensitivas e pedal.', '/imagens/piano.jpg'),
                ('Controladora DJ Pioneer', 'Áudio', 2500.00, 6, 'Controladora de 2 canais perfeita para mixagens.', '/imagens/dj.jpg'),
                ('Saxofone Alto Yamaha', 'Sopro', 6500.00, 3, 'Saxofone com acabamento laqueado dourado.', '/imagens/saxofone.jpg'),
                ('Flauta Transversal Eagle', 'Sopro', 850.00, 15, 'Flauta com chaves fechadas e acabamento prateado.', '/imagens/flauta.jpg'),
                ('Cajon Acústico FSA', 'Percussão', 350.00, 20, 'Cajon inclinado com esteira, som grave profundo.', '/imagens/cajon.jpg'),
                ('Interface de Áudio Focusrite', 'Áudio', 1350.00, 10, 'Interface USB de 2 entradas e 2 saídas.', '/imagens/interface.jpg'),
                ('Fone de Ouvido AKG', 'Áudio', 450.00, 25, 'Fone de referência para mixagem, design fechado.', '/imagens/fone.jpg'),
                ('Pedal de Efeito Boss Distortion', 'Acessórios', 650.00, 14, 'O clássico pedal de distorção encorpada.', '/imagens/pedal.jpg'),
                ('Encordoamento Elixir Guitarra', 'Acessórios', 120.00, 50, 'Cordas de alta durabilidade com revestimento.', '/imagens/cordas.jpg'),
                ('Trompete Shelter', 'Sopro', 1100.00, 5, 'Trompete em Si bemol com estojo luxo.', '/imagens/trompete.jpg'),
                ('Violino Hofner 4/4', 'Cordas', 1300.00, 8, 'Violino clássico com arco e breu, tampo maciço.', '/imagens/violino.jpg'),
                ('Bateria Eletrônica Roland', 'Percussão', 7800.00, 2, 'Bateria com pads de mesh head super realista.', '/imagens/bateria-eletronica.jpg'),
                ('Sintetizador Korg Minilogue', 'Teclas', 4500.00, 3, 'Sintetizador analógico polifônico de 4 vozes.', '/imagens/sintetizador.jpg'),
                ('Microfone Dinâmico Sennheiser', 'Áudio', 850.00, 18, 'Microfone robusto para vocais ao vivo.', '/imagens/microfone-dinamico.jpg'),
                ('Gaita Hohner Marine Band', 'Sopro', 320.00, 30, 'Gaita diatônica clássica, padrão para Blues.', '/imagens/gaita.jpg'),
                ('Ukulele Soprano Kalani', 'Cordas', 250.00, 22, 'Ukulele construído em mogno com som brilhante.', '/imagens/ukulele.jpg'),
                ('Caixa Ativa JBL 15 Polegadas', 'Áudio', 2800.00, 6, 'Caixa de som amplificada com Bluetooth e 300W.', '/imagens/caixa.jpg'),
                ('Pandeiro Contemporânea Luthier', 'Percussão', 280.00, 15, 'Pandeiro de couro super leve, ideal para samba.', '/imagens/pandeiro.jpg')
            `);
            console.log('✅ Instrumentos injetados com sucesso!');
        }

        console.log('🎉 Tudo pronto! O seu banco de dados na nuvem está completo e pronto para uso.');
        process.exit(0);

    } catch (erro) {
        console.error('❌ Erro durante a migração:', erro);
        process.exit(1);
    }
}

fazerMudanca();