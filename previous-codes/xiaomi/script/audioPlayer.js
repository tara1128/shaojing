  var playState = {};
  var playStateIndex = 0;
  window.audioPlayerCB = function( status , cid ){
    if( cid in playState ){
      var au = playState[cid];
      au.trigger( status );
    }
  };

  function audioPlayer( el, playCls, pauseCls ){ //playCls是播放时的样式，pauseCls是停止时的样式
    var src = el.getAttribute("src"); //src是音频的URL地址
    var playIndex = el.getAttribute("playIndex");
    if( !playIndex ){
      playIndex = playStateIndex++;
      el.setAttribute( "playIndex", playIndex );
    }
    var au = playState[ playIndex ];
    if( !au ){ //第一次播放
       stopAllPlayer( playIndex );
      if( window.HTMLAudioElement ){ //支持audio时
        px = new Audio();
        au = playState[ playIndex ] = { x: px, c: el.className };
        px.addEventListener("play", function(){
          el.className = au.c + " " + playCls; //多个class之间必须有空格
        }, false);
        px.addEventListener("ended", function(){
          el.className = au.c;
        }, false);
        px.addEventListener("pause", function(){
          el.className = au.c + " " + pauseCls;
        }, false);
        px.src = src;
        px.play();
      }else{ //不支持audio时则调用swf文件
        var swf = $.flash.create({
          swf: 'player7.swf?t=' + new Date().getTime(), //player7.swf路径请根据实际情况定义
          width: '1',
          height: '1',
          wmode: 'transparent',
          allowScriptAccess: 'always',
          allowNetworking: 'all',
          flashvars: {
          	filepath: encodeURIComponent( src ), //src是音频的URL
          	autoplay: 'yes',
            cid : playIndex,
            callback : window.audioPlayerCB //播放后的回调
          }
        });
        au = playState[ playIndex ] = $({ x: swf, c: el.className });
        au.bind("play", function(){
          el.className = this.c + " " + playCls;
        });
        au.bind("pause", function(){
          el.className = this.c + " " + pauseCls;
        })
        au.bind("ended", function(){
          el.className = this.c;
        });
        $(el).append( swf );
      }
    }else{ //不是第一次播放
     if( !window.Audio ){
       au = au[0];
     }
     if( el.className == au.c + " "  + playCls ){
       if( window.Audio ){
         au.x.pause();
       }else{
         au.x.pauseMp3(); //pauseMp3()是swf文件提供的方法
         el.className = au.c;
       }
     }else if( el.className == au.c || el.className == au.c + " " + pauseCls ){
       stopAllPlayer( playIndex ); //播放前先停止所有音频。这样避免了两个或多个音频同时播放
       if( window.Audio ){
          au.x.play();
       }else{
          au.x.playMp3(); //playMp3()是swf文件提供的方法
       }
     }
   }
  };

  function stopAllPlayer( cid ){
    for( var i in playState ){
      if( i != cid ){
        var au = playState[i];
        if ( window.Audio ){
          au.x.pause();
        }else{
          au[0].x.pauseMp3();
        }
      }
    }
  };
