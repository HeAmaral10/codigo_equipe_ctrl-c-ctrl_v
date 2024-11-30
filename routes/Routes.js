import express from "express";
import bcrypt form "bcrypt";
import { Comentarios, Publicacoes, Usuario } from "../models/Models.js";

const router = express.Router();

router.post("/usuarios", async (req, res) => {
    try {
        const { nome, email, senha, nascimento, nick } = req.body;

        // Verifica se todos os campos obrigatórios estão presentes
        if (!nome || !email || !senha || !nascimento || !nick) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // Verifica se o usuário tem mais de 16 anos
        const anoAtual = new Date().getFullYear();
        const mesAtual = new Date().getMonth();
        const diaAtual = new Date().getDay();
        const dataAtual = anoAtual * 365 + mesAtual * 30 + diaAtual; // Converte a data atual em dias

        const anoNascimento = new Date(nascimento).getFullYear();
        const mesNascimento = new Date(nascimento).getMonth();
        const diaNascimento = new Date(nascimento).getDay();
        const dataNascimento = anoNascimento * 365 + mesNascimento * 30 + diaNascimento; // Converte a data de nascimento em dias

        const diferencaDias = dataAtual - dataNascimento; // Calcula a diferença em dias entre as duas datas

        if (diferencaDias < 5840) { // 5840 dias correspondem a 16 anos
            return res.status(400).json({ erro: "A idade deve ser maior que 16 anos" });
        }

        // Verifica se o email ou o nick já estão em uso
        const emailExiste = await Usuario.findOne({ where: { email } });
        if (emailExiste) {
            return res.status(400).json({ erro: "Email já está em uso" });
        }

        const nickExiste = await Usuario.findOne({ where: { nick } });
        if (nickExiste) {
            return res.status(400).json({ erro: "Nick já está em uso" });
        }

        // Criptografa a senha
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Cria o novo usuário
        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha: senhaCriptografada,
            nascimento,
            nick,
            imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7mMNz8YCBvYmnr3BQUPX__YsC_WtDuAevwg&s", // URL de imagem padrão
        });

        // Retorna o usuário criado
        return res.status(201).json({
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            nick: novoUsuario.nick,
            imagem: [novoUsuario.imagem],
            nascimento: novoUsuario.nascimento,
        });
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao criar usuário" });
    }
});

router.get("/usuarios", async (req, res) => {
    try {
        // Busca todos os usuários no banco de dados
        const usuarios = await Usuario.findAll({});

        // Retorna os usuários encontrados com os campos selecionados
        return res.status(200).json(
            usuarios.map(usuario => ({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                nick: usuario.nick,
                imagem: [usuario.imagem],
                nascimento: usuario.nascimento,
            }))
        );
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao buscar usuários" });
    }
});

router.get("/usuarios/:usuario_id", async (req, res) => {
    try {
        const usuario_id = req.params.usuario_id; // Obtém o ID do usuário a partir dos parâmetros da URL

        const usuario = await Usuario.findByPk(usuario_id); // Busca o usuário pelo ID

        if (!usuario) { // Verifica se o usuário existe
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        // Retorna os detalhes do usuário
        return res.status(200).json({
            nome: usuario.nome,
            email: usuario.email,
            nick: usuario.nick,
            imagem: [usuario.imagem],
            nascimento: usuario.nascimento,
        });
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao buscar detalhes do usuário" });
    }
});

router.patch("/usuarios/:usuario_id", async (req, res) => {
    try {
        const usuario_id = req.params.usuario_id; // Obtém o ID do usuário a partir dos parâmetros da URL
        const { nome, email, nick } = req.body; // Obtém os campos enviados no corpo da requisição

        const usuario = await Usuario.findByPk(usuario_id); // Busca o usuário pelo ID

        if (!usuario) { // Verifica se o usuário existe
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        // Se nenhum campo foi fornecido para atualização
        if (!nome && !email && !nick) {
            return res.status(400).json({ erro: "Pelo menos um campo deve ser fornecido para atualização" });
        }

        if (nome) usuario.nome = nome; // Atualiza o nome se fornecido

        // Verifica se o email está em uso por outro usuário
        if (email && email !== usuario.email) {
            const emailExiste = await Usuario.findOne({ where: { email } });
            if (emailExiste) {
                return res.status(400).json({ erro: "Email já está em uso" });
            }
        }

        // Verifica se o nick está em uso por outro usuário
        if (nick && nick !== usuario.nick) {
            const nickExiste = await Usuario.findOne({ where: { nick } });
            if (nickExiste) {
                return res.status(400).json({ erro: "Nick já está em uso" });
            }
        }

        // Atualiza os campos fornecidos
        await usuario.update({ nome, email, nick });

        return res.status(200).json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            nick: usuario.nick,
            imagem: [usuario.imagem],
            nascimento: usuario.nascimento,
        });
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao atualizar usuário" });
    }
});

