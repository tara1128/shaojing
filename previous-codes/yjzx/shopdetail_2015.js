/* Javascript for shopshow.html, new version of 2015
 * Written by Alex Wong
 * Latest modified date: 2015-04-09 11:59
 */
(function(){
// 缓存变量
var myPan = $("#myPan");
var strP = /^\d+$/; //校验是否正整数
var loading = $(".Loading"); // 加载条
// 几个全局量
var PID = myPan.attr("data-pid"); // pid
var Mine = myPan.attr("data-ismine"); // 是否是我的委托
var Cutted = myPan.attr("data-isadd"); // 本品是否可被还价，如果是我的委托，则该值可能会被重写（即用户手动修改状态）
var isLogin = myPan.attr("data-userid"); // 未登录时为空
var isBuy = myPan.attr("data-isbuy"); // 0是未售出，1是已售出，成交后改写此全局变量
var isFocus = myPan.attr("data-focus"); // 我是否关注了本品
/* ========================================================== */
// 几个AJAX接口的地址：
var AjaxURL_editPrc = '/Shop/modifyproductprice/'; // 改价格接口
var AjaxURL_cutPrc = '/Shop/infixconsignmentpricelog/'; // 还价接口
var AjaxURL_deal = '/Shop/infixorder/'; // 成交和抢购接口
var AjaxURL_yongjin = '/Shop/getfuwumoney/'; // 计算佣金接口
var AjaxURL_changeCut = '/WeiTuo/SetIsConsignMent'; // 修改是否可还价的接口
var AjaxURL_guanzhu = '/Attention/gzajax'; // 关注产品
var AjaxURL_delMyCut = '/Shop/cancelprice/'; // 删除我的还价
/* ========================================================== */
var cutArea = $("#myCutArea"); // 还价的容器
var editArea = $("#myEditArea"); // 改价的容器
var dealArea = $("#myDealArea"); // 成交的容器

var editCheck = $("#editCheckBtn"); // 确认改价的按钮
var dealCheck = $("#dealCheckBtn"); // 我要成交的按钮
var cutCheck = $("#cutCheckBtn"); // 还价的按钮
var soldOutBtn = $("#soldOutBtn"); // 已成交的按钮
var buyCheck = $("#buyCheckBtn"); // 抢购的按钮
var LumpBtn = $("#LumpBtn"); // 修改状态的滑块

var BigRedPrice = $("#BigRedPrice"); // 红色价签显示的数字
var orderTotalPrc = $("#orderTotalPrc"); // 订单总额处的数字
var DQPrice = $("#DQPrice"); // 最新被还价处的数字

var editPrcInp = $("#editPrcInp"); // 修改价格input框
var cutPrcInp = $("#cutPrcInp"); // 还价input框
var latestCut = $("#latestCut"); // 展示还价的数字
var delMyCut = $("#delMyCut"); // 删除我的还价的按钮

var theProName = $("#theProName").html(); // 商品名称描述
var descShow = $("#descShow"); // 显示品相的容器
var seeAllPX = $("#seeAllPX"); // 查看全部品相的按钮
var descHide = $("#descHide"); // 品相隐藏框容器
var theProPX = descShow.html(); // 品相内容描述
var getFocus = $("#getFocus"); // 关注

var moreBoxA = $(".sd2015_moreBoxA"); // 更多的单品A元素

/* ========================================================== */
/* 修改状态的滑块方法 */
$.fn.clickLump = function(dur, clsName){
	var me = $(this); // 主语是滑块
	me.unbind("click").bind("click", function(){
		if( Cutted == "1" ){ // 现在可还价
			me.animate({
				"left": "78px"
			}, dur, function(){
				changeIsCut( 0, "0", me, "一口价", clsName );
			});
		}else{ // 现在是一口价
			me.animate({
				"left": "5px"
			}, dur, function(){
				changeIsCut( 1, "1", me, "可还价", clsName );
			});
		}
	});
};
/* ========================================================== */
// 修改商品是否可以还价的属性，发送参数1是【不可还价变为可还价】，发送参数0是【可还价变为不可还价】
function changeIsCut( n, str, el, descpt, clsName ){
	startLoading();
	$.ajax({
		url: AjaxURL_changeCut,
		type: 'GET',
		dataType: 'json',
		data: { pid: PID, isadd: n },
		success: function( obj ){
			stopLoading();
			if( obj ){
				var data = obj.data;
				if( data == 4 ){ // 未登录
					myPOPUP( "操作提示", "请您先登录系统再操作！", true, function(){ location.href = "/Index/login/"; });
				}else if( data == 2 ){ // pid为空
					myPOPUP( "操作提示", "参数有误，操作失败，请稍后重试！", true );
				}else if( data == 1 ){ // 成功
					Cutted = str; // 改写全局变量
					if( str == "0" ){
						el.addClass( clsName ).html( descpt );
					}else{
						el.removeClass( clsName ).html( descpt );
					}
					myPOPUP( "操作提示", "恭喜！商品状态修改成功！", true );
				}else if( data == 3 ){
					myPOPUP( "操作提示", "本品刚刚已经成交，不能修改状态了。", true );
				}else{ // 其他
					myPOPUP( "操作提示", "网络出错！操作失败！请稍后重试！", true );
				}
			}else{ // 返回为空时
				myPOPUP( "系统提示", "网络错误致操作失败！请稍后重试！", true );
			}
		},
		error: function( r ){
			stopLoading();
			myPOPUP( "系统提示", "网络错误，导致操作失败！请稍后重试！", true );
		}
	}); // end ajax
};
/* ========================================================== */
/* 显示还价 */
if( Cutted == "1" && Mine == "0" ){
	cutArea.show();
}else{
	cutArea.hide();
	if( Mine != "1" ){ $("#myNoCut").show(); }
};
/* 显示改价和成交 */
if( Mine == "1" ){
	editArea.show();
	dealArea.show();
	if( Cutted == "1" ){
		LumpBtn.css({"left": "5px"}).html("可还价").clickLump(300, "yellowLump");
	}else{
		LumpBtn.css({"left": "78px"}).addClass("yellowLump").html("一口价").clickLump(300, "yellowLump");
	}
}else{
	editArea.hide();
	dealArea.hide();
};
/* 如果已经售出，则不再显示还价、改价、改状态、成交等 */
if( isBuy == "1" ){
	cutArea.hide();
	editArea.hide();
	dealArea.hide();
	buyCheck.hide();
	soldOutBtn.show();
}

/* ========================================================== */
/* 点击抢购 */
buyCheck.click(function(){
	var buyPrc = BigRedPrice.html();
	var dingdanlist = $(this).attr("data-dingdan");
	if( !isLogin ){
		myPOPUP("操作提示", "您还没有登录，请先登录系统再抢购！", true, function(){ location.href="/Index/login/"; });
	}else{
		startLoading();
		popPolicy( "易金在线寄售卖场购买协议", buyPolicyHTML( theProName, theProPX, buyPrc ), function(){
			$.ajax({
				url: AjaxURL_deal,
				type: 'GET',
				dataType: 'json',
				data: { pdqprice: buyPrc, pid: PID },
				success: function( obj ){
					stopLoading();
					var data = obj.data;
					if( data == 1 ){ // 抢购成功
						myPOPUP("操作提示", "恭喜！您成功抢购了本商品！点击【确定】即可前往个人中心查看您的订单了！", false, function(){ location.href = dingdanlist; });
						setTimeout(function(){
							buyCheck.hide();
							soldOutBtn.show();
							dealArea.hide()
							cutArea.hide();
							editArea.hide();
						}, 1000);
					}else{
						myPOPUP("系统提示", "网络错误，抢购失败了……", true );
					}
				},
				error: function(){
					stopLoading();
					myPOPUP("系统提示", "网络错误，您的抢购失败了……", true );
				}
			}); // end ajax
		}); // end buy pop Policy
	}
});

/* ========================================================== */
/* 修改价格 */
editCheck.click(function(){
	var newPrc = editPrcInp.val(); // 获取框中的新价格
	newPrc = $.trim( newPrc );
	var oldPrc = BigRedPrice.html(); // 现有价格
	if( !isLogin ){
		myPOPUP("操作提示", "您还没有登录，请先登录系统再修改价格！", true, function(){ location.href="/Index/login/"; });
	}else if( !newPrc ){
		myPOPUP("操作提示", "请输入有效的价格！", true );
		editPrcInp.focus();
	}else if( !strP.test(newPrc) ){
		myPOPUP("操作提示", "价格请输入正整数！", true );
		editPrcInp.focus();
	}else if( newPrc == oldPrc ){
		myPOPUP("操作提示", "请输入一个新的价格！", true );
		editPrcInp.focus();
	}else{
		newPrc = parseInt( newPrc );
		var bc = buChang( newPrc );
		if( newPrc % bc > 0 ){
			myPOPUP("操作提示", "按照您输入的价格，步长为 " + bc + " 元，请输入步长的整数倍！", false );
			editPrcInp.focus();
		}else{
			startLoading();
			$.ajax({
				url: AjaxURL_editPrc,
				type: 'GET',
				dataType: 'json',
				data: { startprice: newPrc, pid: PID },
				success: function( res ){
					stopLoading();
					var data = res.data;
					if( data ){
						if( data == 1 ){
							myPOPUP("操作提示", "恭喜！您的本件委托品价格已修改成功！", true );
							BigRedPrice.html( newPrc );
							orderTotalPrc.html( newPrc );
						}else if( data == 2 ){
							myPOPUP("操作提示", "本品已经售出，不能修改价格了！", true );
						}else if( data == 3 ){
							var dqhp = res.dqhprice;
							myPOPUP("操作提示", "本品最新被还价到 " + dqhp + " 元，您修改的价格不能低于此价格！请您重新修改价格！" , false );
						}else{
							myPOPUP("操作提示", "服务器出错了，操作失败！", true );
						}
					}else{
						myPOPUP("操作提示", "网络错误，操作失败了，请您重试！", true );
					}
				},
				error: function(){
					stopLoading();
					myPOPUP("操作提示", "网络出错，导致操作失败！请重试！", true );
				}
			}); // end ajax
		}
	}
});
/* ========================================================== */
/* 点击我要成交 */
dealCheck.click(function(){
	var me = $(this);
	var myppx = me.data("ppx");
	var cutPrc = DQPrice.html();
	var myPrc = BigRedPrice.html();
	if( !isLogin ){
		myPOPUP("操作提示", "您还没有登录，请先登录系统再操作！", true, function(){ location.href="/Index/login/"; });
	}else if( cutPrc == "0" ){
		myPOPUP("操作提示", "您不能以 0 元成交！", true);
	}else{
		cutPrc = parseInt( cutPrc );
		if( cutPrc ){
			startLoading();
			$.ajax({ // 计算佣金，成功后，再弹协议
				url: AjaxURL_yongjin,
				type: 'GET',
				dataType: 'json',
				data: { pdqprice: cutPrc, px: myppx },
				success: function( obj ){
					stopLoading();
					var yongjin = obj.data;
					if( yongjin == 4 ){
						myPOPUP("操作提示", "您还没有登录，请先登录系统！", true, function(){ location.href="/Index/login/"; });
					}else if( yongjin >= 10 || yongjin == 0 ){ // 返回值大于等于10，才是佣金的值，这时候可以弹协议了：
						popPolicy( "易金在线寄售卖场成交协议", dealPolicyHTML( theProName, theProPX, myPrc, cutPrc, yongjin ), function(){
							startLoading();
							$.ajax({
								url: AjaxURL_deal,
								type: 'GET',
								dataType: 'json',
								data: { pdqprice: cutPrc, ischushou: "1", pid: PID },
								success: function( obj ){
									stopLoading();
									var data = obj.data;
									if( data == 1 ){ // 交易成功
										myPOPUP("操作提示", "恭喜！您的该委托品成功以 " + cutPrc + " 元的价格成交！请前往[个人中心] - [委托管理]页面查看交易详情！", false );
										buyCheck.hide();
										soldOutBtn.show();
										dealArea.hide()
										cutArea.hide();
										editArea.hide();
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
								error: function(r){ stopLoading(); myPOPUP("系统提示", "网络出错，导致操作失败了，请重试！", true); }
							}); // end ajax
						}); // end policy
					}else{
						myPOPUP("操作提示", "数据错误！请稍后重试！", true);
					}
				},
				error: function(r){ stopLoading(); myPOPUP("操作提示", "网络出错，交易失败，请稍后再试！", true ); }
			}); // end ajax
		}else if( cutPrc == 0 ){
			myPOPUP("操作提示", "您不能以 0 元成交！", true);
		}else{
			myPOPUP("操作提示", "网络出错，操作失败！请重试！", true);
		}
	}
});
/* ========================================================== */
/* 点击还价按钮 */
cutCheck.click(function(){
	var newCutPrice = cutPrcInp.val(); // 获取输入框里的价格
	var sellPrc = BigRedPrice.html(); // 当前出售的价格
	newCutPrice = $.trim( newCutPrice );
	if( !isLogin ){
		myPOPUP("操作提示", "您还没有登录，请先登录系统再还价！", true, function(){ location.href="/Index/login/"; });
	}else if( newCutPrice == "" || newCutPrice == "0" ){
		myPOPUP("还价提示", "还价请先输入价格！", true );
		cutPrcInp.focus();
	}else if( !strP.test(newCutPrice) ){
		myPOPUP("还价提示", "还价的价格请输入正整数！", true );
		cutPrcInp.focus();
	}else if( parseInt(newCutPrice) % ( buChang(parseInt(newCutPrice)) ) != 0 ){
		var cpr = parseInt(newCutPrice);
		var cbc = buChang(cpr);
		if( cbc ){
			myPOPUP("还价提示", "价格必须为步长的整数倍哦！按您输入的价格，步长应为 " + cbc + " 元，请重新出价！", false );
			cutPrcInp.focus();
		}else{
			myPOPUP("还价提示", "您输入的价格有误，请重新出价！", true );
			cutPrcInp.focus();
		}
	}else{ // 先弹出协议再调用接口
		startLoading();
		newCutPrice = parseInt( newCutPrice );
		popPolicy( "易金在线寄售卖场还价协议", cutPolicyHTML( theProName, theProPX, sellPrc, newCutPrice ), function(){
			$.ajax({
				url: AjaxURL_cutPrc,
				type: 'GET',
				dataType: 'json',
				data: { pdqprice: newCutPrice, pid: PID },
				success: function( obj ){
					stopLoading();
					var data = obj.data;
					if( data == 4 ){ // 4未登录
						myPOPUP("操作提示", "您还未登录，请先登录系统再还价！", true, function(){ location.href="/Index/login/"; });
					}else if( data == 2 ){ // 2已经售出
						myPOPUP("还价提示", "您的出手太慢了，本品已经被售出了！", true );
					}else if( data == 3 ){ // 3还价低于了最新还价
						var cut = obj.pdqprice; // 拿到最新还价
						myPOPUP("还价提示", "本品的最新还价是 " + cut + "元，您的还价不能低于此价格！", true );
						cutPrcInp.focus();
					}else if( data == 5 ){ // 5还价高于了最新售价
						var prc = obj.startprice; // 拿到最新售价
						myPOPUP("还价提示", "本品的最新售价是 " + prc + " 元，您的还价不能高于此价格！", true );
						cutPrcInp.focus();
					}else if( data == 1 ){ // 1修改成功
						myPOPUP("还价提示", "操作成功！您以 " + newCutPrice + " 元的价格成功还价！请耐心等待委托人的确认。如果委托人确认了以您的价格成交后，您可以在 [个人中心] - [订单管理] 中找到本品的订单！", false );
						cutPrcInp.val( newCutPrice );
						latestCut.html( newCutPrice );
						delMyCut.show();
					}else if( data == 12 ){
						myPOPUP("系统提示", "您的账户未激活，请联系管理员！", true );
					}else if( data == 13 ){
						myPOPUP("系统提示", "您的账户额度不足，请先充值再操作！", true );
					}else{ // 0失败
						myPOPUP("还价提示", "操作失败了，请联系系统管理员！", true );
					}
				},
				error: function(r){
					stopLoading();
					myPOPUP("系统提示", "网络出错，导致操作失败了，请重试！", true );
					cutPrcInp.focus();
				}
			}); // end ajax
		}); // end policy
	}
});
/* ========================================================== */
/* 点击关注按钮 */
getFocus.click(function(){
	var me = $(this);
	if( !isLogin ){
		myPOPUP("操作提示", "您还没有登录，请先登录系统再操作！", true, function(){ location.href="/Index/login/"; });
	}else{
		startLoading();
		$.ajax({
			url: AjaxURL_guanzhu,
			type: 'GET',
			dataType: 'json',
			data: { action: 'gz', id: PID, rand: Math.random(), type: "2" },
			success: function(data){
				stopLoading();
				if(data == 1){ //关注成功
					me.addClass("getFocused").attr("title", "点击取消关注");
					myPOPUP( "操作提示", "您已成功关注本品！", true );
				}else if(data == 2){ //关注失败
					myPOPUP( "操作提示", "关注失败！请稍后重试！", true );
				}else if(data == 3){ //取消成功
					me.removeClass("getFocused").attr("title", "点击关注");
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
		});
	}
});
/* ========================================================== */
// 点击删除我的还价：
delMyCut.click(function(){
	var me = $(this);
	var mycutprice = latestCut.html();
	var dingdan = me.attr("data-dingdan");
	if( mycutprice && mycutprice != "0" ){
		myPOPUP("操作提示", "您当前的还价是 " + mycutprice + " 元，您确定要删除吗？删除后您还可以重新还价！", false, function(){
			startLoading();
			$.ajax({
				url: AjaxURL_delMyCut,
				type: 'GET',
				dataType: 'json',
				data: { pdqprice: mycutprice, pid: PID },
				success: function( obj ){
					stopLoading();
					if( obj ){
						var data = obj.data;
						if( data == 1 ){ // 删除还价成功
							myPOPUP("操作提示", "操作成功！您已删除了您的还价！", true);
							me.parent().find("em").html(0);
							me.hide();
						}else if( data == 2 ){ // 已售出，卖给别人了
							myPOPUP("操作提示", "本品已经售出！", true);
						}else if( data == 3 ){ // 当前不是最新还价
							var dqprice = obj.dqhprice;
							myPOPUP("操作提示", "本品最新还价是 " + dqprice + " 元，您的还价已无效！", true, function(){ me.hide(); });
						}else if( data == 4 ){ // 未登录
							myPOPUP("操作提示", "您还没有登录，请先登录系统再操作！", true, function(){ location.href="/Index/login/"; });
						}else if( data == 5 ){ // 已售出，卖给我了
							myPOPUP("操作提示", "删除失败！本品已经按照您的还价成交了，您可以前往个人中心的订单管理页面，查看此订单！", false, function(){ location.href = dingdan; });
						}else{
							myPOPUP("操作提示", "服务器出错了，请联系管理员！", true);
						}
					}else{
						myPOPUP("操作提示", "服务器出错了，请稍后重试！", true);
					}
				},
				error: function(){
					stopLoading();
					myPOPUP( "系统提示", "网络错误导致了操作失败，请您稍后重试！", true );
				}
			}); // end ajax
		});
	}
});


/* ========================================================== */
// 模拟 placeholder，结构input + s
$.fn.placeHolder = function(){
	var me = $(this); // 主语是input
	var plh = me.data("plh");
	var s = $("#" + plh); // 对应的s元素
	s.click(function(){
		me.focus();
	});
	me.focus(function(){
		var val = me.val();
		val = $.trim( val );
		s.hide();
	});
	me.blur(function(){
		var val = me.val();
		val = $.trim( val );
		if( !val ){
			s.show();
		}else{
			s.hide();
		}
	});
};
editPrcInp.placeHolder();
cutPrcInp.placeHolder();

/* ========================================================== */
/* 品相描述的文字太长的情况下，用浮窗展示 */
if( theProPX.length > 80 ){
	seeAllPX.show().unbind("click").bind("click", function(){
		descHide.show().find("a").click(function(){
			descHide.hide();
		});
	});
};

/* ========================================================== */
/* 更多热卖 */
moreBoxA.hover(function(){
	var div = $(this).find("div");
	div.animate({ bottom: "0px" }, 300);
}, function(){
	var div = $(this).find("div");
	div.animate({ bottom: "-120px" }, 300);
});

// ===================================================================== //
// ===================================================================== //
// 抢购的协议文案：
function buyPolicyHTML( name, px, sellprice ){
	var html = '<ol class="cut_policy_box">\
					<li class="cut_policy_desc">\
						<span>您所购买的商品信息：</span>\
						<div class="cut_policy_info cut_policy_infotop"><b>商品名称：</b><em>' + name + '</em></div>\
						<div class="cut_policy_info"><b>商品详情：</b><em>' + px + '</em></div>\
						<div class="cut_policy_info"><b>订单金额：</b><em>' + sellprice + '元</em></div>\
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
						<span>还价后，系统会扣除等值还价金额的竞买额度，待交易完毕或还价失效后予以返还。</span>\
					</li>\
					<li class="cut_policy_desc">\
						<span>如果有委托方确认出售，系统会自动生成订单，订单金额为您的还价价格。</span>\
					</li>\
					<li class="cut_policy_desc">\
						<span>订单生成后，您将无法取消交易或变更内容，请您于4日之内付清所有款项。</span>\
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
// ===================================================================== //
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
		stopLoading();
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
		stopLoading();
		me.animate({
			right: "-50px"
		}, 300, function(){
			myPOP.hide();
			return false;
		});
	});
}; //end my POP UP

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

})();
