const jwt = require("jsonwebtoken")

const createUserToken = async (user, req, res) => {

    // create a token
    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        'nossosecret', // chave secreta
        { expiresIn: '15m' } // Token expira em 15 minutos
    );

    // return token
    res.status(200).json({
        message: 'Você está autenticado',
        token: token,
        userId: user._id,
        name: user.name,
    })

}

module.exports = createUserToken