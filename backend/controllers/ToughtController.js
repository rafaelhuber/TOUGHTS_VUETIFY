const Toughts = require('../models/Tought')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId
//const User = require('../models/User')


module.exports = class ToughtController {

    static async create(req, res) {
        const { title, text } = req.body


        // validations
        if (!title || !text) {
            res.status(422).json({ message: "Campo obrigatorio!" })
        }

        // get tought owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        // create a tought
        const tought = new Toughts({
            title,
            text,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })


        try {

            const newtought = await tought.save()
            res.status(201).json({ message: 'Pensamento cadastrado com sucesso!', newtought })


        } catch (error) {
            res.status(500).json({ message: error })
        }

    }

    static async getAllUserToughts(req, res) {
        //get user from token

        const token = getToken(req)
        const user = await getUserByToken(token)

        const tought = await Toughts.find({ 'user._id': user._id }).sort('-createdAt')

        res.status(200).json({ tought })
    }

    static async updatetought(req, res) {
        const id = req.params.id

        const { title, text } = req.body

        const updatedData = {}

        // check if tought exists
        const tought = await Toughts.findOne({ _id: id })
        if (!tought) {
            res.status(404).json({ message: "Pensamento não encontrado" })
            return
        }

        // check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (tought.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: "Houve um problema em processar a sua solicitação tente novamente mais tarde!" })
            return
        }

        // validations
        if (!title) {
            res.status(422).json({ message: "Titulo obrigatorio" })
            return
        } else {
            updatedData.title = title
        }

        if (!text) {
            res.status(422).json({ message: "Texto obrigatorio!" })
            return
        } else {
            updatedData.text = text
        }

        // update tought in database
        await Toughts.findByIdAndUpdate(id, updatedData)
        res.status(200).json({ message: "Pensamento atualizado com sucesso!" })

    }

    static async removeToughtById(req, res) {
        const id = req.params.id

        // check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: "ID inválido" })
            return
        }

        // check if pet exists
        const tought = await Toughts.findOne({ _id: id })
        if (!tought) {
            res.status(404).json({ message: "Pensamento não encontrado" })
            return
        }

        // check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (tought.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: "Houve um problema em processar a sua solicitação tente novamente mais tarde!" })
            return
        }

        // remove tought from database
        await Toughts.findByIdAndDelete(id)
        res.status(200).json({ message: "Pensamento removido com sucesso!" })

    }

    static async showTought(req, res) {

        const toughts = await Toughts.find().sort('-createdAt')

        res.status(200).json({ toughts: toughts })
    }

}