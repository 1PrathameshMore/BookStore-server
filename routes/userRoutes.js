const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.patch('/', userController.updateUserDetails)

module.exports = router