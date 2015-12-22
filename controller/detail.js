var Library = require('../model/library');
var PdfImage = require('pdf-image');
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var unoconv = require('unoconv2');

var PATH_CONF = path.resolve(__dirname, '../DB/');
var tmpPdf = path.resolve(__dirname, '../DB/');

// 方法列表
var Methors = {

	pdf2Image: function(newPath, resolve, reject) {

		var docPath = PATH_CONF + newPath.substring(5);
		var PDFImage = PdfImage.PDFImage;
		var pdfImage = new PDFImage(docPath);
		pdfImage.getInfo().then(function(info) {
			var imgList = [];
			for(var i = 0; i <= info["Pages"]; i++){
			 	(function(i) {
			       pdfImage.convertPage(i).then(function(imagePath) {

						var img_buffer = new Buffer(fs.readFileSync(imagePath));
						var img_base = 'data:image/png;base64,' + img_buffer.toString('base64');
						imgList.push(img_base);
						if(i === info["Pages"]  - 1) {
							resolve(imgList);
						}
					});
			   })(i);
    		}
		});
	},
	office2Pdf: function(newPath, resolve, reject) {
		var self = this;
		var docPath = PATH_CONF + newPath.substring(5);
		unoconv.convert(docPath, 'pdf', function(err, result) {

			if(err) {
				reject();
				return;
			}
			fs.writeFile(tmpPdf + '/temp.pdf', result);
			self.pdf2Image(tmpPdf + '/temp.pdf', resolve);
		});
	}
}

// 详情预览
exports.review = function(req, res, next) {

	var docId = parseInt(req.params.id);

	Library.find({id: docId})
		   .then(function(detail) {
		   	var docPath = detail ? detail[0].docPath : '';
		   	var extName = detail[0].download.substring(detail[0].download.lastIndexOf(".") + 1).toLowerCase();
		    var docList = [];
		   	if(extName === 'pdf') {
		   		Methors.pdf2Image(detail[0].download, function(imgList) {

		   			res.render('detail', {title: '详情', pageName: 'detail', list: imgList});
		   		});
		   		return ;
		   	} else if(extName === 'xlsx') {
		   		Methors.office2Pdf(detail[0].download, function(imgList) {
		   			res.render('detail', {title: '详情', pageName: 'detail', list: imgList});
		   		}, function() {
		   			docList.push(docPath);
		   			res.render('detail', {title: '详情', pageName: 'detail', list: docList});
		   		});
		   		return ;
		   	} else {
		   		docList.push(docPath);
		   		res.render('detail', {title: '详情', pageName: 'detail', list: docList});
		   	}
	});
}