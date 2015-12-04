
/**
 * helper methods
 */

'use strict';

var log4js = require('log4js');
var log = log4js.getLogger('hepler');
var _ = require('lodash');
var mongo = require('mongoskin');

var helper = {

	getLogger: function(name) {
		return log4js.getLogger(name);
	},

	_: _,

	toObjectID: mongo.helper.toObjectID,

	/**
	 * 异常处理
	 */
	handleError: function* (context, err, type) {

		if (err) {

			log.error(err);

			if (type === 'json') {
				// 异步接口异常
				context.body = {status: '-1', message: err.message}
			} else {
				context.status = 500;
				yield context.render('error', {err: err});
			}

		}

	}

};


module.exports = helper;