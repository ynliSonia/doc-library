var exec = require('child_process').exec;
var promise = require('bluebird');
var path = require('path');
var outdir = path.resolve(__dirname, '../../DB/offices');

module.exports = {
	convertToHtml: function(fileName, resolve, reject) {
		return new Promise(function(resolve, reject){
			exec('libreoffice --headless --convert-to html --outdir ' + outdir + fileName, function(err){
				if(err) {
					reject();
					return ;
				}
				resolve();
			});
		});
	}
}
