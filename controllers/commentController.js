import Publicacao from "../models/Publicacoes.js"; // Modelo de Publicação
import Usuario from "../models/Usuarios.js"; // Modelo de Usuário
import Comentario from "../models/Comentarios.js"; // Modelo de Comentário

// Função para criar um novo comentário em uma publicação
export const createComentario = async (req, res) => {
    try {
        const { publicacao_id, usuario_id, comentario } = req.body; // Obtém os dados do comentário

        // Verifica se o usuário existe
        const usuario = await Usuario.findByPk(usuario_id);
        // Verifica se a publicação existe
        const publicacao = await Publicacao.findByPk(publicacao_id);

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
        const novoComentario = await Comentario.create({
            comentario,
            publicacao_id,
            usuario_id,
            criado_em: new Date(), // Define a data de criação do comentário
        });

        // Retorna o ID do comentário recém-criado
        return res.status(201).json({
            comentario_id: novoComentario.id
        });

    } catch (error) {
        // Caso ocorra algum erro, retorna um erro de criação
        return res.status(500).json({ erro: "Erro ao criar comentário" });
    }
};

// Função para listar os comentários de uma publicação específica
export const listPublicacaoComentario = async (req, res) => {
    try {
        const { publicacao_id } = req.query; // Obtém o ID da publicação da query string

        // Verifica se o ID da publicação foi informado
        if (!publicacao_id) {
            return res.status(400).json({ erro: "Publicação não informada" });
        }

        // Busca todos os comentários associados a uma publicação
        const comentarios = await Comentario.findAll({
            where: { publicacao_id },
            include: [
                {
                    model: Usuario, // Inclui os dados do usuário que fez o comentário
                    attributes: [
                        'nick', 
                        'imagem'
                    ]
                },
            ]
        });

        // Mapeia os comentários no formato desejado
        const data = comentarios.map(comentario => ({
            id: comentario.id,
            comentario: comentario.comentario,
            usuario_id: comentario.usuario_id,
            nick: comentario.nick,
            imagem: comentario.imagem,
            criado_em: new Date(), // Data de criação do comentário
        }));

        // Retorna os comentários e o total de comentários encontrados
        res.status(200).json({
            data,
            total: comentarios.length,
        });

    } catch (error) {
        // Caso ocorra um erro ao buscar os comentários
        return res.status(500).json({ erro: "Erro ao buscar comentários" });
    }
};

// Função para deletar um comentário
export const deleteComentario = async (req, res) => {
    try {
        const { comentario_id, usuario_id } = req.body; // Obtém os dados do comentário e do usuário

        // Verifica se o usuário existe
        const usuario = await Usuario.findByPk(usuario_id);
        // Verifica se o comentário existe
        const comentario = await Comentario.findByPk(comentario_id);

        // Verifica se o usuário foi encontrado
        if (!usuario) {
            return res.status(400).json({ erro: "Usuário não encontrado" });
        }

        // Verifica se o comentário foi encontrado
        if (!comentario) {
            return res.status(400).json({ erro: "Comentário não encontrado" });
        }

        // Verifica se o usuário é o autor do comentário
        if (comentario.usuario_id !== usuario_id) {
            return res.status(403).json({ erro: "Usuário não autorizado" });
        }

        // Deleta o comentário
        await comentario.destroy();

        // Retorna uma resposta de sucesso, sem conteúdo (status 204)
        return res.status(204).json({});

    } catch (error) {
        // Caso ocorra um erro ao deletar o comentário
        return res.status(500).json({ erro: "Erro ao deletar o comentário" });
    }
};