import express from "express"; // Biblioteca popular no Node, pacote de desenvolvimento web que conecta front e back
import sequelize from "./config/database.js"; // Importa a configuração do BD definida no database.js 
// Biblioteca ORM que simplifica a interação do banco de dados SQL (relacional) com o código
import comentarios from "./routes/comentarios.js"; 
import publicacoes from "./routes/publicacoes.js"; // Importação das rotas com os caminhos
import curtidas from "./routes/curtidas.js";
import usuarios from "./routes/usuarios.js";// "./" significa diretório atual

const app = express(); // Inicializa uma aplicação Express- disponibiliza rotas e outros

// Middleware para interpretar JSON antes da requisição ser processada
app.use(express.json()); // Configura a aplicação para interpretar o body da requisição (HTTP) no formato JSON (objeto dentro de objeto)

// Usando as rotas de publicações, comentários e curtidas
app.use("/app", publicacoes);
app.use("/app", comentarios); // Vincula as rotas importadas ao caminho /app
app.use("/app", curtidas);
app.use("/app", usuarios); // Exemplo: o arquivo define uma rotax, ela será acessível em /app/rotax

// Sincronizar o banco de dados e iniciar o servidor
const startServer = async () => { // Assícrona- permite executar uma sem que a anterior termine (não precisa bloquear sua única thread)
  try {
    await sequelize.sync(); // Isso cria as tabelas se elas não existirem (de acordo com os modelos definidos na aplicação)
    app.listen(3000, () => { // Inicia o servidor na porta 3000, enquanto o listen escuta as requisições nessa porta
      console.log("Servidor rodando na porta 3000");
    });
  } catch (error) { // try...catch gerencia possíveis erros dentro do contexto de sincronização, caso haja é exibido no console
    console.error("Erro ao iniciar o servidor:", error);
  }
};

startServer();