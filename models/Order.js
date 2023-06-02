const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
    {
        status: {
            type: Boolean,
            default: false
        },
        books: [
            {
                book: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Book",
                    required: true
                },
                count: {
                    type: Number,
                    required: true
                }
            }
        ],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Order', orderSchema)