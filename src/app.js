var express = require("express");
var cors = require("cors");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var compression = require("compression");

var app = express();

app.use(compression()); //Compress all routes
app.use(helmet());
app.use(cors());

var customer = require("./routes/customers");
var lists = require("./routes/lists");
var auth = require("./routes/auth");
var quote = require("./routes/quotes");
var request = require("./routes/requests");
// var partner = require('./routes/partners');
// var products = require('./routes/products');

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/v1/customers", customer);
// app.use('/partners', partner);
app.use("/api/v1/quotes", quote);
app.use("/api/v1/requests", request);
app.use("/api/v1/lists", lists);
app.use("/api/v1/auth", auth);
// app.use('/products', products);
app.use("/docs", express.static("./apidoc"));
module.exports = app;
