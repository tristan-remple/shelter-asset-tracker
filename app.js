const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./app/routes/index');
const satRouter = require('./app/routes/sat');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors({
    origin: process.env.APP_URL,
    allowedHeaders: ['authorization', 'content-type'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

app.use('/', indexRouter);
app.use('/sat', satRouter);

module.exports = app;