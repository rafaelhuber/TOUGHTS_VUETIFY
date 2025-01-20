const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Função para obter o usuário pelo token JWT
const getUserByToken = async (token) => {
    try {
        if (!token) {
            throw new Error("Acesso negado! Token não fornecido.");
        }

        // Decodifica o token
        const decoded = jwt.verify(token, "nossosecret");
        const userId = decoded.id;

        // Busca o usuário pelo ID
        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        return user;
    } catch (error) {
        // Lida com erros relacionados ao token
        if (error.name === "TokenExpiredError") {
            throw new Error("O token expirou. Por favor, faça login novamente.");
        }
        throw new Error("Token inválido.");
    }
};

module.exports = getUserByToken;
