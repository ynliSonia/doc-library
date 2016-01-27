var Group = require('../model/group');
var Director = require('../model/director');
var formidable = require('formidable');
exports.editGroup = function(req, res, next) {

	var groupId = parseInt(req.params.id);
	Group.find({id: groupId})
		.then(function(groups){
		var group = groups[0];
		res.render('edit-group', {title: "编辑分组", pageName: 'add-doc', id: groupId, name: group.name, identity: group.identity, photo: group.photo});
	});

};

exports.editTheGroup = function(req, res, next) {
	Group.change(req, 'edit')
		.then(function(){
			res.redirect('/');
		}, function(err) {
			res.json({"status": 0, "text": "分组信息修改失败"});
		})

}

// 渲染编辑文件夹的页面
exports.editDirector = function(req, res, next) {

	var directorId = parseInt(req.params.id);
	Director
		.find({id: directorId})
		.then(function(directors) {
			var director = directors[0];
			res.render('edit-director', {title: "编辑文件夹", pageName: 'add-doc', id: directorId, name: director.name, desc: director.desc, cover_img: director.cover_img});
	});
}

// 修改文件夹信息的接口
exports.editTheDirector = function(req, res, next) {
	Director.change(req)
		.then(function(author_id) {
			res.redirect('/list/' + author_id);
		}, function(err) {
			res.json({"status": 0, "text": "分组信息修改失败"});
		});
}

