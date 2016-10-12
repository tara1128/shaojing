/*
  Latest modified at 2015-06-30 19:35
  这里包含反向映射（从属性值反向查询id）的方法，和图片响应滚轮垂直滚动的事件。
*/
(function(){

  // 渲染产品某一条规格的全部数据，每次用户点击切换属性时都会调用此方法
  // 参数列表 [ res是服务器返回的数据集，id是指定要渲染的对应规格条目的id，即specId ]
  function renderProduct( res, id ) {
    var data = res.data; // data是规格列表集
    var special = formatToArray( res.special ); // 特殊属性的集合，需转换为数组
    var _id = parseInt( id ); // 指定渲染的产品规格条目的id
    for( var a = 0; a < data.length; a++ ){
      if( data[a].id == _id ){
        var item = data[a];
        break;
      }
    };
    if( !item ){ // 可以找到指定id时，渲染指定的规格条目，未找到指定id，则渲染该产品下的第一个规格条目
      var item = data[0];
      _id = item.id;
    };
    if( FCache['code'] ){ // 从缓存里取数据，当前规格条目有F码优惠时
      $(".J_addToCart").attr("data-id", _id).hide();
      $(".J_noCoupon").hide();
      $(".J_hasCounpon").show();
    }else{ // 无优惠时
      $(".J_addToCart").attr("data-id", _id).show();
      $(".J_noCoupon").show();
      $(".J_hasCoupon").hide();
    }
    $(".J_buyNow").attr("data-id", _id);
    for( var p in item ){ // 遍历规格里的所有属性
      var element = $(".J_detail_" + p); // 属性对应的页面元素
      if( $.inArray( p, special ) > -1 ){ // 遍历时发现属性在特殊属性集合里，则特殊处理
        filtProperty( p, res, item );
      }else{
        if( p == "urls" ){ // 对于图片的渲染，每一次都要干掉旧的ul，重新填充新的ul并赋予id，然后赋予fullPage方法
          renderImgs( item, p, _id ); // 渲染这一条规格下的图片们
        }
        if( p == "price" && FCache['code'] ){ // 渲染价格时，要考虑当前是否有coupon，有则特殊渲染，无则无视之
          $(".J_nocoupon_price").html( item[p] );
          var old_price = parseFloat( item[p] ),
              coupon_price = parseFloat( FCache['coupon'] );
          if( old_price && coupon_price ){
            var new_price = old_price - coupon_price;
          }
          $(".J_coupon_price").html( new_price );
        } // 渲染coupon价格结束
        element.html( item[p] ); // 没有在特殊属性集合里的普通属性，直接渲染到页面
      }
    }
  };

  // 图片单独渲染
  // 对于图片的渲染，每一次都要干掉旧的ul，重新填充新的ul并赋予id，然后赋予fullPage方法
  function renderImgs( item, p, id ){
    var imgContainer = $(".J_scrollContainer");
    imgContainer.find(".J_scroll").remove(); // 干掉旧的ul
    var newUlTpl = '<ul class="J_scroll" id="J_scroll_' + id + '"></ul>'; // 新的ul并赋予对应id
    imgContainer.html( newUlTpl ); // 渲染新的ul
    var ulContainer = $("#J_scroll_" + id); // 缓存新的ul到变量里
    var imgsTpl = "";
    var imgList = formatToArray( item[p] ); // 获取该条规格的图片url数组
    var imgLen = imgList.length;
    for( var u = 0; u < imgLen; u++ ){
      imgsTpl += '<li class="section"><img class="J_imgs" src="' + imgList[u] + '"></li>';
    };
    ulContainer.html( imgsTpl ).J_scrollPage();
  };

  // 自定义滚动图片方法
  $.fn.J_scrollPage = function(){
    var me = $(this); // 要滑动的ul容器
    var trig = $(document);
    var lis = me.find("li");
    var len = lis.length;
    var winHeight = $(window).height();
    lis.each(function(i, item){
      $(item).css("height", winHeight + "px");
    });
    $(window).resize(function(){
      winHeight = $(window).height();
      lis.each(function(i, item){
        $(item).css("height", winHeight + "px");
      });
    });
    var prevTime = new Date().getTime();
    trig.unbind("wheel").bind("wheel", function(){
      mouseWheel(me, len, 0, "+", prevTime);
    });
  };

  function mouseWheel(me, len, flag, type, prevTime, e) { // type表示flag是递增还是递减，递减时，是已经滚到头了，反方向滚动
    e = e || window.event;
    var curTime = new Date().getTime();
    var timeDiff = curTime - prevTime;
    prevTime = curTime;
    if( timeDiff > 1000 ){
    var value = e.wheelDelta || -e.deltaY || -e.detail;
    var delta = Math.max(-1, Math.min(1, value));
    var myHeight = me.height();
    var singlePos = Math.floor( myHeight/len );
    var goDownArr = []; // 滚动的位移的值集
    for( var i = 0; i < len; i++ ){
      if( i == 0 ){ goDownArr.push( i*singlePos );
      }else{ goDownArr.push( -(i*singlePos) ); }
    };// end for
    if( delta < 0 ){ // 向下滚
      if( type == "+" ){ //正滚
        flag = flag + 1;
        if( flag == len ){ flag = flag - 2; type = "-"; }
      }else{ // 反滚
        flag = flag - 1;
        if( flag == -1 ){ flag = flag + 2; type = "+"; }
      }
    }else{ // 向上滚
      if( type == "+" ){ // 正滚
        flag = flag - 1;
        if( flag == -1 ){ flag = flag + 2; type = "-"; }
      }else{ // 反滚
        flag = flag + 1;
        if( flag == len ){ flag = flag - 2; type = "+"; }
      }
    }
    me.attr("style", Style( goDownArr[flag] ));
    var prevTime2 = new Date().getTime();
    $(document).unbind("wheel").bind("wheel", function(){
      mouseWheel( me, len, flag, type, prevTime2 );
    });
    }else{
      return false;
    }
  };

  function Style( pos ) {
    var s = 'touch-action:none;-webkit-transform:translate3d(0px, ' + pos + 'px, 0px);transform:translate3d(0px, ' + pos + 'px, 0px);-webkit-transition:all 1000ms ease;transition:all 1000ms ease;';
    return s;
  };










  // 特殊属性是动态渲染，这里是它的模板结构，参数p是指定的某特殊属性名
  function specialTpl( p, value, isChosen, flt ) {
    var chosenCls = (isChosen) ? "chosen" : ""; // 判断是否需要高亮显示当前被选中
    var fCls = (flt == "left") ? "fl" : "fr"; // 判断该属性在页面中的浮动方向
    var tpl = '<a class="btn-blank J_chsBtn J_detail_' + p + ' '+ chosenCls +' '+ fCls +'" data-token="'+ p +'" data-indexs="" href="javascript:;">'+ value +'</a>';
    return tpl;
  };
  // 处理special字符串变数组，去掉多余空格
  function formatToArray( specString ) {
    var specArr = specString.split(",");
    var res = [];
    specArr.forEach(function( item, i ){
      var newItem = item.trim();
      res.push(newItem);
    });
    return res;
  };

  // 特殊属性的渲染处理，参数p即表示指定的属性名，例如color，本注释说明以p传值为color为例
  function filtProperty( p, res, item ) { // item是当前渲染的这一条规格条目
    var data = res.data; // data是规格列表集
    var filtRes = {};
    filtRes[p] = []; // filtRes是一个以属性名color为key，以规格列表集里出现过的所有color的值的集合为value的对象。
    for( var k = 0; k < data.length; k++ ){
      var currentData = data[k];
      filtRes[p].push( currentData[p] ); // 遍历规格列表集，将所有规格的color属性所包含的值放在这个集合里(此时可能包含重复值，下面会去重)
    };
    var cleanValues = unique( filtRes[p] ); // 数组去重，缓存到变量cleanValues里，去重后是color属性在规格集里出现过的所有值
    var specialPrnt = $(".J_specialParent_" + p); // 页面中color属性的值们将要渲染到的容器元素
    specialPrnt.find(".J_chsBtn").remove(); // 渲染之前先把页面里的旧数据干掉
    for( var i = 0; i < cleanValues.length; i++ ){ // 遍历color属性的这些值
      if( cleanValues[i] == item[p] ){ // 如果某个值和当前页面要展示的这条规格里的color属性值相等，则为其高亮
        if( i % 2 > 0){
          specialPrnt.append( specialTpl( p, cleanValues[i], true, "right" ) );
        }else{
          specialPrnt.append( specialTpl( p, cleanValues[i], true, "left" ) );
        }
      }else{
        if( i % 2 > 0){
          specialPrnt.append( specialTpl( p, cleanValues[i], false, "right" ) );
        }else{
          specialPrnt.append( specialTpl( p, cleanValues[i], false, "left" ) );
        }
      }
    }; // 至此，特殊属性color的值已全部渲染完毕，并且当前规格对应的color值也被高亮了
    var chsBtns = specialPrnt.find(".J_chsBtn"); // 渲染后的属性按钮集
    for( var c = 0; c < chsBtns.length; c++ ){ // 遍历color属性下的所有按钮
      var thisBtn = $(chsBtns[c]);
      thisBtn.switchProperty( res ); // 为每一个按钮绑定点击事件，响应用户切换
      var indexs = [];
      for( var d = 0; d < data.length; d++ ){
        var curItem = data[d];
        if( curItem[p] == thisBtn.html() ){
          indexs.push( curItem.id ); // 将每个属性值出现过的规格的id放到一个数组里
        }
      };
      indexs = indexs.join(",");
      thisBtn.attr("data-indexs", indexs); // 当前按钮(color的属性值)所出现过的规格的id集合，缓存到页面元素data属性里
    };
  };

  // 数组去重的方法
  function unique( arr ) {
    var res = [];
    $.each(arr, function(i, el){
      if( $.inArray( el, res ) < 0 ){
        res.push( el );
      }
    });
    return res;
  };

  // 格式化URL的参数列表，获取所需数据
  function formatURL() {
    var arr = window.location.search.substring(1).split("&");
    var res = {};
    arr.forEach(function( item, i ){
      var xObj = item.split("=");
      res[ xObj[0] ] = xObj[1];
    });
    return res;
  };


  // 定义属性按钮的点击事件
  $.fn.switchProperty = function( res ){
    var special = formatToArray( res.special ); // 特殊属性集
    var me = $(this); // 本按钮
    var _p = me.attr("data-token"); // 按钮所属的属性名，例如color
    var us = $(".J_detail_" + _p); // 该属性下的所有属性值按钮
    var clsName = "chosen"; // 按钮高亮的class名
    me.click(function(){
      if( !me.hasClass( clsName ) ){ // 按钮被点击时，只有它当前不是高亮的才会有响应
        us.removeClass( clsName );
        me.addClass( clsName );
        var myIndexs = me.attr("data-indexs"); // 拿到这个属性值出现过的所有规格的id之集合
        var indexsArr = myIndexs.split(","); // 该id集变为数组
        var compare = "";
        var target = "";
        for( var s = 0; s < special.length; s++ ){ //遍历特殊属性集
          var specItem = special[s];
          if( specItem != _p ){ // 遍历到一个不是当前点击的按钮所属的属性时，如点击color，此时遍历到storage
            var eles = $(".J_detail_" + specItem); // 找到所有storage的属性值按钮
            for( var e = 0; e < eles.length; e++ ){ // 寻找当前高亮态的storage值按钮
              var thisEl = $(eles[e]);
              if( thisEl.hasClass( clsName ) ){
                var inx = thisEl.attr("data-indexs"); // 找到当前高亮态的storage的值按钮，拿到它的indexs表
                break;
              }
            }
            compare += (inx + ","); // 遍历特殊属性集时，每一次遍历，都把得到的indexs表累加到compare
          }else{}
        }; // end for
        compare = compare.split(",");
        compare.pop( compare.length - 1 ); // 对compare做处理，生成数组，将与数组indexsArr对比取交集
        indexsArr.forEach(function( val ){
          if( compare.indexOf(val) > -1 ){ // 有交集
            target = val; // 交集的值就是将要渲染的规格的id，此处调用render方法，渲染该条规格的产品信息
          }else{ // 无交集
            target = indexsArr[0]; // 无交集则直接渲染所选属性值对应的规格集里的第一条数据
          }
        });
        renderProduct( res, target );
      }else{ // 点击的按钮当前本身就是高亮态，则不作响应
        return false;
      }
    });
  };

  // Init, check out url to see if there is fcode:
  function init() {
    var productInfo =   {"data":[{"goodsName":"Remix Test1","screen":"1280*960","color":"Red","pid":1,"state":"online","classification":"pad","id":1,"description":"ultra-tablet","sku":"999","storage":"64G","price":"1999","urls":"http://i1.mifile.cn/a1/T1GqdTByYv1RXrhCrK!220x220.jpg, http://i1.mifile.cn/a1/T1m1_TBshT1RXrhCrK!440x440.jpg, http://i1.mifile.cn/a1/T1s1JTB4bT1RXrhCrK!440x440.jpg","cpu":"intel","memory":"2g","clsId":1},{"goodsName":"Remix Test2","screen":"1280*960","color":"Red","pid":1,"state":"online","classification":"pad","id":2,"description":"ultra-tablet","sku":"999","storage":"16G","price":"1299","urls":"http://i1.mifile.cn/a1/T1l0ZvBydv1RXrhCrK!220x220.jpg, http://i1.mifile.cn/a1/T1sWd_B7VT1RXrhCrK!220x220.jpg","cpu":"intel","memory":"2g","clsId":1}],"special":"color, storage","clsId":1,"pid":1};
    var _url = formatURL();
    if( _url.fcode ){ // has F code
      var FCode = _url.fcode;
      getFCodeInfo( FCode, function( data ){
        var pid = data.pid,
            specId = data.specId,
            coupon = data.coupon;
        if( pid ){ // F码正确，渲染优惠后的页面，隐藏[加入购物车]按钮，只供立即购买
          FCache['code'] = FCode;
          FCache['couponSpecId'] = specId;
          FCache['coupon'] = coupon;
          renderProduct( productInfo, specId );
        }else{ // F码不正确，显示原价商品信息
          renderProduct( productInfo, 0 );
        }
      });
    }else{ // no F codes
      renderProduct( productInfo, 0 );
    }
  };

  // 如果用户是带着F码进入页面，则需将F码和对应的specId缓存
  var FCache = {};

  // 验证F码
  function getFCodeInfo( code, cb ) {
    $.ajax({
      url: "/getFcodeInfo",
      type: 'POST',
      data: code,
      contentType: "application/json; charset=utf-8",
      timeout: 3000,
      success: function( data ) {
        if( cb ){
          cb(data);
        }
      },
      error: function(r) {}
    });
  };

  // 获取数据，productInfo是从页面中读取的JSON数据，参数0表示默认展示data中的第一条数据
  var CLASS_ID = productInfo.clsId,
      P_ID = productInfo.pid,
      USER_ID = userInfo.userId,
      IS_LOGIN = userInfo.isLogin;

  // 点击加入购物车
  $(".J_addToCart").click(function(){
    var me = $(this);
    var sid = me.attr("data-id");
    var cookieInfo = $.cookie("remix_cart");
    var comId = CLASS_ID + "," + P_ID + "," + sid;
    if(cookieInfo == undefined){
      cookieInfo = comId;
    } else {
      cookieInfo = cookieInfo + "|" + comId; // 把每次选择的商品的三重id的字符串之和，存入cookie
    }
    $.cookie("remix_cart", cookieInfo);
    popAlert( "此商品成功加入购物车！", 1 );
  });

  // 点击立即购买
  $(".J_buyNow").click(function(){
    var me = $(this);
    var sid = me.attr("data-id");
    var send = {};
    var dataArr = [];
    var combineID = CLASS_ID + "," + P_ID + "," + sid; // combineID是由类id、商品id、规格id三者用逗号连接起来的字符串
    var dItem = {id: combineID, count: 1};
    dataArr.push(dItem);
    send['data'] = dataArr;
    send['fcode'] = ( FCache['code'] )?(FCache['code']):('');
    if( !IS_LOGIN ) { // 未登录时
      popLogin(function(data){
        send = isLoginCb(data, send);
        if( send ){
          createOrder( send );
        }
      });
    }else{
      send['userId'] = USER_ID;
      createOrder( send );
    }
  });

  function isLoginCb( data, send ){
    if( data ){
      data = JSON.parse(data);
      var type = data.type;
      if( type == 1 ){ // login success
        var usrId = data.userId;
        send['userId'] = parseInt( usrId );
        return send;
      }else if( type == 0 ){
        popWarning("用户不存在，现在去注册吗？", function(){ location.href = "/login#reg"; });
        return false;
      }else{
        popAlert("用户名或密码错误，请重新登录！", 0);
        return false;
      }
    }
  };

  function createOrder( sendData ) {
    $.ajax({
      url: '/createOrder',
      type: 'POST',
      dataType: 'JSON',
      data: JSON.stringify( sendData ),
      contentType: "application/json; charset=utf-8",
      success: function( data ) { // get orderId from this data, and go to fillin
        var oid = data.orderId;
        location.href = "/fillin?orderid=" + oid;
      },
      error: function( r ) {}
    });
  };

  init();

})();
