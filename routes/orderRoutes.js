const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')

router.get('/:userId', orderController.getUserOrders)

router.post('/', orderController.addNewOrder)

module.exports = router