const Category = require('../models/Category')
const asyncHandler = require('express-async-handler')

// @desc Get All Categories
// @route GET /category
// @access PUBLIC
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({}).select('-books').lean().exec()

    if (categories) {
        return res.status(200).json({ success: true, data: categories })
    } else {
        return res.status(404).json({ success: false, message: 'Categories not found' })
    }
})

// @desc Add a New Category
// @route POST /category
// @access PRIVATE Temp
const addNewCategory = asyncHandler(async (req, res) => {
    const { name } = req.body
    if (!name) {
        return res.status(400).json({ success: false, message: 'All fields required' })
    }

    const duplicateCategory = await Category.findOne({ name })

    if (duplicateCategory) {
        return res.status(401).json({ success: false, message: 'Duplicate Category' })
    }

    const newCategory = await Category.create({ name })

    if (newCategory) {
        return res.status(201).json({ success: true, data: newCategory })
    } else {
        return res.status(400).json({ success: false, message: 'Invalid Category Data Received' })
    }
})

module.exports = { getAllCategories, addNewCategory }