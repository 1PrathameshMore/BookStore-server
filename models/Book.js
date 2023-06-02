const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mainImage: {
        type: String,
        required: true
    },
    rating: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.0
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    price: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    totalOrders: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }
    ]
})

module.exports = mongoose.model('Book', bookSchema)