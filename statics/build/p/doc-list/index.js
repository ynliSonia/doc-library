"use strict";

(function e(t, n, r) {
	function s(o, u) {
		if (!n[o]) {
			if (!t[o]) {
				var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw (f.code = "MODULE_NOT_FOUND", f);
			}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
				var n = t[o][1][e];return s(n ? n : e);
			}, l, l.exports, e, t, n, r);
		}return n[o].exports;
	}var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) s(r[o]);return s;
})({ 1: [function (require, module, exports) {

		// var add = require('./test.js');

		// console.log('all is :' + add(1, 2));

		var List = function List() {
			this.init();
		};

		List.prototype = {

			init: function init() {
				this.bindEvents();
			},

			bindEvents: function bindEvents() {
				$('.J_add_doc').on('click', function () {
					$('.J_doc_file').click();
				});

				$('.J_doc_file').on('change', function () {
					$('#J_doc_form').submit();
				});
				$('.J_show_ewm').on('mousemove', function (ev) {
					var $tar = $(ev.currentTarget);
					$tar.siblings('img').fadeIn();
				});
				$('.J_show_ewm').on('mouseleave', function (ev) {
					var $tar = $(ev.currentTarget);
					$tar.siblings('img').fadeOut();
				});
			}
		};

		new List();
	}, {}] }, {}, [1]);