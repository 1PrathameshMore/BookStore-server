const User = require('../models/User')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')

// @desc Update User Details including password
// @route PATCH /user { axios does not support body data for GET Requests }
// @access PUBLIC
const updateUserDetails = asyncHandler(async (req, res) => {
    const { id, name, email, password, address } = req.body

    const user = await User.findById(id).select('-password')

    if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' })
    }

    if (name) {
        user.name = name
    }

    if (email) {
        const duplicateEmail = await User.findOne({ email })

        if (duplicateEmail._id === id) {
            return res.status(401).json({ success: false, message: 'Duplicate Email' })
        }
        else {
            user.email = email
        }
    }

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
    }

    if (Object.keys(address).length > 0) {
        user.address = address
    } else {
        return res.status(401).json({ success: false, message: 'Address Must Include all details' })
    }

    const newUser = await user.save()

    if (newUser) {
        return res.status(201).json({ success: true, data: newUser })
    } else {
        return res.status(400).json({ success: false, message: 'Invalid User Data Recieved' })
    }
})

module.exports = {
    updateUserDetails
}