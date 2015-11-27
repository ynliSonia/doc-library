
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var PSD = require('psd');
var PdfImage = require('pdf-image');

var dataPath = path.resolve(__dirname, '../DB/task.json');
var groupPath = path.resolve(__dirname, '../DB/group.json');
var publick = path.resolve(__dirname, '../DB/publick/');


// psd 图片转换为 png
function psdToPng(newPath, pngPath) {
	PSD.open(newPath).then(function(psd) {
		var result = psd.image.saveAsPng(pngPath);
		fs.renameSync(pngPath, result);
	});
}

// pdf 文件转化为图片;
function pdfToImage(newPath, pngPath) {
	var PDFImage = PdfImage.PDFImage;
	var pdfImage = new PDFImage(newPath);
	pdfImage.convertPage(0).then(function(imagePath) {

		console.log(imagePath);
		fs.existsSync(pngPath);
	});
}

// 读取文件中的值
exports.readList = function() {

	var list = fs.readFileSync(dataPath, 'utf-8');

	return list;
}

// 读取分组列表的信息
exports.readGroups = function() {
	var groups = fs.readFileSync(groupPath, 'utf-8');
	return groups;
}

// 增加新的任务
exports.addItem = function(req, res) {

	var taskObj = fs.readFileSync(dataPath, 'utf-8');

	var form = new formidable.IncomingForm();
	form.encoding = 'utf-8';   // 设置编码
	form.uploadDir = path.resolve(__dirname, '../DB/publick/');	// 设置文件的保存地址
	form.keepExtensions = true;  //  保留后缀
	form.maxFieldsSize = 2 * 1024 * 1024;   // 最大的文件大小

	form.parse(req, function(err, fields, files) {

		if(err) {
			console.log(err);
			return ;
		}

		// 根据类型确定文件的后缀名
		var extName = '';  //后缀名
	    switch (files.ppt_cont.type) {
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
	      case 'application/pdf':
	      	extName = 'pdf';
	      	break;
	    }

	    // 判断后缀名是否正确， 如果不正确则不写入数据库
	    if(extName === '') return;
	    var avatarName = new Date().getTime();

    	var newPath = form.uploadDir + '/' + avatarName + '.' + extName;
    	var pngPath = form.uploadDir + '/' + avatarName + '.' + 'png';

    	// 把源文件传入
    	fs.renameSync(files.ppt_cont.path, newPath);

    	// 把 PSD文件转为 png 存储，方便查看

    	if(extName === 'psd'){
	    	psdToPng(newPath, pngPath);
   		}
   		if(extName === 'pdf') {
   			pdfToImage(newPath, pngPath);
   		}

		var list = [];
		if(taskObj) {
			list = JSON.parse(taskObj).list;
		}
		var Time = new Date();
		var times = Time.getFullYear() + '-' + (Time.getMonth() + 1) + '-' + Time.getDate();
		var len = list.length;
		var id = len > 0 ? list[len - 1].id + 1 : 1;

		var docPath = '/docs/publick/' + avatarName + '.' + extName;

		if(extName === 'psd' || extName === 'pdf') {
			docPath = '/docs/publick/' + avatarName + '.png';
		}

		var item = {
			id: id,
			times: times,
			name: fields.name,
			desc: fields.desc,
			docPath: docPath,
			author: fields.author,
			author_id: fields.author_id
		}
		list.push(item);

		var result = {
			list: list
		};
		fs.writeFileSync(dataPath, JSON.stringify(result), {encoding: 'utf8'});
		res.redirect('/list/' + fields.author_id);
	});

}

// 增加新的组
exports.addGroup = function(req) {
	var groupsObj = fs.readFileSync(groupPath, 'utf-8');

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

    	// 写入文件中
		var groups = [];
		if(groupsObj) {
			groups = JSON.parse(groupsObj).groups;
		}
		var id = 10000 + groupsObj.length;
		var times = new Date();

		var item = {
			name: fields.name,
			identity: fields.identity,
			photo: '/docs/photos/' + avatarName + '.' + extName,
			id: id,
			times: times
		}
		groups.push(item);

		var result = {
			groups: groups
		}
		fs.writeFileSync(groupPath, JSON.stringify(result), {encoding: 'utf8'});
	})
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