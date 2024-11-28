import Publicacao from "../models/Publicacoes.js"; // Modelo de Publicação
import Comentario from "../models/Comentarios.js"; // Modelo de Comentário

// Função para dar like em uma publicação
export const likePublicacao = async (req, res) => {
    try {
        const { publicacao_id } = req.body; // Obtém o ID da publicação do corpo da requisição

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
            qtd_likes: publicacao.qtd_likes // Retorna o número de curtidas atualizado
        });

    } catch (error) {
        // Caso ocorra algum erro, o código não faz nada além de deixar o catch vazio
    }
};

// Função para dar like em um comentário
export const likeComentario = async (req, res) => {
    try {
        const { comentario_id } = req.body; // Obtém o ID do comentário do corpo da requisição

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
            qtd_likes: comentario.qtd_likes // Retorna o número de curtidas atualizado
        });

    } catch (error) {
        // Caso ocorra algum erro, o código não faz nada além de deixar o catch vazio
    }
};

// Função para dar deslike em um comentário
export const deslikeComentario = async (req, res) => {
    try {
        const { comentario_id } = req.body; // Obtém o ID do comentário do corpo da requisição

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
            comentario.qtd_likes--; // Decrementa o número de curtidas
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
};

// Função para dar deslike em uma publicação
export const deslikePublicacao = async (req, res) => {
    try {
        const { publicacao_id } = req.body; // Obtém o ID da publicação do corpo da requisição

        // Verifica se a publicação existe no banco de dados
        const publicacao = await Publicacao.findByPk(publicacao_id);
    
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
            publicacao.qtd_likes--; // Decrementa o número de curtidas
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
};