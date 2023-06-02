const Book = require('../models/Book')
const Order = require('../models/Order')
const asyncHandler = require('express-async-handler')

// @desc Get Orders Related To User
// @route GET /order/:userId
// @access PRIVATE
const getUserOrders = asyncHandler(async (req, res) => {
    const user = req.params.userId

    const orders = await Order.find({ user }).populate('books')

    if (orders) {
        return res.status(200).json({ success: true, data: orders })
    } else {
        return res.status(400).json({ success: false, message: 'Invalid Order data Received' })
    }
})

// @desc Post New Order
// @route POST /order
// @access PRIVATE
const addNewOrder = asyncHandler(async (req, res) => {
    const { user, books } = req.body

    if (!user || !Array.isArray(books) || !books.length) {
        return res.status(400).json({ success: false, message: 'All fields required' })
    }

    const newOrder = await Order.create({ user, books })

    if (newOrder) {
        const updatedBooks = await Promise.all(newOrder.books.map(async ({ book, count }) => {
            const bookToUpdate = await Book.findById(book)
            bookToUpdate.totalOrders += count
            const updatedBook = await bookToUpdate.save()
            return updatedBook
        }))

        return res.status(201).json({ success: true, data: newOrder })
    } else {
        return res.status(400).json({ success: false, message: 'Invalid Order Data Receieved' })
    }
})

module.exports = {
    getUserOrders,
    addNewOrder
}