router.post("/publicacoes", async (req, res) => {
    try {
        const { usuario_id, publicacao } = req.body; // Obtém os dados do corpo da requisição

        const usuario = await Usuario.findByPk(usuario_id); // Busca o usuário pelo ID

        // Verifica se o usuário existe
        if (!usuario) {
            return res.status(400).json({ error: "Usuário não encontrado" });
        }

        // Valida se os campos foram preenchidos
        if (!publicacao || !usuario_id) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        // Cria uma nova publicação associada ao usuário
        const novaPublicacao = await Publicacoes.create({
            publicacao,
            usuario_id,
            criado_em: publicacao.criado_em, // Define a data de criação como a data atual
        });

        // Retorna a publicação criada
        return res.status(201).json({
            publicacao_id: novaPublicacao.id, // Retorna o ID da publicação criada
        });
    } catch (error) {
        // Trata erros na criação da publicação
        return res.status(500).json({ error: "Erro ao criar publicação" });
    }
});

router.get("/publicacoes", async (req, res) => {
    try {
        // Busca todas as publicações e inclui os dados do usuário relacionado
        const publicacoes = await Publicacoes.findAll({
            include: [
                {
                    model: Usuario,
                    attributes: [
                        'nick', 
                        'imagem'
                    ], // Seleciona apenas os atributos nick e imagem do usuário
                },
            ],
        });

        // Formata os dados das publicações para o retorno
        const data = publicacoes.map(publicacao => ({
            publicacao_id: publicacao.id,
            publicacao: publicacao.publicacao,
            usuario_id: publicacao.usuario_id,
            nick: publicacao.Usuario.nick, // Obtém o nick do usuário relacionado
            imagem: [publicacao.Usuario.imagem], // Obtém a imagem do usuário relacionado
            qtd_likes: publicacao.qtd_likes, // Quantidade de likes na publicação
            criado_em: publicacao.criado_em, // Data de criação da publicação
        }));

        // Retorna as publicações e o total
        return res.status(200).json({
            data: data, // Dados das publicações
            total: data.length, // Total de publicações encontradas
        });
    } catch (error) {
        // Trata erros na listagem das publicações
        return res.status(500).json({ error: "Erro ao buscar publicações" });
    }
});

router.get("/publicacoes/de/:usuario_id", async (req, res) => {
    try {
        const usuario_id = req.params.usuario_id; // Obtém o ID do usuário dos parâmetros da URL

        // Busca o usuário pelo ID
        const usuario = await Usuario.findByPk(usuario_id);

        // Verifica se o usuário existe
        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        // Busca publicações do usuário com os relacionamentos necessários
        const publicacoes = await Publicacoes.findAll({
            where: { usuario_id }, // Filtra publicações pelo ID do usuário
            include: [
                {
                    model: Usuario,
                    attributes: [
                        'nick', 
                        'imagem'
                    ], // Seleciona atributos do usuário relacionado
                },
                {
                    model: Comentarios,
                    as: 'Comments', // Inclui os comentários relacionados
                },
            ],
        });

        // Mapeia as publicações no formato desejado
        const data = publicacoes.map(publicacao => ({
            publicacao_id: publicacao.id,
            publicacao: publicacao.publicacao,
            usuario_id: publicacao.usuario_id,
            nick: publicacao.Usuario.nick, // Obtém o nick do usuário relacionado
            imagem: [publicacao.Usuario.imagem], // Obtém a imagem do usuário relacionado
            qtd_likes: publicacao.qtd_likes, // Quantidade de likes na publicação
            qtd_comentarios: publicacao.Comments ? publicacao.Comments.length : 0, // Quantidade de comentários
            criado_em: publicacao.criado_em, // Data atual como data de criação
        }));

        // Retorna as publicações e o total
        return res.status(200).json({
            data: data, // Dados das publicações
            total: data.length, // Total de publicações encontradas
        });
    } catch (error) {
        return res.status(500).json({ erro: "Erro interno do servidor" });
    }
});
router.get("/publicacoes/:publicacao_id", async (req, res) => {
    const { publicacao_id } = req.params;
    try {
      if (!publicacao_id) {
        return res.status(404).json({ erro: "Publicação não encontrada" });
      }
  
      const publicacao = await Publicacoes.findByPk(publicacao_id, {
        include: { model: Usuario}, // Assegure-se de que o alias "usuario" está correto
      });
  
      const comentarios = await Comentarios.findAll({
        where: { publicacao_id },
        include: { model: Usuario},
      });
  
      const data = comentarios.map((comentario) => ({
        comentario_id: comentario.id,
        comentario: comentario.comentario,
        usuario_id: comentario.usuario_id,
        nick: comentario.Usuario.nick,
        imagem: [comentario.Usuario.imagem],
        qtd_likes: comentario.qtd_likes,
        criado_em: comentario.criado_em,
      }));
  
      res.status(200).json({
        publicacao_id: publicacao.id,
        publicacao: publicacao.publicacao,
        usuario_id: publicacao.usuario_id,
        nick: publicacao.Usuario.nick,
        imagem: [publicacao.Usuario.imagem], 
        qtd_likes: publicacao.qtd_likes,
        criado_em: publicacao.criado_em,
        comentarios: data,
      });
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao consultar publicação" });
    }
  });

