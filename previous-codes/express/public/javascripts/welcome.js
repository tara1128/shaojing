/*
  Javascript for welcome
  Author: Alex Wang
  Date: 2015-08-26
  Latest modified: 2015-08-26 18:15
*/

(function() {

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
        $(".J_enterRoom").click(function(){
          location.href = "/chat/" + roomId;
        });
      }
    },
    error: function(r) {
      location.href = '/';
    }
  });



})();
