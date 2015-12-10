
var task = require('../model/task');
var Group = require('../model/group');
var Library = require('../model/library');
var Director = require('../model/director');

// 首页
exports.index = function(req, res, next) {

	var groups = Group.find({});

	Group.find({})
		 .then(function(groups) {
		 	var len = groups.length;
		 	var timeObj;
		 	for(var i = 0;i< len; i++) {
		 		timeObj = new Date(groups[i].times);
		 		groups[i].times = timeObj.getFullYear() + '-' + (timeObj.getMonth()+1) + '-' + timeObj.getDate();
		 	}
		   	res.render('index', {title: '首页', pageName: 'home', list: groups});
		})
}

// 新增分组页面
exports.newGroup = function(req, res, next) {
	res.render('add-group', {title: '新建分组', pageName: 'add-doc'});
}


// 新增分组接口
exports.addGroup = function(req, res, next) {
	Group.add(req)
		.then(function() {
			res.redirect('/');
		}, function(status, text) {
			res.json({success: false, status: status, text: text});
		});
}

// 文件夹列表页面
exports.list = function(req, res, next) {

	var groupId = req.params.id;
	Director.find({author_id: groupId})
			.then(function(directors) {
				var len = directors.length;
			 	var libObj;
			 	for(var i = 0;i< len; i++) {
			 		libObj = new Date(directors[i].times);
			 		directors[i].times = libObj.getFullYear() + '-' + (libObj.getMonth()+1) + '-' + libObj.getDate();
			 	}
				res.render('list', {title: '首页', pageName: 'list', list: directors, id: groupId});
			})
}

// 新建文件夹
exports.newDirector = function(req, res, next) {
	res.render('new-director', {title: '新增', pageName: 'add-doc', id: req.params.id})
}
// 新增文件夹接口
exports.addDirector = function(req, res, next) {
	Director.add(req)
		.then(function(id) {
			res.redirect('/list/' + id);

		}, function(obj) {
			res.json({success: false, status: obj.status, text: obj.text});
		});
}

// 文档列表
exports.docList = function(req, res, next) {

	var director_id = req.params.id;
	Library.find({director_id: director_id})
		   .then(function(libraries) {
		   		res.render('doc-list', {title: '文档列表', pageName: 'doc-list', list: libraries, id: req.params.id})
		   })
}

// 新增文档页面
exports.new = function(req, res, next) {

	res.render('add', {title: '新增', pageName: 'add-doc', id: req.params.id});
}


// 新增文档接口
exports.addDoc = function(req, res, next) {

	// task.addItem(req, res);
	Library.add(req)
		.then(function(id) {
			res.redirect('/doc-list/' + id);
	}, function(text) {
		console.log(text);
		res.json({status: 0, text: 'text'});
	});
}

// 删除
exports.del = function(req, res, next) {

	var delId = req.params.id;
	var result = task.delItem(delId);

	if(result) {
		res.json({'status': 1});
		return ;
	}
	res.json({'status': 0});

}

// 详情预览
exports.detail = function(req, res, next) {

	var docId = parseInt(req.params.id);

	Library.find({id: docId})
		   .then(function(detail) {

		   	// console.log(detail.docPath);
		   	var docPath = detail ? detail[0].docPath : '';
		   	res.render('detail', {title: '详情', pageName: 'detail', docPath: docPath});
		   })
}