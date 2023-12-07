'use strict'

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const port = process.env.PORT
const { Router } = require('express');

//import routes
const userRoutes = require('../src/user/user.routes');
const publicationRoutes = require('../src/publication/publication.routes');
const historyRoutes = require('../src/history/history.routes');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

//useRoutes
app.use('/user', userRoutes);
app.use('/publication', publicationRoutes);
app.use('/history', historyRoutes);

exports.initServer = () => {
    app.listen(port);
    console.log(`Server http running in port ${port}`);
}