router.delete("/publicacoes", async (req, res) => {
    try {
        const { publicacao_id, usuario_id } = req.body; // Obtém os IDs da requisição

        const publicacao = await Publicacoes.findByPk(publicacao_id); // Busca a publicação pelo ID

        // Verifica se a publicação existe
        if (!publicacao) {
            return res.status(400).json({ erro: "Publicação não encontrada" });
        }

        // Verifica se o usuário foi informado
        if (!usuario_id) {
            return res.status(400).json({ erro: "Usuário não informado" });
        }

        // Verifica se o usuário é o autor da publicação
        if (publicacao.usuario_id !== usuario_id) {
            return res.status(403).json({ erro: "Usuário não autorizado" });
        }

        // Deleta a publicação
        await publicacao.destroy();

        // Retorna uma mensagem de sucesso
        return res.status(200).json({ mensagem: "Publicação deletada com sucesso" });
    } catch (error) {
        return res.status(500).json({ erro: "Erro interno do servidor" });
    }
});

router.post("/comentarios", async (req, res) => {
    try {
        const { publicacao_id, usuario_id, comentario } = req.body; // Obtém os dados do comentário

        // Verifica se o usuário existe
        const usuario = await Usuario.findByPk(usuario_id);
        // Verifica se a publicação existe
        const publicacao = await Publicacoes.findByPk(publicacao_id);

        // Valida se todos os campos foram preenchidos
        if (!publicacao_id || !usuario_id || !comentario) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // Verifica se o usuário existe no banco de dados
        if (!usuario) {
            return res.status(400).json({ erro: "Usuário não encontrado" });
        }

        // Verifica se a publicação existe no banco de dados
        if (!publicacao) {
            return res.status(400).json({ erro: "Publicação não encontrada" });
        }

        // Cria um novo comentário associado à publicação e ao usuário
        const novoComentario = await Comentarios.create({
            publicacao_id,
            usuario_id,
            comentario,
            
        });

        // Retorna o ID do comentário recém-criado
        return res.status(201).json({
            comentario_id: novoComentario.id
        });

    } catch (error) {
        // Caso ocorra algum erro, retorna um erro de criação
        return res.status(500).json({ erro: "Erro ao criar comentário" });
    }
});

router.get("/comentarios", async (req, res) => {
    try {
        const { publicacao_id } = req.query; // Obtém o ID da publicação da query string

        // Verifica se o ID da publicação foi informado
        if (!publicacao_id) {
            return res.status(400).json({ erro: "Publicação não informada" });
        }   

        // Busca todos os comentários associados a uma publicação
        const comentarios = await Comentarios.findAll({
            where: { publicacao_id },
            include: [
                {
                    model: Usuario, // Inclui os dados do usuário que fez o comentário
                    attributes: [
                        "nick", 
                        "imagem"
                    ],
                },
            ],
        });

        // Mapeia os comentários no formato desejado
        const data = comentarios.map((comentario) => ({
            comentario_id: comentario.id,
            comentario: comentario.comentario,
            usuario_id: comentario.usuario_id,
            nick: comentario.Usuario.nick,
            imagem: [comentario.Usuario.imagem],
            criado_em: comentario.criado_em
        }));
        console.log(data);
        // Retorna os comentários e o total de comentários encontrados
        res.status(200).json({
            data: data,
            total: data.length,
        });

    } catch (error) {
        // Caso ocorra um erro ao buscar os comentários
        return res.status(500).json({ erro: "Erro ao buscar comentários" });
    }
});

