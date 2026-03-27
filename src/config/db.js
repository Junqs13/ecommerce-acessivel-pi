const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false // Exigência do Aiven para permitir a conexão segura
    }
});

db.getConnection()
    .then(() => console.log('Conexão com o banco de dados MySQL NA NUVEM estabelecida com sucesso!'))
    .catch((erro) => console.error('Erro ao conectar com o banco de dados:', erro));

module.exports = db;