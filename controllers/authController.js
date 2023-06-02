const User = require('../models/User')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')

// @desc Log In user
// @route POST /auth/login { axios does not support body data for GET Requests }
// @access PUBLIC
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'All fields required' })
    }

    const foundUser = await User.findOne({ email })

    if (!foundUser) {
        return res.status(401).json({ success: false, message: 'User not found' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) {
        return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    res.status(200).json({ success: true, data: foundUser })

})

// @desc Register a new user
// @route POST /auth/register
// @access PUBLIC
const registerNewUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields required' })
    }

    const foundUser = await User.findOne({ email }).exec()

    if (foundUser) {
        return res.status(401).json({ success: false, message: 'Duplicate Email' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userObject = { name, password: hashedPassword, email }

    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ success: true, data: user })
    }
    else {
        res.status(400).json({ success: false, message: 'Invalid user data recieved' })
    }
})

module.exports = {
    loginUser,
    registerNewUser
}