router.delete("/comentarios", async (req, res) => {
    const { publicacao_id } = req.query;

  try {
    if (!publicacao_id) { 
      return res.status(400).json({ erro: "Publicação não informada" });
    }

    const comentarios = await Comentarios.findAll({
      where: { publicacao_id },
      include: {
        model: Usuario,
        attributes: ["nick", "imagem"],
      },
    });

    const resultado = comentarios.map((com) => ({
      comentario_id: com.id,
      comentario: com.comentario,
      usuario_id: com.usuario_id,
      nick: com.Usuario.nick,
      imagem: [com.Usuario.imagem],
      criado_em: com.criado_em

    }));

    res.status(200).json({ data: resultado, total: resultado.length });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar comentários" });
  }
});

router.post("/curtidas/publicacao", async (req, res) => {
    try {
        const { publicacao_id } = req.body; // Obtém o ID da publicação do corpo da requisição

        // Verifica se a publicação existe no banco de dados
        const publicacao = await Publicacoes.findByPk(publicacao_id);

        // Valida se o campo `publicacao_id` foi preenchido
        if (!publicacao_id) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // Verifica se a publicação foi encontrada
        if (!publicacao) {
            return res.status(400).json({ erro: "Publicação não encontrada" });
        }

        // Adiciona o número de curtidas à publicação
        publicacao.qtd_likes += 1;

        // Busca a publicação atualizada para retornar o número de curtidas atualizado
        await publicacao.save();

        // Retorna o número atualizado de curtidas
        return res.status(200).json({
            qtd_likes: publicacao.qtd_likes // Retorna o número de curtidas atualizado
        });

    } catch (error) {
        // Caso ocorra algum erro, o código não faz nada além de deixar o catch vazio
    }
});

router.delete("/curtidas/publicacao", async (req, res) => {
    try {
        const { publicacao_id } = req.body; // Obtém o ID da publicação do corpo da requisição

        // Verifica se a publicação existe no banco de dados
        const publicacao = await Publicacaos.findByPk(publicacao_id);
    
        // Valida se o campo `comentario_id` foi preenchido
        if (!publicacao_id) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // Verifica se a publicação foi encontrada
        if (!publicacao) {
            return res.status(400).json({ erro: "Publicação não encontrada" });
        }

        // Se o número de curtidas for maior que zero, decrementa o número de curtidas
        if (publicacao.qtd_likes > 0) {
            publicacao.qtd_likes -= 1; // Decrementa o número de curtidas
        }

        // Busca a publicação atualizada para retornar o número de curtidas atualizado
        await publicacao.save();

        // Retorna o número atualizado de curtidas
        return res.status(200).json({
            qtd_likes: publicacao.qtd_likes // Retorna o número de curtidas atualizado
        });

    } catch (error) {
        // Caso ocorra algum erro, o código não faz nada além de deixar o catch vazio
    }
});

router.post("/curtidas/comentario", async (req, res) => {
    try {
        const { comentario_id } = req.body; // Obtém o ID do comentário do corpo da requisição

        // Verifica se o comentário existe no banco de dados
        const comentario = await Comentarios.findByPk(comentario_id);
    
        // Valida se o campo `comentario_id` foi preenchido
        if (!comentario_id) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // Verifica se o comentário foi encontrado
        if (!comentario) {
            return res.status(400).json({ erro: "Comentário não encontrado" });
        }

        // Incrementa o número de curtidas do comentário
        comentario.qtd_likes += 1;

        // Busca o comentário atualizado para retornar o número de curtidas atualizado
        await comentario.save();

        // Retorna o número atualizado de curtidas
        return res.status(200).json({
            qtd_likes: comentario.qtd_likes // Retorna o número de curtidas atualizado
        });

    } catch (error) {
        // Caso ocorra algum erro, o código não faz nada além de deixar o catch vazio
    }
});

router.delete("/curtidas/comentario", async (req, res) => {
    try {
        const { comentario_id } = req.body; // Obtém o ID do comentário do corpo da requisição

        // Verifica se o comentário existe no banco de dados
        const comentario = await Comentarios.findByPk(comentario_id);
    
        // Valida se o campo `comentario_id` foi preenchido
        if (!comentario_id) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // Verifica se o comentário foi encontrado
        if (!comentario) {
            return res.status(400).json({ erro: "Comentário não encontrado" });
        }

        // Se o número de curtidas for maior que zero, decrementa o número de curtidas
        if (comentario.qtd_likes > 0) {
            comentario.qtd_likes -= 1; // Decrementa o número de curtidas
        }

        // Busca o comentário atualizado para retornar o número de curtidas atualizado
        await comentario.save();

        // Retorna o número atualizado de curtidas
        return res.status(200).json({ 
            qtd_likes: comentario.qtd_likes // Retorna o número de curtidas atualizado
        });

    } catch (error) {
        // Caso ocorra algum erro, o código não faz nada além de deixar o catch vazio
    }
});

export default router;
