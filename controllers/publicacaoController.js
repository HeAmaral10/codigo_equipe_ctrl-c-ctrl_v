import  Publicacao  from "../models/Publicacoes.js";
import  Usuario  from "../models/Usuarios.js";
import  Comentario  from "../models/Comentarios.js";

export const createPublicacao = async (req, res) => {

    try {
        const { usuario_id, publicacao } = req.body;

        const usuario = await Usuario.findByPk(usuario_id);
    
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
            criado_em: new Date(),
        });

        // Retorna a publicação criada
        return res.status(201).json({
            publicacao_id: novaPublicacao.id,
        });

    } catch (error) {
        // Trata erros na criação da publicação
        return res.status(500).json({ error: "Erro ao criar publicação" });
    }

};

export const listAllPublicacao = async (req, res) => {

    try {

        const publicacoes = await Publicacao.findAll({
            include: [
                {
                    model: Usuario,
                    attributes: ['nick', 'imagem']
                },
            ]
        });

        const data = publicacoes.map(publicacao => ({
            id: publicacao.id,
            publicacao: publicacao.publicacao,
            usuario_id: publicacao.usuario_id,
            nick: publicacao.nick,
            imagem: publicacao.imagem,
            qtd_likes: publicacao.qtd_likes,
            criado_em: publicacao.criado_em,
        }));

        // Retorna as publicações e o total
        return res.status(200).json({
            data,
            total: publicacoes.length,
        });

    } catch (error) {
        // Trata erros na listagem das publicações
        return res.status(500).json({ error: "Erro ao buscar publicações" });
    }
};

export const listAllUsuario = async (req, res) => {
    try {
        const usuario_id = req.params.usuario_id;

        // Busca o usuário pelo ID
        const usuario = await Usuario.findByPk(usuario_id);

        // Verifica se o usuário existe
        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        // Busca publicações do usuário com os relacionamentos necessários
        const publicacoes = await Publicacao.findAll({
            where: { usuario_id },
            include: [
                {
                    model: Usuario,
                    attributes: ['nick', 'imagem']
                },
                {
                    model: Comentario,
                    as: 'Comments',
                },
            ],
        });

        // Mapeia as publicações no formato desejado
        const data = publicacoes.map(publicacao => ({
            publicacao_id: publicacao.id,
            publicacao: publicacao.publicacao,
            usuario_id: publicacao.usuario_id,
            nick: publicacao.Usuario.nick,
            imagem: publicacao.Usuario.imagem,
            qtd_likes: publicacao.qtd_likes,
            qtd_comentarios: publicacao.Comments ? publicacao.Comments.length : 0,
            criado_em: new Date(),
        }));

        // Retorna as publicações e o total
        return res.status(200).json({
            data,
            total: publicacoes.length
        });
    } catch (error) {
        return res.status(500).json({ erro: "Erro interno do servidor" });
    }
};

export const listOnePublicacao = async (req, res) => {

    try {
        const publicacao_id = req.params.publicacao_id;

        const publicacaoE = await Publicacao.findByPk(publicacao_id);
        
        // Verifica se a publicação existe
        if (!publicacaoE) {
            return res.status(404).json({ erro: "Publicação não encontrada" });
        }

        // Busca a publicação específica e inclui dados do usuário e comentários
        const publicacao = await Publicacao.findOne({
            where: { publicacao_id },
            attributes: [
                'publicacao_id',
                'publicacao',
                'usuario_id',
                'qtd_likes',
                'criado_em'
            ],
            include: [
                {
                    model: Usuario,
                    attributes: ['nick', 'imagem']
                }
            //     {
            //         model: Comentario,
            //         //as: 'Comments',
            //         attributes: [
            //             'comentario_id',
            //             'comentario',
            //             'usuario_id',
            //             'qtd_likes',
            //             'criado_em'
            //         ],
            //     }
            // ],
            ]
        });
        
        const data = publicacoes.map(publicacao => ({
            publicacao_id: publicacao.id,
            publicacao: publicacao.publicacao,
            usuario_id: publicacao.usuario_id,
            nick: publicacao.Usuario.nick,
            imagem: publicacao.Usuario.imagem,
            qtd_likes: publicacao.qtd_likes,
            criado_em: new Date(),
        }));

        // Retorna a publicação e seus detalhes
        return res.status(200).json({
            data    
        });

    } catch (erro) {}

};

export const deletePublicacao = async (req, res) => {


    try {
        const { publicacao_id, usuario_id } = req.body;
    
        const publicacao = await Publicacao.findByPk(publicacao_id);
    
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

    } catch (error) {}

};