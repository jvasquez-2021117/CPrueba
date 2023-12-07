'use strict'

const mongoose = require('mongoose');

const publicationSchemma = mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    productStatus: {
        type: String,
    },
    description: {
        type: String
    }
}, {
    versionKey: false
})

module.exports = mongoose.model('Publication', publicationSchemma);