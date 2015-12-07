
// 判断是否是 PC
function isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

var Detail = function() {
	this.init();
}

Detail.prototype = {

	init: function() {
		this.setStyle();
		this.isSupportExt();
	},

	setStyle: function() {
		// 如果不是 PC 的话
		if(!isPC()) {
			var window_wid = $(window).width();
			$('.library-detail img').width(window_wid);
		}
	},

	isSupportExt: function() {
		var imgSrc = $('.library-detail img').attr('src');
		var extName = imgSrc.indexOf('/default/');
		var extList = ['png', 'jpg', 'jpeg', 'gif'];
		if(imgSrc.indexOf('/default/') < 0) {
			return ;
		}
		$('.library-detail').html('<h2>很抱歉，暂时不支持该文档类型的预览~</h2>');

	}
}

new Detail();