const User = require('../models/User')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, password, confirmpassword } = req.body

        // validações
        if (!name || !email || !password || !confirmpassword) {
            res.status(422).json({ message: 'Unprocessable Entity' })
            return
        }
        if (password != confirmpassword) {
            res.status(422).json({ message: 'Unprocessable Entity' })
            return
        }

        // verificar se o usuário existe
        const userExistes = await User.findOne({ email: email })
        if (userExistes) {
            res.status(422).json({ message: 'Unprocessable Entity' })
            return
        }

        // Criar uma senha criptografada
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // create a user
        const user = new User({
            name: name,
            email: email,
            password: passwordHash,
        })

        try {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)

        } catch (error) {
            res.status(500).json({ message: error })
        }

    }

    static async login(req, res) {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(422).json({ message: 'Unprocessable Entity' })
            return
        }

        const user = await User.findOne({ email: email })

        // Se o usuario não existir
        if (!user) {
            res.status(422).json({ message: 'Unprocessable Entity' })
            return
        }

        // verifique se a senha corresponde à senha do banco de dados
        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) {
            res.status(422).json({ message: 'Unprocessable Entity' })
            return
        }

        await createUserToken(user, req, res)

    }

    static async checkUser(req, res) {

        let currentUser

        if (req.headers.authorization) {

            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret')

            currentUser = await User.findById(decoded.id)
            console.log(currentUser);


            currentUser.password = undefined

        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static verifyAuth(req, res) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(422).send({ message: 'Cabeçalho Authorization ausente' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(422).send({ message: 'Token não fornecido' });
        }

        try {
            const decoded = jwt.verify(token, 'nossosecret');

            // Validação de expiração
            if (Date.now() >= decoded.exp * 1000) {
                return res.status(422).send({ message: 'Token expirado' });
            }

            return res.status(200).send({ message: 'Token válido', decoded });
        } catch (error) {
            console.error('Erro ao validar token:', error.message);
            return res.status(422).send({ message: 'Token inválido ou expirado' });
        }
    }


}