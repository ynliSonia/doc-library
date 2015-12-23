var Group = require('../model/group');

exports.editGroup = function(req, res, next) {
	var groupId = req.params.id;
	Group.find(groupId)
		.then(function(groups){
		var group = groups[0];
		res.render('edit-group', {title: "编辑分组", pageName: 'add-doc', id: groupId, name: group.name, identity: group.identity, photo: group.photo});
	});

};

exports.editTheGroup = function(req, res, next) {
	res.redirec('/');
}
