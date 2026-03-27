const db = require('./src/config/db');

async function atualizarImagens() {
    try {
        console.log('Sincronizando os nomes das imagens com o banco de dados...');

        const atualizacoes = [
            { id: 1, url: '/imagens/guitar-fender.png' },
            { id: 2, url: '/imagens/bateria.png' },
            { id: 3, url: '/imagens/teclado.png' },
            { id: 4, url: '/imagens/shure.png' },
            { id: 5, url: '/imagens/violao-yamaha.png' },
            { id: 6, url: '/imagens/baixo.png' },
            { id: 7, url: '/imagens/piano-casio.png' },
            { id: 8, url: '/imagens/controladora.png' },
            { id: 9, url: '/imagens/saxofone.png' },
            { id: 10, url: '/imagens/flauta.png' },
            { id: 11, url: '/imagens/cajon.png' },
            { id: 12, url: '/imagens/interface.png' },
            { id: 13, url: '/imagens/fone-akg.png' },
            { id: 14, url: '/imagens/pedal.png' },
            { id: 15, url: '/imagens/cordas.png' },
            { id: 16, url: '/imagens/trompete.png' },
            { id: 17, url: '/imagens/violino.png' },
            { id: 18, url: '/imagens/bateria-eletric.png' },
            { id: 19, url: '/imagens/korg.png' },
            { id: 20, url: '/imagens/microfone-dinamico.png' }, // Corrigido sem o ponto extra
            { id: 21, url: '/imagens/gaita.png' },
            { id: 22, url: '/imagens/ukulele.png' },
            { id: 23, url: '/imagens/caixa.png' },
            { id: 24, url: '/imagens/pandeiro.png' }
        ];

        for (let item of atualizacoes) {
            await db.query('UPDATE produtos SET imagem_url = ? WHERE id = ?', [item.url, item.id]);
        }

        console.log('✅ Sucesso! O Banco de Dados agora sabe o nome exato de todas as suas fotos PNG!');
        process.exit(0);
    } catch (erro) {
        console.error('❌ Erro:', erro);
        process.exit(1);
    }
}

atualizarImagens();