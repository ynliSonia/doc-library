
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var dbName = 'groups';
var helper = require('../helper');
var db = helper.db;
var dataPath = path.resolve(__dirname, '../DB/task.json');
var groupPath = path.resolve(__dirname, '../DB/group.json');
var publick = path.resolve(__dirname, '../DB/publick/');

// 组内信息查询
exports.find = function(query) {
	var db = helper.db;
	return db.find(dbName, query);
}

// 增加新的组
exports.add = function(req) {
	var db = helper.db;
	// var groupsObj = fs.readFileSync(groupPath, 'utf-8');
	var self = this;
	var form = new formidable.IncomingForm();
	form.encoding = 'utf-8';   // 设置编码
	form.uploadDir = path.resolve(__dirname, '../DB/photos/');	// 设置文件的保存地址
	form.keepExtensions = true;  //  保留后缀
	form.maxFieldsSize = 2 * 1024 * 1024;   // 最大的文件大小

	form.parse(req, function(err, fields, files) {

		if(err) {
			console.log(err);
			return ;
		}

		// 根据类型确定文件的后缀名
		var extName = '';  //后缀名
	    switch (files.photo.type) {
	      case 'image/pjpeg':
	        extName = 'jpg';
	        break;
	      case 'image/jpeg':
	        extName = 'jpg';
	        break;
	      case 'image/png':
	        extName = 'png';
	        break;
	      case 'image/x-png':
	        extName = 'png';
	        break;
	      case 'image/gif':
	      	extName='gif';
	      	break;
	    }

	    if(extName === '') return ;
	    var avatarName = new Date().getTime();

    	var newPath = form.uploadDir + '/' + avatarName + '.' + extName;

    	// 把源文件传入
    	fs.renameSync(files.photo.path, newPath);

		// var id = 10000 + 3;
		self.find({})
		  .then(function(groups) {
		  	groups.sort(function(a, b) {
		  		return a.id < b.id ? 1 : -1;
		  	});
		  	var id = groups[0] ? groups[0].id + 1 : 10000;
		  	var times = new Date();

			var item = {
				name: fields.name,
				identity: fields.identity,
				photo: '/docs/photos/' + avatarName + '.' + extName,
				id: id,
				times: times
			}

			db.insert('groups', item);
		  })
	});
}

// 删除组
exports.delGroup = function(delId) {

	var taskObj = fs.readFileSync(dataPath, 'utf-8');

	var list = JSON.parse(taskObj).list;
	var len = list.length;

	var flag = false;

	for(var i = 0; i < len ; i++) {

		if(list[i].id == delId) {

			list.splice(i, 1);
			flag = true;
			break;
		}

	}

	var result = {
		list: list
	};

	fs.writeFileSync(dataPath, JSON.stringify(result), {encoding: 'utf8'});
	return flag;
}
// 编辑组