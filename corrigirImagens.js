const db = require('./src/config/db');

async function corrigirExtensao() {
    try {
        console.log('Conectando ao banco na nuvem...');
        // O comando REPLACE vai trocar todos os .jpg por .png de uma vez só!
        await db.query("UPDATE produtos SET imagem_url = REPLACE(imagem_url, '.jpg', '.png')");
        console.log('✅ Sucesso! Todas as 24 imagens foram atualizadas para .png no banco de dados!');
        process.exit(0);
    } catch (erro) {
        console.error('❌ Erro:', erro);
        process.exit(1);
    }
}

corrigirExtensao();