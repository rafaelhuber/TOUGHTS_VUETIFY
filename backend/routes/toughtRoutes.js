const express = require('express')
const router = express.Router()
const ToughtController = require('../controllers/ToughtController')
//const verifyToken = require('../helpers/verify-token')

router.get('/', ToughtController.showTought)
router.post('/add', ToughtController.create)
router.get('/mytoughts', ToughtController.getAllUserToughts)
router.patch('/:id', ToughtController.updatetought)
router.delete('/:id', ToughtController.removeToughtById)

module.exports = router