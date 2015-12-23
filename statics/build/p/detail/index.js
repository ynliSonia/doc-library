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

		// 判断是否是 PC
		function isPC() {
			var userAgentInfo = navigator.userAgent;
			var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
			var flag = true;
			for (var v = 0; v < Agents.length; v++) {
				if (userAgentInfo.indexOf(Agents[v]) > 0) {
					flag = false;
					break;
				}
			}
			return flag;
		}

		var Detail = function Detail() {
			this.init();
		};

		Detail.prototype = {

			init: function init() {
				this.setStyle();
				this.isSupportExt();
			},

			setStyle: function setStyle() {
				// 如果不是 PC 的话
				if (!isPC()) {
					var window_wid = $(window).width();
					$('.library-detail img').width(window_wid);
				}
			},

			isSupportExt: function isSupportExt() {
				var imgSrc = $('.library-detail img').attr('src');
				var extName = imgSrc.indexOf('/default/');
				var extList = ['png', 'jpg', 'jpeg', 'gif'];
				if (imgSrc.indexOf('/default/') < 0) {
					return;
				}
				$('.library-detail').html('<h2>很抱歉，暂时不支持该文档类型的预览~</h2>');
			}
		};

		new Detail();
	}, {}] }, {}, [1]);