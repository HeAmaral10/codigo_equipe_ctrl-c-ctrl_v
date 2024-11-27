import express from "express"; // Pacote de desenvolvimento web responsável por conectar back com front

import { // Importa tudo do arquivo commentController.js
    createComentario,
    listPublicacaoComentario,
    deleteComentario, 
} from "../controllers/commentController.js";

// Roteador modular(melhor organização e manipulação) no framework Express para lidar com um conjunto específico de rotas
const router = express.Router(); // Cria rotas de forma modulaizada- criando um arquivo para lidar com cada rota

// Rota para criar um novo comentário
router.post("/comentarios", createComentario);

// Rota para listar comentários de uma publicação específica
router.get("/comentarios", listPublicacaoComentario);

// Rota para deletar um comentário específico
router.delete("/comentarios", deleteComentario);

export default router; // Permite exportar desse arquivo e não precisa do mesmo nome pois só pode haver um membro padrão sendo exportado por módulo então pode ser qualquer nome)