'use strict'

const express = require('express');
const api = express.Router();
const publicationController = require('./publication.controller');
const multiparty = require('connect-multiparty')
const upload = multiparty({ uploadDir: './upload/publication' })

//get
api.get('/get-image/:fileName', upload , publicationController.getImage);
api.get('/getPublications', publicationController.get);
api.get('/getPublicationsByUser/:id', publicationController.getById);
api.get('/getNoUser/:id', publicationController.getNoUser);

//post
api.post('/createPublication', upload , publicationController.add);

//delete
api.delete('/deletePublication', publicationController.delete);

//put
api.put('/buy', publicationController.buy);

module.exports = api;