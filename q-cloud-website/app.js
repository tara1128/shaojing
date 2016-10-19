var koa = require('koa');
var app = koa();
var Router = require('koa-router');
var router = Router();
var port = 8081;

app.use(router.routes());
app.use(router.allowedMethods());

router.get('/', function *(){
  this.body = 'Welcome to my Koa project!';
});

router.get('/user/:id', function *(){
  this.body = 'User is ' + this.params.id;  
});




app.listen(port);
