/* Javascript for public heading of htmls for the new Version 2015 */
/* Written by AlexWong, created on 2015-01-20 10:54 */
/* Latest modified on 2015-02-13 17:26 */

(function(){

var ROOT = ""; //所有的Ajax请求的接口地址根目录

/* ====================== 顶部左侧图标交互 ====================== */
var tpBtn = $(".topnavbtn");
tpBtn.mouseenter(function(){
	var me = $(this);
	var _s = me.find("s");
	_s.addClass("hover");
});
tpBtn.mouseleave(function(){
	var me = $(this);
	var _s = me.find("s");
	_s.removeClass("hover");
});

/* ====================== 收藏易金 + 设为首页 ====================== */
var Shoucang = $("#Shoucang"),
	Shouye = $("#Shouye");
var isIE = /MSIE ([0-9.]+)/.exec(window.navigator.userAgent);
Shoucang.get(0).onclick = function(){
	if( isIE ){
		window.external.AddFavorite(location.href,document.title);
	}else{
		myPOPUP( "温馨提示", "您的浏览器不支持自动收藏的功能，请同时按下键盘上的Ctrl+D键，手动收藏本页面。" );
	}
};
Shouye.get(0).onclick = function(){
	if( isIE ){
		this.style.behavior='url(#default#homepage)';
		this.setHomePage(location.href);
	}else{
		myPOPUP( "温馨提示", "您的浏览器不支持自动设为首页的功能，请在浏览器的设置选项里手动完成。" );
	}
};

/* ====================== 模拟placeHolder ====================== */
function placeHolder( input, pld ){
	function fcs(){
		pld.hide();
		input.focus().css("background", "#fff");
	}
	input.click(function(){ fcs(); });
	pld.click(function(){ fcs(); });
	input.focus(function(){
		pld.hide();
		$(this).css("background", "#fff");
	});
	input.blur(function(){
		var val = input.val();
		if( !val || val=="" ){
			pld.show();
			input.css("background", "none");
		}
	});
};
placeHolder( $(".user_name"), $(".username_pld") );
placeHolder( $(".user_psw"), $(".password_pld") );
placeHolder( $(".search_input"), $(".search_pld") );

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

/* ====================== 登录区的功能 ====================== */
// 点击一个昵称li，切换昵称
$.fn.pickNickname = function(){
	var me = $(this);
	var nickId = me.attr("data"); //该昵称的id，现在是字符串
	me.click(function(){
		$.getJSON( ROOT + "/UserInfo/nickmr", {
			'm_nicknameId': nickId,
			'rand': Math.random()
		}, function(data){
			if(data){
				$(".nickName").html(data.name);
				me.parent().slideUp(200);
			}
		});
	});
}; //end pick Nickname

// 登录区域功能交互：
var usr = $("#login_username");
var psw = $("#login_password");
var loginBtn = $("#loginBtn");
var signinBtn = $("#signinBtn");
psw.keydown(function(){
	if(event.keyCode == 13){ //按下回车键时
		checkusername();
	}
});
loginBtn.click(function(){
	checkusername();
});

// 加载条的结构
var loadingHTML = '<div class="imLoadingWrap Loading"><div class="imloading"></div></div>';
function startLoading(){
	$("body").prepend( loadingHTML );
};
function removeLoading(){
	$(".Loading").remove();
};

// 登录验证和登录
function checkusername(){
	var username = usr.val();
	var password = psw.val();
	var rand = Math.random();
	if( username == "" ){
		myPOPUP( "登录提示", "用户名不能为空，请重新输入。", true, function(){
			usr.focus();
		});
	}else if( password == "" ){
		myPOPUP( "登录提示", "密码不能为空，请重新输入。", true, function(){
			psw.focus();
		});
	}else{
		startLoading();
		$.post( ROOT + "/Index/checklogininfo", {
			'name': username,
			'pass': password,
			'rand': rand
		}, function(data){
			removeLoading();
			if( data.msg == "1" ){ // 登录成功
				$("#LOGIN").html( data.string );
				if(data.html != 'underfind'){
					$('body').append(data.html);
				}
				afterLogin();
				location.reload();
			}else if(data.msg == "2"){
				myPOPUP( "系统提示", data.str, true, function(){
					usr.focus();
				});
			};
		},"json"); //end post
	}// end else
};

// 登录后的面板元素交互
function afterLogin(){
	var myCen = $(".myCenter"),
		perCen = $(".per-center"),
		pcList = $(".pc-list"),
		nick_list = $(".nickname-list"),
		nicknames = $(".nickname-list li"),
		showNick = $(".nickName");
	myCen.mouseenter(function(){
		perCen.addClass("percen-hover");
		pcList.show();
	});
	pcList.mouseleave(function(){
		perCen.removeClass("percen-hover");
		pcList.hide();
	});
	for(var i = 0; i < nicknames.length; i++){
		$(nicknames[i]).pickNickname();
	}
	if( nicknames.length > 0 ){
		showNick.unbind("click").bind("click", function(){
			if( nick_list.attr("data-status") == "fold" ){
				nick_list.slideDown(200).attr("data-status", "unfold");
			}else{
				nick_list.slideUp(200).attr("data-status", "fold");
			}
		});
	}
};
afterLogin();

/* ====================== 搜索区功能 ====================== */
var nnn = 0;
var num = -1;
var myform = $("#myform"); //搜索的表单
var searchInput = $(".search_input"); //搜索输入框
var searchAutoname = $(".search_autoname"); //展示自动搜索结果列表的容器
searchInput.keyup(function(e){
	var currKey = 0, e = e || event;
	currKey = e.keyCode || e.which || e.charCode; //支持IE、FF
	$('.search_autoname div').css('background-color', '#fff');
	if( currKey == 40 ){
		$('.search_autoname div').eq(num).css('background-color', '#fff');
		num++;
		if(num > nnn){ num = 0; }
		$('.search_autoname div').eq(num).css('background-color', '#bbb');
		var value = $('.search_autoname div').eq(num).html();
		searchInput.val( value );
	}else if( currKey == 38 ){
		$('.search_autoname div').eq(num).css('background-color', '#fff');
		num--;
		if(num < 0){ num = nnn; }
		$('.search_autoname div').eq(num).css('background-color', '#bbb');
		var value = $('.search_autoname div').eq(num).html();
		searchInput.val( value );
	}else{
		var search_name = searchInput.val();
		var search_sort = $(".auto_sort").val();
		$.get( ROOT + "/AucList/searchajax", {
				"action": "auto_search",
				"keyword": search_name,
				"searchstatus": "3",
				'rand': Math.random()
			}, function(data){
				searchAutoname.html( data.str );
				nnn = data.nnn;
				num = -1;
				if(data.str){
					searchAutoname.show();
					searchAutoname.find("div").attr("onclick", "").bind("click", function(){
						searchInput.val( $(this).html() );
						myform.submit();
						searchAutoname.hide();
					});
					$(document).click( function(){ searchAutoname.hide(); });
				}else{
					searchAutoname.hide();
				}
		}, "json");
	}
}); // end keyup

// 搜索框添加鼠标滑过的动画效果
$.fn.searchHover = function( duration ){
	var me = $(this);
	var width = 520, height = 32; // 宽高根据搜索框尺寸先写死
	var topline = me.find(".search_slide_topline"),
		rightline = me.find(".search_slide_rightline"),
		bottomline = me.find(".search_slide_bottomline"),
		leftline = me.find(".search_slide_leftline");
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
		search_btn.css("background-color", "#c38214");
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
		}, duration, function(){
			topline.stop();
			rightline.stop();
			bottomline.stop();
			leftline.stop();
		});
		search_btn.css("background-color", "#cc9617");
	});
};
var search_box = $(".search_box");
var search_btn = $(".search_btn");
search_box.searchHover( 250 );


})();
