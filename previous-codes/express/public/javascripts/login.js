/*
  Javascript for login, executed in browser.
  Author: Alex Wang
  Date: 2015-08-24
  Latest modified: 2016-03-18 16:56
*/

(function() {

  // If not logged in, render login:
  var U_lgUsername = new Input({
    id: 'lgUsername_id',
    name: 'username',
    type: 'text',
    validType: ['REG_Phone'],
    clsName: 'J_username',
    placeholder: 'Please enter your phone number',
    maxlength: 11,
    errorMsg: 'Is it your phone number?',
    style: 'U_inputPrimary flex100'
  });
  var U_lgPassword = new Input({
    id: 'lgPassword_id',
    name: 'password',
    type: 'password',
    validType: [],
    clsName: 'J_password',
    maxlength: 20,
    placeholder: 'Your password here',
    errorMsg: 'Cannot remember your password?',
    style: 'U_inputPrimary flex100'
  });
  U_lgUsername.renderTo( $(".J_usernameDiv") );
  U_lgPassword.renderTo( $(".J_passwordDiv") );

  $(".J_login").bind('click', function(){
    if(U_lgUsername.validation && U_lgPassword.validation){
      var phone = U_lgUsername.value;
      var psw = U_lgPassword.value;
      requestLogin(phone, psw);
    }
  });

  function requestLogin( phone, psw ) {
    var d = { username: phone, password: psw };
    $.ajax({
      url: '/login',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(d),
      success: function( data ){
        if( data != "error" ){
          var nickname = data.nickname;
          var roomId = data.roomId;
          makePopAlert('Hello! ' + nickname + '! Welcome to Web Chat!', 1, 'OK', function(){
            location.href = '/chat/' + roomId;
          });
        }else{
          makePopAlert('There was an error! Try again!', 0, 'Oh Shit', function(){
            location.href = '/';
          });
        }
      },
      error: function(){
        makePopAlert('Server was dead! Sorry!', 0, 'Oh Shit', function(){
          location.href = '/';
        });
      }
    });
  };


})();
