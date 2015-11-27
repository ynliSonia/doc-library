
var task = require('../model/task');

// 首页展示To Do List的列表
exports.list = function(req, res, next) {

	var groupId = parseInt(req.params.id);
	var listObj = task.readList();
	var list = [];
	if(listObj) {
		list = JSON.parse(listObj).list;
	}

	var result = [];
	var len = list.length;

	for(var i = 0; i < len; i++) {
		if(list[i].author_id == groupId) {
			result.push(list[i]);
		}
	}
	res.render('list', {title: '首页', pageName: 'list', list: result, id: groupId});
}

// 首页
exports.index = function(req, res, next) {

	// 文件读取
	var objs = task.readGroups();

	// 判断是否有数据，没有则写入默认数据
	if(objs) {
		var list = JSON.parse(objs).groups;
		res.render('index', {title: '首页', list: list, pageName: 'home'}); 
		return;
	}

	var defaulList = [
		{
			name: '名称',
			photo: '',
			id: -1
		}
	]
	res.render('index', {title: '首页', pageName: 'home', list: defaulList});
}

// 新增分组页面
exports.newGroup = function(req, res, next) {
	res.render('add-group', {title: '新建分组', pageName: 'add-doc'});
}

exports.addGroup = function(req, res, next) {
	task.addGroup(req);
	res.redirect('/');
}

// 新增页面
exports.new = function(req, res, next) {

	res.render('add', {title: '新增', pageName: 'add-doc', id: req.params.id});
}


// 新增
exports.add = function(req, res, next) {

	var item = req.body;

	task.addItem(req, res);
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

// 添加 psd
exports.addPsd = function(req, res, next) {
	var formData = req.body;
	task.addPsd(formData);
	res.redirect('/');
}