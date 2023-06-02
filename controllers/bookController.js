const Author = require('../models/Author')
const Book = require('../models/Book')
const asyncHandler = require('express-async-handler')
const Category = require('../models/Category')

// @desc Get All Books
// @route GET /book
// @access PUBLIC
const getAllBooks = asyncHandler(async (req, res) => {
    const books = await Book.find({}).populate('author').exec()
    const dataBooks = books.sort((a, b) => b.totalOrders - a.totalOrders)

    if (books) {
        return res.status(200).json({ success: true, data: books })
    } else {
        return res.status(400).json({ success: false, message: 'Invalid Books Data Receieved' })
    }
})

// @desc Get Book Details 
// @route GET /book/:bookId
// @access PUBLIC
const getBook = asyncHandler(async (req, res) => {
    const bookId = req.params.bookId

    const book = await Book.findById(bookId).populate('author')

    if (book) {
        return res.status(200).json({ success: true, data: book })
    } else {
        return res.status(400).json({ success: false, message: 'Invalid Book Data Recieved' })
    }
})

// @desc Add A New Book Entry
// @route POST /book
// @access PRIVATE 
const addNewBook = asyncHandler(async (req, res) => {
    const { name, description, price, author, categories, mainImage } = req.body

    if (!name || !description || typeof price !== 'number' || price < 0 || !author || !Array.isArray(categories) || !categories.length) {
        return res.status(400).json({ success: false, message: 'All fields required' })
    }

    const duplicateEntry = await Book.findOne({ name })

    if (duplicateEntry && duplicateEntry.author === author) {
        return res.status(401).json({ success: false, message: 'Duplicate Book Entry' })
    }

    const bookObject = { name, description, price, author, categories, mainImage }

    const newBook = await Book.create(bookObject)

    if (newBook) {
        const bookAuthor = await Author.findById(author)
        bookAuthor.books.push(newBook._id)

        const bookAuthorUpdated = await bookAuthor.save()

        if (!bookAuthorUpdated) {
            return res.status(400).json({ success: false, message: 'Invalid Author Data Received' })
        }

        const updatedCategories = await Promise.all(newBook.categories.map(async (category) => {
            const categoryObject = await Category.findById(category)
            categoryObject.books.push(newBook._id)
            const updatedCategory = await categoryObject.save()
            return updatedCategory
        }))

        return res.status(201).json({ success: true, data: newBook })
    } else {
        res.status(400).json({ success: false, message: 'Invalid Book Data Receieved' })
    }
})

module.exports = {
    getAllBooks,
    getBook,
    addNewBook
}