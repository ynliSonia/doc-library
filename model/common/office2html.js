var exec = require('child_process').exec;

var path = require('path');
var outdir = path.resolve(__dirname, '../../DB/offices');

module.exports = {
	convertToHtml: function(fileName, resolve, reject) {
	
		
		exec('/usr/bin/libreoffice --headless --convert-to html --outdir ' + outdir + ' ' + fileName, function(err){
				if(err) {
					reject();
					return ;
				}
				resolve && resolve();
			});
	
	}
}
