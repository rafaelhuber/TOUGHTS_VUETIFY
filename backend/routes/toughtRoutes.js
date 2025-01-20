const express = require('express')
const router = express.Router()
const ToughtController = require('../controllers/ToughtController')
//const verifyToken = require('../helpers/verify-token')

router.get('/', ToughtController.showTought)
router.post('/add', ToughtController.create)
router.get('/mytoughts', ToughtController.getAllUserToughts)
router.patch('/:id', ToughtController.updatetought)
router.delete('/:id', ToughtController.removeToughtById)
router.patch('/:id/like', ToughtController.likePost)
router.patch('/:id/comment', ToughtController.addComment)
router.get('/:id/comment', ToughtController.getComment)
router.get('/:id/like', ToughtController.showLike)

module.exports = router