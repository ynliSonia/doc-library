
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var helper = require('../helper');
var PSD = require('psd');
var Promise = require('bluebird');

var dbName = 'groups';
var db = helper.db;
var dataPath = path.resolve(__dirname, '../DB/task.json');
var groupPath = path.resolve(__dirname, '../DB/group.json');
var publick = path.resolve(__dirname, '../DB/publick/');

function psdToPng(newPath, pngPath) {
	PSD.open(newPath).then(function(psd) {
		var result = psd.image.saveAsPng(pngPath);
		fs.renameSync(pngPath, result);
	});
}

// 组内信息查询
exports.find = function(query) {
	var db = helper.db;
	return db.find(dbName, query);
}


// 修改组信息
exports.update = function(query, newData) {
	var db = helper.db;
	return db.update(dbName, query, newData);
}
// 增加新的组
exports.change = function(req, type) {
	var db = helper.db;
	// var groupsObj = fs.readFileSync(groupPath, 'utf-8');
	var self = this;
	var form = new formidable.IncomingForm();
	form.encoding = 'utf-8';   // 设置编码
	form.uploadDir = path.resolve(__dirname, '../DB/photos/');	// 设置文件的保存地址
	form.keepExtensions = true;  //  保留后缀
	form.maxFieldsSize = 2 * 1024 * 1024;   // 最大的文件大小

	return new Promise(function(resolve, reject) {
		form.parse(req, function(err, fields, files) {

			if(err) {
				reject(-1, '系统错误');   // -1 系统错误
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
		
	    	if(extName === '' && (type === 'edit' && files.photo.size > 0)) {
	    		reject(-2, '不支持该类型的文件');
	    		return ;
	    	}
	    	var avatarName = new Date().getTime();

    		var newPath = form.uploadDir + '/' + avatarName + '.' + extName;

	    	// 把源文件传入
	    	fs.renameSync(files.photo.path, newPath);

			// var id = 10000 + 3;
		if(type === 'add') {
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
				resolve();
			  })
		} else {
			var groupId = parseInt(fields.groupId);
			self.find({id: groupId})
				.then(function(groups) {
					if(groups.length <= 0) return ;
					var newData = groups[0];
					newData.name = fields.name;
					newData.identity = fields.identity;
					if(files.photo.size > 0){
						 newData.photo = '/docs/photos/' + avatarName + '.' + extName;
					}
				
					self.update({id: groupId}, newData);
					resolve();
				});
		}
		});
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
