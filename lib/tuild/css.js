var TUILD = require('./../tuild').Tuild,

/**
 * CSS build/compressor for Tuild
 */
CSS = {
	
	__watch: false,
	
	/**
	 *  The CSS command lines
	 */
	commands:{
		
		'__default': '-min',
		
		'-h': function(){
			
			console.log(
				'Tuild CSS \n' + 
				'You can use one or more files, or one folder to point to the new css file. For example: \n' +
				'One file: tuild css old.css > new.min.css \n' +
				'Two or more files: tuild css file1.css|file2.css|fileN.css > new.min.css \n' + 
				'Folder: tuild css forder/ > new.css \n\n' + 
				
				'USAGE:\n' + 
				'tuild css -h --help -q --quiet -dev -min -minifield --watch -h --help [file > file] [file1|file2|fileN > file] [folder > file] \n\n' +
				'-h, --help				print this help info \n' + 
				'-q, --quiet			silence warnings and status messages during compilation \n' + 
				'-dev					create a file with only the development version of one code (no minifield code). Is like a join files \n' +
				'-min					DEFAULT OPTION. create a file with the minifield code of your css\'s. \n' + 
				'-minifield				only return the css code minifield. None file is created/edited \n' + 
				'--watch				watch the file(s)/folder to automatically change the target css file. Press CMD+C or CTRL+C to unwatch and exit the process'
			);
			
			return true;
		},
		
		'-minifield': function(src){
			
			var code = TUILD.read( TUILD.getFiles(src) );
			console.log( CSS.minifield(code) );
			
			return true;
		},
		
		'--watch': function(){
			CSS.__watch = true;				
		}
	},
	
	/**
	 * Minifield the CSS code
	 * Comments that begin with / *! will be preserved - like YUI JS compressor
	 * @param [string] src
	 */
	minifield: function(src){
	
		var regex = /(\/\*\![\s\S]*?\*\/)/gm,
			comments = src.match(regex),
			src = src.replace(regex, '__COMMENT__'),

		/**
		 * MINIFY the CSS
		 */	
		src = src
			.replace(/\*[^*]*\*+([^\/][^*]*\*+)*/gm, '') // Comments
			.replace('//', '') // Comments Fix
		
			.replace(/(\r\n|\r|\n|\t|\s{2,10})/ig, '') // Whitespace
			.replace(/\s!important/g, '!important') // Whitespace before !important
			.replace(/:\s/g, ':') // Whitespace after ":"
		
			.replace(/,\s/g, ',') // Comma with a space
			.replace(/progid:[^(]+\(([^\)]+)/, function(match, contents) { // Restore spaces inside IE filters (IE 7 issue)
				return match.replace(/,/g, ', ');
			})
			
			.replace(/;}/g, '}') // Trailing semicolons
			.replace(/(\s|:)0(px|em|ex|cm|mm|in|pt|pc|%)/g, '$1' + '0') // Zero + unit to zero
			.replace(/(border|border-top|border-right|border-bottom|border-left|outline|background):none/g, '$1:0') // None to 0
			.replace(/0 0 0 0/g, '0') // Multiple zeros into one
	
			.replace(/[^\}]+{(\s)?}/g, '') // Remove empty elements
		
			.replace(/rgb\s*\(([^\)]+)\)/g, function(match, color) { // Rgb to hex colors
				var parts = color.split(','),
					hex = '#', 
					i = 0;
				
				for(; i < 3; i++){
					var asHex = parseInt(parts[i], 10).toString(16);
					hex += asHex.length === 1 ? '0' + asHex : asHex;
				}
			
			return hex;
			})
			
			.trim(); // Trim spaces at beginning and end
    
		/**
		 * Replace the comments
		 */
		if(comments){
	
			comments.forEach(function(value, i){
				
				/**
				 * IF is first comment
				 */
				if(i == 0)
					src = value.replace('/*!', '/**') + '\n' + src.replace(/(__COMMENT__)/, '');
				else
					src = src.replace(/(__COMMENT__)/, '\n\n' + value.replace('/*!', '/**') + '\n');
				
			});
	
		}
	
		return src;
	},
	
	/**
	 * Execute a task for CSS files
	 * @param [string] type
 	 * @param [string - array] src
	 * @param [string] dest
	 * @param [function] callback
	 */
	task: function(type, src, dest, callback){
		
		/**
		 * Watch
		 */
		if(CSS.__watch){
			
			TUILD.log('CSS: File monitoring started! (Press CMD+C or CTRL+C to exit)')
			
			return TUILD.watch(src, 'css', function(file){
			
				TUILD.log('CSS: Changed file: ' + file);
				TUILD[type].call(null, src, dest, 'CSS', callback)
			
			});
		}
		
		return TUILD[type].call(null, src, dest, 'CSS', callback);
	},
	
	/**
	 * Create the development version of CSS code
	 * @param [string - array] src
	 * @param [string] dest
	 */
	dev: function(src, dest){
		return CSS.task('dev', src, dest);
	},
	
	/**
	 * Create the minifield version of CSS code
	 * @param [string - array] src
	 * @param [string] dest
	 */
	min: function(src, dest){
				
		return CSS.task('min', src, dest, function(code){
			return CSS.minifield(code);
		});
	}

}

/**
 * Exports
 */
exports.commands = CSS.commands;
exports.minifield = CSS.minifield;
exports.dev = CSS.dev;
exports.min = CSS.min;