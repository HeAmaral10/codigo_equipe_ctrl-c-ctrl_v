import { Sequelize } from "sequelize";
import dotenv from "dotenv";
// Biblioteca que interage o node (backend) com o
// banco de dados —> SERVIDOR (banco de dados) -
// API (backend) - CLIENTE (frontend)

// Conexão com o banco de dados LOCALMENTE a
// qual dialect define o tipo de bd (SQLite) e storage o
// caminho do arquivo onde os dados do banco serão
// armazenados
// const sequelize = new Sequelize({ 
//     host: "localhost",
//     dialect: "sqlite",
//     // storage: "./banco.db",
//     storage: "./database.sqlite",
//     define: {
//         timestamps: false,
//     }
// });

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

// Conexão com o banco de dados PROD (produção),
// utilizando as variáveis de ambiente configuradas no .env.
// Dialect define o tipo de banco de dados (MySQL, Postgres, SQLite, etc.),
// e as opções adicionais como ssl são configuradas para maior segurança.
const sequelize = new Sequelize(
    process.env.DB_PROD_NAME, // Nome do banco de dados
    process.env.DB_PROD_USER, // Usuário do banco
    '4xL5gzL8I8zvd4gF',       // Senha do banco (pode ser extraída de variáveis de ambiente por questões de segurança)
    {
        host: process.env.DB_PROD_HOST, // Host do banco de dados
        port: process.env.DB_PROD_PORT, // Porta do banco de dados
        dialect: process.env.DB_PROD_DIALECT, // Tipo do banco de dados (Postgres, MySQL, etc.)
        dialectOptions: {
            ssl: { // Configuração SSL para conexões seguras
                require: true,
                rejectUnauthorized: false, // Permite certificados SSL autoassinados
            },
        },
        logging: false, // Desabilita logs SQL no console para manter o terminal limpo
    }
);

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