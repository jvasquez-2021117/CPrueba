'use strict'

const express = require('express');
const api = express.Router();
const historyController = require('./history.controller');

//get
api.get('/get', historyController.getHistory);
api.get('/getByUser/:id', historyController.getByUser);
api.get('/getSold/:id', historyController.getSold);
api.get('/getBought/:id', historyController.getBought);

module.exports = api;