import  Publicacao  from "../models/Publicacoes.js";
import  Comentario  from "../models/Comentarios.js";

export const likePublicacao = async (req, res) => {



    try {
        const { publicacao_id } = req.body;

        // Verifica se a publicação existe no banco de dados
        const publicacao = await Publicacao.findByPk(publicacao_id);
        // Valida se o campo `publicacao_id` foi preenchido
        if (!publicacao_id) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // Verifica se a publicação foi encontrada
        if (!publicacao) {
            return res.status(400).json({ erro: "Publicação não encontrada" });
        }

        // Adiciona o número de curtidas à publicação
        publicacao.qtd_likes++;

        // Busca a publicação atualizada para retornar o número de curtidas atualizado
        await publicacao.save();

        // Retorna o número atualizado de curtidas
        return res.status(200).json({
            qtd_likes: publicacao.qtd_likes
        });

    } catch (error) {}

};

export const likeComentario = async (req, res) => {

    try {

        const { comentario_id } = req.body;

        // Verifica se o comentário existe no banco de dados
        const comentario = await Comentario.findByPk(comentario_id);
    
        // Valida se o campo `comentario_id` foi preenchido
        if (!comentario_id) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // Verifica se o comentário foi encontrado
        if (!comentario) {
            return res.status(400).json({ erro: "Comentário não encontrado" });
        }

        // Incrementa o número de curtidas do comentário
        comentario.qtd_likes++;

        // Busca o comentário atualizado para retornar o número de curtidas atualizado
        await comentario.save();

        // Retorna o número atualizado de curtidas
        return res.status(200).json({
            qtd_likes: comentario.qtd_likes
        });

    } catch (error) {}

};

export const deslikeComentario = async (req, res) => {


    try {
        const { comentario_id } = req.body;

        // Verifica se o comentário existe no banco de dados
        const comentario = await Comentario.findByPk(comentario_id);
    
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
            comentario.qtd_likes--;
        }

        // Busca o comentário atualizado para retornar o número de curtidas atualizado
        await comentario.save();

        // Retorna o número atualizado de curtidas
        return res.status(200).json({ 
            qtd_likes: comentario.qtd_likes
        });

    } catch (error) {}

};

export const deslikePublicacao = async (req, res) => {
    

    try {
        const { publicacao_id } = req.body;

        // Verifica se o comentário existe no banco de dados
        const publicacao = await Publicacao.findByPk(publicacao_id);
    
        // Valida se o campo `comentario_id` foi preenchido
        if (!publicacao_id) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // Verifica se o comentário foi encontrado
        if (!publicacao) {
            return res.status(400).json({ erro: "Publicação não encontrada" });
        }

        // Se o número de curtidas for maior que zero, decrementa o número de curtidas
        if (publicacao.qtd_likes > 0) {
            publicacao.qtd_likes--;
        }

        // Busca o comentário atualizado para retornar o número de curtidas atualizado
        await publicacao.save();

        // Retorna o número atualizado de curtidas
        return res.status(200).json({
            qtd_likes: publicacao.qtd_likes
        });

    } catch (error) {}

};