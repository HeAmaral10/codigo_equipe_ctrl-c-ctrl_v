import { Sequelize } from "sequelize";
import dotenv from "dotenv";
// Biblioteca que interage o node (backend) com o
// banco de dados —> SERVIDOR (banco de dados) -
// API (backend) - CLIENTE (frontend)

// Conexão com o banco de dados LOCALMENTE a
// qual dialect define o tipo de bd (SQLite) e storage o
// caminho do arquivo onde os dados do banco serão
// armazenados
const sequelize = new Sequelize({ 
    host: "localhost",
    dialect: "sqlite",
    //storage: "./banco.db",
    storage: "./database.sqlite",
    define: {
        timestamps: false,
    }
});

// dotenv.config();

// const sequelize = new Sequelize(
//     process.env.DB_PROD_NAME,
//     process.env.DB_PROD_USER,
//     '4xL5gzL8I8zvd4gF',
//     {
//         host: process.env.DB_PROD_HOST,
//         port: process.env.DB_PROD_PORT,
//         dialect: process.env.DB_PROD_DIALECT,
//         dialectOptions: {
//             ssl: {
//                 require: true,
//                 rejectUnauthorized: false,
//             },
//         },
//         logging: false,
//     }
// );

// Função assíncrona para verificar o teste de conexão com o banco de dados foi feito corretamente
const testConnection = async () => {
    try {
        // Espera o método verificar se as credenciais e 
       // configurações estão corretas
        await sequelize.authenticate(); 
        console.log("Banco de dados no ar"); // mensagem
    } catch (err) { // Erros durante a autenticação 
        console.error("Não foi possível conectar ao banco de dados:", err); // Mensagem de erro 
    }
};

testConnection(); // Chama a função para testar a conexão ao iniciar o programa

export default sequelize; // Exporta para ser usado em outros módulos do projeto (permitindo outras partes interajam com o banco de dados usando a mesma conexão configurada)

// Observação: Sequelize é um ORM (mapeador objeto-relacional), ou seja, permite que criar modelos (classes) em TypeScript ou JavaScript que
//representam as tabelas do seu banco de dados. Assim, pode manipular os dados usando objetos e métodos, sem precisar escrever SQL diretamente.