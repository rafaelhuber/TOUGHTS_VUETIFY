const mongoose = require('../db/conn')
const { Schema } = mongoose

const Toughts = mongoose.model(
    'Tought',
    new Schema({
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        user: Object,
    },
        { timestamps: true },
    )
)

module.exports = Toughts
