
/*
 ** todo: browserify
*/

var path = require('path');
var fs = require('fs');
var connect = require('gulp-connect');

var gulp = require('gulp');
var babel = require('gulp-babel');
var rimraf = require('gulp-rimraf');
var autoprefixer = require('gulp-autoprefixer');
var gutil = require('gulp-util');
var reactify = require('reactify');

var browserify = require('browserify');
var globby = require('globby');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename');
var streamify = require('gulp-streamify');

// js 压缩
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var less = require('gulp-less');

// 资源地址

var SRC_BASE = './statics/src';
var BUILD_BASE = './statics/build';

var SCRIPTS = SRC_BASE + '/p/*/index.js';

var LIB_BASE = [SRC_BASE + '/c/lib/*.js', SRC_BASE + '/c/lib/*.css'];

// clean
gulp.task('clean', function() {
	gulp.src(BUILD_BASE, {read: false})
		.pipe(rimraf({force: true}));
});

// css 压缩
// gulp.task('css', function() {

// 	gulp.src(SRC_BASE + '/**/*.css')
// 		.pipe(autoprefixer())
// 		.pipe(minify())
// 		.pipe(gulp.dest(BUILD_BASE));
// });

// js 打包
gulp.task('script', function() {

	gulp.src(SRC_BASE + '/**/*.js')
		.pipe(babel())
		.pipe(uglify())
		.pipe(gulp.dest(BUILD_BASE));
});

// js 打包 browserify 版
gulp.task('js', function() {

	var isError = false;

	globby([SCRIPTS], function(err, filePaths) {

		if(err) {
			gutil.log('globby error');
			return ;
		}

		// 打包压缩文件到 build
		
            
		// browserify 一次只能接受一个文件
		filePaths.forEach(function(filePath) {
		
			var pageNameReg = new RegExp(SRC_BASE + '\/p\/(.*)\/');
	        var pageName = filePath.match(pageNameReg)[1];

			browserify(filePath)
				.transform(reactify)
				.bundle()
				.on('error', function(err) {

					if(!isError) {
						gutil.log(err);
						isError = true;
					}
				})
				.pipe(source('index.js'))
				.pipe(streamify(babel()))
				.pipe(gulp.dest(BUILD_BASE + '/p/' + pageName))
				.pipe(buffer())
				.pipe(uglify())
				.pipe(rename({
					suffix: '.min'
				}))
				.pipe(gulp.dest(BUILD_BASE + '/p/' + pageName))
		})
	});
});

// less编译 及 打包
gulp.task('less', function() {

	gulp.src(SRC_BASE + '/**/*.less')
		.pipe(less({
      			paths: [ path.join(__dirname, 'less', 'includes') ]
    		}).on('error', function(err){
    			gutil.log(err);
    		}))
		.pipe(minify())
		.on('error', function(err) {
			gutil.log(err);
		})
		.pipe(gulp.dest(BUILD_BASE));

});

// copy 
gulp.task('lib', function() {

	gulp.src(LIB_BASE)
		.pipe(gulp.dest(BUILD_BASE + '/lib'));
});

// dev
// gulp.task('dev', function() {

// 	connect.server({
// 		root: '.',
// 		port: 8181,
// 		livereload: true
// 	});
// });

// watch
gulp.task('watch', function() {

	gulp.watch(SRC_BASE + '/**/*', ['default']);
	
});

gulp.task('default', ['js', 'less', 'lib']);

