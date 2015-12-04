

// var add = require('./test.js');

// console.log('all is :' + add(1, 2));

var List = function() {
	this.init();
}

List.prototype = {

	init: function() {
		this.bindEvents();
	},

	bindEvents: function() {
		$('.J_add_doc').on('click', function() {
			$('.J_doc_file').click();
		});

		$('.J_doc_file').on('change', function() {
			$('#J_doc_form').submit();
		});
	}
}

new List();