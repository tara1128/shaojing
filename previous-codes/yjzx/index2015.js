/* Javascript for index.html of Version 2015, new look */
/* Written by AlexWong, created on 2015-01-16 09:42 */
/* Latest modified on 2015-03-30 11:52 */

(function(){

var ROOT = ""; //所有的Ajax请求的接口地址根目录
var refTg;
clearInterval( refTg );

/* ====================== 顶部通栏广告 ====================== */
var topAD = {
	has: false, //此属性标记是否有顶部通栏广告，有广告时，置为true，没有广告则置为false
	src: 'Public/Home/yjimg2015/top_ad.png', //此属性标记通栏广告图片的URL
	linkTo: '#', //此属性标记通栏广告点击后的跳转链接
	elem: $(".wide_AD"), //广告外层容器
	linka: $(".wide_a"), //广告图片外层的a元素，其href属性值是跳转链接
	img: $(".wide_adimg"), //广告图片img元素
	desc: "易金在线 Only for your classical collections !", //鼠标悬停时的文字描述，可以为空
	cls: $(".wide_close") //关闭按钮元素
};
if( topAD.has ){
	topAD.elem.show();
	topAD.linka.attr("href", topAD.linkTo);
	topAD.img.attr("src", topAD.src).attr("title", topAD.desc);
	topAD.cls.click(function(){
		topAD.elem.slideUp(200);
	});
};

/* ====================== 弹出提示框 (新版) 的样式 ====================== */
function myPOPUP( title, txt, center, func ){ // 参数center标识提示文案是否居中显示
	var myPOP = $(".myPOP"),
		myPOPH1 = $("#myPOPH1"),
		myPOPTXT = $("#myPOPTXT"),
		myPOP_OK = $("#myPOP_OK"),
		myPOP_Cancel = $("#myPOP_Cancel");
	myPOP_Cancel.css("right", "0px");
	myPOP.show();
	myPOPH1.html( title );
	if( center ){
		myPOPTXT.css("text-align", "center").html( txt );
	}else{
		myPOPTXT.css("text-align", "left").html( txt );
	}
	myPOP_OK.unbind("click").bind("click", function(){
		if( func ){
			func(); //点击确定后执行回调
			myPOP.hide();
			return false;
		}else{
			myPOP.hide();
			return false;
		}
	});
	myPOP_Cancel.unbind("click").bind("click", function(){
		var me = $(this);
		me.animate({
			right: "-50px"
		}, 300, function(){
			myPOP.hide();
			return false;
		});
	});
}; //end my POP UP

/* ====================== 首屏论坛列表交互 ====================== */
var bbslis = $(".billboard_bbsli");
var bbslisLen = bbslis.length;
var bbslisShowLen = 8; //只显示8条
for( var i = bbslisShowLen; i < bbslisLen; i++ ){
	$(bbslis[i]).hide();
};
$(bbslis[bbslisShowLen - 1]).parent().css("border-bottom", "none"); //最后一条li去掉下边框


/* ====================== 团购区域页面交互 ====================== */
var tgTerm = $("#tgTerm"), // 第几期
	tgTitle = $("#tgTitle"), // 产品名
	tgSCPrice = $("#tgSCPrice"), // 市场价
	tgTGPrice = $("#tgTGPrice"), // 团购价
	buyerNum = $("#buyerNum"), // 当前参团人数
	totalBuyer = $("#totalBuyer"), // 可参团的总人数
	tgBaom = $("#tgBaom"), // 点报名，打开滑动面板
	tgComingSoon = $("#tgComingSoon"), // 即将开始的按钮
	tgPopBoard = $("#tgPopBoard"), // 滑动面板
	tgPopBoard_Confirm = $("#tgPopBoard_Confirm"), // 二次确认的面板
	tgConfirmTxt = $("#tgConfirmTxt"), // 二次确认的提示文案
	tgSuccess = $("#tgSuccess"), // 团购成功的提示文案，提供跳转到订单列表的入口
	tgIntros = $("#tgIntros"), // 描述等级和数量的文字容器
	tgQuant = $("#tgQuant"), // 盛放数量和加减号的容器
	tgSupl = $("#tgSupl"), // 描述里的补充说明文字
	tgLev = $("#tgLev"), // 用户等级
	tgMaxNum = $("#tgMaxNum"), // 盛放当前用户可团购的最大数量的容器
	tgMinus = $("#tgMinus"), // 减号按钮
	tgPlus = $("#tgPlus"), // 加号按钮
	tgNum = $("#tgNum"), // 数量显示
	tgSend = $("#tgSend"), // 选好数量，确认按钮
	tgClose = $(".tgou_pop_clsBtn"); // 关闭面板
var ori_max = 0, // 按照会员级别对应的可买的最大数量
	real_max = 0, // 实际可购买的最大数量，可能因剩余的产品不够，而小于ori_max
	myuserid = 0, // 登录用户的id
	goodsid = 0; // 团购产品的id
// 获取团购的数据信息：
ask4TgInfo();
function ask4TgInfo(){
	$.ajax({
		url: ROOT + '/Bulk/bulkInfo',
		type: 'GET',
		dataType: 'json',
		success: function( data ){
			renderTgInfo( data ); // 团购信息渲染到页面
			var _stat = data['status']; // 0未开始，1进行中，2已结束
			if( _stat == "0" ){ // 团购未开始
				tgBaom.hide();
				tgComingSoon.show().html("即将开始");
			}else if( _stat == "1" ){ // 团购进行中
				tgComingSoon.hide();
				tgBaom.show();
				goodsid = parseInt( data['id'] );
				getCurrSold( goodsid ); // 获取当前已经卖出多少枚
				getUserInfo( goodsid ); // 获取用户信息
			}else if( _stat == "2" ){ // 团购已结束
				tgBaom.hide();
				tgComingSoon.show().html("已结束");
			}
		}
	}); // end ajax
};
// 渲染团购信息
function renderTgInfo( data ){ // data是服务器返回的对象
	tgTerm.html( data['issue'] ); // 第几期
	tgTitle.html( data['name'] ); // 标题
	tgSCPrice.html( data['quote'] ); // 市场价
	tgTGPrice.html( data['price'] ); // 团购价
	buyerNum.html( data['numberOfSold'] ); // 卖出去多少枚
	totalBuyer.html( data['number_ceiling'] ); // 团购可卖的总数
};
// 获取用户信息：
function getUserInfo( goodsid ){
	$.ajax({
		url: ROOT + '/Bulk/userInfo',
		type: 'GET',
		dataType: 'json',
		data: { goods_id: goodsid },
		success: function( data ){
			if( !data.user_id ){ //未登录
				tgBaom.bind("click", function(){
					var loginUrl = $(this).data("login");
					location.href = loginUrl;
				});
			}else{ //已登录
				checkBuyingRight( data ); // 检测购买资格
				tgBaom.bind("click", function(){
					tgPopBoard.slideDown(200);
					tgNum.html("1");
				});
			}
		},
		error: function( error ){
			myPOPUP( "系统提示", "获取数据失败，请刷新页面重新访问！", true );
		}
	});
}; // end get userinfo
// 检测购买资格
function checkBuyingRight( data ){
	myuserid = parseInt( data['user_id'] );
	ori_max = parseInt( data['ori_max'] );
	real_max = parseInt( data['real_max'] );
	function buyNo( txt ){
		tgIntros.html( txt );
		tgQuant.hide();
		tgSend.hide();
	};
	function buySome( lev, qua, supl ){
		tgLev.html( lev );
		tgMaxNum.html( qua );
		if( supl ){ // 如果有补充说明，即实际可买的数量小于本来可以买的数量时
			tgSupl.html( "由于产品余量不足，" );
		}
	};
	if( ori_max == 0 || data['auth'] != 1 ){
		buyNo( "非常抱歉，您没有参加本次团购的权限。" );
	}else if( ori_max == 1 ){ // 只能买1枚的是普通会员
		if( real_max == 0 ){
			buyNo( "非常抱歉，产品已售罄！" );
		}else{
			buySome( "普通会员", real_max );
		}
	}else if( ori_max == 2 ){ // 可买2枚的是币友级会员
		if( real_max == 0 ){
			buyNo( "非常抱歉，产品已售罄！" );
		}else if( real_max == 1 ){
			buySome( "币友级会员", real_max, true );
		}else{
			buySome( "币友级会员", real_max );
		}
	}else if( ori_max == 3 ){ // 可买3枚的是藏家级会员
		if( real_max == 0 ){
			buyNo( "非常抱歉，产品已售罄！" );
		}else if( real_max == 1 || real_max == 2 ){
			buySome( "藏家级会员", real_max, true );
		}else if( real_max == 3 ){
			buySome( "藏家级会员", real_max );
		}
	}
};
// 获取当前已卖出去的枚数，并渲染到页面，该方法需要每隔5秒调用一次。
function getCurrSold( id ){
	if( id ){
		$.ajax({
			url: ROOT + '/Bulk/getNumberOfSold',
			type: 'GET',
			data: { 'goods_id': id },
			dataType: 'json',
			success: function( data ){
				var sellNum = data['numberOfSold'];
				real_max = data['real_max'];
				buyerNum.html( sellNum );
				tgMaxNum.html( real_max );
				if( parseInt( sellNum ) == parseInt( totalBuyer.html() ) ){
					tgBaom.hide();
					tgComingSoon.show().html("已结束");
				}
			}
		});
	}
};
setInterval( function(){
	refTg = getCurrSold( goodsid );
}, 5000 );

// 选好数量后，点击【确定】：(展开二次确认的面板)
tgSend.click(function(){
	var buynum = parseInt( tgNum.html() );
	sendTg( buynum );
});

// 调接口，发送报名信息
function sendTg( num ){
	$.ajax({
		url: ROOT + '/Bulk/join',
		type: 'POST',
		data: {
			user_id: myuserid,
			goods_id: goodsid,
			purchase_number: num
		},
		dataType: 'json',
		success: function( data ){
			tgPopBoard.slideUp(200); // 收起操作面板
			tgPopBoard_Confirm.slideDown(200); // 展开二次确认面板
			var _status = parseInt( data.status );
			if( _status == 0 ){ //报名成功
				tgConfirmTxt.hide();
				tgSuccess.show();
			}else{ // 报名不成功（也可能是已报过名了）
				tgSuccess.hide();
				tgConfirmTxt.show().html( data.retmsg );
			}
		},
		error: function(r){
			tgPopBoard.slideUp(200); // 收起操作面板
			tgPopBoard_Confirm.slideDown(200); // 展开二次确认面板
			tgSuccess.hide();
			tgConfirmTxt.show().html( "网络错误导致操作失败。请刷新重试或联系网络管理员！" );
		}
	}); // end ajax
}; // end send

// 收面板：
tgClose.click(function(){
	var me = $(this);
	me.parent().parent().slideUp(200);
});
// 加减号交互：
tgPlus.click(function(){
	var val = parseInt( tgNum.html() );
	tgMinus.removeClass("tgoubtn_disable");
	if( val >= real_max ){
		$(this).addClass("tgoubtn_disable");
	}else{
		tgNum.html( val + 1 );
	}
});
tgMinus.click(function(){
	var val = parseInt( tgNum.html() );
	tgPlus.removeClass("tgoubtn_disable");
	if( val == 1 ){
		$(this).addClass("tgoubtn_disable");
		return false;
	}else{
		tgNum.html( val - 1 );
	}
});
/* ====================== 团购功能结束 ====================== */



/* ====================== 列表动态间距 ====================== */
function dynMargin( ul, n ){ // n 标示一行显示n个
	var lis = ul.find("li");
	var lisLen = lis.length;
	for(var i = 1; i < lisLen; i++ ){
		if( (i+1)%n == 0 ){
			$(lis[i]).css("margin-right", "0px"); // 每行的最后一个去掉右边距
		}
	}
};
// dynMargin( $("#Bestsells"), 5 ); // 精品推荐改为滚动展示，暂时不需要此方法
dynMargin( $("#Histories"), 5 );
dynMargin( $("#Tools"), 5 );


/* ====================== 侧边滑动小导航交互 ====================== */
var sidenav = $(".sidenav");
var sidenavbtn = $(".sidenavbtn");
sidenavbtn.mouseenter(function(){
	var me = $(this);
	var _s = me.find("s");
	var _active = me.attr("data");
	_s.addClass("hover");
	me.addClass( _active );
});
sidenavbtn.mouseleave(function(){
	var me = $(this);
	var _s = me.find("s");
	var _active = me.attr("data");
	var current = "current"; //标记当前按钮是否在当前页面范围内高亮
	if( !me.hasClass( current ) ){
		_s.removeClass("hover");
		me.removeClass( _active );
	}
});
// 侧边小导航的滑入滑出：
function sideNavMove(y, obj){
	if( y > obj["showSidebar"] ){
		sidenav.slideDown(300);
		if( y > obj["sidenav_market_active"] && y <= obj["sidenav_bestsell_active"] ){
			highLightSidebarNav("sidenav_market");
		}else if( y > obj["sidenav_bestsell_active"] && y <= obj["sidenav_history_active"] ){
			highLightSidebarNav("sidenav_bestsell");
		}else if( y > obj["sidenav_history_active"] && y <= obj["sidenav_tools_active"] ){
			highLightSidebarNav("sidenav_history");
		}else if( y > obj["sidenav_tools_active"] && y <= obj["sidenav_graph_active"] ){
			highLightSidebarNav("sidenav_tools");
		}else if( y > obj["sidenav_graph_active"] && y <= obj["sidenav_phone_active"] ){
			highLightSidebarNav("sidenav_graph");
		}else if( y > obj["sidenav_phone_active"] && y <= obj["noCurrentSidebar"] ){
			highLightSidebarNav("sidenav_contact");
		}else{
			highLightSidebarNav();
		}
	}else{
		sidenav.slideUp(300);
	}
};
// 这个对象标识页面滚到不同的高度处，侧边小导航的对应按钮执行高亮显示：
var topToWhichSidebar = {
	"showSidebar": 400, //小导航出现
	"sidenav_market_active": 600, //寄售卖场
	"sidenav_bestsell_active": 1400, //精品推荐
	"sidenav_history_active": 1700, //历史成交
	"sidenav_tools_active": 2000, //工具书刊
	"sidenav_graph_active": 2300, //及时动态
	"sidenav_phone_active": 2600, //联系电话
	"noCurrentSidebar": 3000 // 最后一个按钮不再高亮
};
// 高亮显示某个小导航的通用方法：
function highLightSidebarNav( cls ){ // cls是对应小导航的class名
	for( var i = 0; i < sidenavbtn.length; i++ ){
		var _item = $(sidenavbtn[i]);
		var act_cls = _item.attr("data");
		_item.removeClass( act_cls ).removeClass( "current" );
		_item.find("s").removeClass("hover");
	}
	if( cls ){ //传参时，才有高亮；不传参，则所有按钮都不高亮。
		$("." + cls).addClass( cls + "_active").addClass("current").find("s").addClass("hover");
	}
};

// 监听滚轮事件
$(window).scroll(function(){
	var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight; //获取网页的总高度，documentElement for IE
	var clientHeight = document.body.clientHeight || document.documentElement.clientHeight; //网页在浏览器中的可视高度
	var scrollTop = document.body.scrollTop || document.documentElement.scrollTop; //浏览器滚动条的top位置
	sideNavMove( scrollTop, topToWhichSidebar );
});

/* ====================== 寄售大卖场轮图 ====================== */
var Coins = $("#Coins");
var cLis = Coins.find("li");
var totalLen = cLis.length;
var coinStartx = 0;
function putInCoins(){ //x是计数起点
	cLis.hide();
	if( coinStartx >= totalLen ){
		coinStartx = 0;
	}
	var chazhi = totalLen - coinStartx;
	if( chazhi > 0 && chazhi < 6 ){ //最后不能被6整除的
		var extra = 6 - chazhi; //少几个，就从第一个开始补几个
		for(var i = coinStartx; i <= (coinStartx+chazhi); i++ ){
			$(cLis[i]).show();
		}
		for(var k = 0; k < extra; k++ ){
			$(cLis[k]).show();
		}
		coinStartx = coinStartx + 6;
		setTimeout(function(){
			putInCoins();
		}, 4000);
	}else{
		for(var i = coinStartx; i < (coinStartx+6); i++ ){
			$(cLis[i]).show();
		}
		coinStartx = coinStartx + 6;
		setTimeout(function(){
			putInCoins();
		}, 4000);
	}
};
putInCoins( coinStartx );

/* ====================== 非整倍数的图片干掉 ====================== */
var CONS = 5; // 不是5倍数的图片需要被干掉
$.fn.removeTails = function(){ // 主语是ul
	var me = $(this);
	var lis = me.find("li");
	var len = lis.length;
	var res = len%CONS;
	if( res != 0 ){
		var newlen = len - res;
		for( var i = newlen; i < len; i++ ){
			$( lis[i] ).remove(); // 干掉余数尾巴 
		}
	};
};

// $("#Bestsells").removeTails();
$("#Histories").removeTails();

/* ====================== [换一换]轮图 ====================== */
// 精品推荐轮图
/*
var startBsetsell = 5;
$(".bs_change").click(function(){
	var bs_lis = $("#Bestsells li");
	var bs_len = bs_lis.length;
	if( bs_len == startBsetsell ){
		myPOPUP( "温馨提示", "本期的精品推荐只有五个哦！", true );
		return false;
	}
	bs_lis.hide();
	if( (bs_len - startBsetsell) <= 5 ){
		for( var i = startBsetsell; i < bs_len; i++ ){
			$(bs_lis[i]).show();
		}
		startBsetsell = 0;
	}else{
		for( var i = startBsetsell; i < (startBsetsell + 5); i++ ){
			$(bs_lis[i]).show();
		}
		startBsetsell = startBsetsell + 5;
	}
});
// 精品推荐没图时，显示默认
var bestLens = $("#Bestsells li").length;
if( bestLens == 0 ){
	$(".bestsell_empty").show();
}else{
	$(".bestsell_empty").hide();
};
*/

// =================================================================== //
// 历史成交轮图
var startHistory = 5;
var his_lis = $("#Histories li");
var his_len = his_lis.length;
his_lis.hide();
for( var hs = 0; hs < startHistory; hs++ ){
	$(his_lis[hs]).show();
}; // 默认先展示前五个
$(".his_change").click(function(){
	if( his_len == startHistory ){
		myPOPUP( "温馨提示", "本期的历史成交只有五个哦！", true );
		return false;
	}
	his_lis.hide();
	if( (his_len - startHistory) <= 5 ){
		for( var i = startHistory; i < his_len; i++ ){
			$(his_lis[i]).show();
		}
		startHistory = 0;
	}else{
		for( var i = startHistory; i < (startHistory + 5); i++ ){
			$(his_lis[i]).show();
		}
		startHistory = startHistory + 5;
	}
});

/* ====================== 动画 ====================== */
// 首屏倒计时鼠标滑过的动画
$.fn.animateHover = function(){
	var me = $(this);
	me.mouseenter(function(){
		me.css({
			"font-weight": "bold",
			"margin-left": "128px"
		});
	});
	me.mouseleave(function(){
		me.css({
			"font-weight": "normal",
			"margin-left": "130px"
		});
	});
};
$(".billboard_zhuanch").animateHover();

// 鼠标滑过边框变化
$.fn.hoverBorder = function( duration, padding_w, padding_h ){
	var me = $(this); // 主语是本身带有边框的li元素或其他元素
	if( !padding_w && !padding_h ){
		var width = me.width() + 2,
			height = me.height() + 2; // 算上边框
	}else{
		var width = me.width() + 2 + padding_w,
			height = me.height() + 2 + padding_h; // 算上边框和padding
	}
	var stupidBorderHtml = '<div class="stupidlines topline"></div>\
							<div class="stupidlines rightline"></div>\
							<div class="stupidlines bottomline"></div>\
							<div class="stupidlines leftline"></div>';
	me.css("position", "relative");
	me.prepend( stupidBorderHtml );
	var topline = me.find(".topline"),
		rightline = me.find(".rightline"),
		bottomline = me.find(".bottomline"),
		leftline = me.find(".leftline");
	me.mouseenter(function(){
		topline.animate({
			width: width + "px"
		}, duration);
		rightline.animate({
			height: height + "px"
		}, duration);
		bottomline.animate({
			width: width + "px"
		}, duration);
		leftline.animate({
			height: height + "px"
		}, duration);
	});
	me.mouseleave(function(){
		topline.animate({
			width: "0px"
		}, duration);
		rightline.animate({
			height: "0px"
		}, duration);
		bottomline.animate({
			width: "0px"
		}, duration);
		leftline.animate({
			height: "0px"
		}, duration);
	});
};

var stupidLine = $(".stupidLine");
for( var s = 0; s < stupidLine.length; s++ ){
	var imstupid = $(stupidLine[s]);
	if( imstupid.parent().hasClass("graph_ul") ){ // 如果是及时动态的框
		imstupid.hoverBorder( 300, 0, 18 );
	}else{
		imstupid.hoverBorder( 300 );
	}
};


/* ====================== 直购区动画效果 ====================== */
$.fn.hoverZhiGou = function( lines, zMask, iMask, lineWidth, zMaskWidth, iMaskWidth, duration ){
	var me = $(this);
	me.mouseenter(function(){
		lines.animate({
			width: lineWidth + "px"
		}, duration);
		zMask.animate({
			width: zMaskWidth + "px"
		}, duration, function(){
			iMask.animate({
				width: iMaskWidth + "px"
			}, duration);
		});
	});
	me.mouseleave(function(){
		lines.animate({
			width: "0px"
		}, duration);
		iMask.animate({
			width: "0px"
		}, duration, function(){
			zMask.animate({
				width: "0px"
			}, duration);
		});
		setTimeout(function(){
			iMask.animate({ width: "0px" }, duration);
			zMask.animate({ width: "0px" }, duration);
		}, 500);
	});
}; // end hover
var zhigouItem = $(".zhig_shp_item");
for(var zg = 0; zg < zhigouItem.length; zg++ ){
	var zItem = $(zhigouItem[zg]);
	var animLineCls = zItem.attr("data");
	var zLines = $("." + animLineCls);
	var zMask = zItem.find(".zgmask");
	var iMask = zItem.find(".imask");
	zItem.hoverZhiGou( zLines, zMask, iMask, 188, 56, 38, 50 );
}; // end for


})();
