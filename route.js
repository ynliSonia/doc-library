
var express = require('express');
var router = express.Router();

var task = require('./controller/task');

// 列表页
router.get('/list/:id', task.list);

// 首页
router.get('/', task.index);
// 新增页面
router.get('/new/:id', task.new);

// 新增任务接口
router.post('/addItem', task.add);

// 删除某个文档
router.delete('/del/:id', task.del);

// 增加新的分组
router.get('/newgroup', task.newGroup);
// 新增分组接口
router.post('/addGroup', task.addGroup)

module.exports = router;