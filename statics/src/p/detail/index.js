
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
	},

	setStyle: function() {

		console.log(isPC());
		// 如果不是 PC 的话
		if(!isPC()) {
			var window_wid = $(window).width();
			$('.library-detail img').width(window_wid);
		}
	}
}

new Detail();