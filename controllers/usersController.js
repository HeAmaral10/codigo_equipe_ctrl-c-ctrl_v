import Usuario from "../models/Usuarios.js"; // Modelo de Usuário
import bcrypt from "bcrypt";

// Função para criar um novo usuário
export const createUsuario = async (req, res) => {


    try {
        const { nome, email, senha, nascimento, nick } = req.body;


        // Verifica se todos os campos obrigatórios estão presentes
        if (!nome || !email || !senha || !nascimento || !nick) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        // Verifica se o usuário tem mais de 16 anos
        const idade = new Date().getFullYear() - new Date(nascimento).getFullYear();
        if (idade < 16) {
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
            imagem: novoUsuario.imagem,
            nascimento: novoUsuario.nascimento,
        });
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao criar usuário" });
    }
};

// Função para listar usuários com filtro por nome ou nick
export const listUsuarios = async (req, res) => {

    try {

        const usuarios = await Usuario.findAll({});

        return res.status(200).json(
            usuarios.map(usuario => ({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                nick: usuario.nick,
                imagem: usuario.imagem,
                nascimento: usuario.nascimento,
            }))
        );
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao buscar usuários" });
    }
};

// Função para obter detalhes de um usuário
export const detailUsuario = async (req, res) => {

    try {

        const usuario_id = req.params.usuario_id;

        const usuario = await Usuario.findByPk(usuario_id);

        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        return res.status(200).json({
            nome: usuario.nome,
            email: usuario.email,
            nick: usuario.nick,
            imagem: usuario.imagem,
            nascimento: usuario.nascimento,
        });
    } catch (error) {}
};

// Função para atualizar um usuário
export const updateUsuarios = async (req, res) => {

    try {
        const usuario_id = req.params.usuario_id;
        const { nome, email, nick } = req.body;
    
        const usuario = await Usuario.findByPk(usuario_id);

        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        // Se nenhum campo foi fornecido para atualização
        if (!nome && !email && !nick) {
            return res.status(400).json({ erro: "Pelo menos um campo deve ser fornecido para atualização" });
        }

        if (nome) usuario.nome = nome;

        // Verifica se o email ou o nick já estão em uso
        if (email && email !== usuario.email) {
            const emailExiste = await Usuario.findOne({ where: { email } });
            if (emailExiste) {
                return res.status(400).json({ erro: "Email já está em uso" });
            }
        }

        if (nick && nick !== usuario.nick) {
            const nickExiste = await Usuario.findOne({ where: { nick } });
            if (nickExiste) {
                return res.status(400).json({ erro: "Nick já está em uso" });
            }
        }

        usuario.update( email, nick);

        await usuario.save();

        // Atualiza os campos fornecidos
        //await usuario.update({ nome, email, nick });

        return res.status(200).json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            nick: usuario.nick,
            imagem: usuario.imagem,
            nascimento: usuario.nascimento,
        });
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao atualizar usuário" });
    }
};