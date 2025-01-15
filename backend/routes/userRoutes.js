const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
//const verifyToken = require('../helpers/verify-token')

router.post("/register", UserController.register)
router.post("/login", UserController.login);
router.get("/checkuser", UserController.checkUser)
// router.get('/:id', UserController.getUserById)

router.get('/verifyAuth', UserController.verifyAuth);

module.exports = router