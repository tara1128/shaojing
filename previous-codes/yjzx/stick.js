/* 页面右侧紧靠窗口的悬浮框方法 */
/* Latest modified on 2014-11-18 14:23 */
$(document).ready(function(){
		$(".slideShort").mouseenter(function(){
			$(".slideLong").stop(true, true).css("right", "-156px");
			var me = $(this);
			var lg = me.parent().find(".slideLong");
			lg.animate({ right: 0 }, 250);
		});
		$(".slideLong").mouseleave(function(){
			var me = $(this);
			var me = $(this);
			var st = me.parent().find(".slideShort");
			me.animate({ right: "-156px" }, 250, function(){
				$(".slideLong").stop(true, true).css("right", "-156px");
			});
		});
});
