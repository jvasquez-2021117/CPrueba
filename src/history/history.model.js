'use strict'

const mongoose = require('mongoose');

const historySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    publication: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publication',
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    }
}, {
    versionKey: false
})

module.exports = mongoose.model('History', historySchema);