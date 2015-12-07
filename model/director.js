
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var PSD = require('psd');
var PdfImage = require('pdf-image');

var dataPath = path.resolve(__dirname, '../DB/task.json');
var groupPath = path.resolve(__dirname, '../DB/group.json');
var publick = path.resolve(__dirname, '../DB/publick/');

var helper = require('../helper');
var db = helper.db;
var dbName = 'directors';

function psdToPng(newPath, pngPath) {
	PSD.open(newPath).then(function(psd) {
		var result = psd.image.saveAsPng(pngPath);
		fs.renameSync(pngPath, result);
	});
}
// 查找
exports.find = function(query) {
	db = helper.db;
	return db.find(dbName, query);
}

// 增加新的文件夹
// 文件夹的 id 从 10万起
exports.add = function(req, res) {

	db = helper.db;
	// var taskObj = fs.readFileSync(dataPath, 'utf-8');
	var self = this;
	var form = new formidable.IncomingForm();
	form.encoding = 'utf-8';   // 设置编码
	form.uploadDir = path.resolve(__dirname, '../DB/publick/');	// 设置文件的保存地址
	form.keepExtensions = true;  //  保留后缀
	form.maxFieldsSize = 2 * 1024 * 1024;   // 最大的文件大小

	form.parse(req, function(err, fields, files) {

		if(err) {
			console.log(err);
			return false;
		}

		// 根据类型确定文件的后缀名
		var extName = '';  //后缀名
	    switch (files.cover_img.type) {
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
	      case 'image/vnd.adobe.photoshop':
	       	extName = 'psd';
	       	break;
	      case 'image/gif':
	      	extName='gif';
	      	break;
	    }

	    // 判断后缀名是否正确， 如果不正确则不写入数据库
	    if(extName === '') return false;
	    var avatarName = new Date().getTime();

    	var newPath = form.uploadDir + '/' + avatarName + '.' + extName;
    	var pngPath = form.uploadDir + '/' + avatarName + '.' + 'png';

    	// 把源文件传入
    	fs.renameSync(files.cover_img.path, newPath);

    	// 把 PSD文件转为 png 存储，方便查看

    	if(extName === 'psd'){
	    	psdToPng(newPath, pngPath);
   		}

   		self.find({})
   			.then(function(directors) {
   				directors.sort(function(a, b) {
   					return a.id < b.id ? 1 : -1;
   				});
   				var id = directors[0] ? directors[0].id + 1 : 100000;
   				var times = new Date();
   				var docPath = '/docs/publick/' + avatarName + '.' + extName;

				if(extName === 'psd' || extName === 'pdf') {
					docPath = '/docs/publick/' + avatarName + '.png';
				}

				var item = {
					id: id,
					times: times,
					name: fields.name,
					desc: fields.desc,
					cover_img: docPath,
					author_id: fields.author_id
				}

				db.insert(dbName, item);
				// return true;
				res.redirect('/list/' + fields.author_id);
   			})
	});

}

// 删除任务
exports.delItem = function(delId) {

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