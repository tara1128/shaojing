/*
  Javascript for chat page, executed in browser.
  Author: Alex Wang
  Date: 2015-08-24
  Latest modified: 2016-03-25 16:56
*/

(function() {

  var socket = io.connect('/socket');

  // Get room id from the url:
  var RoomId = Number(window.location.pathname.match(/\/chat\/(\d+)$/)[1]);
  var me = $.cookie("jidewebchat_nickname");

  // Socket event binding:
  socket.on("connect", function(){
    socket.emit("load", RoomId);
  });

  socket.on("img", function(data){
  });

  socket.on('startChat', function( data ){
    renderUsers( data.number, data.user );
  });

  socket.on("peopleinchat", function(data){
    var howManyPeople = data.number;
    if( howManyPeople == 0 ){
      makePopAlert('No one here...', 0, 'Ok');
    }else if( howManyPeople == 1 ){
      renderUsers( 1, data.user );
    }else if( howManyPeople == 2 ){
      renderUsers( 2, data.user );
    }else if( howManyPeople == 3 ){
      renderUsers( 3, data.user );
    }else{
      // Too many people
    }
  });

  socket.on("receive", function(data){
    renderMsg(data);
  });

  function renderMsg( data ) {
    var msg = data.msg;
    var user = data.user;
    var time = data.time || new Date().getTime();
    var dialogBox = $(".J_showDialogs");
    var field = $(".J_textarea");
    var tmpl = '<div class="one-says">\
                  <span class="person">' + user + ': </span>\
                  <span class="sentence"> ' + msg + ' </span>\
                  <span class="times">(' + formatTime(time) + ')</span>\
                </div>';
    var tmpl_me = '<div class="one-says me">\
                    <span class="times">(' + formatTime(time) + ')</span>\
                    <span class="sentence"> ' + msg + ' </span>\
                    <span class="person"> :' + user + '</span>\
                  </div>';
    if( user == me ){
      dialogBox.append( tmpl_me );
    }else{
      dialogBox.append( tmpl );
    }
    field.val("");
  };


  // First to query userState to check if has logged in ===>
  $.ajax({
    url: '/queryUserState',
    type: 'POST',
    data: JSON.stringify({"a":""}),
    contentType: "application/json; charset=utf-8",
    success: function(data) {
      if( data == 'false' ){
        location.href = '/';
      }else{
        var name = data.nickname;
        var roomId = data.roomId;
        if( roomId == RoomId ){
          renderContent(name, roomId);
        }else{
          location.href = '/';
        }
      }
    },
    error: function(r) {
      location.href = '/';
    }
  });

  // Click to send messages:
  $(".J_editSend").click(function() {
    sendMessage();
  });

  $("body").keypress(function(e){
    if( e.keyCode == 13 ){
      sendMessage();
    }
  });

  function sendMessage() {
    var field = $(".J_textarea");
    var message = field.val();
    var username = $(".J_editSend").attr("data-username");
    if(!message) {
      makePopAlert('Please make sure you have a message to send!', 0, 'Ok');
    }else{
      var msgData = {
        msg: message,
        user: username
      };
      socket.emit('msg', msgData);
      renderMsg( msgData );
    }

  };

  function renderContent( name, roomId ) {
    socket.emit('login', {
      userName: name,
      id: roomId
    });
    $(".J_info").html("Welcome, " + name + "!");
    $(".J_editSend").attr("data-username", name);
    // Define what to do when chat starts:
  };

  // Render users who have logged in:
  function renderUsers( peopleNumber, name ) {
    var container = $(".J_userList");
    container.html("");
    var tmpl = function(n){
      return '<a class="one-user">' + n + '</a>';
    };
    if( peopleNumber < 2 ){
      container.append( tmpl(name) );
    }else{
      $.each(name, function(index, value){
        container.append( tmpl(value) );
      });
    }
  };

  // Log out:
  function requestLogout() {
    $.ajax({
      url: '/logout',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({"a": ""}),
      success: function( data ){
        if( data == "ok" ){
          location.href = "/";
        }else{
          makePopAlert('Server was dead! Sorry!', 0, 'Oh Shit', function(){
            location.href = '/';
          });
        }
      },
      error: function() {
        makePopAlert('Server was dead! Sorry!', 0, 'Oh Shit', function(){
          location.href = '/';
        });
      }
    });
  };

  // Format time:
  function formatTime( time ){ //ms
    var _d = new Date( time );
    var year = _d.getFullYear();
    var month = _d.getMonth() + 1; 
    var date = _d.getDate();
    var hour = formatNum( _d.getHours() );
    var minute = formatNum( _d.getMinutes() );
    var second = formatNum( _d.getSeconds() );
    var giveTime = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    return giveTime;
  };
  function formatNum( t ){
    if( t < 10 ){ t = "0" + t; }
    return t;
  };

  // Click to logout:
  $(".J_logout").bind("click", function(){
    makePopAlert('Are you sure you want to sign out?', 0, 'Of Course', function(){
      requestLogout();
    }, 'Not Really');
  });

})();
