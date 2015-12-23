

// var add = require('./test.js');

// console.log('all is :' + add(1, 2));

var List = function() {
	this.init();
}

List.prototype = {

	init: function() {
		this.bindEvents();
		this.generatorQRCode();
	},

	bindEvents: function() {
		$('.J_add_doc').on('click', function() {
			$('.J_doc_file').click();
		});

		$('.J_doc_file').on('change', function() {
			$('#J_doc_form').submit();
		});
		$('.J_show_ewm').on('mousemove', function(ev) {
			var $tar = $(ev.currentTarget);
			$tar.siblings('.J_qrcode').fadeIn();
		});
		$('.J_show_ewm').on('mouseleave', function(ev) {
			var $tar = $(ev.currentTarget);
			$tar.siblings('.J_qrcode').fadeOut();
		})
	},

	generatorQRCode: function() {
		var qrcodes = $('.J_qrcode');
		var qrLen = qrcodes.length;
		var qrcodePath;
		for(var i = 0;i < qrLen; i++) {
			qrcodePath = 'http://127.0.0.1:8181' + $(qrcodes[i]).attr('data-url');
			$(qrcodes[i]).qrcode({
				text: qrcodePath,
				width: 100,
				height: 100
			});
		}
		$('.J_qrcode').qrcode()
	}
}

new List();