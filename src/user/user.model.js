'use strict'

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        uppercase: true
    }
},
{
    versionKey: false
}
);

module.exports = mongoose.model('User', userSchema);