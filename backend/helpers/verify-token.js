const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

// middleware to validate token 
const checkToken = (req, res, next) => {

    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'Acesso Negado!' })
        }

        const token = getToken(req)

        if (!token) {
            return res.status(401).json({ message: 'Acesso Negado!' })
        }

        try {

            const verified = jwt.verify(token, 'nossosecret')
            req.user = verified
            next()

        } catch (error) {
            return res.status(400).json({ message: 'Token inválido!' })
        }

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new Error("O token expirou. Por favor, faça login novamente.");
        }

        throw new Error("Token inválido.");

    }

}

module.exports = checkToken