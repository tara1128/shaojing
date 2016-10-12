/*
  App.js, core of app
  Author: Alex Wang
  Date: 2015-09-01
  Latest modified 2016-03-18 15:44
*/


var express = require('express');
var app = express();

var port = process.env.PORT || 8081;

var sio = require('socket.io');
var io = sio.listen(app.listen(port));

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('127.0.0.1:27017/jidewebchat'); // Use "localhost" not work!

// To use DATABASE, we need to code like this:
app.use(function( req, res, next ){
  req.db = db;
  next();
});

require('./config')(app, io);
require('./routes')(app, io);

console.log('App starts! Check it at Port :' + port);

