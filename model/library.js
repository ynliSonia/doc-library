
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var PSD = require('psd');
var PdfImage = require('pdf-image');

var Promise = require('bluebird');
var Office2Html = require('./common/office2html');

var dataPath = path.resolve(__dirname, '../DB/task.json');
var groupPath = path.resolve(__dirname, '../DB/group.json');
var publick = path.resolve(__dirname, '../DB/publick/');
var qrcodeDir = path.resolve(__dirname, '../DB/qrcode/');

var officePath = path.resolve(__dirname, '../DB/offices');
var exec = require('child_process').exec;


var helper = require('../helper');
var db = helper.db;
var dbName = 'libraries';

// 设置默认图片
function setDefaultImg(extName) {
	var imgPath = '';
	switch(extName) {
		case 'zip':
		imgPath = '/docs/default/zip.png';
		break;
		case 'doc':
		case 'docx':
		imgPath = '/docs/default/word.png';
		break;
		case 'xls':
		case 'xlsx':
		case 'xlsm':
		case 'xltx':
		case 'xlsb':
		imgPath = '/docs/default/excel.png';
		break;
		case 'ppt':
		case 'pptx':
		imgPath = '/docs/default/default.png'
		break;
	}

	return imgPath;
}

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
		fs.existsSync('../DB/test.png');
	});
}

// 自定义，判断某个值是否在列表中
function inArray(value, list) {
	var listLen = list.length;
	var flag = false;
	for(var i = 0; i < listLen; i++) {
		if(value === list[i]) {
			flag = true;
			break;
		}
	}
	return flag;
}

function generatorQRCode(text, qrcodePath, callback) {

	qrcode({
	  text: text,
	  size: 200,
	  qrcodePath: qrcodePath,
	  browser: 'chrome'
	}).then(function(qrcodePath) {
	 	callback && callback(qrcodePath);  // balabala/node-qrcode/qrcode.png
	});
}

// 查找
exports.find = function(query) {
	db = helper.db;
	
	return db.find(dbName, query);
}

// 增加新的文档
exports.add = function(req, res) {

	db = helper.db;
	var self = this;
	var form = new formidable.IncomingForm();
	form.encoding = 'utf-8';   // 设置编码
	form.uploadDir = path.resolve(__dirname, '../DB/publick/');	// 设置文件的保存地址
	form.keepExtensions = true;  //  保留后缀
	form.maxFieldsSize = 2 * 1024 * 1024;   // 最大的文件大小
	form.multiples = true;

	return new Promise(function(resolve, reject) {
		form.parse(req, function(err, fields, files) {

			if(err) {
				reject('系统错误');
				return ;
			}

			// 根据类型确定文件的后缀名
			var extName = '';  //后缀名
			var docLength = files.docs.length;
			var docsList = docLength ? files.docs : [files.docs];
			docLength = docLength || 1;
			var doc;

			for(var i = 0; i < docLength; i++) {

				(function(i){
					doc = docsList[i];
					var name = doc.name; //.substring(0, doc.name.lastIndexOf("."));
					extName = doc.name.substring(doc.name.lastIndexOf(".") + 1).toLowerCase();
					var extList = ['jpg', 'jpeg', 'png', 'gif', 'psd', 'pdf', 'doc', 'docx', 'zip', 'rar', 'gzip', 'xlsx', 'xls', 'xlsm', 'xltx', 'xlsb', 'ppt', 'pptx', 'txt'];
					if(!inArray(extName, extList)) {
						reject('暂时不支持该类型文件的上传');
						return ;
					}
				    // 判断后缀名是否正确， 如果不正确则不写入数据库
				    if(extName === '') return false;
				    var avatarName = new Date().getTime() + i;

			    	var newPath = form.uploadDir + '/' + avatarName + '.' + extName;
			    	var pngPath = form.uploadDir + '/' + avatarName + '.' + 'png';

			    	// 把源文件传入
			    	fs.renameSync(doc.path, newPath);
					var officeList = ['doc', 'docx', 'xlsx', 'xls', 'xlsm', 'xltx', 'xlsb'];

			    	// 把 PSD文件转为 png 存储，方便查看

			    	if(extName === 'psd'){
				    	psdToPng(newPath, pngPath);
			   		}
			   		if(extName === 'pdf') {
			   			pdfToImage(newPath, pngPath);
			   		}

					if(inArray(extName, officeList)) {
						Office2Html.convertToHtml(newPath);

					}

					if(extName === 'ppt' || extName === 'pptx') {
						Office2Html.convertToPdf(newPath);
					}
			   		(function(name, i, extName){

				   		self.find({})
				   			.then(function(libraries) {
				   				libraries.sort(function(a, b) {
				   					return a.id < b.id ? 1 : -1;
				   				});

				   				var id = libraries[0] ? parseInt(libraries[0].id) + 1 + i : 1000000;
				   				if(!libraries[0]) {
				   					id = 1000000 + i;
				   				}
				   				var docPath = '/docs/publick/' + avatarName + '.' + extName;

								var convertPath = ''; 

								if(extName === 'psd') {
									docPath = '/docs/publick/' + avatarName + '.png';
								}
								if(extName === 'pdf') {
									docPath = '/docs/publick/' + avatarName + '-0.png';
								}

								if(inArray(extName, officeList)) {
									convertPath = '/docs/offices/' + avatarName + '.html';
								}
								if(extName === 'ppt' || extName === 'pptx') {
									convertPath = '/docs/offices/' + avatarName + '.pdf';
								}

								if(setDefaultImg(extName) !== '') {
									docPath = setDefaultImg(extName);
								}
								// generatorQRCode('http://172.16.11.98:8181/detail/' + id, qrcodeDir + '/qrcode_' + avatarName + '.png', function(qrcodePath) {
								// 	// fs.renameSync('/docs/qrcode/qrcode_' + avatarName + '.png', qrcodePath);
								// 	var item = {
								// 		id: id,
								// 		docPath: docPath,
								// 		download: '/docs/publick/' + avatarName + '.' + extName,
								// 		director_id: fields.director_id,
								// 		name: name,
								// 		qrcodePath: '/docs/qrcode/qrcode_' + avatarName + '.png'
								// 	}

								// 	db.insert(dbName, item);
								// 	if(i === docLength - 1) {
								// 		res.redirect('/doc-list/' + fields.director_id);
								// 	}
								// })
								var item = {
										id: id,
										docPath: docPath,
										download: '/docs/publick/' + avatarName + '.' + extName,
										director_id: fields.director_id,
										times: new Date(),
										name: name,
										convert_path: convertPath

									}

									db.insert(dbName, item);
									if(i === docLength - 1) {
										resolve(fields.director_id);
									}
				   			})
				   		})(name, i, extName);
				})(i)
			}
		});
	})
	

}

// 添加文件夹
exports.addDirector = function(req) {
	
}

exports.delete = function(req) {
	db = helper.db;
	var self = this;
	var libraryId = parseInt(req.params.id);
	return new Promise(function(resolve, reject) {
	   self.find({id: libraryId})
	    .then(function(libraryItem) {
		if(libraryItem.length <= 0) return ;
		db.remove(dbName, {id: libraryId})
		   .then(function() {
			var downloadFile = path.resolve(__dirname, '../DB') + libraryItem[0].download.substring(5);
			var docFile = path.resolve(__dirname, '../DB') + libraryItem[0].docPath.substring(5);
			exec('rm -f ' + downloadFile);
			if(docFile.indexOf('/default/')) {
				 exec('rm -f ' + docFile);
			}
		
			resolve();
		   });
	    });
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



