// Pinja Mikkonen
// WWW-programming 2019 spring
// 10ECTS coursework

const http = require('http');
const hostname = '0.0.0.0';
const port = 3000;

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const hbs = require('express-hbs');
const bodyParser = require('body-parser');
const sanitizer = require('express-sanitizer');
const csrf = require('csurf');
const jwt = require('jsonwebtoken');
const xss = require('xss-filters');
const session = require('express-session');

const api = require('./routers/api.js');
const router = require('./routers/router.js');

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(sanitizer());

app.engine('hbs', hbs.express4());
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

var mongoDB = 'mongodb://127.0.0.1/WWWProgramming';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// React single page -application
app.use('/', express.static('public'));

// HBS-generated content
// app.use('/', router);
app.use('/api', api);

app.listen(port, () => console.log('App listening to ' + port));
