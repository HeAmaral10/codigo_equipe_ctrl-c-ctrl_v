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
        // Busca todos os usuários no banco de dados
        const usuarios = await Usuario.findAll({});

        // Retorna os usuários encontrados com os campos selecionados
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
            imagem: usuario.imagem,
            nascimento: usuario.nascimento,
        });
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao buscar detalhes do usuário" });
    }
};

// Função para atualizar um usuário
export const updateUsuarios = async (req, res) => {
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
            imagem: usuario.imagem,
            nascimento: usuario.nascimento,
        });
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao atualizar usuário" });
    }
};