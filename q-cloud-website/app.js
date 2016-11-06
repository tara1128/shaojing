/*
  The core of the app.
  Should be synchronous with files on cloud.
  Author: Alex Wang.
  Latest modified: 2016-10-20 11:14
*/

var koa = require('koa');
var app = koa();
var Router = require('koa-router');
var router = Router();
var port = 8081;

var wrapper = require('co-mysql');
var mysql = require('mysql');
var co = require('co');

app.use(router.routes());
app.use(router.allowedMethods());

router.get('/', function *(){
  this.body = '123';
});

router.get('/user/:id', function *(){
  this.body = 'User is ' + this.params.id;  
});

console.log( wrapper );
//console.log( mysql );
//console.log( co );



app.listen(port);
