var webpack = require('webpack');
// var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {

    // 插件列表
    // plugins: [commonsPlugin],

    // 需要编译的文件
    entry: {
        path: './statics/src/',
        index: './*/index.js'
    },

    // 文件输出
    output: {
        path: './statics/build/',
        filename: '[name].js'
    },

    // 依赖的模块，用!连接多个模块
    module: {
        loaders: [
            { test: /\.coffee$/, loader: "coffee-loader" }
        ]
    },

    // 定义扩展名和其他的 config 文件等
    resolve: {
        extensions: ['', '.js', '.css', '.json', 'less']
    }
}