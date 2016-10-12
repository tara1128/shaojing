/*
  config.js
  Catching 2 parameters from app.js: app, io
*/

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');

module.exports = function(app, io){
	// app.set('view engine', 'html');
  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
	app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
	// app.engine('html', require('ejs').renderFile);
	app.use(express.static(__dirname + '/public'));
	io.set('log level', 1); // Have no idea what this command is for...
};
