/* Javascript for shoplist.html, new version of 2015
 * Written by Alex Wong
 * Latest modified date: 2015-04-17 18:47
 * */

(function(){
$("body,html").animate({scrollTop:0},200);
// 缓存变量
var strP = /^\d+$/; //校验是否正整数
var loading = $(".Loading"); // 加载条
var bigCateDiv = $(".slist2015_bigCate"); // 左侧分类div，包含彩块a元素和子菜单ul
var bigCates = $(".slist2015_Cate"); // 左侧彩块大分类的a元素按钮
var subUls = $(".slist2015_bigCate ul"); // 大分类的二级滑动菜单
var smaItems = $(".slist2015_smaItem"); // 小分类容器div
var smaUls = $(".slist2015_smaSub"); // 小分类的列表ul元素
var smaSubA = $(".slist2015_smaSub a"); // 小分类的子元素按钮
var yearBox = $("#yearBox"); // 搜索年份的ul容器
var seeMore = $("#seeMore"); // “查看更多”的容器，默认是隐藏态
var seeMoreBtn = $("#seeMoreBtn"); // 查看更多的按钮
var Empty = $("#Empty"); // 查询为空时的提示
var Preload = $("#Preload"); // 加载数据前的容器底色装饰物
var breadAll = $("#breadAll"); // 面包屑里的查看全部
var breadSub = $(".bread_sub"); // 面包屑里的导航小按钮

var rightContainer = $("#rightContainer"); // 右侧大容器
var loopContainer = $("#theLoopContainer"); // 盛放列表数据的容器
var bread = $("#breadNav"); // 右侧面包屑导航的外层容器
var pageWrap = $("#pageWrap"); // 页码的容器

var globalColor = "#cc9617"; // 全局颜色变量
var skinBtn = $(".skinBtn"); // 换皮肤按钮
var skinBack = $(".skinBack"); // 复原皮肤

var sFluid = $("#sFluid"); // 瀑布模式按钮
var sPage = $("#sPage"); // 分页模式按钮
var isFld = 0; // 标识是否瀑布模式的标志，默认是0(即默认显示分页模式)。切换为瀑布模式时，置为1

var isLogin = 0; // 标识是否登录，1登录，0未登录
// ===================================================================== //
// 全局标记对象，用来标记当前展示的是哪一个搜索条件下的内容，供叠加搜索时用：
// 每一次的搜索、查询和翻页，都要改写该全局对象里对应的值：
var globalStatus = {
	mycat: 0,
	cat: 0,
	px: 0,
	sort: 0,
	year: 0,
	isdeal: 0,
	menshi: 0,
	nextpage: 1
};
// ===================================================================== //
// 左侧大分类的交互
$.fn.hoverBigCates = function( width1, width2, subW, duration ){
	var me = $(this); // 主语是包含彩块a和子菜单ul的div容器
	var btn = me.find(".slist2015_Cate"); // 彩块a元素
	var arr = btn.find(".slist_arr"); // 小箭头
	var bgCol = btn.attr("data"); // 原始背景色的色值缓存在data属性里
	var sub = me.find("ul"); // 二级菜单ul
	var subLis = sub.find("li"); // 二级菜单里有内容时，才滑出
	var btnShadow = "0px 3px 10px #999"; // 静止时的投影样式
	var hoverShadow = "0px 1px 2px #aaa"; // hover时的投影样式
	me.hover(function(){ // 滑入时
		me.addClass( "hover" );
		btn.css({"background": bgCol, "box-shadow": hoverShadow}).animate({ width: width2 }, duration, function(){
			if( subLis.length > 0 ){
				arr.show().animate({ right: "15px" }, duration);
				sub.css({"background": bgCol}).animate({ width: subW }, duration);
			}
		});
	}, function(){ // 滑出时
		me.removeClass( "hover" );
		btn.css({"background": bgCol, "box-shadow": btnShadow}).animate({ width: width1 }, duration, function(){
			if( subLis.length > 0 ){
				arr.animate({ right: "-14px" }, duration, function(){ arr.hide(); });
				sub.css( "width", "0px" );
			}
		});
	});
}; // end hover
for( var iCate = 0; iCate < bigCateDiv.length; iCate++ ){
	var cateItem = $(bigCateDiv[iCate]);
	cateItem.hoverBigCates( "150px", "170px", "100px", 100 );
};
// ===================================================================== //
// 左侧小分类的交互
$.fn.hoverSmaCates = function( duration ){
	var me = $(this); // 主语是小分类的div容器，内含按钮a元素和滑出菜单ul
	var sBtn = me.find(".slist2015_smaBtn"); // 按钮a元素
	var sUl = me.find(".slist2015_smaSub"); // 滑出的ul菜单
	me.hover(function(){ // 滑入
		if( !me.hasClass("mines") ){
			me.addClass("hover");
			sBtn.addClass("btnActive");
		}
	}, function(){ // 滑出
		me.removeClass("hover");
		sBtn.removeClass("btnActive");
	});
}; // end hover
for(var smaI = 0; smaI < smaItems.length; smaI++ ){
	var smaItemDiv = $(smaItems[smaI]);
	smaItemDiv.hoverSmaCates( 100 );
};
// ===================================================================== //
// 渲染年份搜索列表1979-2015
for( var yearI = 1979; yearI < 2016; yearI++ ){
	var yearItem = '<li><a class="searches" data-type="year" data-search="' + yearI + '">' + yearI + '年</a></li>';
	yearBox.append( yearItem );
};
// ===================================================================== //
// 面包屑子项的小叉叉点击事件，删除当前搜索条件：
$.fn.clearThisCondition = function( type, code, name ){
	var me = $(this); // 小叉叉s
	me.unbind("click").bind("click", function(){
		globalStatus[type] = 0; // 清空对应搜索条件
		$("#bread_" + type).hide().attr("data-search", "").attr("data-name", "").find("b").html("");
		globalStatus['nextpage'] = 1;
		getDataToRender( globalStatus, false );
		renderSeperates();
		var leftCon = 0; // 标记是否所有的搜索条件都被删除了，若是，则leftCon置为0
		for( var p in globalStatus ){
			if( p != 'nextpage' && globalStatus[p] != 0 ){ // 有至少一个非页码的属性为非0时，leftCon置为1
				leftCon = 1;
			}
		};
		if( !leftCon ){ // 没有遗留的搜索条件时，隐藏面包屑
			bread.hide();
		}
	});
};
// ===================================================================== //
// 页面滚动的瀑布模式加载：
var scrStop = true;
$.fn.windowScroll = function(){
	var me = $(this); // 主语是window对象
	me.scroll(function(){
		if( isFld ){
			var totalHeight = parseInt( $(window).height() ) + parseInt( $(window).scrollTop() );//窗口高度+滚动高度
			var docHeight = parseInt( $(document).height() );//文档高度，内容越多，值越大
			if( totalHeight >= docHeight ){//窗口高度&滚动高度之和，大于文档高度时，加载新内容
				if( scrStop == true ){
					scrStop = false;
					seeMoreBtn.html( "更多产品正在加载中…" );
					globalStatus['nextpage']++; // 改写全局对象的nextpage属性，页码+1
					getDataToAppend( globalStatus ); // 请求下一页
				}
			}
		}
	});
};
// ===================================================================== //
// 瀑布模式和分页模式的切换：
sFluid.click(function(){
	var me = $(this);
	if( isFld ){
		myPOPUP("操作提示", "当前已经是瀑布模式了，您可以选择分页模式浏览哦！", true);
	}else{
		isFld = 1;
		sPage.removeClass("stype_sel");
		me.addClass("stype_sel");
		pageWrap.hide();
		var iso = seeMore.attr("data-over");
		if( iso == "1" ){ //最后一页不显示更多
			seeMore.hide();
		}else{
			seeMore.show();
			$(window).windowScroll();
		}
	}
});
sPage.click(function(){
	var me = $(this);
	if( isFld ){
		isFld = 0;
		sFluid.removeClass("stype_sel");
		me.addClass("stype_sel");
		seeMore.hide();
		pageWrap.show();
	}else{
		myPOPUP("操作提示", "当前已经是分页模式了，您可以选择瀑布模式浏览哦！", true);
	}
});
// ===================================================================== //
// 页面初始加载获取数据Start
getDataToAppend( globalStatus );
// ===================================================================== //
// 点击“查看更多”，直接向右侧列表中的现有数据里append进新数据。
// 此方法的渲染，是页面初始加载或查看下一页时的数据append展示，不需清空右侧列表，与“get Data To Render”的渲染相区别。
function getDataToAppend( dataObj ){
	$.ajax({
		url: '/Shop/shoplistajax/',
		type: 'GET',
		dataType: 'json',
		data: dataObj,
		success: function(data){
			// console.log( "Append", dataObj, data );
			stopLoading();
			if( data ){ // 数据正常时
				Preload.hide();
				Empty.hide();
				var Pro = data.allproduct;
				for(var p in Pro){ $(loopHTML( Pro[p] )).appendTo( loopContainer ); };
				scrStop = true; // 瀑布滚动的标记易位，必须放在success回调里执行
				var extra = data.extra;
				var isOver = extra.isover;
				var login = extra.islogin;
				var pages = extra.showpage;
				var totalPage = extra.total; // 总页数
				renderPages( pages, totalPage ); // 渲染分页页码
				isLogin = login; // 改写登录状态的标识
				if( isOver == 1 ){ // 是最后一页
					seeMore.attr("data-over", isOver).hide();
				}else{ // 不是最后一页
					if( isFld ){ // 并且是瀑布模式时，才显示更多
						pageWrap.hide(); //瀑布下，分页隐藏
						seeMore.attr("data-over", isOver).show();
						seeMoreBtn.html("滚动页面可查看更多");
					}else{ //非瀑布
						seeMore.attr("data-over", isOver).hide();
						pageWrap.show(); //非瀑布，分页显示
					}
				}
				makeLastItem();
			}else{ // 服务器传来数据错误时
				myPOPUP("系统提示", "服务器出错了，内容获取失败！", true, function(){ location.href = "/Index/"; });
			}
		},
		error: function(r){
			stopLoading();
			myPOPUP("系统提示", "网络出错，内容获取失败，请稍后重试！", true, function(){ location.href = "/Index/"; });
		}
	}); // end ajax
};
// ===================================================================== //
// ===================================================================== //
// 根据指定条件，调用接口获取数据，并返回渲染
// 此方法的渲染，是展示新搜索条件下的内容，需清空右侧列表的原展示，与“getDataToAppend”的append展示相区别。
function getDataToRender( dataObj, isForPage ){
	startLoading();
	$.ajax({
		url: '/Shop/shoplistajax/',
		type: 'GET',
		dataType: 'json',
		data: dataObj,
		success: function(data){
			// console.log( "Render", dataObj, data );
			stopLoading();
			if( data ){ // 数据正常
				var Pro = data.allproduct;
				var extra = data.extra;
				var login = extra.islogin;
				var isOver = extra.isover;
				var pages = extra.showpage; // 页码结构
				var totalPage = extra.total; // 总页数
				isLogin = login; // 改写登录状态的标识
				loopContainer.html(""); // 清空原有数据
				if( !isForPage ){ // 如果是某个搜索条件的渲染，则需将全局对象globalStatus的nextpage属性重置为1；如果是分页渲染，不需重置
					globalStatus['nextpage'] = 1;
				};
				if( Pro.length > 0 ){ // 渲染内容，不为空时
					Empty.hide();
					for(var p in Pro){ $(loopHTML( Pro[p] )).appendTo( loopContainer ); }; // 展示查询结果
					if( isOver == 1 ){ // 是最后一页，隐藏【查看更多】
						seeMore.attr("data-over", isOver).hide();
					}else{
						if( isFld ){ // 并且是瀑布模式，才显示更多
							seeMore.attr("data-over", isOver).show();
							seeMoreBtn.html("滚动页面查看更多").unbind("click").bind("click", function(){
								seeMoreBtn.html( "更多产品正在加载中…" );
								globalStatus['nextpage']++; // 在搜索结果中，第一次点更多时，页码先加1，因为第一次点更多，请求的是第二页
								getDataToAppend( globalStatus );
							});
						}else{
							seeMore.attr("data-over", isOver).hide();
						}
					}
					makeLastItem();
				}else{ // 查询结果为空
					Empty.show().find("a").unbind("click").bind("click", function(){ clearToRestart(); });
				}
				// 渲染分页页码，但暂时不显示，默认是瀑布模式：
				renderPages( pages, totalPage );
			}else{ // 服务器数据传来有误
				myPOPUP("系统提示", "服务器出错了，内容获取失败！", true, function(){ location.href = "/Index/"; });
			}
		},
		error: function(r){
			stopLoading();
			myPOPUP("系统提示", "网络出错，导致数据获取失败！", true, function(){ location.href = "/Index/"; });
		}
	}); // end ajax
};
// ===================================================================== //
// 以下是各种分类的查询
$(".searches").click(function(){
	var me = $(this);
	var type = me.data("type");
	var code = me.data("search");
	var name = (me.data("name"))?(me.data("name")):(me.html());
	if( type == "mycat" && (!isLogin) ){
		myPOPUP("操作提示", "请您先登录系统，再查看与您相关的商品！", true, function(){ location.href="/Index/login/"; });
		return false;
	};
	globalStatus[type] = code; // 改写全局对象的对应标识
	globalStatus['nextpage'] = 1; // 查询时每次的页码都从1开始
	getDataToRender( globalStatus, false );
	setTimeout(function(){
		renderBread( type, code, name );
	}, 1000);
});
// ===================================================================== //
// 面包屑的渲染：
function renderBread( type, code, name ){ // type是所选的搜索条件
	var tag = 0; // 标记是否所有属性（除nextpage之外）都为0，若是，则不显示面包屑
	bread.find(".bread_seperate").hide(); // 先隐藏分隔符(加号)，最后单独渲染
	for( var p in globalStatus ){
		if( p != 'nextpage' && globalStatus[p] != 0 ){
			tag = 1;
			break;
		}
	}
	if( tag > 0 ){
		bread.show();
		breadAll.unbind("click").bind("click", function(){ clearToRestart(); }); // 返回到全部
		if( globalStatus[type] != 0 ){
			$("#bread_" + type).show().attr("data-search", code).attr("data-name", name).find("b").html( name );
			$("#bread_" + type).find("s").clearThisCondition( type, code, name ); // 为对应的小叉叉绑定事件，点击后删除该搜索条件
		}else{
			$("#bread_" + type).hide().attr("data-search", "").attr("data-name", "").find("b").html("");
		}
		renderSeperates();
	}else{
		bread.hide();
	}
}; // end render
// ===================================================================== //
// 单独渲染面包屑里的分隔符：
function renderSeperates(){
	var adds = bread.find(".bread_seperate"); // 单独渲染分隔符(加号)
	adds.hide();
	for(var l = 0; l < adds.length; l++){
		var add = $(adds[l]);
		var lef = add.attr("data-left");
		var arr = lef.split(","); // 获取当前分隔符左边的元素集合，如果左边元素集合中有至少一个元素被显示，则该分隔符就显示
		for(var e = 0; e < arr.length; e++){
			var ele = $("#bread_" + arr[e]);
			var sch = ele.attr("data-search"); // 该属性为空时，即元素隐藏时，因此用该属性来替代判断元素是否显示
			if( sch ){
				add.show();
				break; // 左边元素集合中，只要有一个显示，该分隔符即显示，不需要继续遍历
			}
		}
	}; // end for
}; // end render sep
// ===================================================================== //
// 清空所有搜索条件、清空面包屑里的值，重新展示默认数据：
function clearToRestart(){
	startLoading();
	for( var p in globalStatus ){
		globalStatus[p] = 0;
	}
	globalStatus['nextpage'] = 1;
	loopContainer.html(""); // 清空原有数据的展示
	getDataToAppend( globalStatus ); // 重新展示默认数据
	setTimeout(function(){
		for( var i = 0; i < breadSub.length; i++ ){
			var sub = $(breadSub[i]);
			sub.attr("data-search", "").attr("data-name", "").find("b").html("");
			sub.hide();
		}
		bread.hide();
	}, 1000);
};
// ===================================================================== //
// 点击修改价格的方法，在数据渲染结束后，再赋给铅笔按钮：
$.fn.modifyPrice = function(){
	var me = $(this);
	var pid = me.data("id");
	var showBox = $("#showP_" + pid),
		editBox = $("#editP_" + pid),
		Input = $("#inp_" + pid),
		strongP = $("#strong_" + pid),
		checkBtn = $("#eCheck_" + pid),
		cancelBtn = $("#eCancel_" + pid);
	me.unbind("click").bind("click", function(){
		Input.val( me.attr("data-price") );
		showBox.hide();
		editBox.show();
		cancelBtn.unbind("click").bind("click", function(){
			editBox.hide();
			showBox.show();
		});
		checkBtn.unbind("click").bind("click", function(){
			var newPrice = Input.val();
			newPrice = $.trim( newPrice );
			if( newPrice == "" ){
				myPOPUP("改价提示", "请输入价格！", true, function(){Input.focus();});
			}else if( !strP.test(newPrice) ){
				myPOPUP("改价提示", "价格请输入正整数！", true, function(){ Input.focus(); });
			}else if( parseInt(newPrice) % ( buChang(parseInt(newPrice)) ) != 0 ){
				var pr = parseInt(newPrice);
				var bc = buChang(pr);
				// var guess = pr - ( pr%bc );
				if( bc ){
					myPOPUP( "改价提示", "价格必须为步长的整数倍哦！按照您输入的价格，步长应为 " + bc + " 元，请您重新输入！", false, function(){Input.focus();});
				}else{
					myPOPUP( "改价提示", "您输入的价格有误，请您重新输入！", true, function(){Input.focus();});
				}
			}else{
				newPrice = parseInt( newPrice );
				startLoading();
				$.ajax({
					url: '/Shop/modifyproductprice/',
					type: 'GET',
					dataType: 'json',
					data: { startprice: newPrice, pid: pid },
					success: function( data ){
						stopLoading();
						if( data.data == 1 ){
							myPOPUP("改价提示", "恭喜！价格修改成功！", true );
							me.attr("data-price", newPrice);
							strongP.html( newPrice );
							editBox.hide();
							showBox.show();
						}else if( data.data == 2 ){
							myPOPUP("改价提示", "本品已经售出，不能修改价格了！", true );
						}else if( data.data == 3 ){
							dqhp = data.dqhprice;
							myPOPUP("操作提示", "本品最新被还价到 " + dqhp + " 元，您修改的价格必须高于此价格！请您重新修改价格！" , false );
						}else{
							myPOPUP("改价提示", "系统出错，操作失败！请重试！", true, function(){Input.focus();});
						}
					},
					error: function(r){
						stopLoading();
						myPOPUP("改价提示", "网络出错，导致操作失败！请重试！", true, function(){ Input.focus(); });
					}
				}); // end ajax
			}
		});
	});
}; // end modify price
// ===================================================================== //
// 点击还价的方法，在数据渲染结束后，再赋给对勾：
$.fn.cutPrice = function(){
	var me = $(this);
	var pid = me.attr("data-pid");
	var inputCut = $("#inputCut_" + pid);
	var productname = $("#ProName_" + pid).html();
	var proPx = $("#PX_" + pid).html();
	var sellPrc = $("#strong_" + pid).html();
	me.unbind("click").bind("click", function(){
		var newCutPrice = inputCut.val();
		newCutPrice = $.trim( newCutPrice );
		if( !isLogin ){
			myPOPUP("操作提示", "您还没有登录，请先登录系统再还价！", true, function(){ location.href="/Index/login/"; });
		}else if( newCutPrice == "" || newCutPrice == "0" ){
			myPOPUP("还价提示", "还价请先输入价格！", true );
		}else if( !strP.test(newCutPrice) ){
			myPOPUP("还价提示", "还价的价格请输入正整数！", true, function(){inputCut.focus();});
		}else if( parseInt(newCutPrice) % ( buChang(parseInt(newCutPrice)) ) != 0 ){
			var cpr = parseInt(newCutPrice);
			var cbc = buChang(cpr);
			if( cbc ){
				myPOPUP("还价提示", "价格必须为步长的整数倍哦！按您输入的价格，步长应为 " + cbc + " 元，请重新出价！", false, function(){inputCut.focus();});
			}else{
				myPOPUP("还价提示", "您输入的价格有误，请重新出价！", true, function(){inputCut.focus();});
			}
		}else{ // 先弹出协议再调用接口
			newCutPrice = parseInt( newCutPrice );
			popPolicy( "易金在线寄售卖场还价协议", cutPolicyHTML( productname, proPx, sellPrc, newCutPrice ), function(){
				startLoading();
				$.ajax({
					url: '/Shop/infixconsignmentpricelog/',
					type: 'GET',
					dataType: 'json',
					data: { pdqprice: newCutPrice, pid: pid },
					success: function( obj ){
						stopLoading();
						var data = obj.data;
						if( data == 4 ){ // 4未登录
							myPOPUP("操作提示", "您还未登录，请先登录系统再还价！", true, function(){ location.href="/Index/login/"; });
						}else if( data == 2 ){ // 2已经售出
							myPOPUP("还价提示", "您的出手太慢了，本品已经被售出了！", true );
						}else if( data == 3 ){ // 3还价低于了最新还价
							var cut = obj.pdqprice; // 拿到最新还价
							myPOPUP("还价提示", "本品的最新还价是 " + cut + "元，您的还价必须高于此价格！", true, function(){inputCut.focus().val(cut);});
						}else if( data == 5 ){ // 5还价高于了最新售价
							var prc = obj.startprice; // 拿到最新售价
							myPOPUP("还价提示", "本品的最新售价是 " + prc + " 元，您的还价必须低于此价格！", true, function(){inputCut.focus();});
						}else if( data == 1 ){ // 还价成功
							myPOPUP("还价提示", "操作成功！您以 " + newCutPrice + " 元的价格成功还价！请耐心等待委托人的确认。如果委托人确认了以您的价格成交后，您可以在 [个人中心] - [订单管理] 中找到本品的订单！", false );
							inputCut.val( newCutPrice );
							$("#scut_" + pid).removeClass("thereNoCut").html( "￥" + newCutPrice );
							$("#inputCut_" + pid).val( newCutPrice );
							$("#cuttitle_" + pid).html("我的还价：");
							$("#Cut4Show_" + pid).hide();
							$("#Cut4Tool_" + pid).show();
							$("#cancelMyCut_" + pid).show();
						}else if( data == 12 ){
							myPOPUP("系统提示", "您的账户未激活，请联系管理员！", true );
						}else if( data == 13 ){
							myPOPUP("系统提示", "您的账户额度不足，请先充值再操作！", true );
						}else if( data == 14 ){
                                                        var zuidiprc = obj.zuidiprice; // 拿到最低售价
                                                        myPOPUP("系统提示", "您的还价低于售价的80%，请重新还价！", true );
                                                }else{ // 0失败
							myPOPUP("还价提示", "操作失败了，请联系系统管理员！", true );
						}
					},
					error: function(r){
						stopLoading();
						myPOPUP("系统提示", "网络出错，导致操作失败了，请重试！", true, function(){inputCut.focus();});
					}
				}); // end ajax
			}); // end policy
		}
	});
}; // end cut price
// ===================================================================== //
// 删除我的还价：
$.fn.delMyCut = function(){
	var me = $(this);
	var pid = me.attr("data-pid");
	var inp = $("#inputCut_" + pid);
	var noone = $("#noone_" + pid);
	var cutShow = $("#Cut4Show_" + pid);
	var cutTool = $("#Cut4Tool_" + pid);
	me.unbind("click").bind("click", function(){
		var myp = inp.val();
		if( !myp ){
			myPOPUP("操作提示", "操作有误，您还没有还价！", true);
		}else{
			myPOPUP("操作提示", "您当前的还价是 " + myp + " 元，您确定要删除吗？删除后您还可以重新还价！", false, function(){
				startLoading();
				$.ajax({
					url: '/Shop/cancelprice/',
					type: 'GET',
					dataType: 'json',
					data: { pdqprice: myp, pid: pid }, // ctype 给任意值，表示此接口是委托人删除买家的还价。
					success: function( obj ){
						stopLoading();
						if( obj ){
							var data = obj.data;
							if( data == 1 ){ // 删除还价成功
								myPOPUP("操作提示", "操作成功！您已删除了您的还价！", true);
								inp.val("");
								noone.show();
								cutShow.hide();
								$("#cuttitle_" + pid).html("还价：");
								$("#scut_" + pid).addClass("thereNoCut").html("暂无人还价");
								cutTool.show();
								me.hide();
							}else if( data == 2 ){ // 已售出，卖给别人了
								myPOPUP("操作提示", "本品已经售出！", true);
							}else if( data == 3 ){ // 当前不是最新还价
								var dqprice = obj.dqhprice;
								if( !dqprice ){ dqprice = 0; }
								myPOPUP("操作提示", "本品最新还价是 " + dqprice + " 元，您的还价已无效！", true);
							}else if( data == 4 ){ // 未登录
								myPOPUP("操作提示", "您还没有登录，请先登录系统再操作！", true, function(){ location.href="/Index/login/"; });
							}else if( data == 5 ){ // 已出售，卖给我了
								myPOPUP("操作提示", "删除失败！本品已经按照您的还价成交了，您可以前往个人中心的订单管理页，查看本订单！", false );
							}else if( data == 6 ){ // 理论上买家自己取消还价，不会进入到这个状态码中。
								myPOPUP("操作提示", "删除失败！还价已被取消！", true );
							}else{
								myPOPUP("操作提示", "服务器出错了，请联系管理员哦！", true);
							}
						}else{
							myPOPUP("操作提示", "服务器出错了，请您稍后重试！", true);
						}
					},
					error: function(){
						stopLoading();
						myPOPUP("操作提示", "服务器出错了！请稍后重试！", true);
					}
				}); // end ajax
			});
		}
	});
};
// ===================================================================== //
// 拒绝还价的方法，单独定义在此：
function doRefuseThisCut( cutprice, pid ){
	startLoading();
	$.ajax({
		url: '/Shop/cancelprice/',
		type: 'GET',
		dataType: 'json',
		data: { pdqprice: cutprice, pid: pid, ctype: 1 }, // ctype 给任意值，表示此接口是委托人删除买家的还价。
		success: function( obj ){
			stopLoading();
			if( obj ){
				var data = obj.data;
				if( data == 1 ){ // 拒绝成功
					myPOPUP("操作提示", "操作成功！您已成功拒绝了对方的还价！", true);
					$("#scut_" + pid).addClass("thereNoCut").html("暂无人还价");
					$("#donedeal_" + pid).hide();
					$("#cancelcut_" + pid).hide();
				}else if( data == 2 ){ // 已经售出
					myPOPUP("操作提示", "操作失败，本品刚已售出！", true);
				}else if( data == 3 ){ // 不是最新还价
					var dqprice = obj.dqhprice; // 拿到最新还价
					if( !dqprice ){ dqprice = 0; }
					$("#scut_" + pid).removeClass("thereNoCut").html("￥" + dqprice ); // 顺便把最新还价更新到页面里
					myPOPUP("操作提示", "本品最新还价是 " + dqprice + " 元，你确定要拒绝 " + dqprice + " 元的还价吗？", true, function(){
						doRefuseThisCut( dqprice, pid );
					});
				}else if( data == 4 ){ // 未登录
					myPOPUP("操作提示", "您还没有登录，请先登录系统再操作！", true, function(){ location.href="/Index/login/"; });
				}else if( data == 5 ){ // 自己买了
					myPOPUP("操作提示", "操作失败！本品已经按照您的还价成交了，您可以前往个人中心的订单管理页，查看本订单！", false );
				}else if( data == 6 ){ // 买家先你一步已经把还价取消了！
					myPOPUP("操作提示", "操作失败！还价刚已被买家取消了！", true );
				}else{
					myPOPUP("操作提示", "服务器出错了，请立即联系管理员哦！", true);
				}
			}else{ // 服务器返回错误时
				myPOPUP("操作提示", "服务器出错了哦，请您稍后再试！", true);
			}
		},
		error: function(){
			stopLoading();
			myPOPUP("操作提示", "服务器出错了，请您稍后再试！", true);
		}
	}); // end ajax
};
// 拒绝买家还价，即删除买家对我的委托品的还价价格：
$.fn.refuseCut = function(){
	var me = $(this);
	var pid = me.attr("data-pid");
	var cutp = me.attr("data-cutprice");
	me.unbind("click").bind("click", function(){
		if( !cutp ){
			myPOPUP("操作提示", "数据有误，请联系系统管理员！", true);
		}else{
			myPOPUP("操作提示", "您确定要拒绝 " + cutp + " 元的还价吗？", true, function(){
				doRefuseThisCut( cutp, pid );
			});
		}
	});
};
// ===================================================================== //
// 成交事件：(先请求接口1用成交价计算佣金，然后弹出协议，再请求接口2进行成交)
$.fn.doneDeal = function(){
	var me = $(this);
	var pid = me.attr("data-pid");
	var productname = $("#ProName_" + pid).html();
	var proPx = $("#PX_" + pid).html();
	var myPrc = $("#strong_" + pid).html();
	var sldout = $("#soldout_" + pid);
        var canceout = $("#cancelcut_"+pid);
	var cutprice = me.attr("data-cutprice");
	var myppx = me.attr("data-ppx"); // 计算佣金的接口用
	var pencil = $("#pencil_" + pid);
	var donebtn = $("#donedeal_" + pid);
	var cheer = $("#closeMyWT_" + pid);
	me.unbind("click").bind("click", function(){
		cutprice = parseInt( cutprice );
		if( cutprice ){
			startLoading();
			$.ajax({ // 计算佣金，成功后，再弹协议
				url: '/Shop/getfuwumoney/',
				type: 'GET',
				dataType: 'json',
				data: { pdqprice: cutprice, px: myppx },
				success: function( obj ){
					stopLoading();
					var yongjin = obj.data;
					if( yongjin == 4 ){
						myPOPUP("操作提示", "您还没有登录，请先登录系统！", true, function(){ location.href="/Index/login/"; });
					}else if( yongjin >= 10 || yongjin == 0 ){ // 返回值大于等于10，才是佣金的值，这时候可以弹协议了：
						popPolicy( "易金在线寄售卖场成交协议", dealPolicyHTML( productname, proPx, myPrc, cutprice, yongjin ), function(){
							startLoading();
							$.ajax({
								url: '/Shop/infixorder/',
								type: 'GET',
								dataType: 'json',
								data: { pdqprice: cutprice, ischushou: "1", pid: pid },
								success: function( obj ){
									stopLoading();
									var data = obj.data;
									if( data == 1 ){ // 交易成功
										myPOPUP("操作提示", "恭喜！您的该委托品成功以 " + cutprice + " 元的价格成交！请前往[个人中心] - [委托管理]页面查看交易详情！", false);
										$("#jgName_" + pid).html("成交价：");
										$("#strong_" + pid).html( cutprice );
										pencil.hide();
										donebtn.hide();
                                                                                canceout.hide();
										cheer.show();
										sldout.show();
									}else if( data == 2 ){ // 订单插入失败
										myPOPUP("操作提示", "服务器出错导致您的交易失败，请稍后重试！", true );
									}else if( data == 3 ){ // 插入委托表数据失败
										myPOPUP("操作提示", "服务器出错导致交易失败，请稍后重试！", true );
									}else if( data == 4 ){ // 更新产品表为已购买状态失败
										myPOPUP("操作提示", "产品表更新失败！交易未成功！请稍后重试！", true );
									}else if( data == 5 ){ // 该专场下已经有相同的委托记录
										myPOPUP("操作提示", "数据库出错了，交易失败！请稍后重试！", true );
									}else if( data == 6 ){ // 该产品没有合同编号，不能生成委托记录
										myPOPUP("操作提示", "数据异常，交易失败！请稍后重试！", true );
									}else if( data == 7 ){ // 该产品已经生成订单，已被别人买走了
										myPOPUP("操作提示", "本品已经被售出！", true );
									}else if( data == 8 ){ // 参数为空，无产品ID
										myPOPUP("操作提示", "数据传输错误，请刷新页面再试一次！", true, function(){ location.reload(); });
									}else if( data == 9 ){ // 不是当前商城中的产品
										myPOPUP("操作提示", "本品不是本商城中的产品！此交易失败！", true );
									}else if( data == 10 ){ // 数据异常
										myPOPUP("操作提示", "网络数据异常，请刷新页面再试一次！", true, function(){ location.reload(); });
									}else if( data == 11 ){ // 额度扣除失败
										myPOPUP("操作提示", "服务器出错，导致交易失败！", true );
									}else if( data == 12 ){
										myPOPUP("系统提示", "您的账户未激活，请联系管理员！", true );
									}else if( data == 13 ){
										myPOPUP("系统提示", "您的账户额度不足，请先充值再操作！", true );
									}else if( data == 14 ){
										var dqprice = obj.dqprice;
										myPOPUP("系统提示", "操作失败！最新的还价价格已经更新为 " + dqprice + " 元！请刷新页面后重新操作！", true, function(){ location.reload(); });
									}else{ // 其他可能的错误
										myPOPUP("操作提示", "网络出错，交易失败，请稍后再试！", true );
									}
								},
								error: function(r){
									stopLoading();
									myPOPUP("系统提示", "网络出错，导致操作失败了，请重试！", true);
								}
							}); // end ajax
						}); // end policy
					}else{
						myPOPUP("操作提示", "数据错误！请稍后重试！", true);
					}
				},
				error: function(r){
					stopLoading();
					myPOPUP("操作提示", "网络出错，交易失败，请稍后再试！", true );
				}
			}); // end ajax
		}else if( cutprice == 0 ){
			myPOPUP("操作提示", "您不能以 0 元成交！", true);
		}else{
			myPOPUP("操作提示", "网络出错，操作失败！请重试！", true);
		}
	});
};
// ===================================================================== //
// 页码点击的事件，在渲染页码之后再绑定到页码按钮上：
$.fn.pageClick = function(){
	var me = $(this);
	me.unbind("click").bind("click", function(){
		var nextpage = me.data("nextpage");
		if( me.parent().hasClass("selected") ){
			return false;
		}else{
			globalStatus['nextpage'] = nextpage;
			getDataToRender( globalStatus, true );
		}
	});
};
// 向左和向右箭头切换页码的方法：
$.fn.prevOrNextPage = function( token, totalPage ){ // token 标识左右
	var me = $(this);
	me.unbind("click").bind("click", function(){
		if( token == "right" ){ // 向右翻，下一页
			if( parseInt(globalStatus['nextpage']) == parseInt(totalPage) ){ // 当前已经是最后一页
				return false;
			}else{
				globalStatus['nextpage']++;
				getDataToRender( globalStatus, true );
			}
		}else{ // 向左翻，上一页
			if( parseInt(globalStatus['nextpage']) == 1 ){ // 当前已经是第一页
				return false;
			}else{
				globalStatus['nextpage']--;
				getDataToRender( globalStatus, true );
			}
		}
	});
};
// 页码跳转Go按钮的方法：
$.fn.pageGo = function( inp, totalPage ){
	var me = $(this);
	me.html( me.html().toLocaleUpperCase() );
	me.unbind("click").bind("click", function(){
		var val = parseInt( inp.val() );
		if( val ){
			if( val > totalPage ){
				myPOPUP("系统提示", "您输入的页码有误！请重新输入！", true, function(){ inp.val("").focus(); });
			}else{
				globalStatus['nextpage'] = val;
				getDataToRender( globalStatus, true );
			}
		}else{
			myPOPUP("系统提示", "请输入正确的页码！", true, function(){ inp.val("").focus(); });
		}
	});
};
// 渲染页码的方法：
// 每次拉取数据的ajax请求，都要渲染页码，只不过不显示出来，只有当用户点击了【分页模式】后，才会显示：
function renderPages( pages, totalPage ){
	pageWrap.html( pages );
	if( pages ){
		var pagenums = $(".pagenum"); // 所有带数字的a元素页码
		var pageleft = $(".pageleft"); // 左箭头
		var pageright = $(".pageright"); // 右箭头
		var inpPage = $("#in_page"); // 跳转页码输入框
		var pageGoBtn = $("#btnsub"); // Go按钮
		for(var i = 0; i < pagenums.length; i++){
			$(pagenums[i]).pageClick(); // 绑定数字页码点击事件
		};
		pageleft.prevOrNextPage("left");
		pageright.prevOrNextPage("right", totalPage);
		pageGoBtn.pageGo( inpPage, totalPage );
	}
};
// ===================================================================== //
// 图片hover事件：
$.fn.hoverImgs = function(){
	var me = $(this); // 主语是图片外层的a元素
	var bigimg = me.data("big");
	var protitle = me.attr("title");
	var zoom = me.find(".myzoom");
	me.hover(function(){
		zoom.show(250);
		if( zoom.get(0).addEventListener ){
			zoom.get(0).addEventListener("click", function(event){
				showBigPic( bigimg, protitle );
				event.stopPropagation();
				event.preventDefault();
				window.event.cancelBubble = true;
				return false;
			}, false);
		}
	}, function(){
		zoom.hide(250);
		return false;
	});
};
// ===================================================================== //
// 展示大图的弹窗方法：
function showBigPic( url, title ){
	var bigimgs = $(".popbigimg");
	var mask = $(".popbigimgmask");
	var popimg = $(".popimg"); // 展示大图的img
	var popimgh1 = $(".popimgh1"); // 展示产品名称的h1
	var closebtn = $(".popimgclose"); // 关闭按钮
	popimg.attr("src", url).attr("title", title).attr("alt", title);
	popimgh1.html( title );
	closebtn.css({"right": "0px"});
	bigimgs.show();
	mask.unbind("click").bind("click", function(){
		bigimgs.hide();
		popimg.attr("src", "").attr("title", "").attr("alt", "");
		return false;
	});
	closebtn.unbind("click").bind("click", function(){
		var me = $(this);
		me.animate({
			right: "-50px"
		}, 300, function(){
			popimg.attr("src", "").attr("title", "").attr("alt", "");
			bigimgs.hide();
			return false;
		});
	});
};
// ===================================================================== //
// 无人还价的文字点击：
$.fn.noCuts = function(){
	var me = $(this);
	var pid = me.attr("data");
	var cut = me.attr("data-cut");
	var inp = $("#inputCut_" + pid);
	me.unbind("click").bind("click", function(){
		me.hide();
		inp.focus().val("");
	});
	inp.blur(function(){
		var myvl = inp.val();
		myvl = $.trim( myvl );
		if( ( myvl == "" ) && (cut == "0") ){
			me.show();
		}
	});
};
// ===================================================================== //
// 关注功能：
$.fn.getHearts = function(){
	var me = $(this);
	var pid = me.data("pid");
	me.unbind("click").bind("click", function(){
		if( isLogin ){
			startLoading();
			$.ajax({
				url: '/Attention/gzajax',
				type: 'GET',
				dataType: 'json',
				data: { action: 'gz', id: pid, rand: Math.random(), type: "2" },
				success: function(data){
					stopLoading();
					if(data == 1){ //关注成功
						me.addClass("hearted").attr("title", "点击取消关注");
						myPOPUP( "操作提示", "您已成功关注了本商品！", true );
					}else if(data == 2){ //关注失败
						myPOPUP( "操作提示", "关注失败！请稍后重试！", true );
					}else if(data == 3){ //取消成功
						me.removeClass("hearted").attr("title", "点击关注");
						myPOPUP( "操作提示", "您已成功取消关注！", true );
					}else if(data == 4){ //取消失败
						myPOPUP( "操作提示", "操作失败！请稍后重试！", true );
					}else{
						myPOPUP( "系统提示", "网络错误，操作失败，请稍后重试！", true );
					}
				},
				error: function(){
					stopLoading();
					myPOPUP( "系统提示", "网络错误导致了操作失败，请您稍后重试！", true );
				}
			}); // end ajax
		}else{ // 未登录
			myPOPUP( "操作提示", "未登录不能关注商品！请您先登录系统！", true, function(){ location.href="/Index/login/"; });
		}
	});
};
// ===================================================================== //
// 点击打开还价的输入框：
$.fn.wantToCut = function(){
	var me = $(this);
	var pid = me.attr("data");
	var cuttool = $("#Cut4Tool_" + pid);
	var cutshow = $("#Cut4Show_" + pid);
	me.click(function(){
		cuttool.hide();
		cutshow.show();
	});
};
// 点击关闭还价输入框：
$.fn.closeCutting = function(){
	var me = $(this);
	var pid = me.attr("data");
	var cuttool = $("#Cut4Tool_" + pid);
	var cutshow = $("#Cut4Show_" + pid);
	me.click(function(){
		cuttool.show();
		cutshow.hide();
	});
};
// ===================================================================== //
// 以下是通用方法 ：
// ===================================================================== //
// 单品循环体模板结构
function loopHTML( pro ){
	var pid = pro['V_ProandCatePid'],
		img = pro['V_ProandCatePlistimg'],
		bigImg = pro['V_ProandCatePmediumimg'],
		name = pro['V_ProandCatePname'],
		linkTo = pro['pro_url'],
		pms = pro['V_ProandCatePms'],
		ppx = pro['V_ProandCatePpx'],
		menshi = (pro['V_ProandCatePmenshi'] == "1")?( '<div class="slist2015_menshi_bj">北京市场同步出售</div>' ):( '<div class="slist2015_menshi_sh">上海市场同步出售</div>' ),
		price = pro['overprice'],
		cutprice = pro['V_ProandCatePdqprice'],
		cutprice4show = (pro['V_ProandCatePdqprice'] == "0")?("暂无人还价"):("￥" + pro['V_ProandCatePdqprice']),
		thereisCutCls = (pro['V_ProandCatePdqprice'] == "0")?("thereNoCut"):(""),
		cutprice_inInput = ( pro['V_ProandCatePdqprice'] == "0" )?(""):( pro['V_ProandCatePdqprice'] ),
		isNobodyCut = ( (pro['V_ProandCatePdqprice'] == "0") && ( pro['isMine'] != 1 ) )?("block"):("none"),
		isCut = ( pro['V_ProandCatePisadd'] == "1" )?("block"):("none"),
		noCut = ( pro['V_ProandCatePisadd'] == "1" )?("none"):("block"),
		isMine = ( pro['isMine'] == 1 )?("block"):("none"),
		isMyCut = ( pro['ismyhuanjia'] == 1 && pro['V_ProandCatePisbuy'] != "1" )?("block"):("none"),
		isMyCutTxt = ( pro['ismyhuanjia'] == 1 && pro['V_ProandCatePisbuy'] != "1" )?("我的还价"):("还价"),
		isShowMine = ( (pro['isMine'] == 1) && (pro['V_ProandCatePisbuy'] == "0") )?("block"):("none"),
		isShowDeal = ( (pro['isMine'] == 1) && (pro['V_ProandCatePdqprice'] != "0") && (pro['V_ProandCatePisbuy'] == "0") )?("block"):("none"),
		isMyCloseDeal = ( (pro['isMine'] == 1) && (pro['V_ProandCatePisbuy'] == "1") )?("block"):("none"),
		ifLetCut = ( (pro['isMine'] == 1) || (pro['V_ProandCatePisbuy'] == "1") )?("none"):("block"),
		notMine = ( pro['isMine'] == 1 )?("none"):("block"),
		isNew = ( pro['isnew'] == 1 )?("block"):("none"),
		isSoldOut = ( pro['V_ProandCatePisbuy'] == "1" )?("block"):("none"),
		isCutEditable = ( pro['V_ProandCatePisbuy'] == "1" )?("disabled"):(""),
		isSoldNoCut = ( pro['isMine'] == 1 || pro['V_ProandCatePisbuy'] == "1" )?("none"):("block"),
		jiageName = ( pro['V_ProandCatePisbuy'] == "1" )?("成交价"):( ( pro['V_ProandCatePisadd'] == "1" )?("售价"):("一口价") ),
		timename = pro['listimename'],
		time = formatTime( pro['listtime'] ),
		guanzhuCode = pro['isguanzhu'],
		isGuanzhuCls = (pro['isguanzhu'] == 1)?("hearted"):(""),
		isGuanzhuTxt = (pro['isguanzhu'] == 1)?("点击取消关注本品"):("点击关注本品"),
		theCutNum = pro['huanjianum'],
		theModNum = pro['V_ProandCatePupmoneynum'];
	var HTML = '<div class="slist2015_loopBox">\
						<div class="slist2015_booktag"></div>\
						<a class="slist2015_nums cutnum" title="本品被降价 ' + theModNum + ' 次">' + theModNum + '</a>\
						<a class="slist2015_nums modnum" title="本品被还价 ' + theCutNum + ' 次">' + theCutNum + '</a>\
						<a class="slist2015_heart getHeart ' + isGuanzhuCls + '" data-pid="'+ pid + '" title="' + isGuanzhuTxt + '">' + isGuanzhuTxt + '</a>\
						<a class="slist2015_relprc" href="/AucList/searchfinish/id/' + pid + '.html" target="_blank" title="查看相关价格">相关价格</a>\
						<div class="slist2015_productItem">\
							<div class="slist2015_proImgBox">\
								<a class="slist2015_proImgA" data-big="' + bigImg + '" target="_blank" href="' + linkTo + '" title="' + name + '">\
									<img class="slist2015_bigImg180" src="' + img + '" width="178" height="178" />\
									<div class="slist2015_selled" id="soldout_' + pid + '" style="display:' + isSoldOut + ';">已售罄</div>\
									<div class="slist2015_proNew" style="display:'+ isNew + ';">最新</div>\
									<div class="slist2015_zoomTool myzoom" title="点击查看大图">查看大图</div>\
								</a>\
							</div>\
							<div class="slist2015_proIntroBox">\
								<a class="slist2015_proName" id="ProName_' + pid + '" target="_blank" href="' + linkTo + '" title="' + name + '">' + name + '</a>\
								<div class="slist2015_priceBox box_showprices" id="showP_' + pid + '">\
									<p class="e_showprice"><b style="font-weight:bold;" id="jgName_' + pid + '">' + jiageName + '：</b><em><s>￥</s><strong id="strong_' + pid + '">' + price + '</strong></em></p>\
									<div class="editPrice" data-price="' + price + '" data-id="' + pid + '" id="pencil_'+ pid +'" title="修改价格" style="display:' + isShowMine + ';">修改价格</div>\
									<div class="closeMyWeituo" id="closeMyWT_' + pid + '" title="本品是我的委托" style="display:' + isMyCloseDeal + ';">这是我的委托</div>\
								</div>\
								<div class="slist2015_priceBox box_editprices" id="editP_' + pid + '" style="display:none;">\
									<input class="e_input" type="text" id="inp_' + pid + '" value="' + price + '" />\
									<div class="editCheck" title="确定修改" id="eCheck_' + pid + '">确定修改</div>\
									<div class="editCancel" title="取消修改" id="eCancel_' + pid + '">取消修改</div>\
								</div>\
								<div class="slist2015_priceBox box_cutprices" id="cutP_' + pid + '" style="display:' + isCut + ';">\
									<div class="Cut4Tool" id="Cut4Tool_' + pid + '" style="display:block;">\
										<div class="cutpricetxt">\
											<b style="font-weight:bold;" id="cuttitle_' + pid + '">' + isMyCutTxt + '：</b>\
											<em>\
												<strong class="' + thereisCutCls + '" id="scut_' + pid + '">' + cutprice4show + '</strong>\
											</em>\
										</div>\
										<div class="wanttocut" title="点此还价" data="' + pid + '" style="display:' + ifLetCut +';">点击这里还价</div>\
										<div class="cancelMyCut" title="删除我的还价" id="cancelMyCut_' + pid + '" data-pid="' + pid + '" style="display:' + isMyCut + ';">删除我的还价</div>\
										<div class="dealCheck" id="donedeal_' + pid + '" data-pid="' + pid + '" data-cutprice="' + cutprice + '" data-ppx="' + ppx + '" style="display:' + isShowDeal + ';">成交</div>\
										<div class="cancelCut" id="cancelcut_' + pid + '" data-pid="' + pid + '" data-cutprice="' + cutprice + '" style="display:' + isShowDeal + ';">拒绝</div>\
									</div>\
									<div class="Cut4Show" id="Cut4Show_' + pid + '" style="display:none;">\
										<div class="cutpricetxt" style="font-weight:bold;line-height:28px;"><b style="font-weight:bold;">我还价：</b></div>\
										<input type="text" value="' + cutprice_inInput + '" id="inputCut_' + pid + '" />\
										<div class="nobodyCut" id="noone_' + pid + '" data="' + pid + '" data-cut="' + cutprice + '" style="display:' + isNobodyCut + ';">暂时无人还价</div>\
										<div class="editCut" id="checkCut_' + pid + '" title="确认还价" data-pid="' + pid + '">确认还价</div>\
										<div class="closeCut" title="关闭还价" data="' + pid + '">关闭还价</div>\
									</div>\
								</div>\
								<div class="slist2015_priceBox box_cutprices" id="nocutP_' + pid + '" style="display:' + noCut + ';">\
									<b class="cannotCut">本品谢绝还价！</b>\
								</div>\
								<div class="slist2015_priceBox"><p title="' + pms + '" id="PX_' + pid + '">' + pms + '</p></div>\
								<div class="slist2015_priceBox">\
									<p>' + timename + '时间：' + time + '</p>\
								</div>\
								<div class="slist2015_menshi">' + menshi + '</div>\
							</div>\
						</div>\
					</div>';
	return HTML;
};
// ===================================================================== //
// 还价的协议文案：
function cutPolicyHTML( name, px, sellprice, cutprice ){
	var html = '<ol class="cut_policy_box">\
					<li class="cut_policy_desc">\
						<span>您所还价的商品信息：</span>\
						<div class="cut_policy_info cut_policy_infotop"><b>商品名称：</b><em>' + name + '</em></div>\
						<div class="cut_policy_info"><b>商品详情：</b><em>' + px + '</em></div>\
						<div class="cut_policy_info"><b>委托方价：</b><em>' + sellprice + '元</em></div>\
						<div class="cut_policy_info"><b>您的还价：</b><em>' + cutprice + '元</em></div>\
					</li>\
					<li class="cut_policy_desc">\
						<span>如果有委托方确认出售，系统会自动生成订单，订单金额为您的还价价格。</span>\
					</li>\
					<li class="cut_policy_desc">\
						<span>订单生成后，系统会自动扣除等值商品竞买额度，待交易完毕后予以返还，期间您将无法取消交易或变更内容，请您于4日之内付清所有款项。</span>\
					</li>\
					<li class="cut_policy_desc">\
						<span>请自觉遵守本协议，如单方面不履行此协议，需承担相应处罚和违约责任。</span>\
					</li>\
					<li class="cut_policy_desc">\
						<span>易金在线对本协议有最终解释权。</span>\
					</li>\
				</ol>\
				<div class="policy_checking unchecked">同意协议</div>';
	return html;
};
// 成交(出售)的协议文案：
function dealPolicyHTML( name, px, myprice, dealprice, yongjin ){
	var total = parseInt(dealprice) - parseInt(yongjin);
	var html = '<ol class="cut_policy_box">\
					<li class="cut_policy_desc">\
						<span>您所出售的商品信息：</span>\
						<div class="cut_policy_info cut_policy_infotop"><b>商品名称：</b><em>' + name + '</em></div>\
						<div class="cut_policy_info"><b>商品详情：</b><em>' + px + '</em></div>\
						<div class="cut_policy_info"><b>您的定价：</b><em>' + myprice + '元</em></div>\
						<div class="cut_policy_info"><b>成交价格：</b><em>' + dealprice + '元</em></div>\
						<div class="cut_policy_info"><b>服务佣金：</b><em>' + yongjin + '元</em></div>\
						<div class="cut_policy_info"><b>货款总额：</b><em>' + total + '元</em></div>\
					</li>\
					<li class="cut_policy_desc">\
						<span>如果您确定以此价格出售，系统会自动为您生成订单。订单生成后，您将无法取消交易或变更内容。</span>\
					</li>\
					<li class="cut_policy_desc">\
						<span>我们会根据购买方的具体付款时间，及时为您返款。</span>\
					</li>\
					<li class="cut_policy_desc">\
						<span>请自觉遵守本协议，如单方面不履行此协议，需承担相应处罚和违约责任。</span>\
					</li>\
					<li class="cut_policy_desc">\
						<span>易金在线对本协议有最终解释权。</span>\
					</li>\
				</ol>\
				<div class="policy_checking unchecked">同意协议</div>';
	return html;
};
// 弹出协议的方法：
function popPolicy( title, HTML, func ){
	var poppolicy = $(".poppolicy"),
		policymodel = $(".policymodel"),
		policytitle = $(".policytitle"),
		box = $(".policytxt"),
		policyCancel = $("#policyCancel"),
		policyOK = $("#policyOK");
	policyCancel.css("right", "0px");
	policytitle.html( title );
	box.html( HTML );
	poppolicy.show();
	var policyHeight = policymodel.height();
	policymodel.css({
		"top": "50%",
		"margin-top": "-" + (policyHeight/2) + "px"
	});
	if( /iphone|android|ipad|windows phone/i.test( navigator.userAgent)){ // 如果在移动设备中访问
		policymodel.css({
			"width": "100%",
			"margin-left": "-50%"
		});
	};
	policyOK.removeClass("policyok").addClass("policygreyok").unbind("click").css("cursor", "default");
	$(".policy_checking").unbind("click").bind("click", function(){
		stopLoading();
		var me = $(this);
		if( me.hasClass("unchecked") && policyOK.hasClass("policygreyok") ){
			me.removeClass( "unchecked" ).addClass( "checked" );
			policyOK.removeClass("policygreyok").addClass("policyok").unbind("click").css("cursor", "pointer").bind("click", function(){
				func(); // 确定按钮不是灰色时，点击执行回调
				poppolicy.hide();
			});
		}else{
			me.removeClass( "checked" ).addClass( "unchecked" );
			policyOK.removeClass("policyok").addClass("policygreyok").unbind("click").css("cursor", "default");
		}
	});
	policyCancel.unbind("click").bind("click", function(){
		stopLoading();
		$(this).animate({
			right: "-50px"
		}, 300, function(){
			poppolicy.hide();
			return false;
		});
	});
}; //end pop Policy
// ===================================================================== //
// 加载进度条和弹窗：
function startLoading(){ $(".Loading").show(); };
function stopLoading(){ $(".Loading").hide(); };
function myPOPUP( title, txt, center, func ){
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
// 格式化时间戳
function formatTime( timestamp ){ // 参数是秒
	var time = timestamp * 1000; // 毫秒
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
function formatNum( t ){ // 小时、分钟、秒的数字小于10时，前面加0
	if( t < 10 ){
		t = "0" + t;
	}
	return t;
};
// 计算步长
function buChang( price ){
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
}; // end buChang
// 列表渲染后，每行最后一枚赋特殊class，并为改价和还价绑定事件：
function makeLastItem(){
	var items = loopContainer.find(".slist2015_productItem");
	for(var i = 0; i < items.length; i++){
		var thisItem = $(items[i]);
		if( (i+1)%4 == 0 ){
			thisItem.addClass("slist2015_lastPro");
		}
	};
	var editBtns = loopContainer.find(".editPrice"); // 修改价格的按钮
	var cutBtns = loopContainer.find(".editCut"); // 还价的按钮
	var cancelCutBtns = loopContainer.find(".cancelMyCut"); // 删除我的还价的按钮
	var nobodycuts = loopContainer.find(".nobodyCut"); // 无人还价的文字
	var dealBtns = loopContainer.find(".dealCheck"); // 成交的按钮
	var rejectCutBtns = loopContainer.find(".cancelCut"); // 拒绝买家还价的按钮
	var imgs = loopContainer.find(".slist2015_proImgA"); // 产品图片
	var hearts = loopContainer.find(".getHeart"); // 关注按钮
	var wantcut = loopContainer.find(".wanttocut"); // 点击这里还价，打开还价的输入框
	var closecut = loopContainer.find(".closeCut"); // 点击关闭还价的输入框
	for(var j = 0; j < editBtns.length; j++){
		$(editBtns[j]).modifyPrice(); // 绑定改价事件
	};
	for(var k = 0; k < cutBtns.length; k++){
		$(cutBtns[k]).cutPrice(); // 绑定还价事件
	};
	for(var l = 0; l < cancelCutBtns.length; l++){
		$(cancelCutBtns[l]).delMyCut(); // 绑定删除我的还价事件
	};
	for(var n = 0; n < dealBtns.length; n++){
		$(dealBtns[n]).doneDeal(); // 绑定成交事件
	};
	for(var r = 0; r < rejectCutBtns.length; r++){
		$(rejectCutBtns[r]).refuseCut(); // 绑定拒绝还价的事件
	};
	for(var m = 0; m < imgs.length; m++){ // 绑定图片的hover事件
		$(imgs[m]).hoverImgs();
	};
	for(var x = 0; x < nobodycuts.length; x++){ // 无人还价点击消失
		$(nobodycuts[x]).noCuts();
	};
	for(var h = 0; h < hearts.length; h++ ){
		$(hearts[h]).getHearts(); // 绑定关注功能
	};
	for(var w = 0; w < wantcut.length; w++ ){
		$(wantcut[w]).wantToCut(); // 打开还价输入框
	};
	for(var c = 0; c < closecut.length; c++ ){
		$(closecut[c]).closeCutting(); // 关闭还价输入框
	};

};
// ===================================================================== //
// ===================================================================== //
// The End
})();

