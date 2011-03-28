var TUILD = require('./../tuild').Tuild,
	JSHINT = require('jshint').JSHINT,
	UGLIFYJS = require('uglify-js'),

	PARSER = UGLIFYJS.parser,
	PROCESS = UGLIFYJS.uglify,
	
/**
 * JS build/compressor for Tuild
 */
JS = {
	
	__watch: false,
	__hint: true,
	
	/**
 	 * Messages that should not be displayed.
 	 */
	jsHintOK: {
		"Expected an identifier and instead saw 'undefined' (a reserved word).": true,
		"Use '===' to compare with 'null'.": true,
		"Use '!==' to compare with 'null'.": true,
		"Expected an assignment or function call and instead saw an expression.": true,
		"Expected a 'break' statement before 'case'.": true
	},
	
	/**
	 *  The JS command lines
	 */
	commands:{
		
		'__default': '-min',
		
		'-h': function(){
			
			console.log(
				'Tuild JS \n' + 
				'You can use one or more files, or one folder to point to the new js file. For example: \n' +
				'One file: tuild js old.js > new.min.js \n' +
				'Two or more files: tuild js script1.js+script.js+scriptN.js > scripts.min.js \n' + 
				'Folder: tuild js forder/ > scripts.js \n\n' + 
				
				'USAGE:\n' + 
				'tuild js -h --help -q --quiet -dev -min -hint --watch --no-hint [file > file] [file1+file2+fileN > file] [folder > file] \n\n' +
				'-h, --help             print this help info \n' + 
				'-q, --quiet            silence warnings and status messages during compilation \n' + 
				'-hint                  only check your code with jsHint. None file is created/edited \n' + 
				'-dev                   return the development version of code (no minifield code). Is like a join files. If a destination is specified, is created/edited the file destination \n' +
				'-min                   [DEFAULT OPTION]. return the minifield code of your js file(s). If a destination is specified, is created/edited the file destination \n' + 
				'--watch                watch the file(s)/folder to automatically change the target js file. If you use ">" in command line, the target is incremented... Press CMD+C or CTRL+C to unwatch and exit the process \n' +
				'--no-hint              disable jsHint check when your create the development version code'
			);
			
			return true;
		},
		
		'-hint': function(src){
			
			var code = TUILD.read( TUILD.getFiles(src) );
			return JS.hint(code);
			
		},
		
		'--watch': function(){
			JS.__watch = true;				
		},
		
		'--no-hint': function(){
			JS.__hint = false;				
		}
	},
	
	/**
	 * Minifield the JS code
	 * Comments that begin with / *! will be preserved - like YUI JS compressor
	 * @param [string] src
	 */
	minifield: function(src){
	
		var regex = /(\/\*\![\s\S]*?\*\/)/gm,
			comments = src.match(regex),
			src = src.replace(regex, '__COMMENT__'),
			first;
		
		/**
		 * Check if file start with comment
		 * Because Uglify JS change the order of scripts (this maybe have bugs)
		 */
		if(src.indexOf('__COMMENT__') === 0)
			first = true;
			
		/**
		 * UGLIFY JS
		 */	
		src = PARSER.parse(src);
		src = PROCESS.ast_mangle(src);
		src = PROCESS.ast_squeeze(src);
		src = PROCESS.gen_code(src);
		
		/**
		 * Replace the comments
		 */
		if(comments){
	
			comments.forEach(function(value, i){
				
				/**
				 * IF is first comment
				 */
				if(i == 0 && first){
					src = value + '\n' + src.replace(/(,?__COMMENT__,?)/, '');
				
				}else{
					src = src.replace(
						/(__COMMENT__,?)/, '\n\n' + value + '\n'
					);
				}
			});
	
		}
		
		return src;
	},
	
	/**
	 * Adds a message to JSHintOK
	 * @param [string] message
	 */
	addHintOk: function(message){
		
		JS.jsHintOK[message] = true;
		
		return JS;
	},
	
	/**
	 * Check for erros in JS code
	 * @param [string] src
	 */
	hint: function(src){
		
		TUILD.log('JS: Checking the code with JSHint.')
		
		try{
			
			JSHINT(src, { evil: true, forin: true, undef: true, browser: true });
			
			/**
			 * If errors, but not fail
			 */
			if(JSHINT.errors){
				
				var i = 0;
				
				JSHINT.errors.forEach(function(erro){
					
					if(!JS.jsHintOK[erro.reason]){
						i++;
						TUILD.log(erro.id + " line " + erro.line + ": " + erro.reason + '\n' + erro.evidence + '\n');
	  				}
	  				
	  			});
				
				/**
				 * The return
				 */
				if(i)
	  				TUILD.log('JS: ' + i + ' Error(s) found.');
	  			else
	  				TUILD.log('JS: JSHint found no errors. Congratulations!');	  			
	  		}
	  		
	  	/**
	  	 * Fail
	  	 */		
		} catch(e){
			TUILD.log("JS: JSHint FAIL: " + e.message);
			process.exit(1);
		}
		
		return src;
	},

	/**
	 * Execute a task for JS files
	 * @param [string] type
 	 * @param [string - array] src
	 * @param [string] dest
	 * @param [function] callback
	 */
	task: function(type, src, dest, callback){
		
		/**
		 * Watch
		 */
		if(JS.__watch){
			
			/**
			 * Force queit, in case dest is undefined, considering the command ">"
			 */
			if(!dest) TUILD.__quiet = true;
			
			TUILD.log('JS: File monitoring started! (Press CMD+C or CTRL+C to exit)');
			
			return TUILD.watch(src, 'js', function(file){
			
				TUILD.log('JS: Changed file: ' + file);
				TUILD[type].call(null, src, dest, 'JS', callback)
			
			});
		}
		
		return TUILD[type].call(null, src, dest, 'JS', callback);
	},
	
	/**
	 * Create the development version of JS code
	 * @param [string - array] src
	 * @param [string] dest
	 */
	dev: function(src, dest){
		
		return JS.task('dev', src, dest, function(code){
						
			/**
		 	 * Test the code with JSHINT
		 	 */
			if(JS.__hint) JS.hint(code);
			
			return code;
		});
	},
	
	/**
	 * Create the minifield version of JS code
	 * @param [string - array] src
	 * @param [string] dest
	 */
	min: function(src, dest){
				
		return JS.task('min', src, dest, function(code){
			return JS.minifield(code);
		});
	}

}

/**
 * Exports
 */
exports.commands = JS.commands;
exports.minifield = JS.minifield;
exports.addHintOk = JS.addHintOk;
exports.hint = JS.hint;
exports.dev = JS.dev;
exports.min = JS.min;