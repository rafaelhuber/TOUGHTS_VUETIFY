const Toughts = require('../models/Tought')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId
//const User = require('../models/User')


module.exports = class ToughtController {

    static async create(req, res) {
        const { title, text } = req.body

        // get tought owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        // validations
        if (!title || !text) {
            res.status(422).json({ message: "Campo obrigatorio!" })
        }


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

        try {
            const token = getToken(req)
            const user = await getUserByToken(token)
            const tought = await Toughts.find({ 'user._id': user._id }).sort('-createdAt')
            res.status(200).json({ tought })
        } catch (error) {
            return res.status(404).json()
        }
    }

    static async updatetought(req, res) {
        const id = req.params.id
        const { title, text } = req.body
        const updatedData = {}

        try {
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
        } catch (error) {
            return res.status(404).json()
        }


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

    static async likePost(req, res) {

        const postId = req.params.id;
        const token = getToken(req)
        const user = await getUserByToken(token)

        try {

            const userId = user._id.toString();
            const tought = await Toughts.findById(postId);

            if (!tought) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // Verifica se o usuário já deu "like"
            const alreadyLiked = tought.likes.includes(userId);

            if (alreadyLiked) {
                // Remove o "like"
                tought.likes = tought.likes.filter(id => id.toString() !== userId.toString());
                res.status(200).json({
                    userId,
                    likes: tought.likes
                });
            } else {
                // Adiciona o "like"
                tought.likes.push(userId);
                res.status(200).json({
                    userId,
                    likes: tought.likes
                });
            }
            await tought.save();
            return;
        } catch (error) {
            //console.log('error', error);

            return res.status(500).json({ message: 'Error liking the post', error });
        }
    };

    static async showLike(req, res) {
        try {
            const postId = req.params.id; // ID do post
            const token = getToken(req); // Obtém o token
            const user = await getUserByToken(token); // Valida o usuário

            // Busca o pensamento específico
            const tought = await Toughts.findById(postId).select('likes'); // Apenas o campo `likes`

            if (!tought) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // Retorna os nomes no campo `likes`
            res.status(200).json({ likes: tought.likes });
        } catch (error) {
            console.error('Error in showLike:', error);
            res.status(500).json({ message: 'Error fetching likes', error });
        }
    }
    static async addComment(req, res) {

        const { commentText } = req.body;
        const postId = req.params.id


        const token = getToken(req); // Obtém o token
        const user = await getUserByToken(token); // Valida o usuário

        try {

            const userId = user._id.toString();
            console.log('user', user);


            const tought = await Toughts.findById(postId);



            if (!tought) return res.status(404).json({ message: "Pensamento não encontrado." });

            // Adiciona o comentário ao array de comments
            tought.comments.push({
                userId: userId,
                name: user.name,
                text: commentText
            });


            // Salva o post com o novo comentário
            await tought.save();

            res.status(200).json(tought);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao adicionar comentário." });
        }
    };


    static async getComment(req, res) {
        const postId = req.params.id; // Obtém o ID do post da URL

        try {


            // Busca o post pelo ID
            const tought = await Toughts.findById(postId);

            // Verifica se o post existe
            if (!tought) {
                return res.status(404).json({ message: 'Post não encontrado' });
            }

            // Retorna os comentários do post
            return res.status(200).json({ comments: tought.comments });
        } catch (error) {
            console.error('Erro ao buscar os comentários:', error);
            return res.status(500).json({ message: 'Erro ao buscar os comentários' });
        }
    }
}