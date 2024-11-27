import Publicacao from "../models/Publicacoes.js";
import Usuario from "../models/Usuarios.js";
import Comentario from "../models/Comentarios.js";

// Função para criar um novo comentário
export const createComentario = async (req, res) => {

    try {

        const { publicacao_id, usuario_id, comentario } = req.body;

        const usuario = await Usuario.findByPk(usuario_id);
        const publicacao = await Publicacao.findByPk(publicacao_id);

        if (!publicacao_id || !usuario_id || !comentario) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        if (!usuario) {
            return res.status(400).json({ erro: "Usuário não encontrado" });
        }

        if (!publicacao) {
            return res.status(400).json({ erro: "Publicação não encontrada" });
        }

        const novoComentario = await Comentario.create({
            comentario,
            publicacao_id,
            usuario_id,
            criado_em: new Date(),
        });

        return res.status(201).json({
            comentario_id: novoComentario.id
        });

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao criar comentário" });
    }
};

// Função para listar os comentários de uma publicação
export const listPublicacaoComentario = async (req, res) => {

    try {

        const { publicacao_id } = req.query;

        if (!publicacao_id) {
            return res.status(400).json({ erro: "Publicação não informada" });
        }

        const comentarios = await Comentario.findAll({
            where: { publicacao_id },
            include: [
                {
                    model: Usuario,
                    attributes: ['nick', 'imagem']
                },
            ]
        });

        const data = comentarios.map(comentario => ({
            id: comentario.id,
            comentario: comentario.comentario,
            usuario_id: comentario.usuario_id,
            nick: comentario.nick,
            imagem: comentario.imagem,
            criado_em: comentario.criado_em,
        }));

        res.status(200).json({
            data,
            total: comentarios.length,
        });

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao buscar comentários" });
    }
};

// Função para deletar um comentário
export const deleteComentario = async (req, res) => {
    
    try {
        const { comentario_id, usuario_id } = req.body;

        const usuario = await Usuario.findByPk(usuario_id);
        const comentario = await Comentario.findByPk(comentario_id);
    
    

        if (!usuario) {
            return res.status(400).json({ erro: "Usuário não encontrado" });
        }

        if (!comentario) {
            return res.status(400).json({ erro: "Comentário não encontrado" });
        }

        if (comentario.usuario_id !== usuario_id) {
            return res.status(403).json({ erro: "Usuário não autorizado" });
        }

        await comentario.destroy();

        return res.status(204).json({});

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao deletar o comentário" });
    }
};