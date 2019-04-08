var express = require('express');
var cors = require('cors')
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var compression = require('compression');

var app = express();

app.use(compression()); //Compress all routes
app.use(helmet());
app.use(cors());

var user = require('./routes/user');
var cities = require('./routes/cities');
var oauth = require('./routes/oauth');
var products = require('./routes/products');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/oauth', oauth);
app.use('/user', user);
app.use('/cities', cities);
app.use('/products', products);
app.use('/docs', express.static('./apidoc'))
module.exports = app;
