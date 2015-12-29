var Group = require('../model/group');
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
