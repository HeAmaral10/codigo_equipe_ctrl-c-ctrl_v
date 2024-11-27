import express from "express"; // Framework (recursos prontos, utilizados e testados) para desenvolvimento web

import { // Importa do arquivo publicacaoController.js
    createPublicacao,
    listAllPublicacao,
    listAllUsuario,
    listOnePublicacao,
    deletePublicacao,
} from "../controllers/publicacaoController.js";

// Cria um objeto de roteamento para definir rotas específicas, organizando de forma modular
const router = express.Router(); 

// Rota para criar uma nova publicação
router.post("/publicacoes", createPublicacao);

// Rota para listar todas as publicações com informações do usuário
router.get("/publicacoes", listAllPublicacao);

// Rota para listar todas as publicações de um usuário específico
router.get("/publicacoes/de/:usuario_id", listAllUsuario);

// Rota para obter uma publicação específica com comentários e informações do usuário
router.get("/publicacoes/:publicacao_id", listOnePublicacao);

// Rota para deletar uma publicação
router.delete("/publicacoes", deletePublicacao);

export default router; // Export para ter a possiblidade de importar em outro arquivo
// Default para ser exportado como valor padrão de um módulo