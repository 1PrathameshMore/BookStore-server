const Author = require('../models/Author')
const asyncHandler = require('express-async-handler')

// @desc Get All Authors
// @route GET /author
// @access PUBLIC
const getAllAuthors = asyncHandler(async (req, res) => {
    const authors = await Author.find({}).exec()

    if (authors) {
        return res.status(200).json({ success: true, data: authors })
    } else {
        return res.status(400).json({ success: false, message: 'Invalid Authors Data Recieved' })
    }
})

// @desc Get Author Details including Books
// @route GET /author/:authorId
// @access PUBLIC
const getAuthor = asyncHandler(async (req, res) => {
    const id = req.params.authorId

    const author = await Author.findById(id).populate('books').exec()

    if (author) {
        return res.status(200).json({ success: true, data: author })
    } else {
        return res.status(400).json({ success: false, message: 'Invalid Authors Data Recieved' })
    }
})

// @desc Create New Author Detail
// @route POST /author
// @access PRIVATE Temp
const addNewAuthor = asyncHandler(async (req, res) => {
    const { name, profileImage, info } = req.body
    if (!name) {
        return res.status(400).json({ success: false, message: 'All fields required' })
    }

    const authorObject = { name }

    if (typeof info === 'string' && info.length > 0) {
        authorObject.info = info
    }

    if (typeof profileImage === 'string' && profileImage.length > 0) {
        authorObject.profileImage = profileImage
    }

    const newAuthor = await Author.create(authorObject)

    if (newAuthor) {
        return res.status(201).json({ success: true, data: newAuthor })
    } else {
        return res.status(400).json({ success: false, message: 'Invalid Author Data Received' })
    }
})

module.exports = {
    getAuthor,
    getAllAuthors,
    addNewAuthor
}