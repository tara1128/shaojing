/* Javascript for jingpaishow.html */
/* Written by AlexWong, created on 2014-12-11 19:13 */
/* Latest modified on 2015-03-27 16:32 */
(function(){

// 全局对象
var strP = /^\d+$/; //校验是否正整数
var TimeInt = 2000; //setTimeout的时间间隔

// 缓存变量
var nMS2; //用于倒计时的nMS2必须作为全局变量
var ROOT; //站点根目录，接口请求时用到
var sto; //提示文案的timeout清理
var unClock;//防止倒计时在ajax异步之后出现时间错乱的问题
/* ====================================================== */
var jingpaiShow = $(".jingpaiShow"); //竞拍框架
var finishShow = $(".finishShow"); //结拍框架
var prevPage = $(".prev-page"), nextPage = $(".next-page"); //书本上下页
var use_edu = $("#use_edu"); //显示额度数值的元素
var c_State = $("#c_State"); //显示状态，首次用静态渲染，出价后局部刷新重新赋值
var bookMask = $(".bookMask"); //书的幻灯片效果的遮罩层
/* ====================================================== */
var BjJia = $("#bjjia"); //[当前价格]处的数字
var Qian = $("#BidText"); //竞拍出价的输入框
var chuJ = $(".chuJ"); //[出价]按钮和[代理出价]按钮的容器
var qxchuJ = $(".qxchuJ"); //[取消代理]按钮的容器
var imChujiaBtn = '<input type="button" value="" class="btn btn-hover imChujiaBtn" />'; //[出价]按钮
var imDaiLiBtn = '<input type="button" value="" class="btn btn1 btn1-hover imDaiLiBtn" />'; //[代理出价]按钮
/* ====================================================== */
var chengjiaoZJ = $("#dqprice"); //[成交总价]处的数字
var Yongjin = $("#fwprice"); //[佣金]处的数字
var zongJiaGe = $("#zongjiage"); //[合计]处的数字
/* ====================================================== */
var PopText = $(".PopText"); //错误提示的浮层蒙版
var popMessages = $(".popMessages"); //错误提示的文案容器
/* ====================================================== */
var GZBtn = $("#ifGuanzhu"); //[关注]按钮
var pricesRel = $(".prices-rel"); //查询相关价格
/* ====================================================== */
var leftTagUl = $(".leftTagUl"); //左右书签的ul容器
var rightTagUl = $(".rightTagUl");
var tagMyFocus = $(".bkTag-myFocus");
/* ====================================================== */
var Pop = $("#pop"); //右侧滑出列表
var jp_cheers = $(".jp_cheers"); //小酒杯
/* ====================================================== */
var page = 0, pagecount = 0; //书本左侧小图轮播的页码
var leftImgsList = $(".image-list"); //书本左侧下的小图列表div容器
var leftImgsPrev = $("#prevId3"); //书本左侧下的小图列表左箭头
var leftImgsNext = $("#nextId3"); //书本左侧下的小图列表右箭头
var scrollpicUl = $("#scrollpic"); //盛放小图们的ul容器
var sLeft = 0; //每次点击小箭头的left值，切换拍品后，要重置该值
var liwidth = 0; //轮播小图容器内部区域宽度
// ============================================================================================ //
var arrSparkle = []; //询问闪不闪，该数组盛放前三个关注品的id
var gotoLatest = $("#gotoLatest"); //左侧书签第一个，直接进入即将结拍的页
// ============================================================================================ //
// 全局都会用到的数值，赋给以下全局变量，方便调用：
var g_buchang, //步长
	g_cjcount, //被出价的总次数，会被重写
	g_current, //当前拍品所在页数
	g_mydaili, //当前用户代理价，页面中设置代理或取消代理，会重写该变量的值
	g_edu, //当前用户的额度
	g_fuwufee, //服务费
	g_fwjia,
	g_id, //拍品id，字符串
	g_lefttime,
	g_nowtime,
	g_next,
	g_pre,
	g_total, //队列中的拍品总数
	g_status, //用户状态，值2为正常
	g_entrustuid, //识别当前拍品的被委托人的id（如果与当前登录用户id相同，则出现小酒杯）
	g_userid; //用户id，字符串
var g_Logined = false; //登录后此变量被赋值为true
var p_DqPrice, //当前价
	p_StartPrice, //起始价
	p_StartTime,
	p_EndTime,
	p_Num; 
// ============================================================================================ //
//页面首次请求成功后，给全局变量赋值，为全局function们所调用：
function valueAllVar( G, P ){ //G是global Msg对象，P是Pai pin对象
	g_buchang = parseInt( G['bcnum'] );
	g_cjcount = parseInt( G['cjcount'] );
	g_current = parseInt( G['current'] );
	g_mydaili = parseInt( G['dquserdl_price'] );
	g_edu = parseInt( G['edu'] );
	g_fuwufee = parseInt( G['fuwufee'] );
	g_fwjia = parseInt( G['fwjia'] );
	g_id = G['id']; //拍品id，字符串
	g_lefttime = parseInt( G['lefttime'] );
	g_nowtime = parseInt( G['nowtime'] );
	g_next = parseInt( G['next'] );
	g_pre = parseInt( G['pre'] );
	g_total = parseInt( G['total'] );
	g_status = parseInt( G['status'] );
	g_entrustuid = parseInt( G['entrustuid'] );
	g_userid = G['userid']; //当前用户id，字符串
	p_DqPrice = parseInt( P['auc_proDqPrice'] );
	p_StartPrice = parseInt( P['auc_proStartPrice'] );
	p_StartTime = parseInt( P['auc_proStartTime'] );
	p_EndTime = parseInt( P['auc_proEndTime'] );
	p_Num = P['auc_proProductNumber'];
	// if( p_DqPrice == 0 ){ p_DqPrice = p_StartPrice; } 当前价为0，即无人出过价！
	if( g_userid != "" ){ g_Logined = true; }
}; //end value All Var
// ============================================================================================ //
var pidFromHash = (window.location.hash).substr(1); //从URL的hash中拿到列表页中传来的拍品id
callAjax( pidFromHash, 0 );
// ============================================================================================ //

// 页面最初的ajax请求，获取全部基础数据
// type值：0是页面初加载或结拍时静默显示结拍数据，1翻下一页，2翻上一页，3是结拍后先展示本拍品再自动翻到下一拍品的处理
function callAjax( p_id, type ){
	startLoading();
	$.ajax({
		url: '/AjaxReturn/AjaxTurnPage/pid/' + p_id,
		type: 'GET',
		dataType: 'json',
		success: function( data ){
			if( data.statusCode != "200" ){
				dealError( data.message );
			}else{ //code == 200
				clearTimeout( unClock ); //倒计时前先清理异步之前的时间计时
				ROOT = data.wwwroot;
				var Paipin = {}; //接收服务器传来的message.auc_rs
				var Sqlbig = {}; //接收message.sqlbig
				var Sqldiblog = {}; //接收message.sqldiblog
				var globalMsg ={}; //接收message其他的属性
				var dataMsg = data.message;
				for(var p in dataMsg){
					if( typeof dataMsg[p] != "object" ){
						globalMsg[p] = dataMsg[p];
					};
				};
				var glb_gz = data.gz; //展示于右侧书签的数据
				var glb_doneorder = data.doneorder; //展示于左侧书签的数据
				if( p_id == "" ){ //左侧书签第一个，传空id，直接进入即将结拍的页面
					document.location.hash = "#" + globalMsg['id']; //手动改写url
				}
				makePaipinObj( dataMsg.auc_rs, Paipin );
				makeArrObj( dataMsg.sqlbig, Sqlbig );
				makeArrObj( dataMsg.sqldiblog, Sqldiblog );
				dealRightTags( glb_gz );
				dealLeftTags( glb_doneorder );
				askIfSparkle();
				showInput( Paipin['auc_proProductNumber'] );
				//异步请求，so，渲染页面的逻辑，都应在该success的回调里执行
				if( data.statusAuction == "On" ){ // 竞拍
					valueAllVar( globalMsg, Paipin );
					jingpaiShow.show();
					finishShow.hide();
					if( type == 0 ){ //静默渲染
						showInput( p_Num );//TOMMY
						imgIntoPreviewWrap( Sqlbig, $("#idPicPrew"), scrollpicUl );
						makeImgsSlide();
						renderStaticData( Paipin, globalMsg, $("#JingPaiProdInfo") );
						adjustProTitle( $("#JingPaiProdInfo") );
						renderDiblog( Sqldiblog, $("#chujialist"), $(".more") );
						renderBidInput();
						showJingPaiEndTime( $(".jpEndTime") );
						showDLBtn( globalMsg, Paipin ); //必须在 renderBidInput() 方法后执行
						nMS2 = globalMsg['lefttime'];
						GetRTime();
						DealWithPages( globalMsg );
						unbindListen();
						listenClicks( Paipin, globalMsg );
						stopLoading();
					}else if( type != 3 ){ //上下页渲染，先翻页再渲染
						showInput( p_Num );//TOMMY
						imTurnPage( type, $(".my-auction-wrap"), function(){ //上or下，在翻页方法里判断
							imgIntoPreviewWrap( Sqlbig, $("#idPicPrew"), scrollpicUl );
							makeImgsSlide();
							renderStaticData( Paipin, globalMsg, $("#JingPaiProdInfo") );
							adjustProTitle( $("#JingPaiProdInfo") );
							renderDiblog( Sqldiblog, $("#chujialist"), $(".more") );
							renderBidInput();
							showJingPaiEndTime( $(".jpEndTime") );
							showDLBtn( globalMsg, Paipin ); //必须在 renderBidInput() 方法后执行
							nMS2 = globalMsg['lefttime'];
							GetRTime();
							DealWithPages( globalMsg );
							unbindListen();
							listenClicks( Paipin, globalMsg );
							stopLoading();
						});
					}else{ //type为3，结拍先展示本拍品再自动翻页，如果已结拍还走到这个竞拍里，则表示浏览器时间快于服务器时间
						showInput( p_Num );//TOMMY
						stopLoading();
						myPOPUP( "当前拍品已经结束竞拍，您可以点击【确定】查看本拍品的最新数据！", false, function(){
							callAjax( g_id, 3 );
						});
					}
				}else{ //结拍
					
					valueAllVar( globalMsg, Paipin );
					jingpaiShow.hide();
					finishShow.show();
					if( type == 0 ){ //页面初加载，静默渲染
						showInput( p_Num );//TOMMY
						imgIntoPreviewWrap( Sqlbig, $("#idPicPrew"), scrollpicUl );
						makeImgsSlide();
						renderStaticData( Paipin, globalMsg, $("#JiePaiProdInfo") );
						adjustProTitle( $("#JiePaiProdInfo") );
						renderDiblog( Sqldiblog, $("#chujialist_jp"), $(".more") );
						DealWithPages( globalMsg );
						unbindListen();
						listenClicks( Paipin, globalMsg );
						formatFinishTime();
						stopLoading();
					}else if( type != 3 ){ //上下页渲染，先翻页，再渲染
						showInput( p_Num );//TOMMY
						imTurnPage( type, $(".my-auction-wrap"), function(){ //上or下，在翻页方法里判断
							imgIntoPreviewWrap( Sqlbig, $("#idPicPrew"), scrollpicUl );
							makeImgsSlide();
							renderStaticData( Paipin, globalMsg, $("#JiePaiProdInfo") );
							adjustProTitle( $("#JiePaiProdInfo") );
							renderDiblog( Sqldiblog, $("#chujialist_jp"), $(".more") );
							DealWithPages( globalMsg );
							unbindListen();
							listenClicks( Paipin, globalMsg );
							formatFinishTime();
							stopLoading();
						});
					}else{ //type为3，结拍先展示本拍品，再自动翻页
						showInput( p_Num );//TOMMY
						imgIntoPreviewWrap( Sqlbig, $("#idPicPrew"), scrollpicUl );
						makeImgsSlide();
						renderStaticData( Paipin, globalMsg, $("#JiePaiProdInfo") );
						adjustProTitle( $("#JiePaiProdInfo") );
						renderDiblog( Sqldiblog, $("#chujialist_jp"), $(".more") );
						DealWithPages( globalMsg );
						unbindListen();
						listenClicks( Paipin, globalMsg, true ); //一会要自动翻页了，所以设置true不允许手动翻页
						formatFinishTime();
						stopLoading();
						setTimeout(function(){
							// if( globalMsg['next'] == "" ){ //后面没拍品了
							if( g_current == g_total ){ //后面没拍品了
								myPOPUP( "本场竞拍圆满结束了，感谢您的参与！", true );
							}else{
								document.location.hash = "#" + globalMsg['next'];
								callAjax( globalMsg['next'], 1 );
							}
						}, 3000); //3秒后自动翻到下一页
					}
				}
			}
		},
		error: function( r ){
			myPOPUP( "网络出错，请点击[确定]刷新页面后重试！", true, function(){
				location.reload();
			});
		}
	}); //end ajax
};
// ================================ 通用方法，全局可用 ======================================== //
// 通用方法 - -1：点击遮罩层，去掉遮罩
bookMask.click(function(){
	bookMask.hide();
});
// 通用方法 - 0：ajax请求错误统一处理
function dealError( txt ){
	jingpaiShow.hide();
	finishShow.hide();
	PopText.show();
	stopLoading();
	if( txt ){
		popMessages.html( txt );
	}else{
		popMessages.html( "您访问的拍品不存在" );
	}
	setTimeout(function(){
		location.href = "/Index/";
	}, TimeInt);
};
// 通用方法 - 1：Loading
function startLoading(){
	$(".Loading").show();
};
function stopLoading(){
	$(".Loading").hide();
};
// 通用方法 - 2：给对象的属性赋值
function makePaipinObj( obj, targetObj ){ //仅对拍品对象使用，因为每个对象里的属性列表都一致，可以直接覆盖旧数据
	for(var p in obj){ //obj是服务器传来的数据里的对象
		targetObj[p] = obj[p]; //targetObj是要被赋值的全局对象
	}
};
function makeArrObj( obj, targetObj ){ //适用于图片队列和出价列表对象，因属性列表不一致（不同拍品的图片数量不同），不能直接覆盖旧数据
	for(var p in obj){ //obj是服务器传来的数据里的对象
		targetObj[p] = obj[p]; //targetObj是要被赋值的全局对象
	}
};
// 通用方法 - 3：获取秒数，转换为可读时间的展示
function secToTIME( sec ){ //参数是服务器传来的秒数
	var time = sec * 1000; //转换为毫秒
	var d = new Date(time);
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var date = d.getDate();
	var hour = d.getHours();
	var minute = d.getMinutes();
	var second = d.getSeconds();
	var outputTime = year + "-" + FormatDate(month) + "-" + FormatDate(date) + " " + FormatDate(hour) + ":" + FormatDate(minute) + ":" + FormatDate(second);
	return outputTime;
};
// 通用方法 - 4：将一位数的时间变为两位数展示，前面加0
function FormatDate( num ){ return (num >= 10) ? num : '0' + num; };
// 通用方法 - 5：点小图让中图轮播 mEl是中图元素，即.control_show_hide
$.fn.switchPics = function( mEl ){
	var me = $(this);
	var us = me.parent().find("li");
	var _i = me.attr("data");
	me.css("cursor", "pointer");
	me.click(function(){
		us.removeClass("current");
		me.addClass("current");
		$(mEl).hide();
		$(mEl[_i]).show();
	});
};
// 通用方法 - 6：监听事件集合
// 参数isAutoJump判断是否结拍跳转，若是，则不给下一页按钮绑定点击事件，避免结拍的自动翻页和用户手动点击发生重叠从而一次跳出两页！
function listenClicks( Ppin, glbMsg, isAutoJump ){
	$(".plus").bind("click", function(){ //加号[+]点击
		PriceClickChang( 1 );
	});
	$(".lower").bind("click", function(){ //减号[-]点击
		PriceClickChang( 0 );
	});
	Qian.bind("keyup", function(){ //输入框的键盘事件
		ChangePriceText();
	});
	GZBtn.bind("click", function(){ //点击[关注]按钮
		gz( GZBtn );
	});
	pricesRel.bind("click", function(){ //点击[相关价格]按钮
		location.href = ROOT + "/AucList/searchfinish/id/" + g_id;
		return false;
	});
	$(".imQXDailiBtn").bind("click", function(){ //点击[取消代理]按钮
		DeleteBid();
	});
	$(".chaxun").bind("click", function(){ //点击[查询]按钮
		$.ajax({
			url: ROOT + "/JingPai/viewAgentAmount",
			type: "POST",
			data: {'pid': g_id},
			dataType: 'text',
			success: function( data ){
				var jsonRet = eval("(" + data + ")");//转换为josn对象
				if( jsonRet.status == 0 ){
					var amount = jsonRet.errtxt.P_d4;
					var datetime = jsonRet.errtxt.P_d5;
					var ret1 = "代理价格：" + amount + "元";
					var ret2 = "出价时间：" + datetime;
				}else{
					var ret1 = jsonRet.errtxt;
					var ret2 = '';
				}
				$(".ts-price").html( ret1 );
				$(".ts-time").html( ret2 );
				$(".ts").show();
			}
		});
	});
	$(".close1").css("cursor", "pointer").bind("click", function(){ //关闭查询结果
		$(".ts").hide();
	});
	$(".more").bind("click", function(){ //点击竞价表格的[更多]后弹出右侧 (transplanted from newcom.js)
		$("#pop").animate({width: "648px"}, 400);
		$(window).scrollTop(0);
		setComPage(1);
	});
	$("#off").bind("click", function(){ //收回右侧
		$("#pop").animate({width: "0"}, 400);
	});
	leftImgsPrev.bind("click", function(){ //书本左侧下的小图轮播向left滚动
		leftImgsNext.show();
		scrollpicUl.stop(false,true).animate({'left': '+=' + liwidth*5 + 'px'}, 500);
		sLeft = scrollpicUl.position().left; //每单击一次获取一次left
		if( sLeft == -liwidth*5 ){ leftImgsPrev.hide();}
	});
	leftImgsNext.bind("click", function(){ //向right滚动
		leftImgsPrev.show();
		scrollpicUl.stop(false,true).animate({'left': '-=' + liwidth*5 + 'px'}, 500);
		sLeft = scrollpicUl.position().left;
		if( sLeft == -pagecount*5*liwidth ){ leftImgsNext.hide(); }
	});
	prevPage.bind("click", function(){ //书本翻回上一页拍品
		bookMask.show();
		var myPrevPage = glbMsg['pre'];
		if( myPrevPage ){
			document.location.hash = "#" + myPrevPage;
			callAjax( myPrevPage, 2 );
		}else{ //如果上一页是空
			myPOPUP( "您已经在第一页，前面没有内容了。", true );
		}
	});
	nextPage.bind("click", function(){ //书本翻到下一页拍品
		if( !isAutoJump ){
			bookMask.show();
			var myNextPage = glbMsg['next'];
			if( g_current == g_total ){ // 若当前页等于总页数，则为最后一个拍品
				myPOPUP( "这是本期竞拍的最后一枚拍品了，后面没有数据了哦，您是否要返回易金首页？", false, function(){
					location.href = "/Index/";
				});
			}else{ // 不是最后一个拍品，继续翻到下一个
				document.location.hash = "#" + myNextPage;
				callAjax( myNextPage, 1 );
			}
			/*
			if( myNextPage ){
				document.location.hash = "#" + myNextPage;
				callAjax( myNextPage, 1 );
			}else{ //如果下一页是空
				myPOPUP( "这是本期竞拍的最后一枚拍品，后面没有数据了，您是否要返回易金首页？", false, function(){
					location.href = "/Index/";
				});
			}
			*/
		}else{
			return false;
		}
	});
	gotoLatest.bind("click", function(){ //点击左侧书签第一个，直接进入马上结拍的页面
		callAjax( "", 2 );
	});
}; //end listen Clicks
// 通用方法 - 6x：解绑监听事件
function unbindListen(){ //每次切换拍品，先解绑，再重新绑定监听。否则会连续执行
	$(".plus").unbind("click");
	$(".lower").unbind("click");
	Qian.unbind("keyup");
	GZBtn.unbind("click");
	pricesRel.unbind("click");
	$(".imQXDailiBtn").unbind("click");
	$(".chaxun").unbind("click");
	$(".close1").unbind("click");
	$(".more").unbind("click");
	$("#off").unbind("click");
	leftImgsPrev.unbind("click");
	leftImgsNext.unbind("click");
	prevPage.unbind("click");
	nextPage.unbind("click");
	gotoLatest.unbind("click");
}; //end unbind Listen
// 通用方法 - 7：步长计算方法
function planningBuChang( price ){
	if( price >= 1 && price < 200 ){
		return 5;
	}else if( price >= 200 && price < 1000 ){
		return 10;
	}else if( price >= 1000 && price < 5000 ){
		return 50;
	}else if( price >= 5000 && price < 10000 ){
		return 100;
	}else if( price >= 10000 && price < 50000 ){
		return 200;
	}else if( price >= 50000 && price < 100000 ){
		return 500;
	}else if( price >= 100000 && price < 500000 ){
		return 1000;
	}else if( price >= 500000 && price < 1000000 ){
		return 2000;
	}else if( price >= 1000000 ){
		return 5000;
	}
};
// 通用方法 - 8：弹出和自动隐藏提示框
function popMsg( txt ){
	$("#textmsg").html( txt );
	$("#dislayer").show();
	sto = setTimeout(function(){
		$("#dislayer").hide();
	}, TimeInt );
	return false;
};
// 通用方法 - 9：计算出价、服务费、总价（每出一次价，调用此方法更新页面的价格展示）
function ChuJiaJiSuan( price ){
	var bfb = g_fuwufee/100;
	var fwprice = GetFormatData( price, bfb );
	var zongjiage = price + fwprice;
	chengjiaoZJ.html( price );
	Yongjin.html( fwprice );
	zongJiaGe.html( zongjiage );
}; //end Chu Jia JiSuan
// 通用方法 - 10：计算fwprice
function GetFormatData( price, range ){ //price是当前价，range是百分比
	var fwprice = price * range;
	if( fwprice < 1 ){
		fwprice = 1;
	}else{
		var reg = /^\d*\./;
		if( reg.test(fwprice) ){
			fwprice = parseInt(fwprice) + 1;
		}
	}
	return fwprice;
} //end Get Format Data
// 通用方法 - 11：判断是否登录，没有登录直接跳转到登录页
function checkIfLogin(){
	if( g_userid == "" ){
		myPOPUP( "登录后才能使用本系统，现在就登录？", true, function(){
			location.href = "/Index/login/pid/" + g_id;
		});
		return false;
	}else if( g_status != 2 ){
		myPOPUP( "您的账号正在审核中，暂无法使用本系统！", true );
		return false;
	}
} //end check ifLogin
// 通用方法 - 12：关注指定拍品(跟随出价自动关注)
function setGuanzhu(){
	$.post( ROOT + "/AjaxReturn/setGuanzhu",{
		'id': g_id,
		rand: Math.random()
	}, function(data){
		if( data == 2 ){
			GZBtn.attr('class','attention').attr('title', '取消关注');
		}
	});
} //end set Guan zhu
// 通用方法 - 13：点击小圆圈按钮，关注/取消关注指定拍品
function gz( el ){ //关注
	checkIfLogin();
	$.get( ROOT + "/Attention/gzajax", {
		'action':'gz',
		'id': g_id,
		'rand': Math.random()
	}, function(data){
			if(data == 1){ //关注成功
				myPOPUP( "您已成功关注本拍品！", true );
				el.attr('class','attention').attr('title', '取消关注');
				return false;
			}else if(data == 2){ //关注失败
				myPOPUP( "关注失败！请点击[确定]刷新页面后重试！", true, function(){
					location.reload();
				});
			}else if(data == 3){ //取消成功
				myPOPUP( "您已成功取消关注！", true );
				el.attr('class','after-attention').attr('title', '关注此拍品');
				return false;
			}else if(data == 4){ //取消失败
				myPOPUP( "操作失败！请点击[确定]刷新页面重试。", true, function(){
					location.reload();
				});
			}
		}); //end get
}; //end g z
// 通用方法 - 14：处理页码展示
function DealWithPages( glbMsg ){
	nextPage.find("span").html( g_current + "/" + g_total );
}; //end Deal With Pages
// 通用方法 - 15：书本左侧下的小图列表左右滑动：
function makeImgsSlide(){
	page = 0; pagecount = 0; sLeft = 0; liwidth = 0;
	scrollpicUl.css("left", "0px");
	leftImgsPrev.hide();
	leftImgsList.mouseenter(function(){
		leftImgsPrev.addClass('prevhover');
		leftImgsNext.addClass('nexthover');
	});
	leftImgsList.mouseleave(function(){
		leftImgsPrev.removeClass('prevhover');
		leftImgsNext.removeClass('nexthover');
	});
	var lis = scrollpicUl.find("li");
	var len = lis.length; //小图片个数
	liwidth = lis.outerWidth(true);  //包含一张图片的容器内部区域宽度（包括padding）
	if(len == 5 || len < 5){
		leftImgsNext.hide();
	}else if( len%5 == 0 ){
		if( len > 5 ){leftImgsNext.show();}
		page = len/5;
		pagecount = page - 2;
	}else if( len%5 != 0 ){
		leftImgsNext.show();
		page = Math.floor(len/5) + 1;
		pagecount = page - 2;
	}
};// end make Imgs Slide
// 通用方法 - 16：统一弹出样式(新版后使用新的弹出样式，关闭按钮增添滑动效果)
function myPOPUP( txt, center, func ){ // center为true时文字居中显示
	var myPOP = $(".myPOP"),
		myPOPTXT = $("#myPOPTXT"),
		myPOP_Cancel = $("#myPOP_Cancel"),
		myPOP_OK = $("#myPOP_OK");
	myPOP_Cancel.css("right", "0px");
	if( center ){
		myPOPTXT.css("text-align", "center").html( txt );
	}else{
		myPOPTXT.css("text-align", "left").html( txt );
	}
	myPOP.show();
	myPOP_Cancel.unbind("click").bind("click", function(){
		$(this).animate({ right: "-50px" }, 300, function(){
			myPOP.hide();
			return false;
		});
	});
	myPOP_OK.unbind("click").bind("click", function(){
		if( func ){
			func(); //点击确定后执行回调
		}
		myPOP.hide();
		return false;
	});
}; //end my POP UP
// 通用方法 - 17：检测拍品标题，字数过多则将字号变小，避免页面被挤乱
function adjustProTitle( container ){
	var proTitle = container.find(".myProTitle");
	var t_height = proTitle.height();
	if( t_height > 70 ){ //高度大于一定数值，则字号变小
		proTitle.css("font-size", "16px");
	}
};
// ============================================================================================ //
// ================================== 页面数据的渲染 ========================================== //
// 图片渲染到预览区域和预览下的小图列表区域
function imgIntoPreviewWrap( sql_big, bigWrap, smlWrap ){
	bigWrap.html("");
	smlWrap.html("");//每渲染前，先清空原内容
	var bigImgArr = [], mediumImgArr = [], listImgArr = [];
	for(var p in sql_big){
		bigImgArr.push( sql_big[p].auc_albumBigImg );
		mediumImgArr.push( sql_big[p].auc_albumMediumImg );
		//listImgArr.push( sql_big[p].auc_albumListImg );
		listImgArr.push( sql_big[p].auc_albumSmallImg );
	}
	if( bigImgArr.length == mediumImgArr.length && mediumImgArr.length == listImgArr.length ){
		for(var i = 0; i < bigImgArr.length; i++){
			if( i == 0 ){ //第一个图片，中图显示，小图加边框
				var bigMediumTmpl = '<div class="control_show_hide"><a href="' + bigImgArr[i] + '"><img src="' + mediumImgArr[i] + '" width="500" height="500" /></a></div>';
				var listImgTmpl = '<li class="current" data="' + i + '"><a><img src="' + listImgArr[i] + '" width="80" height="80" /></a></li>';
			}else{ //非第一个图片，中图暂时隐藏，小图不加边框
				var bigMediumTmpl = '<div class="control_show_hide" style="display:none;"><a href="' + bigImgArr[i] + '"><img src="' + mediumImgArr[i] + '" width="500" height="500" /></a></div>';
				var listImgTmpl = '<li data="' + i + '"><a><img src="' + listImgArr[i] + '" width="80" height="80" /></a></li>';
			}
			bigWrap.append( bigMediumTmpl );
			smlWrap.append( listImgTmpl );
		} //end for
		var smlLis = $(smlWrap).find("li");
		for(var j = 0; j < smlLis.length; j++){
			$( smlLis[j] ).switchPics( $(".control_show_hide") );//点小图，中图轮播
		}
		$('.duandian a').lightBox(); //图片放大，看超大图片
	}else{
		dealError( "拍品无法展示，请联系网站管理员！" ); //不同尺寸的图片的数量不等，无法展示，页面报错
	}
};
// 渲染静态数据，即不需逻辑判断直接载入页面的元素
function renderStaticData( Ppin, glbMsg, Wrap ){
//Wrap是静态数据所在元素们的共同容器：#JingPaiProdInfo 或 #JiePaiProdInfo
//从Pai pin对象中取值的元素，class前缀带myPro_
//从glbMsg对象中取值的元素，class前缀带myU_
	var myProes = Wrap.find(".myPro_es");
	var myUes = Wrap.find(".myU_es");
	var myProInp = Wrap.find(".myPro_es_input");
	for( var i = 0; i < myProes.length; i++ ){
		var p_item = $(myProes[i]);
		var _d = "auc_" + p_item.data("tag");
		p_item.html("").html( Ppin[_d] );
	}
	for( var j = 0; j < myUes.length; j++ ){
		var u_item = $(myUes[j]);
		var _p = u_item.data("tag");
		u_item.html("").html( glbMsg[_p] );
	}
	for( var k = 0; k < myProInp.length; k++ ){
		var i_item = $(myProInp[k]);
		var _v = "auc_" + i_item.data("tag");
		i_item.val( Ppin[_v] );
	}
	var popdetails = Ppin['auc_proMs'] + " " + Ppin['auc_proProMs'];
	$(".product-detail").attr("title", popdetails );
	//渲染当前价、成交总价、佣金、合计：
	if( p_DqPrice == 0 ){ // 当前价为0，无人出过价
		// BjJia.html( p_StartPrice );
		chengjiaoZJ.html( p_StartPrice );
	}else{
		// BjJia.html( p_DqPrice );
		chengjiaoZJ.html( p_DqPrice );
	}
	BjJia.html( p_DqPrice ); // [当前价格：]显示当前价（可以为0）
	var chengjiaozongjia = parseInt( chengjiaoZJ.html() );
	var yongjin = parseInt( Yongjin.html() );
	zongJiaGe.html( chengjiaozongjia + yongjin );
	//[关注]按钮的处理
	var _gzrs = glbMsg['gzrs']; //如果没关注，则为空字符串，否则是一个对象
	if( _gzrs == "" ){
		GZBtn.attr("class", "after-attention").attr("title", "关注此拍品");
	}else{
		GZBtn.attr("class", "attention").attr("title", "取消关注");
	}
	Pop.css({"height":$("body").height()}); //右侧滑出的高度设定
	//是否显示小酒杯
	if( parseInt(g_userid) && ( g_entrustuid == parseInt(g_userid) ) ){
		jp_cheers.show();
	}else{
		jp_cheers.hide();
	}
};
// 结拍页的时间显示的处理
function formatFinishTime(){
	$("#finishStartTime").html( secToTIME(p_StartTime) );
	$("#finishEndTime").html( secToTIME(p_EndTime) );
};
// 展示竞拍结束时间
function showJingPaiEndTime( el ){
	el.html("").append("竞拍结束时间 : ").append( secToTIME(p_EndTime) );
};
// ============================================================================================ //
// ====================== 需逻辑判断才能渲染的数据，依次判断再渲染 ============================ //
// 出价输入框的展示，需判断用户状态，审核中的用户不能加减价、输入框亦不能处理
function renderBidInput(){
	var jpNUM = 0; //将展示在输入框中的竞拍出价数字
	if( p_StartPrice > 1 ){
		if( p_DqPrice > 0 ){
			jpNUM = p_DqPrice + g_buchang;
		}else{
			jpNUM = p_StartPrice;
		}
	}else{
		jpNUM = p_DqPrice + g_buchang;
	}
	if( g_userid == "" || (!g_status) ){
		Qian.attr("disabled","disabled");
		Qian.val( jpNUM );
		return false;
	}else{
		if( g_status != 2 ){ //有status值，说明已登录
			Qian.attr("disabled","disabled");
			Qian.val( jpNUM );
			return false;
		}else{
			Qian.val( jpNUM );
		}
	}
};
// 生成出价记录表的HTML结构模板(页面中展示的，非右侧弹出区)：
function DiBlogTMPL( obj, q ){ //参数 q 表示的是第几个人，第一个人名字样式不同且含有[领先]字样
	if( obj ){
		var _style = (q == 1)?"color:#b31e4e;":"",
			_name = obj['bidlogname'],
			_price = obj['V_BidMemAprice'],
			_sum = obj['sum'],
			_time = secToTIME( obj['V_BidMemAaddtime'] ),
			_city = ( obj['cityname'] )?( obj['cityname'] ):(""),
			_membUserid = obj['V_BidMemAuserid'],
			_emoticonId = obj['emoticon_id'],
			_ifLingxian = (q == 1)?"lingxian":"";
		var blogTmpl = '<tr>\
							<td style="' + _style + 'font-size:14px;font-weight:bold;">' + _name + '</td>\
							<td style="font-size:14px;font-weight:bold;">' + _price + '</td>\
							<td>' + _sum + '</td>\
							<td>' + _time + '</td>\
							<td>' + _city + '</td>\
							<td class="face-td" data-userid="' + _membUserid + '" data-myid="' + g_userid + '">\
								<div class="face-btn face-btnbg" data="' + _emoticonId + '" title="选择表情" style="display:none;"></div>\
								<div class="face-justshow" data="' + _emoticonId + '" style="display:none;"></div>\
								<div class="face-board">\
									<div class="face-preview face-prevTop"></div>\
									<div class="face-preview face-prevBot"></div>\
									<a class="face-sbtn face-hover-top face-sml-1 face-sposition-1" data="1" href="javascript:;"></a>\
									<a class="face-sbtn face-hover-top face-sml-2 face-sposition-2" data="2" href="javascript:;"></a>\
									<a class="face-sbtn face-hover-bot face-sml-3 face-sposition-3" data="3" href="javascript:;"></a>\
									<a class="face-sbtn face-hover-bot face-sml-4 face-sposition-4" data="4" href="javascript:;"></a>\
									<a class="face-sbtn face-hover-top face-sml-5 face-sposition-5" data="5" href="javascript:;"></a>\
									<a class="face-sbtn face-hover-top face-sml-6 face-sposition-6" data="6" href="javascript:;"></a>\
									<a class="face-sbtn face-hover-bot face-sml-7 face-sposition-7" data="7" href="javascript:;"></a>\
									<a class="face-sbtn face-hover-bot face-sml-8 face-sposition-8" data="8" href="javascript:;"></a>\
									<a class="face-sbtn face-hover-top face-sml-9 face-sposition-9" data="9" href="javascript:;"></a>\
									<a class="face-sbtn face-hover-top face-sml-10 face-sposition-10" data="10" href="javascript:;"></a>\
									<a class="face-sbtn face-hover-top face-sml-11 face-sposition-11" data="11" href="javascript:;"></a>\
									<a class="face-sbtn face-hover-top face-sml-12 face-sposition-12" data="12" href="javascript:;"></a>\
									<a class="face-sbtn face-hover-top face-sml-13 face-sposition-13" data="13" href="javascript:;"></a>\
									<a class="face-sbtn face-hover-top face-sml-14 face-sposition-14" data="14" href="javascript:;"></a>\
									<a class="face-sbtn face-hover-top face-sml-15 face-sposition-15" data="15" href="javascript:;"></a>\
									<a class="face-sbtn face-hover-top face-sml-16 face-sposition-16" data="16" href="javascript:;"></a>\
								</div>\
							</td>\
							<td class="' + _ifLingxian + '"><s></s></td>\
						</tr>';
		return blogTmpl;
	}else{
		var emptyTmpl = '<tr><td class="nochujia" colspan="7">还没有人出价哦</td></tr>';
		return emptyTmpl;
	}
}; //end TMPL
// 渲染出价记录表，Container是#chujialist (结拍则是#chujialist_jp)
function renderDiblog( dblog, Container, bmore ){
	var firstBidder = dblog[0], secondBidder = dblog[1]; //两个出价人
	if( !firstBidder || (firstBidder.length == 0) ){
		Container.html("").html( DiBlogTMPL( firstBidder, 0 ) );
	}else if( !secondBidder || (secondBidder.length == 0) ){
		Container.html("").append( DiBlogTMPL( firstBidder, 1 ) );
		Faces();
		confirmingFace();
	}else{
		Container.html("").append( DiBlogTMPL( firstBidder, 1 ) ).append( DiBlogTMPL( secondBidder, 2 ) );
		var _sum_1 = parseInt( firstBidder['sum'] ), _sum_2 = parseInt( secondBidder['sum'] );
		//两个人的出价次数之和小于总次数时，则必然至少三个人出过价，此时再显示[更多]按钮弹出右侧浮层
		if( (_sum_1 + _sum_2) < g_cjcount ){
			bmore.show().css("display","block");
		}
		Faces();
		confirmingFace();
	}
};
// 渲染[出价]或[代理出价]按钮，同时如果输入价格是 (当前价 + 2个步长)，出现代理出价按钮
function showDLBtn(){
	if( g_mydaili && g_mydaili > p_DqPrice ){ //当前用户对该拍品有代理价且大于当前价
		Qian.val( g_mydaili ); //输入框显示用户代理价
		chuJ.html( imDaiLiBtn ); //展示[代理出价]按钮
		qxchuJ.show(); //展示[取消代理]按钮
		$(".imDaiLiBtn").click(function(){
			AddAagency();
		});
		ChuJiaJiSuan( p_DqPrice ); //用当前价计算成交总价、佣金、合计
	}else{
		ChuJiaJiSuan( p_DqPrice ); //用当前价计算成交总价、佣金、合计
		chuJ.html( imChujiaBtn ); //展示[出价]按钮
		$(".imChujiaBtn").click(function(){ //动态塞入页面的元素，必须用class名去调用，不能用字符串变量调用
			AddBid();
		});
		if( !g_mydaili ){
			qxchuJ.hide();
		}else{ //只要有代理价，即使我的代理不是最高代理，也显示[取消代理]按钮
			qxchuJ.show();
		}
	}
};
// ============================================================================================ //
// 左侧书签的HTML结构：
function leftTagTmpl( _pid, _sort, _title ){
	return '<li title="成功拍下\n' + _title + '" data="' + _pid + '"><s class="bkTag-greyHeart"></s><span>' + _sort + '</span></li>';
};
// 右侧书签的HTML结构：
function rightTagTmpl( _pid, _sort, _title ){
	return '<li id="ifSparkleLi_' + _pid + '" title="' + _title + '" data="' + _pid + '" class="bkTag-yellow"><s id="ifSparkle_' + _pid + '" class="bkTag-yellowHeart"></s><span>' + _sort + '</span></li>';
};
// 每隔五秒询问一次闪否：
function askIfSparkle(){
	if( arrSparkle && arrSparkle.length > 0 ){
		var _pids = "";
		for( var i = 0; i < arrSparkle.length; i++ ){
			_pids += ( arrSparkle[i] + "," ); //拍品逗号间隔
		}
		_pids = _pids.substring(0, _pids.length-1); //去掉最后一个逗号
		$.ajax({
			url: ROOT + '/AjaxReturn/GetFlash/pids/' + _pids,
			type: 'GET',
			dataType: 'json',
			success: function(data){
				for( var p in data ){ //p就是拍品id
					if( data[p] ){ //返回true则闪
						$("#ifSparkleLi_" + p).removeClass("bkTag-yellow").addClass("bkTag-pink");
						$("#ifSparkle_" + p).removeClass("bkTag-yellowHeart").addClass("bkTag-sparkle");
					}
				}
			}
		});
	}
}; //end ask if Sparkle
// 获取右侧书签数据(我关注的)后的处理：
function dealRightTags( gz ){
	arrSparkle = [];
	var lis = rightTagUl.find("li");
	for( var k = 0; k < lis.length; k++ ){
		var thisLi = $(lis[k]);
		if( !thisLi.hasClass("bkTag-myFocus") ){
			thisLi.remove(); //清空前一页的旧书签
		}
	}
	if( gz ){
		for(var i = 0; i < gz.length; i++){
			var _item = gz[i];
			var _pid = _item['V_ProAttentionAid'],
				_sort = _item['sort'],
				_title = _item['V_ProAttentionAname'];
			var _tmpl = rightTagTmpl( _pid, _sort, _title );
			$(_tmpl).insertBefore( tagMyFocus ); //塞入数据
			if( i < 3 ){
				arrSparkle.push( _pid ); //只取前三个关注品，来询问是否闪动
			}
		}
		makeTagAlive( rightTagUl );
	}
}; //end deal right tags
// 获取左侧书签数据(我拍下的)后的处理：
function dealLeftTags( doneorder ){
	var lis = leftTagUl.find("li");
	for( var k = 0; k < lis.length; k++ ){
		var thisLi = $(lis[k]);
		if( !thisLi.hasClass("bkTag-gotoLatest") ){
			thisLi.remove(); //清空前一页的旧书签
		}
	}
	if( doneorder ){
		for(var i = 0; i < doneorder.length; i++){
			var _item = doneorder[i];
			var _pid = _item['V_OrderProoproductid'],
				_sort = _item['sort'],
				_title = _item['V_OrderPropname'];
			var _tmpl = leftTagTmpl( _pid, _sort, _title );
			leftTagUl.append( _tmpl );
		}
		makeTagAlive( leftTagUl );
	}
}; //end deal left tags
// ================================================= //
// 书签效果的方法：
$.fn.hoverTag = function( type ){
	var me = $(this);
	var thisPid = me.attr("data");
	if(me.hasClass("bkTag-myFocus")){return false;}
	if(me.hasClass("bkTag-gotoLatest")){return false;}
	me.click(function(){ //点击书签
		document.location.hash = "#" + thisPid;
		callAjax( thisPid, type ); //type为2是左边书签，向左翻页；type为1是右边书签，向右翻页
	});
}; //end hover Tag
// 书签调用(此方法需在数据塞入之后再调用)：
function makeTagAlive( ul ){
	var tagsLis = ul.find("li");
	var type = ul.attr("data");
	for( var i = 0; i < tagsLis.length; i++ ){
		var tagItem = $(tagsLis[i]);
		tagItem.hoverTag( parseInt( type ) );
	};
}; //end make tag alive
// ============================================================================================ //
// ============================================================================================ //
// ================== end for 需逻辑判断才能渲染的数据，依次判断再渲染 ======================== //
// ============================================================================================ //
// ============================================================================================ //
function GetRTime(){ //倒计时，该方法也必须放在首次Ajax的success回调里执行
	clearTimeout( unClock ); //倒计时前先清理异步之前的时间计时
	var nMS = nMS2 * 1000;
	if( nMS >= 0 ){
		if( nMS <= 10000 && nMS >0 ){ //时间小于10秒，每隔1秒刷新一次出价表
			showInput( p_Num );//TOMMY
			PartRefresh("4", 1);  //tommy pn
			if( nMS <= 2000 ){
				nextPage.unbind("click"); //最后2秒，不允许手动点击下一页
			}
		}else if( nMS <= 30000 && nMS > 0 ){ //30秒以内
			if( nMS2*1%10 == 0 ){
				PartRefresh("4", 0);
			}else{
				if( nMS2*1%5 == 0 ){
					askIfSparkle();
				}
				nMS2 = (nMS2 - 1);
			}
		}else if( nMS <= 300000 && nMS >0 ){ //5分钟以内
			if( nMS2*1%30 == 0 ){
				PartRefresh("4", 0);
			}else{
				if( nMS2*1%5 == 0 ){
					askIfSparkle();
				}
				nMS2 = (nMS2 - 1);
			}
		}else{
			nMS2 = (nMS2 - 1);
		}
		var nD = Math.floor(nMS / (1000 * 60 * 60 * 24)) % 24;
		var nH = Math.floor(nMS / (1000 * 60 * 60)) % 24;
		var nM = Math.floor(nMS / (1000 * 60)) % 60;
		var nS = Math.floor(nMS / 1000) % 60;
		$("#RemainD").html( FormatDate(nD) );
		$("#RemainH").html( FormatDate(nH) );
		$("#RemainM").html( FormatDate(nM) );
		$("#RemainS").html( FormatDate(nS) );
		unClock = setTimeout( GetRTime, 1000 ); //避免异步请求后时间错乱，赋值到一个全局变量
		if( g_nowtime < p_StartTime ){
			dealError( "该拍品的竞拍未开始，敬请等待！" );
		}
	}else{
		nextPage.unbind("click"); //竞拍结束瞬间，不允许手动点击下一页
		PartRefresh("4", 0);
		setTimeout(function(){
			callAjax( g_id, 3 );
		}, 1000);
	}
}; //end Get R Time
// ============================================================================================ //
// ============================================================================================ //
// 修改出价的价格，点击加减号[+][-]调用此方法
function PriceClickChang( type ){
	checkIfLogin();
	var price = parseInt( Qian.val() );
	var buchangNum = planningBuChang( price ); //计算出步长
	price = parseInt( price/buchangNum ) * buchangNum; //规范当前价格
	//在页面里对价格增减，赋值到出价框
	if( type == 1 ){
		Qian.val( price += buchangNum );
		ChuJiaJiSuan( price );
	}
	if( type == 0 ){
		Qian.val( price -= buchangNum );
		ChuJiaJiSuan( price );
	}
	//判断是否超出可用额度
	if( g_Logined && (price > g_edu) ){
		popMsg( "您的出价超出了可用额度" );
		Qian.val( g_edu );
		return false;
	}
	if( g_Logined && (price <= p_DqPrice) ){
		popMsg( "您的出价不能低于当前价" );
		Qian.val( p_DqPrice + g_buchang );
		return false;
	}
	if( g_Logined && (price >= (p_DqPrice + 2*buchangNum)) ){
		chuJ.html( imDaiLiBtn );
		$(".imDaiLiBtn").click(function(){
			AddAagency();
		});
	}else if( g_Logined && ( price < (p_DqPrice + 2*buchangNum) ) ){
		if( g_mydaili && (g_mydaili > p_DqPrice) ){ //我已有代理价，点[-]减号输入框刚好为(当前价+1个步长)
			chuJ.html( imDaiLiBtn );
			$(".imDaiLiBtn").click(function(){
				AddAagency();
			})
		}else{
			chuJ.html( imChujiaBtn );
			$(".imChujiaBtn").click(function(){
				AddBid();
			});
		}
	}
}; // end Price Click Chang
// ============================================================================================ //
// 输入框手动录入数据时的校验
function ChangePriceText(){
	var price = parseInt( Qian.val() );
	var chazhi = price - p_DqPrice;
	var currprice;
	if( p_DqPrice == 0 ){
		if( p_StartPrice <= 1 ){
			currprice = 0;
		}else{
			currprice = p_StartPrice;
		}
	}else{
		currprice = p_DqPrice;
	}
	currprice = currprice + g_buchang;
	if( !price ){
		popMsg("请您填写合理的价格！");
		return false;
	}
	if( price > g_edu ){
		popMsg("出价不可超出可用额度！");
		Qian.val( g_edu );
		ChuJiaJiSuan( g_edu );
		return false;
	}
	if( price > 100000000 ){
		price = 100000000;
		Qian.val( price );
		popMsg("请填写合理的价格！");
		ChuJiaJiSuan( price );
		return false;
	}
	if( currprice == price){
		ChuJiaJiSuan( price );
		chuJ.html( imChujiaBtn );
		$(".imChujiaBtn").click(function(){
			AddBid();
		});
	}
	var tmp_price = (p_DqPrice == 0)?( p_StartPrice - 1 ):( p_DqPrice );
	if( price <= tmp_price ){
		popMsg("出价不能低于当前价格！");
		ChuJiaJiSuan( price );
		return false;
	}
	if( chazhi >= 2*g_buchang ){
		chuJ.html( imDaiLiBtn );
		$(".imDaiLiBtn").click(function(){
			AddAagency();
		});
	}
	if( !/^[0-9]+$/.test(price) ){
		popMsg("出价请输入正整数！");
		ChuJiaJiSuan( price );
		return false;
	}else{
		var b = false;
		var buchang = planningBuChang( price );
		if( price%buchang != 0){
			var newprice = ( parseInt(price/buchang) + 1 ) * buchang;
			popMsg("出价不符合规则，您想输入的是否是" + newprice);
			return false;
		}else{
			b = true;
		}
		if( g_mydaili && g_mydaili > p_DqPrice ){
			chuJ.html( imDaiLiBtn );
			$(".imDaiLiBtn").click(function(){
				AddAagency();
			});
		}
		ChuJiaJiSuan( price );
		return b;
	}
}; //end Change Price Text
// ============================================================================================ //
// 添加出价
function AddBid(){
	checkIfLogin();
	var price = parseInt( Qian.val() ); //获取输入框当前的价格
	var bjJia = parseInt( $("#bjjia").html() ); //拿到页面显示的当前价
	var bjBuCh = planningBuChang( bjJia ); //对应的步长
	if( !ChangePriceText() ){
		popMsg( "出价有误，请重新设置价格" );
		Qian.val( bjJia + bjBuCh );
		return false;
	}
	if( g_mydaili && g_mydaili > p_DqPrice ){ //若我对此拍品有代理价
		popMsg( "您已经是最高价" );
		return false;
	}else if( price <= p_DqPrice ){
		popMsg("出价不能低于当前价");
		Qian.val( bjJia + bjBuCh );
		return false;
	}else{ //我无代理价
		$.post( ROOT + "/AjaxReturn/updatebid", {
			Action: "post",
			did: g_id,
			price: price,
			endtime: p_EndTime,
			bc: g_buchang,
			productid: g_id
		}, function(_obj){
			var res = _obj;
			if( !res ){
				popMsg( "网络出错，请刷新后重试" );
				return false;
			}else{
				res = res.split("|");
				if( res[0] == "b1" ){
					popMsg( "出价成功" );
					PartRefresh("0", 0);
					setGuanzhu();
				}else if( res[0] == "b2" ){
					popMsg( "出价不能超出可用额度" );
					return false;
				}else if( res[0] == "b3" ){
					popMsg( "出价不能低于当前价!!" );
					PartRefresh("0", 0);
					return false;
				}else if( res[0] == "b4" ){
					popMsg( "您已是最高出价" ); //出价到最高价，按钮变[代理出价]
					chuJ.html( imDaiLiBtn );
					$(".imDaiLiBtn").click(function(){
						AddAagency();
					});
					return false;
				}else if( res[0] == "b5" ){
					popMsg( "当前拍品时间不符" );
					return false;
				}else if( res[0] == "b6" ){
					popMsg( "网络错误，请联系管理员" );
					return false;
				}else{
					popMsg( "出价失败" );
					return false;
				}
			}
		}); //end post
	}
}; //end Add Bid
// ============================================================================================ //
// 添加代理出价
function AddAagency(){
	checkIfLogin();
	var price = parseInt( Qian.val() );
	if( !ChangePriceText() ){
		popMsg( "价格有误，请重新设置价格" );
		return false;
	}
	$.post( ROOT + "/Home/AjaxReturn/AddAgency", {
		Action: "post",
		agencyid: g_id,
		agencyprice: price
	}, function( _obj ){
		var res = _obj;
		if( !res ){
			popMsg( "网络出错，请刷新后重试" );
			return false;
		}else{
			res = res.split("|");
			if( res[0] == "a1" ){
				popMsg( "代理出价设置成功" );
				qxchuJ.show();
				PartRefresh("2", 0);
				setGuanzhu();
			}else if( res[0] == "a2" ){
				popMsg( "出价不能超出可用额度" );
				return false;
			}else if( res[0] == "a3" ){
				popMsg( "出价不能低于拍品价格" );
				PartRefresh("2", 0);
			}else if( res[0] == "b1" ){
				popMsg( "出价成功！" ); //点击[代理出价]，作为正常出价处理，说明已有人比我的代理价还高
				PartRefresh("3", 0);
				setGuanzhu();
			}else if( res[0] == "b2" ){
				popMsg( "出价不能超出可用额度" );
				return false;
			}else if( res[0] == "b3" ){
				popMsg( "出价不能低于当前出价" );
				PartRefresh("3", 0);
			}else if( res[0] == "b4" ){
				popMsg( "您已是最高出价" );
				return false;
			}else{
				popMsg( "网络出错，请重试" );
				return false;
			}
		}
	}); //end post
}; //end Add Aagency
// ============================================================================================ //
// 删除代理出价
function DeleteBid(){
	$.post( ROOT + "/AjaxReturn/DeleteBid", {
		Action: "post",
		did: g_id
	}, function( _obj ){
		var res = _obj;
		if( !res ){
			popMsg( "网络出错，请稍后重试" );
			return false;
		}else if( res == "1" ){
			popMsg( "代理出价取消成功" );
			qxchuJ.hide();
			chuJ.html( imChujiaBtn );
			$(".imChujiaBtn").click(function(){ AddBid(); })
			g_mydaili = null;
			PartRefresh("1", 0);
		}else if( res == '2' ){
			popMsg( "操作失败，请重试" );
			return false;
		}
	}); //end post
}//end Delete Bid
// ============================================================================================ //
function PartRefresh( dl, type ){ //局部刷新的方法 最后10秒时type为1，不刷新出价输入框
	var localVal = parseInt( Qian.val() ); //本地输入框里的值
	var oldDq_Price = parseInt( p_DqPrice ); //拿到局部刷新请求之前的当前价
	var oldBuchang = parseInt( g_buchang ); //刷新之前的旧步长
	$.post( ROOT + "/AjaxReturn/GetReleData", {
		'pid': g_id,
		'dl': dl,
		'rand': Math.random()
	}, function( data ){
		var cjdata = data.cjdata;
		var cjList = data.chujialist;
		var newQian = parseInt( cjdata['input_price'] ); //输入框新价格
		p_DqPrice = parseInt( cjdata['dq_price'] ); //重写全局当前价
		g_mydaili = parseInt( cjdata['dquserdl_price'] ); //重写我的代理价
		g_buchang = parseInt( cjdata['bcnum'] ); //重写步长
		g_edu = parseInt( cjdata['edu'] ); //重写额度
		use_edu.html( g_edu ); //显示新的额度
		BjJia.html( p_DqPrice ); //显示新的当前价
		ChuJiaJiSuan( p_DqPrice ); //显示新的总价佣金合计
		$("#jjfudu").html( g_buchang ); //显示新的步长值
		nMS2 = cjdata['lefttime']; //重写倒计时
		c_State.html( cjdata['state'] ); //重写状态
		renderDiblog( cjList, $("#chujialist"), $(".more") ); //渲染出价记录表
		//局部刷新异步返回最新价格，重新绑定加减号的点击事件
		$(".plus").unbind("click").bind("click", function(){ PriceClickChang(1); });
		$(".lower").unbind("click").bind("click", function(){ PriceClickChang(0); });
		//输入框的键盘事件重新绑定
		Qian.unbind("keyup").bind("keyup", function(){ ChangePriceText(); });
		//判断输入框的数值的刷新显示：
		if( !g_mydaili ){ g_mydaili = 0; }
		if( localVal <= p_DqPrice && g_mydaili <= p_DqPrice ){ //本地价小于等于最新当前价 并且 代理价小于最新当前价
			if( type == 1 ){ //最后10秒，局部刷新不更改用户输入框的值				
				Qian.val( Qian.val() );
			}else{
				Qian.val( p_DqPrice + g_buchang );
			}
		}else{
			if( localVal > g_mydaili ){
				Qian.val( localVal );
			}else{
				Qian.val( g_mydaili );
			}
		};
		//判断出价按钮或代理出价按钮的显示
		var localChazhi = localVal - oldDq_Price; //当前的差值
		if( g_mydaili && g_mydaili > p_DqPrice  ){ //我有代理价且最高
			chuJ.html( imDaiLiBtn );
			$(".imDaiLiBtn").click(function(){
				AddAagency();
			});
			qxchuJ.show();
		}else if( localChazhi >= 2*oldBuchang ){
			chuJ.html( imDaiLiBtn );
			$(".imDaiLiBtn").click(function(){
				AddAagency();
			});
			qxchuJ.hide();
		}else{
			chuJ.html( imChujiaBtn );
			$(".imChujiaBtn").click(function(){
				AddBid();
			});
			qxchuJ.hide();
		}
	}); //end post
}; //end Part Refresh
// ============================================================================================ //
// 选择表情
$.fn.makeFace = function(){
	var me = $(this); //当前行放表情的td
	var userid = me.attr("data-userid");
	var myid = me.attr("data-myid");
	if( userid == myid ){ //列表中的当前行是登录用户本人时，可以操作切换表情
		me.find(".face-btn").show().toggle(function(){
			me.find(".face-board").show();
		}, function(){
			me.find(".face-board").hide();
		});
		var myfaceID = me.find(".face-btn").attr("data");
		if( myfaceID != 0 ){
			me.find(".face-btn").removeClass("face-btnbg").addClass("face-sml-" + myfaceID);
		}
	}else{ //列表中当前行不是登录用户本人时，只显示表情，不能操作切换表情
		var facejustshow = me.find(".face-justshow");
		var justshowID = facejustshow.attr('data');
		facejustshow.show().addClass( "face-sml-" + justshowID ).css("cursor", "default");
	}
};
// ============================================================================================ //
function Faces(){
	var facetds = $(".face-td");
	var lx = facetds.next();
	$(lx[0]).addClass("lingxian");
	for(var i = 0; i < facetds.length; i++){
		var item = $(facetds[i]);
		item.makeFace(); // 点击打开表情面板
	};
};
// ============================================================================================ //
function facePrevTmpl( id ){ //表情预览的html模板
	return '<a class="face-pres face-pre-' + id + '"></a>';
}
// ============================================================================================ //
$.fn.confirmFace = function(){ //点击确定表情
	var me = $(this);
	var data = me.attr("data");
	var faceBtn = $(".face-btn");
	data = parseInt(data);
	me.click(function(){
			$.ajax({
				url: '/JingPai/set_emoticon',
				type: 'POST',
				data: { 'emoticon_id': data, "pid": g_id },
				dataType: 'json',
				success: function(data){
					if( data.status == 0 ){
						faceBtn.trigger("click");
						var faceID = data.data;
						faceBtn.attr("class", "").attr("class", "face-btn face-sml-" + faceID);
					}else{
						myPOPUP( "网络出错，请点击[确定]刷新重试。", true, function(){
							location.reload();
						});
					}
				},
				error: function(r){}
			});
	});
};
// ============================================================================================ //
function confirmingFace(){ //为对应元素绑定确定表情的方法
	var facesBtn = $(".face-sbtn");
	for(var m = 0; m < facesBtn.length; m++){
		var fItem = $(facesBtn[m]);
		fItem.confirmFace();
	};
};
// ============================================================================================ //
// ============================================================================================ //
// 右侧滑出的出价列表的页码跳转
function setComPage( pagenum ){
	pagenum = $.trim( pagenum );
	if( !pagenum ){
		pagenum = $("#in_page").val();
		if( pagenum == "" || pagenum == "0" || !strP.test(pagenum) ){
			myPOPUP( "请输入正确的页数！", true );
			$("#in_page").val("");
			return false;
		}
	}
	$.get( ROOT + '/JingPai/bidrecord_more/page/' + pagenum + '/pid/' + g_id + '/status/jingpai', function(_obj){
		if( _obj == "0" ){
			myPOPUP("抱歉，您的产品参数错误。", true );
			return false;
		}else if( _obj == "1" ){
			$("#chujialist_more").html("没有出价记录");
			return false;
		}else{
			var tmp_array = new Array();
			tmp_array = _obj.split("||||####");
			$("#chujialist_more").html( tmp_array['0'] );//渲染列表
			$("#more_page").html( tmp_array['1'] );//渲染页码
			$("#more_page").attr("data", pagenum);
			$(".mpagebtns").click(function(){ //点击右侧列表的页码
				var _page = $(this).attr("data");
				if( _page == "next" ){
					_page = parseInt( $("#more_page").attr("data") ) + 1;
				}else if( _page == "prev" ){
					_page = parseInt( $("#more_page").attr("data") ) - 1;
				}else{
					_page = parseInt( _page );
				}
				setComPage( _page );
			});
			$("#btnsub").click(function(){
				setComPage( $("#in_page").val() );
			})
		}
	});
}; // end set Com Page
// ============================================================================================ //
//todo:tommy 2015/3/19 展示出价人的代理价格
function showInput(pn){
	//$('#ShowInput').html('');
	$.ajax({
		url: '/JingPai/viewAgentForP.html',
		type: 'POST',
		data: { 'pn': pn},
		dataType: 'json',
		success: function( data ){
			if( data.status == "0" ){
				$('#ShowInput').html(data.errtxt);
			}else{ //code != 0
				return false;
				//myPOPUP(data.errtxt, true, function(){
				//location.reload();
				//});
			}
		},
		error: function( r ){
			myPOPUP( "网络出错，请点击[确定]刷新页面后重试！", true, function(){
				location.reload();
			});
		}
	}); //end ajax
}
//---------------------------------------------------------------------------------//
//todo:tommy 2015/3/23 刷新出价人的代理价格特定
function showInputTo(pn){
	$.ajax({
		url: '/JingPai/viewAgentForP.html',
		type: 'POST',
		data: { 'pn': pn},
		dataType: 'json',
		success: function( data ){
			if( data.status == "0" ){
				$('#ShowInput').html(data.errtxt);
			}else{ //code != 0
				return false;
				//myPOPUP(data.errtxt, true, function(){
				//location.reload();
				//});
			}
		},
		error: function( r ){
			myPOPUP( "网络出错，请点击[确定]刷新页面后重试！", true, function(){
				location.reload();
			});
		}
	}); //end ajax
}
//-------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------//
// todo: tommy 2015/3/23特定添加代理出价
function AddAagencyOnly(){
	checkIfLogin();
	var price = parseInt( $('#topPrice').val() );
	return false;
	if( !ChangePriceText() ){
		popMsg( "价格有误，请重新设置价格" );
		return false;
	}
	$.post( ROOT + "/Home/AjaxReturn/AddAgency", {
		Action: "post",
		agencyid: g_id,
		agencyprice: price
	}, function( _obj ){
		var res = _obj;
		if( !res ){
			popMsg( "网络出错，请刷新后重试" );
			return false;
		}else{
			res = res.split("|");
			if( res[0] == "a1" ){
				popMsg( "代理出价设置成功" );
				qxchuJ.show();
				PartRefresh("2", 0);
				setGuanzhu();
			}else if( res[0] == "a2" ){
				popMsg( "出价不能超出可用额度" );
				return false;
			}else if( res[0] == "a3" ){
				popMsg( "出价不能低于拍品价格" );
				PartRefresh("2", 0);
			}else if( res[0] == "b1" ){
				popMsg( "出价成功！" ); //点击[代理出价]，作为正常出价处理，说明已有人比我的代理价还高
				PartRefresh("3", 0);
				setGuanzhu();
			}else if( res[0] == "b2" ){
				popMsg( "出价不能超出可用额度" );
				return false;
			}else if( res[0] == "b3" ){
				popMsg( "出价不能低于当前出价" );
				PartRefresh("3", 0);
			}else if( res[0] == "b4" ){
				popMsg( "您已是最高出价" );
				return false;
			}else{
				popMsg( "网络出错，请重试" );
				return false;
			}
		}
	}); 
}; 
// ============================================================================================ //
// 通用方法 - Z: 翻页特效
function imTurnPage( type, container, func ){ //type标识上 or 下页，container是.my-auction-wrap容器，func是翻页后的回调
	if( type == 1 ){ //下一页
		var nextRoll = $('<div style="position:absolute;z-index:1000;left:1174px;top:7px;height:670px;width:1px;border:1px solid #999;background-image:url(' + nextPageImg + ');background-repeat:repeat-y;background-color:#fff;background-position:-200px 0px;"></div>');
		nextRoll.appendTo( container );
		nextRoll.animate({
			left: "30px",
			width: "570px",
			backgroundPositionX: "350px",
			backgroundPositionY: "0px"
		}, 700, function(){
			func(); //页翻过去之后的回调（在此渲染数据）
			nextRoll.fadeOut(300, function(){
				nextRoll.remove();
			});
		});
	}else if( type == 2 ){ //上一页
		var prevRoll = $('<div style="position:absolute;z-index:1000;left:15px;top:7px;height:670px;width:1px;border:1px solid #CCC;background-image:url(' + prevPageImg + ');background-repeat:repeat-y;background-color:#fff;background-position:-200px 0px;"></div>');
		prevRoll.appendTo( container );
		prevRoll.animate({
			left: "603px",
			width: "570px",
			backgroundPositionX: "0px",
			backgroundPositionY: "0px"
		}, 700, function(){
			func(); //页翻后的回调
			prevRoll.fadeOut(300, function(){
				prevRoll.remove();
			});
		});
	}
}; //end im Turn Page
// 翻页的两个图片用Base64
var prevPageImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN4AAABlCAYAAAAial0BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkY1MEIzQjVENkUyRjExRTQ5RkI0OTRCQzQ1RENGMkI3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkY1MEIzQjVFNkUyRjExRTQ5RkI0OTRCQzQ1RENGMkI3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjUwQjNCNUI2RTJGMTFFNDlGQjQ5NEJDNDVEQ0YyQjciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjUwQjNCNUM2RTJGMTFFNDlGQjQ5NEJDNDVEQ0YyQjciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6wwzNpAAAE8klEQVR42uyda3LbMAyEs7xS7n8Dn8lo/rWT5iHbJLEAP8ykyigdCQR2F6Bk0rrdbvE2z+Kf4+fffzr3ys/9wvn7xb/d/x7j46hP56YfnzgX9y/8+uz3/cH7/Pf3j3/uuubbzONv5x7J5RWMPPvzG67f3t/ff+TVeIpW3Sy++lVejl32a47fesNW2iAbzkME/hBvk56D74xgx4bMhDkI4hzioecuwdaGzOj702EfoL3EC+B6SMmn47BqNQWS1/pGyWeO14NExkgO2UULg3j9+w81iRYMn0u8IOgF0ZhwX5HCqcRT2aA7qIGSXFSbCJ7WYI36hJER6sJQsMINcwhBLvFM0i3Ti81C34yHOrHXaUE8rLwgaOc1eD8C8TDMuO2FeMCHSVpCDYd4RwBOybcL2Azx+uC7jrKI4LYhXnTWRtcRqOGYIN40DNTXxo6lkyeee4iHwFErH/ArDgPQOuIhcMfWlTk7xQjiUeCa163YRX5QMp14gqJ161bR4pK4U4wJ8eLRLEM+BGX+1WThcWwknnITgJ3TFXcRl0FOsK2iG8ao2Ohakfd4ULhNWiRf99WEeDK80imSsMWv4jOGTPf5rGZT7PEIy1shR8eOLmhTTUQhfFIgZ+IpjR0LY8yOInmuyi8F4Ui8ggpUr54JVxlT/TleF2wwHzvLBgg4WUCiwR26EC+7hMSE/0q2beju3JGEFfFmDWrDLgE6aW6CtRKFZcST6S4BYXQdCjOt5jFSVHKfWKxdnzoIAoY9ATIdRTzHLwW5wvzYchesThs2KnAsrJqzOTuK0JoyxztMa4A/ZjjHC/BtkrzEHUWiCbqN8TnQc9fkJe4oYrOmqC8aWY9XSGTBPMRrguQAcFgKisf62xsjOVQqWVifBmC0IZFhO7UtWjCcVpPJWsJ9RQohnk3ElOSiwFxxQYkNCRpr0i0j1Dl+zCxcMYcQXI393Pd4KjTyyn2YeoKxUeu6epH1WK1ytEzYdP40WGQ9Vqscr8XOqBBbq2+DRdZ8cgX7Hjps77fs0mMen1lzBiqp+i8SjzVnGAxbCcgB/LHj2g+DRdYjN3msOeu85ozmOpN4rDkD3W4SYxDys59q0lETboiHUZEgHsmiIiEVzsRjzRmWl2CdRjzWnCEoJDiBeKw5q463IEGpyB2ZzrHmzJzv6gn65dGLZ4g37XustDHGsQ+MWDJheiyyXveNsFvXFEEZeuoMN56/GO/xmtcHzNNGK/g0Qis1HOLVgY9WMJHag5UjXnYpY/MKzLPDWrS9n1PlpGJhfrD03N6P2RL2gH5WlNaxIS7W3UBQIcvrp04mXp9vJ6dC0tEXIh5NZX02BMGHeNBhvxTpirMrtrCJ8xIG8RKyU6o4XNwWR/v0oUUrBfFodJkS0mquzHSAQmQK4m0HquTrfhMU8mAzkXhbgl8cqDSlUHisABXKZ4Ch0tviqH06h3cCXgxPgV0CKKtndiuec7yYFB51GhMd3bVh1BiUJ/H4rHY/n2LXMGqAZzAfwyqRvAteR44+RIM7YDQO5VpNHZ2gwJnjjY+Mna7aqkP8aCQeEA+bw58N2+KoUf8J8coh3LSKm26LE6Zhh3jVmMarlpRLK4N4zL+ZEVL1E4hH6jErhsmd+TGHeBhqv3NcYSX5c7bQukC82JDpMAeVMboPaD90gDfj9xtp32Bs1hSd01wHbEuxPwIMAGBB09jk7H+AAAAAAElFTkSuQmCC";
var nextPageImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN4AAABlCAYAAAAial0BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDNFNEFFODg2QUZDMTFFNEJCNTRGQjU4MDA3MkZGQzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDNFNEFFODk2QUZDMTFFNEJCNTRGQjU4MDA3MkZGQzEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEM0U0QUU4NjZBRkMxMUU0QkI1NEZCNTgwMDcyRkZDMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEM0U0QUU4NzZBRkMxMUU0QkI1NEZCNTgwMDcyRkZDMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqMx45EAAAT4SURBVHja7J0LbhsxDEQzuv/VciY2bYMiKBJ7beszJB8Bw8Y60ZLUDD+7llYR8XZL3t/f9flRn6+vn28de+U1LhwfF78bF47NfP/3+cOz0n/Hvvu7+9/H+DvUj99/vOvBMW8em/T+R697c/DIXF7ByLOve7h++/L+sow3ZJlo20jffR82Hgg3tVZIQDxkMu3raOJj5GbimYS72KlfXD9HANAuSBztvB631NAGm9U8NcD/nqUm4O6TXY3dS49HyE/CxsjvXohHkvr+BEoM5VxkhXiJgrHSn4C+4gzxqvYVKsx2msNpboljxOPCxkTY6pCCKuXFndOhTqVm5Jufs1prg06xx4vOfi5PPO1Gy4y5nHWRIzw96VP5COKVobCM8EBpbytLiEf7jSAHiFcq0Eb5EyKUmg6gjcNRRHVdi1Ql3skGqzgy6RchnmdYV0GbzLUPiEdYx6b92gvipYiX8dBfk7MogCDelHiZe+cSpJLjKTXvUEx7TkO+bJYA09xAjypw4vZEWkppP/Hi+FRr+TkAaF/SaTZHZxEPUFK90cjNpMIArL91iyPOR/rG1n3EkzEPJb+ZQUqXI8euaqZPGuoLoWgwMapKPLLI1JafoJlMBjP6E/kDcBtE4KhnkhHxwpH8qmNTOmW1JwDFEZOMiMdvk1H2BF8Oms1PxloWcMQ0ery2AA0A2xhQoza4nQEKDV4BSmQCm4yIB+yQV4CiDWAL1uMhjhVHGOmyYnDZrsfjhne1RHKkapG7oXbEE0xEuDhgUGrSueXHo/nONKrBSHo8SscHR/LemSaScJEeDylV6WSpuUZdK8NcjcM70wTx4CQEBl5f7HHt1O+BnWlox48ikR6PuqdN8VGn1MS/yNMByHoTnlzEI8CTpK6fwBktWu4xSk0YcSaIlovSgnil6151cmbd5mX5fbxoBdCqsUeHFFQpL84jnsC/c3yWu9Y7fv4Ve7z4qCJjpXGRGbVtkqxq6yRPm8ZK47IvVkQo0VeNMXYqs2Jw8ehxxDDfahbxOi5WnGsTTERml5pgrGl06VM6XhspDhNPMBKpGPLmrVUcJ1wQHbhIjEFukHX4qEKYbRcVGq9VHAC0Y4JireLptYr8SLpTFsbhNgLxyKgIxKsLZTIqQbQI8VSerIjn9Ko38cg71L0O0xuniEcWedYtrFWsEHu0iHiNFyuung/WKronx3Vaj+c1rL9YEXFMsrFvKmdtyDT3ibD1FysiiSls/hwy7uNR3iEHBOKRG4giB04I8RBT0MbhKCJT4lHHIJYNVg5gDtOAgJAxiwFzxfZ+LlNCFiZjJrFplJoSsnCKcGn+lPUtenFxhb52e7jM/ZR1iJfK8wHLKT6XEs8dL7HgXy9s5yFTqEHvKsRzD01a8K9K5oOnVYWmlJpEewo+iAeMiDYzdAuIhxTNjjK265kn0ATEgzJk/ZIGhCvxosHM8OjxvpWOXIlHy10sHVnt5hElpyBJqRn1gnGg0zXEq56f8xBPe4JxHDGJDNvQphIXVwLgIcnwWoJ48KUuQCvW13rjPl77Xsq5Z1ahs+QvNWMCgKIFoqgWjCUf8TQBQE+iLbi/hTgSL8zGmT24cmzngXQjnszGaVNbCSZSahLt6dwaS8wjnvnWNIKRSL6QN14fyntrmujARWIMpaZbqdOi6LI2MszViA0ni4I9XkKABk7f73Dt1O/+Jjy/BBgAwM4ZPosCxGcAAAAASUVORK5CYII=";
// ============================================================================================ //
// THE END
})();
