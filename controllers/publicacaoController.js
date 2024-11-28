import Publicacao from "../models/Publicacoes.js"; // Modelo de Publicação
import Usuario from "../models/Usuarios.js"; // Modelo de Usuário
import Comentario from "../models/Comentarios.js"; // Modelo de Comentário

// Função para criar uma nova publicação
export const createPublicacao = async (req, res) => {
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
        const novaPublicacao = await Publicacao.create({
            publicacao,
            usuario_id,
            criado_em: new Date(), // Define a data de criação como a data atual
        });

        // Retorna a publicação criada
        return res.status(201).json({
            publicacao_id: novaPublicacao.id, // Retorna o ID da publicação criada
        });
    } catch (error) {
        // Trata erros na criação da publicação
        return res.status(500).json({ error: "Erro ao criar publicação" });
    }
};

// Função para listar todas as publicações
export const listAllPublicacao = async (req, res) => {
    try {
        // Busca todas as publicações e inclui os dados do usuário relacionado
        const publicacoes = await Publicacao.findAll({
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
            id: publicacao.id,
            publicacao: publicacao.publicacao,
            usuario_id: publicacao.usuario_id,
            nick: publicacao.nick, // Obtém o nick do usuário relacionado
            imagem: publicacao.imagem, // Obtém a imagem do usuário relacionado
            qtd_likes: publicacao.qtd_likes, // Quantidade de likes na publicação
            criado_em: new Date(), // Data de criação da publicação
        }));

        // Retorna as publicações e o total
        return res.status(200).json({
            data, // Dados das publicações
            total: publicacoes.length, // Total de publicações encontradas
        });
    } catch (error) {
        // Trata erros na listagem das publicações
        return res.status(500).json({ error: "Erro ao buscar publicações" });
    }
};

// Função para listar todas as publicações de um usuário específico
export const listAllUsuario = async (req, res) => {
    try {
        const usuario_id = req.params.usuario_id; // Obtém o ID do usuário dos parâmetros da URL

        // Busca o usuário pelo ID
        const usuario = await Usuario.findByPk(usuario_id);

        // Verifica se o usuário existe
        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        // Busca publicações do usuário com os relacionamentos necessários
        const publicacoes = await Publicacao.findAll({
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
                    model: Comentario,
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
            imagem: publicacao.Usuario.imagem, // Obtém a imagem do usuário relacionado
            qtd_likes: publicacao.qtd_likes, // Quantidade de likes na publicação
            qtd_comentarios: publicacao.Comments ? publicacao.Comments.length : 0, // Quantidade de comentários
            criado_em: new Date(), // Data atual como data de criação
        }));

        // Retorna as publicações e o total
        return res.status(200).json({
            data, // Dados das publicações
            total: publicacoes.length, // Total de publicações encontradas
        });
    } catch (error) {
        return res.status(500).json({ erro: "Erro interno do servidor" });
    }
};

// Função para buscar uma única publicação
export const listOnePublicacao = async (req, res) => {
    try {
        const publicacao_id = req.params.publicacao_id; // Obtém o ID da publicação dos parâmetros da URL

        // Busca a publicação específica e inclui dados do usuário e comentários
        const publicacao = await Publicacao.findOne({
            where: { publicacao_id }, // Filtra pela publicação com o ID informado
            attributes: [
                'id', 
                'publicacao', 
                'usuario_id', 
                'qtd_likes'
            ], // Seleciona os atributos necessários da publicação
            include: [
                {
                    model: Usuario,
                    attributes:[
                        'nick', 
                        'imagem'
                    ], // Inclui dados do usuário relacionado
                },
                {
                    model: Comentario,
                    attributes: [
                        'id',
                        'comentario', 
                        'usuario_id', 
                        'qtd_likes'
                    ], // Inclui os atributos necessários dos comentários
                    include: {
                        model: Usuario,
                        attributes: [
                            'nick', 
                            'imagem'
                        ], // Inclui dados do usuário autor do comentário
                    },
                },
            ],
        });

        // Verifica se a publicação existe
        if (!publicacao) {
            return res.status(404).json({ erro: "Publicação não encontrada" });
        }

        // Retorna a publicação e seus detalhes
        return res.status(200).json(
            publicacao.map(publicacao => ({
                publicacao: publicacao.publicacao,
                usuario_id: publicacao.usuario_id,
                nick: publicacao.nick, // Nick do autor da publicação
                imagem: publicacao.imagem, // Imagem do autor da publicação
                qtd_likes: publicacao.qtd_likes, // Quantidade de likes na publicação
                criado_em: new Date(), // Data atual
                comentarios: publicacao.Comentarios.map(comentario => ({
                    comentario_id: comentario.id,
                    comentario: comentario.comentario,
                    usuario_id: comentario.usuario_id,
                    nick: comentario.nick, // Nick do autor do comentário
                    imagem: comentario.imagem, // Imagem do autor do comentário
                    qtd_likes: comentario.qtd_likes, // Quantidade de likes no comentário
                    criado_em: new Date(), // Data atual
                })),
            }))
        );
    } catch (error) {
        return res.status(500).json({ erro: "Erro interno do servidor" });
    }
};

// Função para deletar uma publicação
export const deletePublicacao = async (req, res) => {
    try {
        const { publicacao_id, usuario_id } = req.body; // Obtém os IDs da requisição

        const publicacao = await Publicacao.findByPk(publicacao_id); // Busca a publicação pelo ID

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
};