var TUILD = require('./../tuild').Tuild,

/**
 * HTML build/compressor for Tuild
 */
HTML = {
	
	__watch: false,
	
	/**
	 *  The HTML command lines
	 */
	commands:{
		
		'__default': '-min',
		
		'-h': function(){
			
			console.log(
				'Tuild HTML \n' + 
				'You can use one or more files, or one folder to point to the new html file. For example: \n' +
				'One file: tuild html old.html > new.min.html \n' +
				'Two or more files: tuild html file1.html|file2.html|fileN.html > new.min.html \n' + 
				'Folder: tuild html forder/ > new.html \n\n' + 
				
				'USAGE:\n' + 
				'tuild html -h --help -q --quiet -dev -min -minifield --watch -h --help [file > file] [file1|file2|fileN > file] [folder > file] \n\n' +
				'-h, --help				print this help info \n' + 
				'-q, --quiet			silence warnings and status messages during compilation \n' + 
				'-dev					create a file with only the development version of one code (no minifield code). Is like a join files \n' +
				'-min					DEFAULT OPTION. create a file with the minifield code of your html files \n' + 
				'-minifield				only return the html code minifield. None file is created/edited \n' + 
				'--watch				watch the file(s)/folder to automatically change the target html file. Press CMD+C or CTRL+C to unwatch and exit the process'
			);
			
			return true;
		},
		
		'-minifield': function(src){
			
			var code = TUILD.read( TUILD.getFiles(src) );
			console.log( HTML.minifield(code) );
			
			return true;
		},
		
		'--watch': function(){
			HTML.__watch = true;				
		}
	},
	
	/**
	 * Minifield the HTML code
	 * @param [string] src
	 */
	minifield: function(src){

		/**
		 * MINIFY the HTML CODE
		 */	
		src = src
			.replace(/<!--.*?-->/gm, '') // Comments
			.replace(/(\r\n|\r|\n|\t|\s{2,10})/ig, '') // Whitespace
			
			.trim(); // Trim spaces at beginning and end
	
		return src;
	},
	
	/**
	 * Execute a task for HTML files
	 * @param [string] type
 	 * @param [string - array] src
	 * @param [string] dest
	 * @param [function] callback
	 */
	task: function(type, src, dest, callback){
		
		/**
		 * Watch
		 */
		if(HTML.__watch){
			
			TUILD.log('HTML: File monitoring started! (Press CMD+C or CTRL+C to exit)')
			
			return TUILD.watch(src, 'html', function(file){
			
				TUILD.log('HTML: Changed file: ' + file);
				TUILD[type].call(null, src, dest, 'HTML', callback)
			
			});
		}
		
		return TUILD[type].call(null, src, dest, 'HTML', callback);
	},
	
	/**
	 * Create the development version of HTML code
	 * @param [string - array] src
	 * @param [string] dest
	 */
	dev: function(src, dest){
		return HTML.task('dev', src, dest);
	},
	
	/**
	 * Create the minifield version of HTML code
	 * @param [string - array] src
	 * @param [string] dest
	 */
	min: function(src, dest){
				
		return HTML.task('min', src, dest, function(code){
			return HTML.minifield(code);
		});
	}

}

/**
 * Exports
 */
exports.commands = HTML.commands;
exports.minifield = HTML.minifield;
exports.dev = HTML.dev;
exports.min = HTML.min;