/*
  Javascript for register
  Author: Alex Wang
  Date: 2015-08-24
  Latest modified: 2015-08-26 18:15
*/

(function() {

  // Register render ===>
  var U_regNickname = new Input({
    id: 'regNickname_id',
    name: 'nickname',
    type: 'text',
    validType: [],
    clsName: 'J_nickname',
    placeholder: 'Give yourself a nickname',
    maxlength: 30,
    errorMsg: 'Error',
    style: 'U_inputPrimary flex100'
  });
  U_regNickname.renderTo( $(".J_regNicknameDiv") );

  var U_regPhone = new Input({
    id: 'regPhone_id',
    name: 'phone',
    type: 'text',
    validType: ['REG_Phone'],
    clsName: 'J_phone',
    placeholder: 'Use your phone number to sign in',
    maxlength: 11,
    errorMsg: 'Are you sure it\'s your phone number?',
    style: 'U_inputPrimary flex100'
  });
  U_regPhone.renderTo( $(".J_regPhoneDiv") );


  var U_regPassword = new Input({
    id: 'regPassword_id',
    name: 'password',
    type: 'password',
    validType: ['REG_Password'],
    clsName: 'J_password',
    maxlength: 20,
    placeholder: 'Set password',
    errorMsg: 'Cannot be shorter than 6 characters',
    style: 'U_inputPrimary flex100'
  });
  U_regPassword.renderTo( $(".J_regPasswordDiv") );

  var U_regConfirmPsw = new Input({
    id: 'regConfirmPsw_id',
    name: 'confirmPsw',
    type: 'password',
    validType: ['REG_Password'],
    clsName: 'J_passwordConfirm',
    maxlength: 20,
    placeholder: 'Confirm your password',
    errorMsg: 'There\'s something wrong here',
    style: 'U_inputPrimary flex100'
  });
  U_regConfirmPsw.renderTo( $(".J_regConfirmPasswordDiv") );


  $(".J_Register").click(function(){
    if(U_regNickname.validation && U_regPhone.validation && U_regPassword.validation && U_regConfirmPsw.validation) {
      if( U_regPassword.value != U_regConfirmPsw.value ){
        makePopAlert('Passwords do NOT match!', 0, 'OK', function(){
          $(".J_passwordConfirm").focus();
        });
      }else{
        var nickname = U_regNickname.value;
        var phone = U_regPhone.value;
        var psw = U_regPassword.value;
        sendRequest( nickname, phone, psw );
      }
    }
  });

  function sendRequest( name, phone, psw ) {
    var d = { nickname: name, phone: phone, password: psw };
    $.ajax({
      url: '/register',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(d),
      success: function( data ){
        if( data == 'error' ){
          makePopAlert('Register Failed! Try again!', 0, 'All right', function(){
            location.href = '/reg';
          });
        }else{
          location.href = '/welcome';
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
