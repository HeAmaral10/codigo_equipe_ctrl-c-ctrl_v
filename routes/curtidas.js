import express from "express"; // Pacote de desenvolvimento web

import { // Importa do arquivo likeController.js
    likePublicacao,
    deslikePublicacao,
    likeComentario,
    deslikeComentario,
} from "../controllers/likeController.js";

// Roteador modular no framework Express para lidar com um conjunto específico de rotas
const router = express.Router();

// Rota para adicionar uma curtida a uma publicação
router.post("/curtidas/publicacao", likePublicacao);

// Rota para adicionar uma curtida a um comentário
router.post("/curtidas/comentario", likeComentario);

// Rota para remover uma curtida de um comentário
router.delete("/curtidas/comentario", deslikeComentario);

// Rota para remover uma curtida de uma publicação
router.delete("/curtidas/publicacao", deslikePublicacao);

export default router; // Só pode ter um membro padrão sendo exportado por módulo
// A vantagem é que não precisa ser referenciado com o mesmo nome ao ser importado 
// (sempre vai referenciar ao mesmo membro, independente do nome por ser o único a ser exportado no mesmo módulo)