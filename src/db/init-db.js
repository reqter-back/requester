// var mongoose = require('mongoose');
// var init = function()
// {
//     var dev_db_url = 'mongodb://fakhrad:logrezaee24359@ds127995.mlab.com:27995/authdb'
//     var mongoDB = process.env.DATABASE_URL || dev_db_url;
//     mongoose.connect(mongoDB);
//     mongoose.Promise = global.Promise;
//     var db = mongoose.connection;
//     db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//     db.on('connected', ()=>{
//       console.log('MongoDb connected');

//     });
// }
// module.exports = init;
var mongoose = require("mongoose");
var connections = require("./connections");

var dev_db_url =
  "mongodb://fakhrad:logrezaee24359@ds243188-a0.mlab.com:43188,ds243188-a1.mlab.com:43188/content-db?replicaSet=rs-ds243188";
var mongoDB = process.env.DATABASE_URL || dev_db_url;

var auth_db_url =
  "mongodb://fakhrad:logrezaee24359@ds127995.mlab.com:27995/authdb";
var authDB = process.env.AUTHDB_URL || auth_db_url;
var db1 = mongoose.createConnection(mongoDB);
var db2 = mongoose.createConnection(authDB);
mongoose.Promise = global.Promise;
db1.on("error", console.error.bind(console, "ContentDb connection error:"));
db1.on("connected", () => {
  console.log("ContentDb connected");
});
connections.contentDb = db1;

db2.on("error", console.error.bind(console, "AuthDb connection error:"));
db2.on("connected", () => {
  console.log("AuthDb connected");
});
connections.authDb = db2;
