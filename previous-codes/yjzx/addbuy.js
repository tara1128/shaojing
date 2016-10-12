/* Javascript for jiajiagou only */
/* Written by AlexWong, created on 2015-01-28 16:51 */
/* Latest modified on 2015-03-09 18:34 */
(function(){

// 缓存变量
var Loading = $("#Loading"), // loading容器
	yjAddBuy = $("#yjAddBuy"), // 加价购最外层容器，登录后可拿到userid
	list4Category = $("#list4Category"), // 下拉分类列表
	list4Year = $("#list4Year"), // 下拉年份列表
	list4PriceOrder = $("#list4PriceOrder"), // 下拉价格排序列表
	jjgSearch = $("#jjgSearch"), // 搜素按钮
	jjgSearchBack = $("#jjgSearchBack"), // 搜索后返回按钮的容器
	jjgMyGz = $("#jjgMyGz"), // 我的关注列表入口
	cates = $(".cates"), // 搜索下拉的分类li元素们
	btn4year = $("#btn4year"), // 触发下拉年份的小三角
	btn4category = $("#btn4category"), // 触发下拉分类的小三角
	btn4PriceOrder = $("#btn4PriceOrder"), // 触发下拉价格排序的小三角
	arrow4year = $("#arrow4year"), // 年份小三角
	arrow4category = $("#arrow4category"), // 类别小三角
	arrow4priceorder = $("#arrow4priceorder"), // 价格排序小三角
	inpYear = $("#inpYear"), // 选择年份的input框
	inpCate = $("#inpCate"), // 选择分类的input框
	inpPriceOrder = $("#inpPriceOrder"), // 选择价格排序的input框
	inpYearSend = $("#inpYearSend"), // 选择年份的隐藏的input框，其val值用于承载参数
	inpCateSend = $("#inpCateSend"), // 选择分类的隐藏的input框，其val值用于承载参数
	inpPriceOrderSend = $("#inpPriceOrderSend"); // 选择价格分类的隐藏input框，其val值用于承载参数

var jjgou_chujiaInp = $(".jjgou_chujiaInp"), //出价框集合
	jjgou_chujiaBtn = $(".jjgou_chujiaBtn"), //所有的加减号集合
	jjgou_sendChujia = $(".jjgou_sendChujia"), //[我出价]按钮集合
	jjgou_price_done = $(".jjgou_price_done"), //[已成交]容器集合
	jjgou_price_mine = $(".jjgou_price_mine"), //[我的出价]容器集合
	jjgou_confirmBtn = $(".jjgou_confirmBtn"), //[我有货，我确认]按钮集合
	doFocus = $(".doFocus"), //[关注]按钮集合
	jjgouDelMine = $(".jjgouDelMine"); // 删除我的出价

var qgouName = $("#qgouName"), // 求购-商品名称
	qgouSelPX = $("#qgouSelPX"), // 求购-点击选择品相
	qgouPXList = $("#qgouPXList"), // 求购-品相列表ul
	qgouPXShow = $("#qgouPXShow"), // 求购-品相选择后展示用的文字
	qgouPrice = $("#qgouPrice"), // 求购-价格input框
	qgouMsg = $("#qgouMsg"), // 求购-留言框
	qgouSendBtn = $("#qgouSendBtn"), // 求购-发送按钮
	strP = /^\d+$/; // 校验是否正整数

var g_Userid = yjAddBuy.attr("data-userid"); // userid未登录时为空

// 不允许手动输入年份和分类
$(".uneditable").keydown(function(){return false;});

// 计算对应的步长
function buChang( price ){
	if( price >= 1 && price < 1000 ){
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

// 页码的输入框交互
var pageInp = $(".jjgou_page_jumpNum input");
pageInp.focus(function(){
	$(this).addClass("inpFocused");
});
pageInp.blur(function(){
	$(this).removeClass("inpFocused");
});

// loading的加载与消失
function startLoading(){ Loading.show(); };
function stopLoading(){ Loading.hide(); };

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

// ======================================================================================== //
// 点击选择年份 (必须在 searchObj 获取成功后才能绑定到按钮的click上)
$.fn.pickYear = function( catesObj ){
	var me = $(this);
	var year = me.attr("data-sel");
	me.bind("click", function(event){
		inpYear.val( year );
		inpYearSend.val( year );
		list4Year.slideUp(200).attr("data-status", "fold");
		cates.addClass("disabled");
		inpCate.val("选择分类");
		inpCateSend.val("");
		for( var i = 0; i < cates.length; i++ ){ // 遍历分类列表，把年份对应的分类显亮，年份中没有的分类则继续灰色显示
			var _itemCates = $(cates[i]);
			var _itemId = _itemCates.attr("data-id");
			for( var pr in catesObj ){
				if( _itemId == pr ){
					_itemCates.removeClass("disabled");
				}
			}
		} // end for
		event.stopPropagation();
	});
}; // end pick year

var prcOrderObj = {
	"bid": "最新出价",
	"deal": "最新成交",
	"desc": "按价格从高到低",
	"asc": "按价格从低到高"
};

// 页面加载，调用搜索数据接口，获取搜索年份和分类，并渲染数据：
$.ajax({
	url: jjgSearch.data("api"),
	type: 'POST',
	dataType: 'json',
	success: function( searchObj ){
		// 渲染出价框默认显示的数字
		for( var i = 0; i < jjgou_chujiaInp.length; i++ ){
			var _cjItem = $(jjgou_chujiaInp[i]);
			var _dqPrice = parseInt( _cjItem.attr("data-dqprice") );
			var _bc = buChang( _dqPrice );
			_cjItem.val( _dqPrice + _bc );
		};
		// 判断是否要展示搜索[返回]按钮（当页面是搜索结果时，才展示返回）
		var _href = window.location.href;
		if( _href.indexOf('year') != -1 || _href.indexOf('category') != -1 || _href.indexOf('priceorder') != -1 ){
			jjgSearchBack.show();
			jjgMyGz.hide(); // 搜索结果不显示我的关注入口
		}else{
			if( _href.indexOf('gz') != -1 ){
				jjgMyGz.hide();
				jjgSearchBack.show();
			}else{
				jjgMyGz.show();
				jjgSearchBack.hide();
			}
		};
		// 如果分类搜索框里有分类条件，要手动给value赋一次值:
		var i_priceOrderVal = inpPriceOrder.val();
		for(var p in prcOrderObj){
			if( i_priceOrderVal == prcOrderObj[p] ){
				inpPriceOrderSend.val( p );
			}
		};
		// 动态加载搜索用的年份和分类名
		for(var p in searchObj){
			var tmpl_year = '<li id="years_' + p + '" data-sel="' + p + '"><a href="javascript:;">' + p + '</a></li>';
			list4Year.find("ul").append( tmpl_year );
			var catesObj = searchObj[p]; //年份对应的分类对象
			$("#years_" + p).pickYear( catesObj ); // append到页面的元素，必须用$符重新获取再执行方法！
		};
		// 绑定下拉列表的点击
		slideMenu( btn4year, list4Year, arrow4year, $(".not4year") );
		slideMenu( inpYear, list4Year, arrow4year,  $(".not4year") );
		slideMenu( btn4category, list4Category, arrow4category, $(".not4cate") );
		slideMenu( inpCate, list4Category, arrow4category, $(".not4cate") );
		slideMenu( btn4PriceOrder, list4PriceOrder, arrow4priceorder, $(".not4order") );
		slideMenu( inpPriceOrder, list4PriceOrder, arrow4priceorder, $(".not4order") );
		// 展示搜索结果页时，如果年份已被选，则年份对应的分类能够筛选出可选的分类
		var s_res_year = inpYearSend.val();
		if( s_res_year ){
			var s_res_cateObj = searchObj[s_res_year];
			cates.addClass("disabled");
			for( var i = 0; i < cates.length; i++ ){ // 遍历分类列表，把年份对应的分类显亮，年份中没有的分类则继续灰色显示
				var _itemCates = $(cates[i]);
				var _itemId = _itemCates.attr("data-id");
				for( var pt in s_res_cateObj ){
					if( _itemId == pt ){
						_itemCates.removeClass("disabled");
					}
				}
			} // end for
		}// end if
	},
	error: function(){
		myPOPUP( "系统提示", "网络异常，请先刷新页面再访问。", true, function(){ location.reload(); });
	}
});

// 点击选择分类
cates.bind("click", function(event){
	var me = $(this);
	var _id = me.attr("data-id");
	var _sel = me.attr("data-sel");
	if( !!me.hasClass("disabled") ){
		return false;
	}else{
		inpCate.val( _sel );
		inpCateSend.val( _id );
		list4Category.slideUp(200).attr("data-status", "fold");
	}
	event.stopPropagation();
});

// 点击选择分类排序
$(".priceorderSel").bind("click", function(event){
	var me = $(this);
	var order = me.attr("data"); // 排序方式，asc升序，desc降序，bid按出价时间排序，deal按成交时间排序
	var orderTxt = me.html();
	inpPriceOrderSend.val( order );
	inpPriceOrder.val( orderTxt );
	list4PriceOrder.slideUp(200).attr("data-status", "fold");
	event.stopPropagation();
});

// 点击打开搜索条件的下拉列表
function slideMenu( triger, menu, arrow, foldMenu ){
	triger.bind("click", function(event){
		if( menu.attr("data-status") == "fold" ){
			menu.slideDown(200).attr("data-status", "unfold");
			arrow.addClass( "gliding" );
			foldMenu.slideUp(200).attr("data-status", "fold");
		}else{
			menu.slideUp(200).attr("data-status", "fold");
			arrow.removeClass( "gliding" );
		}
		event.stopPropagation();
	});
};

// 点击页面任何地方都收回下拉列表：
$("body").bind("click", function(){
	var slideLists = $(".jjg_divlist");
	for( var i = 0; i < slideLists.length; i++ ){
		var l_item = $(slideLists[i]);
		if( l_item.attr("data-status") == "unfold" ){
			l_item.slideUp(200).attr("data-status", "fold");
			l_item.parent().find("s").removeClass( "gliding" );
		}
	}
});


// 点击搜索按钮
jjgSearch.bind("click", function(event){
	var searchapi = $(this).data("searchapi");
	var s_year = inpYearSend.val(),
		s_cate = inpCateSend.val(),
		s_order = inpPriceOrderSend.val();
	if( !s_year && !s_cate && !s_order ){
		myPOPUP( "搜索提示", "请至少选择一个搜索条件哦！", true );
	}else{
		if( !s_year ){ s_year = 0; }
		if( !s_cate ){ s_cate = 0; }
		if( !s_order ){
			location.href = searchapi + "/year/" + s_year + "/category/" + s_cate;
		}else{
			location.href = searchapi + "/year/" + s_year + "/category/" + s_cate + "/priceorder/" + s_order;
		}
	}
	event.stopPropagation();
});

// 点击[我的关注]
jjgMyGz.find("a").click(function(){
	var mygzapi = $(this).data("mygz");
	var mylogin = $(this).data("login");
	if( g_Userid ){
		location.href = mygzapi + "/gz/1";
	}else{
		myPOPUP( "系统提示", "请您先登录再操作", true, function(){ location.href = mylogin; });
	}
});

// ======================================================================================== //
// ======================================================================================== //
// 加减价并出价
$.fn.plusMinus = function( leastPrice ){ // 加减号调用此方法
	var me = $(this);
	var token = me.attr("data-token"); //标识加减号
	var pid = me.attr("data-pid"); //对应的产品id
	var inp = $("#input_" + pid); //对应的输入框input元素
	var currVal = inp.val(); //静默加载后显示的初始价格，点击减号不能低于此价格
	var minusDisCls = "minus_disabled"; // 减号不可用时的class名
	if( pid && currVal ){
		currVal = parseInt( currVal );
		var buchang = buChang( currVal ); //用显示价算出步长
		if( token == "plus" ){ // 点击[+]号时
			var _minusbtn = $("#cjminusbtn_" + pid); // 对应的减号
			inp.val( currVal + buchang );
			_minusbtn.removeClass( minusDisCls );
		}else{ //点击[-]号时
			if( !!me.hasClass( minusDisCls ) ){
				return false;
			}else{
				var minusRes = currVal - buchang;
				inp.val( minusRes );
				if( minusRes == leastPrice ){
					me.addClass( minusDisCls );
				}
			}
		}
	}else{ // pid或currVal至少有一个没有值时，都不能点击加减号
		return false;
	}
};

// 点击[加减号]
jjgou_chujiaBtn.click(function(){
	var me = $(this);
	var pid = me.attr("data-pid");
	var inp = $("#input_" + pid); //对应的输入框input元素
	var dqp = inp.attr("data-dqprice");
	if( dqp ){
		dqp = parseInt( dqp );
		var leastPrice = dqp + buChang( dqp );
		me.plusMinus( leastPrice );
	}else{
		return false;
	}
});

// 鼠标滑过[加减号]
jjgou_chujiaBtn.mouseenter(function(){
	var me = $(this);
	var pid = me.attr("data-pid");
	var token = me.attr("data-token");
	var splitLine = $("#split_" + pid); // 加号右边框和减号左边框
	var disCls = token + "_disabled"; // 加减号不可用时的class名
	if( !!me.hasClass( disCls ) ){
		splitLine.css("background", "#221815");
	}else{
		splitLine.css("background", "#d8271c");
	}
});
jjgou_chujiaBtn.mouseleave(function(){
	var me = $(this);
	var pid = me.attr("data-pid");
	var token = me.attr("data-token");
	var splitLine = $("#split_" + pid); // 加号右边框和减号左边框
	splitLine.css("background", "#221815");
});

// 点击[我出价]
jjgou_sendChujia.click(function(){
	var me = $(this);
	var pid = me.attr("data-pid");
	var pname = me.attr("data-name");
	var pXiang = me.attr("data-px");
	var addPriceApi = me.attr("data-api");
	var login = me.attr("data-login");
	var inpEle = $("#input_" + pid);
	var inpVal = inpEle.val();
	var inpDqP = inpEle.attr("data-dqprice"); // input元素的data属性里拿到当前价
	if( g_Userid ){ // 出价必须在登录后才弹出协议
		if( inpVal ){
			if( !strP.test(inpVal) ){
				myPOPUP( "出价提示", "价格必须填写正整数哦！", true, function(){ inpEle.focus(); });
			}else{
				inpVal = parseInt( inpVal ); // 输入的价格
				inpDqP = parseInt( inpDqP ); // 当前价
				if( inpVal <= inpDqP ){
					myPOPUP( "出价提示", "出价必须大于当前价哦！", true, function(){ inpEle.focus(); });
				}else{
					var inpBuC = buChang( inpVal ); // 按照用户输入的价格计算步长
					if( inpVal % inpBuC != 0 ){
						myPOPUP( "出价提示", "价格必须为步长的整数倍哦！按照您当前的出价，步长为 " + inpBuC + " 元，请重新出价！", false, function(){ inpEle.focus(); });
					}else{ // 验证通过，该弹协议了
						popPolicy( "购买协议", buyPolicy( pname, inpVal, pXiang ), function(){
							startLoading();
							$.ajax({
								url: addPriceApi,
								type: 'POST',
								data: { 'pid': pid, 'price': inpVal },
								dataType: 'json',
								success: function(data){
									stopLoading();
									if( data.data ){
										var _data = parseInt( data.data ); //该值为200时，才是出价成功
										if( _data == 200 ){
											myPOPUP( "出价提示", "恭喜您出价成功！您的出价是" + inpVal + "元！", true );
											$("#gzNum_" + pid).removeClass("jjgou_tool_focus").addClass("jjgou_tool_focused").attr("title", "取消关注");
										}else{ //状态码不是200
											if( _data == 0 ){
												myPOPUP( "出价提示", "您的账户状态异常，请联系客服！", true );
											}else if( _data == 1 ){
												myPOPUP( "出价提示", "操作有误，参数缺失，请重试！", true );
											}else if( _data == 2 ){
												myPOPUP( "出价提示", "很抱歉，您的账户额度不足，请先充值。", true );
											}else if( _data == 3 ){
												myPOPUP( "出价提示", "出价不能小于本品当前价，请重试！", true );
											}else if( _data == 4 ){
												myPOPUP( "出价提示", "您的出价已经是本品最高价，无需继续出价！", true );
											}else{
												myPOPUP( "温馨提示", "网络异常，请刷新页面重试。", true );
											}
										}
										partRefresh( pid );
									}else{
										return false;
									}
								},
								error: function(){
									stopLoading();
									myPOPUP( "系统提示", "网络异常，请刷新页面后再试！", true, function(){ location.reload(); });
								}
							}); // end ajax
						}); // end pop policy
					} // end else 弹协议over
				}
			}
		}else{ // 输入框没有数值时
			myPOPUP( "系统提示", "您还没有输入价格哦，请重试！", true, function(){
				inpEle.focus();
			});
		}
	}else{ // 未登录时点出价，提示登录
		myPOPUP( "系统提示", "请您先登录再出价", true, function(){ location.href = login; });
	} // end this else
});

// ======================================================================================== //
// [我出价] 的购买协议文案
function buyPolicy( pname, pPrice, ppx ){
	var price = parseInt( pPrice );
	var yongjin = Math.ceil( price * 0.03 ); // 佣金向上取整
	var total = price + yongjin;
	var policy = '<ol class="jjgou_policy_box">\
					<li class="jjgou_policy_desc">\
						<span>您所购买的商品信息：</span>\
						<div class="jjgou_policy_info jjgou_policy_infotop"><b>商品名称：</b><em>' + pname + '</em></div>\
						<div class="jjgou_policy_info"><b>商品品相：</b><em>' + ppx + '</em></div>\
						<div class="jjgou_policy_info"><b>商品价格：</b><em>' + price + '元</em></div>\
						<div class="jjgou_policy_info"><b>服务佣金：</b><em>' + yongjin + '元</em><em class="noline">（商品价格的3%）</em></div>\
						<div class="jjgou_policy_info"><b>支付总额：</b><em>' + total + '元</em></div>\
					</li>\
					<li class="jjgou_policy_desc">\
						<span>如果有委托方确认出售，易金客服核验商品后会与您及时联系，双方确认后生成订单。</span>\
					</li>\
					<li class="jjgou_policy_desc">\
						<span>订单生成后，系统会自动扣除等值商品竞买额度，待交易完毕后予以返还，期间您将无法取消交易或变更内容，请您于7日之内付清所有款项。</span>\
					</li>\
					<li class="jjgou_policy_desc">\
						<span>请自觉遵守本协议，如单方面不履行此协议，需承担相应处罚和违约责任。</span>\
					</li>\
					<li class="jjgou_policy_desc">\
						<span>易金在线对本协议有最终解释权。</span>\
					</li>\
				</ol>\
				<div class="jjgou_policy_checking jjgou_sprites unchecked" data-type="buy">同意协议</div>';
	return policy;
};
// [我有货我确认] 的出售协议文案
function sellPolicy( pname, pPrice, ppx ){
	var price = parseInt( pPrice );
	var yongjin = Math.ceil( price * 0.03 ); // 佣金向上取整
	var total = price + yongjin;
	var policy = '<ol class="jjgou_policy_box">\
					<li class="jjgou_policy_desc">\
						<span>您所出售的商品信息：</span>\
						<div class="jjgou_policy_info jjgou_policy_infotop"><b>商品名称：</b><em>' + pname + '</em></div>\
						<div class="jjgou_policy_info"><b>商品品相：</b><em>' + ppx + '</em></div>\
						<div class="jjgou_policy_info"><b>商品价格：</b><em>' + price + '元</em></div>\
						<div class="jjgou_policy_info"><b>服务佣金：</b><em>' + yongjin + '元</em><em class="noline">（商品价格的3%）</em></div>\
						<div class="jjgou_policy_info"><b>货款总额：</b><em>' + total + '元</em></div>\
					</li>\
					<li class="jjgou_policy_desc">\
						<span>如果您确定以此价格出售，易金客服会与您及时联系，请您于3日内将商品寄送到易金在线（北京门市、上海门市均可）；商品通过易金在线的专业人员核验后，系统会自动为您生成订单。</span>\
					</li>\
					<li class="jjgou_policy_desc">\
						<span>订单生成后，系统会自动扣除等值商品竞买额度，待交易完毕后予以返还，期间您将无法取消交易或变更内容。</span>\
					</li>\
					<li class="jjgou_policy_desc">\
						<span>我们会根据购买方的具体付款时间，及时为您返款。</span>\
					</li>\
					<li class="jjgou_policy_desc">\
						<span>请自觉遵守本协议，如单方面不履行此协议，需承担相应处罚和违约责任。</span>\
					</li>\
					<li class="jjgou_policy_desc">\
						<span>易金在线对本协议有最终解释权。</span>\
					</li>\
				</ol>\
				<div class="jjgou_policy_checking jjgou_sprites unchecked" data-type="sell">同意协议</div>';
	return policy;
};
// ======================================================================================== //
// 弹出协议的方法
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
	$(".jjgou_policy_checking").unbind("click").bind("click", function(){
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
		$(this).animate({
			right: "-50px"
		}, 300, function(){
			poppolicy.hide();
			return false;
		});
	});
}; //end pop Policy
// ======================================================================================== //
// 点击[我有货，我确认]
jjgou_confirmBtn.click(function(){
	var me = $(this);
	var sellApi = me.attr("data-api");
	var login = me.attr("data-login");
	var pid = me.attr("data-pid");
	var pname = me.attr("data-name");
	var pxiang = me.attr("data-px");
	var dqp_b = $("#dq_price_" + pid); //放当前价的b元素
	var pageprice = dqp_b.attr("data-dqprice"); // 当前在页面上看到的[当前价]，未必是最新的，发给服务器做校验(不要从页面上带逗号的数值里取)
	if( g_Userid ){ // 确认我有货，必须在登录后，才弹出协议
		popPolicy( "出售协议", sellPolicy( pname, pageprice, pxiang ), function(){
			callSell( sellApi, pid, pageprice );
		}); // end pop policy
	}else{ // 未登录
		myPOPUP( "系统提示", "请您先登录再操作", true, function(){ location.href = login; });
	}
});
// 请求出售的接口，如果价格不是最新当前价，则需递归调用本方法：
function callSell( sellapi, pid, hprice ){
	startLoading();
	$.ajax({
		url: sellapi,
		type: 'POST',
		data: { 'pid': pid, 'htmlprice': hprice },
		dataType: 'json',
		success: function(data){
			stopLoading();
			var _data = data.data;
			if( _data ){
				_data = parseInt( _data );
				if( _data == 200 ){
					myPOPUP( "出售提示", "操作成功！系统已为您自动生成订单。易金客服将与您取得联系。" );
				}else if( _data == 5 ){
					myPOPUP( "出售提示", "操作失败，账户额度不足，请先充值。", true );
				}else if( _data == 101 ){
					var latestPrice = parseInt( data.info ); // 服务器返回的最新当前价
					var latestYongj = Math.ceil( latestPrice * 0.03 ); // 计算出最新的佣金
					var latestTotal = latestPrice + latestYongj; // 最新的总价
					var showLatestInfo = "抱歉哦，您下手太慢，原价格刚被成交了！本品最新价已变为 " + latestPrice + " 元，佣金 " + latestYongj + " 元，货款总额 " + latestTotal + " 元，您是否确定出售呢？";
					myPOPUP( "出售提示", showLatestInfo, false, function(){
						callSell( sellapi, pid, latestPrice );
					});
				}else{
					myPOPUP( "出售提示", "操作失败！请重试。", true );
				}
			}else{
				return false;
			}
			partRefresh( pid );
		},
		error: function( r ){
			stopLoading();
			myPOPUP( "系统提示", "网络异常，请刷新页面后再试！", true, function(){ location.reload(); });
		}
	}); // end ajax
}; // end call sell

// ======================================================================================== //
// 点击[关注本品]
doFocus.click(function(){
	var me = $(this);
	var pid = me.attr("data-pid");
	var api = me.attr("data-api");
	var login = me.attr("data-login");
	if( !!me.hasClass("jjgou_tool_focused") ){ // 已关注了，要取消关注，传status值为0
		var _status = 0;
	}else{ // 未关注，要关注，传status值为1
		var _status = 1;
	};
	startLoading();
	$.ajax({
		url: api,
		type: 'POST',
		data: { 'pid': pid, 'status': _status },
		dataType: 'json',
		success: function( data ){
			stopLoading();
			if( data.status ){
				var sta = data.status;
				if( sta == 200 ){
					if( _status == 1 ){ // 要关注，操作成功后，红心变红
						myPOPUP( "温馨提示", "您已成功关注本商品！", true );
						me.removeClass("jjgou_tool_focus").addClass("jjgou_tool_focused").html( data.data ).attr("title", "取消关注");
					}else{ // 要取消，红心变灰
						myPOPUP( "温馨提示", "您已成功取消了关注！", true );
						me.removeClass("jjgou_tool_focused").addClass("jjgou_tool_focus").html( data.data ).attr("title", "关注本品");
					}
				}else{
					myPOPUP( "温馨提示", "服务器出错了，请刷新页面重试", true, function(){ location.reload(); });
				}
			}else{ // status为0时，未登录
				myPOPUP( "温馨提示", "要关注商品，请先登录系统。", true, function(){ location.href = login; });
			}
		},
		error: function( r ){
			stopLoading();
			myPOPUP( "系统提示", "网络异常，请刷新页面后再试！", true, function(){ location.reload(); });
		}
	});
});
// ======================================================================================== //
// 删除我的出价(未登录时，不会出现我的出价和删除我的出价的按钮)
jjgouDelMine.unbind("click").bind("click", function(){
	var me = $(this);
	var pid = me.attr("data-pid"),
		pname = me.attr("data-name"),
		pmyprice = me.attr("data-myprice"),
		delApi = me.attr("data-api");
	myPOPUP( pname, "您已出价 " + pmyprice + " 元，是否确定取消收购？", true, function(){
		startLoading();
		$.ajax({
			url: delApi,
			type: 'POST',
			data: { 'pid': parseInt( pid ) },
			dataType: 'json',
			success: function( data ){
				stopLoading();
				if( data.data ){
					var _data = parseInt( data.data );
					if( _data == 200 ){
						myPOPUP( pname, "您已成功取消收购该商品！", true );
					}else{
						myPOPUP( pname, "服务器出错，请重试！", true );
					}
					partRefresh( pid );
				}else{
					return false;
				}
			},
			error: function(r){
				stopLoading();
				myPOPUP( "系统提示", "网络异常，请刷新后再试！", true, function(){ location.reload(); });
			}
		}); //end ajax
	});
});

// ======================================================================================== //
// 局部刷新方法
function partRefresh( pid ){
	var div = $("#jjgLoop_" + pid);
	var refreshAPI = div.attr("data-refreshAPI"),
		inpChujia = $("#input_" + pid), // 出价输入框
		bidNum = $("#bidNum_" + pid), // 出价人数
		doneNum = $("#doneNum_" + pid), // 成交总量
		gzNum = $("#gzNum_" + pid), // 关注数量
		dq_price_b = $("#dq_price_" + pid), // 显示当前价的b元素
		firstBid = $("#firstBid_" + pid), // 当前价下面的第一个价格li
		secondBid = $("#secondBid_" + pid), // 当前价下面的第二个价格li
		donePrice = $("#donePrice_" + pid), // 成交价的容器
		done_price_b = $("#done_price_" + pid), // 显示成交价的b元素
		myPrice = $("#myPrice_" + pid), // 我的价格的容器
		my_price_b = $("#my_price_" + pid), // 显示我的价的b元素
		mydelbtn = $("#mydelbtn_" + pid), // 取消我的价格按钮
		yjPrice = $("#yjPrice_" + pid), // 显示易金直购价的容器
		yj_price_b = $("#yj_price_" + pid); // 显示易金直购价的b元素
	$.ajax({
		url: refreshAPI,
		type: 'POST',
		data: { 'pid': pid },
		dataType: 'json',
		success: function( data ){
			var intDqPrice = parseInt(data.dq_price_int); // 用于显示在出价输入框中的当前价，需要和步长做计算，无逗号
			var intDqPrice_str = data.dq_price; // 仅用于显示，不需要计算的当前价，有逗号
			inpChujia.val( intDqPrice + buChang(intDqPrice) ).attr("data-dqprice", intDqPrice);
			bidNum.html( data.bid_num );
			doneNum.html( data.done_num );
			gzNum.html( data.gz_num );
			dq_price_b.html( intDqPrice_str ).attr("data-dqprice", intDqPrice); // 显示带逗号的当前价，赋值不带逗号的当前价
			if( data.firstbidlog ){
				firstBid.show().find("b").html( data.firstbidlog );
			}else{
				firstBid.hide().find("b").html("");
			};
			if( data.secondbidlog ){
				secondBid.show().find("b").html( data.secondbidlog );
			}else{
				secondBid.hide().find("b").html("");
			};
			if( data.doneprice ){ // 如果有成交价
				donePrice.show();
				done_price_b.html( data.doneprice );
			}else{
				donePrice.hide();
				done_price_b.html("");
			};
			if( data.myprice ){ // 如果有我的出价
				myPrice.show();
				my_price_b.html( data.myprice ).attr("data-myprice", data.myprice_int ); // 赋值用整型_int，不带逗号
				mydelbtn.attr("data-myprice", data.myprice_int ); // 给[取消出价]按钮的属性赋值
			}else{
				myPrice.hide();
				my_price_b.html("").attr("data-myprice", "" );
				mydelbtn.attr("data-myprice", "" );
			};
		},
		error: function(){ return false; }
	}); // end ajax
}; // end part refresh

// ======================================================================================== //
// 有事您说话
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
			input.css("background", "#fff");
		}
	});
};
placeHolder( $(".jjgou_msg_pname"), $(".jjgou_msg_pname_pld") );
placeHolder( $(".jjgou_msg_pprice"), $(".jjgou_msg_pprice_pld") );
placeHolder( $(".jjgou_msg_textarea"), $(".jjgou_msg_textarea_pld") );
// 点击下拉选择一个品相
qgouSelPX.click(function(){
	if( qgouPXList.attr("data") == "fold" ){
		qgouPXList.slideDown(200).attr("data", "unfold");
	}else{
		qgouPXList.slideUp(200).attr("data", "fold");
	}
});
// 点击一个品相li选中の
var pxlis = qgouPXList.find("li");
pxlis.click(function(){
	var me = $(this);
	var pxVal = me.html();
	qgouPXShow.html( pxVal );
});
// 点击[我也要求购]
qgouSendBtn.click(function(){
	var login = $(this).attr("data-login"),
		nameval = qgouName.val(),
		pxval = qgouPXShow.html(),
		priceval = qgouPrice.val(),
		msgval = qgouMsg.val();
	if( g_Userid ){
		if( !nameval ){
			myPOPUP( "操作提示", "商品名称不能为空哦！", true, function(){ qgouName.focus(); } );
		}else if( !pxval ){
			myPOPUP( "操作提示", "您忘了选择品相哦！", true );
		}else if( !priceval ){
			myPOPUP( "操作提示", "请填写求购价格哦！", true, function(){ qgouPrice.focus(); } );
		}else if( !strP.test( priceval ) ){
			myPOPUP( "操作提示", "价格请必须填写正整数哦！", true, function(){ qgouPrice.focus(); } );
		}else{
			if( !msgval ){ msgval = ""; }
			$.ajax({
				url: '/AddBuy/AddMessage/',
				type: 'POST',
				data: {
					uid: g_Userid,
					name: nameval,
					price: priceval,
					desc: pxval,
					message: msgval
				},
				dataType: 'json',
				success: function(data){
					myPOPUP( "温馨提示", "您发送的加价购产品信息我们已经收到，易金在线会根据实际情况增加，感谢您的参与！" );
					resetQgou();
				},
				error: function(r){
					myPOPUP( "操作提示", "网络错误，请刷新页面重试。", true, function(){ location.reload(); } );
				}
			}); //end ajax
		}
	}else{ // 未登录
		myPOPUP( "系统提示", "请您先登录再操作", true, function(){ location.href = login; });
	}
});
// 求购表单重置
function resetQgou(){
	$(".jjg_inps").val("");
	qgouPXShow.html("");
	$(".jjg_plds").show();
};

// 鼠标滑过边框变化
$.fn.hoverBorder = function( duration, padding_w, padding_h ){
	var me = $(this); // 主语是本身带有边框的li元素或其他元素
	if( !padding_w && !padding_h ){
		var width = me.width(),
			height = me.height(); // 算上边框
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
	imstupid.hoverBorder( 300 );
};



// ============================================================================================ //
// THE END
})();
