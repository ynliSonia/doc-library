
var express = require('express');
var router = express.Router();
var task = require('./controller/task');

// 首页
router.get('/', task.index);

// 增加新的分组
router.get('/newgroup', task.newGroup);

// 新增分组接口
router.post('/addGroup', task.addGroup)

// 文件夹列表页
router.get('/list/:id', task.list);
// 新建文件夹页面
router.get('/new-director/:id', task.newDirector);

// 新建文件夹接口
router.post('/addDirector', task.addDirector);

// 新增文档页面
router.get('/new/:id', task.new);

// 文档列表页面
router.get('/doc-list/:id', task.docList);
// 新增文档接口
router.post('/addItem', task.addDoc);

// 删除某个文档
router.delete('/del/:id', task.del);

// 详情预览页
router.get('/detail/:id', task.detail);

module.exports = router;