/*
  app.js
*/

var koa = require('koa');
var app = new koa();
var Router = require('koa-router');
var router = Router();
var port = 3000;

var React = require('react');
var ReactDOMServer = require('react-dom/server');
// var App = React.createFactory(require('./components/app'));
var App = require('./components/app');

app.use(router.routes());
app.use(router.allowedMethods());

router.get('/', function *(){
  var markUp = ReactDOMServer.renderToString( App() );
  this.body = markUp;
});

app.listen(port, function(){
  console.log('App.js is running, listening 3000');  
});
