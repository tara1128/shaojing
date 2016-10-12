/*
* scripts for miwifi WAP version
* Latest modified 2014-10-10 17:15
*/
$(document).ready(function(){

	//首页点击视频介绍
	var videoURL = "http://player.youku.com/embed/XNjQ4NzMwMzky";
	$("#wapVideo").click(function(){
		$(".Pop").show().find(".rls").attr("src", videoURL);
	});

	//下载页Tab的点击
	function tabHideAll(){
		$(".wapTabLi a").removeClass("waptabActive");
		$(".wapTabLi p").removeClass("waptabPActive");
		$(".wapTabLi s").addClass("wapHide");
		$(".wapCons").removeClass("wapShow").addClass("wapHide");
	};
	$(".wapTabLi").click(function(){
		var me = $(this);
		var token = me.attr("data");
		tabHideAll();
		me.find("a").addClass("waptabActive"); //Tab对应的图标
		me.find("p").addClass("waptabPActive"); //Tab对应的标题文字
		me.find("s").removeClass("wapHide"); //Tab对应的小箭头
		$(".wapCon_" + token).removeClass("wapHide").addClass("wapShow");
	});
	//下载页 点击[更新日志]时，在弹窗里显示最新日志
	$(".seelog").click(function(){
		var me = $(this);
		var token = me.attr("data");
		var logTitle = $(".popTitle");
		var logCon = $(".logContent");
		$(".Pop").show();
		var datas = logDatas[token]; //根据token拿到对应的日志，包括标题和内容
		logTitle.html( datas[0] ); //展示对应标题
		logCon.html( datas[1] ); //展示对应日志
	});
	//点击关闭弹窗
	$(".popClose").click(function(){
		$(".Pop").find(".rls").attr("src", "");
		$(".Pop").hide();
	});
	



});

