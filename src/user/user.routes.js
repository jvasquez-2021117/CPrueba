'use strict'

const express = require('express');
const api = express.Router();
const userController = require('./user.controller');

//get
api.get('/getUsers', userController.getUsers);
api.get('/getUser', userController.getUser);

//post
api.post('/register', userController.register);
api.post('/login', userController.login);

//put
api.put('/updateUser/:id', userController.update);

//delete
api.delete('/deleteUser/:id', userController.delete);

module.exports = api;