import express from "express"; // Framework (recursos prontos, utilizados e testados) para desenvolvimento web

import { 
  createUsuario, 
  listUsuarios,
  detailUsuario,
  updateUsuarios,
} from "../controllers/usersController.js"; // Importa de outro arquivo

// Cria um objeto de roteamento para definir rotas específicas, organizando de forma modular
const router = express.Router(); 

// Rota para criar um novo usuario
router.post("/usuarios", createUsuario); // Cria um recurso/produto por uma solicitação

// Rota para listar usuario
router.get("/usuarios", listUsuarios); // Pega a informação

// Rota para detalhar um usuario
router.get("/usuarios/:usuario_id", detailUsuario);// pega o ID do usuario a ser detalhado- valor especifico

// Rota para atualizar um usuario
router.patch("/usuarios/:usuario_id", updateUsuarios); // Patch atualiza se existe, caso contrário não atualiza

export default router; // Exportar o módulo como padrão (não precisa usar chave para especificar o valor exportado, nem ter o mesmo nome ao ser importado)