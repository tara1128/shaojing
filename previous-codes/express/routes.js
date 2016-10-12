/* 
  routes.js for App
  Latest modified 2016-03-25 16:57
*/

var gravatar = require('gravatar');

module.exports = function(app, io) {

  var staticRoomId = 1357;

  // Get Home page =====>
  app.get('/', function(req, res){
    res.render('login', {
      title: 'Realtime App with socket.io',
      desc: 'Welcome, this is V2.0'
    });
  });

  // Get Reg page =====>
  app.get('/reg', function(req, res){
    res.render('register', {
      title: 'Become One of Us',
      desc: 'Register now, you\'re very welcome to become one of us!'
    });
  });

  // Post to query user state =====>
  app.post('/queryUserState', function(req, res){
    var _cookies = req.cookies;
    var u_name = _cookies.jidewebchat_nickname;
    var u_token = _cookies.jidewebchat_token;
    var u_roomid = _cookies.jidewebchat_roomid;
    var u_ip = req._remoteAddress;
    var STATE = {};
    if( u_name && u_token ){
      STATE['nickname'] = u_name;
      STATE['roomId'] = u_roomid;
      res.send( STATE );
    }else{ // not login
      res.send( 'false' );
    }
  });

  // Post to login =====>
  app.post('/login', function(req, res){
    var db = req.db;
    var phone = req.body.username;
    var psw = req.body.password;
    var collection = db.get('usercollection');
    var result = collection.findOne({phone: phone, password: psw}, function(err, doc){
      if(!doc){
        res.send("error");
      }else{
        var nickname = doc.nickname;
        var userPhone = doc.phone;
        var _sessionID = req.sessionID;
        var userInfo = {};
        userInfo['nickname'] = nickname;
        userInfo['userphone'] = userPhone;
        userInfo['roomId'] = staticRoomId;
        res.cookie( 'jidewebchat_nickname', nickname );
        res.cookie( 'jidewebchat_token', _sessionID );
        res.cookie( 'jidewebchat_roomid', staticRoomId );
        res.send( userInfo );
      }
    });
  });

  // Post to logout =====>
  app.post('/logout', function(req, res){
    res.cookie( 'jidewebchat_nickname', '' );
    res.cookie( 'jidewebchat_token', '' );
    res.cookie( 'jidewebchat_roomid', '' );
    res.send( 'ok' );
  });

  // Post to Register =====>
  app.post('/register', function(req, res){
    var db = req.db;
    var nickname = req.body.nickname;
    var phone = req.body.phone;
    var psw = req.body.password;
    var collection = db.get('usercollection');
    collection.insert({
      nickname: nickname,
      phone: phone,
      password: psw
    }, function( err, doc ){
      if(err) {
        res.send('error');
      }else{
        var userInfo = {};
        var _sessionID = req.sessionID;
        userInfo['nickname'] = doc.nickname;
        userInfo['userphone'] = doc.phone;
        res.cookie( 'jidewebchat_nickname', doc.nickname );
        res.cookie( 'jidewebchat_token', _sessionID );
        res.cookie( 'jidewebchat_roomid', staticRoomId );
        res.send( userInfo );
      }
    });
  });

  // Post to send a message =====>
  app.post('/message', function(req, res) {
    var msg = req.body.message;
    var sender = req.body.sender;
    var sendtime = req.body.sendtime;
    var db = req.db;
    var collection = db.get('msgcollection');
    collection.insert({
      message: msg,
      sender: sender,
      sendtime: sendtime
    }, function(err, doc) {
      if(err) {
        res.send('error');
      } else {
        var msgData = {};
        msgData['message'] = msg;
        msgData['sender'] = sender;
        msgData['sendtime'] = sendtime;
        res.send( msgData );
      }
    });
  });

  // Get welcome page =====>
  app.get('/welcome', function(req, res){
    var _cookies = req.cookies;
    var u_name = _cookies.jidewebchat_nickname;
    var u_token = _cookies.jidewebchat_token;
    if( u_name && u_token ){
      res.render('welcome', {
        title: 'Welcome to Realtime App with socket.io',
        desc: 'Hi ' + u_name + '! This is a cool place to chat. Enjoy!'
      });
    }else{ // Failed in writing cookies, so, back to register... 
      res.render('register', {
        title: 'Become One of Us',
        desc: 'Server sucks! Please register again!'
      });
    }
  });

  // Get create page =====>
  app.get("/create", function(req, res){
    var id =  Math.round( (Math.random() * 1000000) );
    res.redirect("/chat/" + id);
  });

  // Get chat room page with id =====>
  app.get("/chat/:id", function(req, res){
    res.render("chat", {
      title: 'Realtime App with socket.io'
    });
  });

  // =========================================================== //
  // =========================================================== //

  // Listening to events of socket:
  var chat = io.of("/socket").on("connection", function(socket){
		socket.on('load',function(data){ // In load (not login), can catch the length of clients
      if( chat.clients(data).length === 0 ){
        socket.emit('peopleinchat', {number: 0});
      }else if( chat.clients(data).length === 1 ){
        socket.emit('peopleinchat', {
          number: 1,
          user: chat.clients(data)[0].username,
          id: data
        });
      }else if( chat.clients(data).length === 2 ){
        socket.emit('peopleinchat', {
          number: 2,
          user: [chat.clients(data)[0].username, chat.clients(data)[1].username],
          id: data
        });
      }else if( chat.clients(data).length === 3 ){
        socket.emit('peopleinchat', {
          number: 3,
          user: [chat.clients(data)[0].username, chat.clients(data)[1].username, chat.clients(data)[2].username],
          id: data
        });
      }else{
        socket.emit('peopleinchat', {
          state: 'too many people here!'
        });
      }
    });

		socket.on('login',function(data){
      var maxPeopleLength = 10;
      if( chat.clients(data.id).length < maxPeopleLength ){
        socket.username = data.userName;
        socket.room = data.id;
        socket.join(data.id); // join makes clients.length +1
        if( chat.clients(data.id).length >= 2 ) {
          dealWithClients(data);
        }
        // if length == 3 ...
      }
    });

    function dealWithClients(data) {
      var usernames = [];
      chat.clients(data.id).forEach(function(item, index){
        usernames.push( item.username );
      });
      chat.in(data.id).emit('startChat', {
        check: true,
        user: usernames,
        number: usernames.length,
        id: data.id
      });
    };

		socket.on('disconnect',function(data){
    });

		socket.on('msg',function(data){
      socket.broadcast.to(socket.room).emit('receive', {
        msg: data.msg,
        user: data.user,
        time: new Date().getTime()
      });
    });



  }); // End of connection

}; // End exports
