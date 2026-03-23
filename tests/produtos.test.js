const request = require('supertest');
const app = require('../server');

describe('Bateria de Testes Automatizados - Produtos', () => {
    
    it('Deve listar todos os instrumentos musicais com status 200 (OK)', async () => {
        // O robô do Supertest simula uma requisição GET na rota de produtos
        const resposta = await request(app).get('/api/produtos');
        
        // Verificações (Expectativas)
        expect(resposta.statusCode).toBe(200); // Exige que o servidor responda com sucesso
        expect(Array.isArray(resposta.body)).toBe(true); // Exige que a resposta seja uma lista (Array)
    });

    it('Deve retornar erro 404 para um produto que não existe', async () => {
        // Tenta buscar um produto com ID 99999 (que sabemos que não existe)
        const resposta = await request(app).get('/api/produtos/99999');
        
        expect(resposta.statusCode).toBe(404);
        expect(resposta.body).toHaveProperty('mensagem', 'Instrumento não encontrado.');
    });

});