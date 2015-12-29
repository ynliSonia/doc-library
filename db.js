var mongo = require('mongoskin');

var Promise = require('bluebird');

var helper = require('./helper.js');
var config = {

	host: '127.0.0.1',
	port: '27017',
	dbName: 'library'
};

var log = helper.getLogger('db');
exports.connect = function(callback) {

	if (helper.db) {
		callback(null, helper.db);
	}
	log.info('连接数据库', config.dbName);

	var db = mongo.db('mongodb://' + config.host + ':' + config.port + '/' + config.dbName + '?auto_reconnect=true&poolSize=3', {native_parse: true});

	init(db)
	  .then(function() {
	  	callback(null, db);
	  })
	  .catch(function(err) {
	  	callback(err);
	  });
};

function init(db, callback) {
	WrapperDbMethodByPromise(db);
	return db
	  .find('groups', {})
	  .then(function(data) {
	  	log.info('数据库连接成功');

	  	if(data && data.length > 0) {
	  		log.debug('users 已经初始化');
	  	} else {
	  		// db.insert('groups', {
	  		// 	name: 'test',
	  		// 	photo: '',
	  		// 	times: '2015-12-03',
	  		// 	id: -1,
	  		// 	identify: 'admin'
	  		// })
	  	}
	 });
}
function WrapperDbMethodByPromise(db) {
	db.find = function(dbName, query) {
		// if(query._id) {
		// 	query._id = helper.toObjectID(quert._id);
		// }

		return new Promise(function(resolve, reject) {
			db.collection(dbName).find(query).toArray(function(err, data) {
				return err ? reject(err) : resolve(data);
			});
		});
	};
	db.insert = function(dbName, rowData) {
		return new Promise(function(resolve, reject) {

      		db.collection(dbName).insert(rowData, function(err, data) {
       		return err ? reject(err) : resolve(data);
      		});

    	})
	};

	db.update = function(dbName, query, newData) {
		if (query._id) {
	      query._id = helper.toObjectID(query._id);
	    }

	    return new Promise(function(resolve, reject) {

	      db.collection(dbName).update(query, newData, function(err) {
	        return err ? reject(err) : resolve();
	      });

	    });
	};

	db.remove = function(dbName, query) {
	//if (query._id) {
	  //    query._id = helper.toObjectID(query._id);
	   // }

	    return new Promise(function(resolve, reject) {
		
	      db.collection(dbName).remove(query, function(err) {
	        err ? reject(err): resolve();
	      });
	    });
	}
}





