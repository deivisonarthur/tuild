var FS = require('fs'),
	SYS = require('sys'),
	PATH = require('path'),
	
/**
 * The Tuild - This Build
 */
Tuild = {
	
	__quiet: false,
	
	/**
	 * Tuild command lines
	 */
	commands: {
		'-v': function(){
			console.log('v 1.0');
		},
		'-h': function(){
			console.log(
				'Tuild\n' + 
				'-v, --version          print the version of tuild \n' +
				'-h, --help             print this help info \n' +
				'-q, --quiet            silence warnings and status messages during compilation \n' +
				'For more help type: "tuild css -h" OR "tuild html -h" OR "tuild js -h"'
			);
		},
		'-q': function(){
			Tuild.__quiet = true;
		}
	},
	
	/**
	 * Process a command line script
	 * @param [string] script
	 * @param [boolean] again
	 */
	command: function(script, again){
		
		script = script.replace('--help', '-h')
				.replace('--version', '-v')
				.replace('--quiet', '-q')
				.replace('>', '')
				.toLowerCase();
		
		/**
		 * First check the Tuild commands, simple commands
		 */
		if( Tuild.commands.hasOwnProperty( script ) )
			return Tuild.commands[ script ].apply(Tuild);
				
		/**
		 * Check if is quiet command
		 */
		if(script.match(/\s?(-q)\s/)){
			Tuild.__quiet = true;
			script = script.replace('-q', '');
		}
		
		script = script.replace(/(\s{2,10})/ig, ' ');
		
		/**
		 * Give some variables
		 */
		var args = script.split(' '),
			type = args.shift();
					
		/**
		 * Check the module
		 */
		if(!type || ['css', 'js', 'html'].indexOf(type) === -1)
			return console.log('What module is that? Aborting the command line...');
		
		/**
		 * Give more variables, because type exists...
		 */
		var MODULE = exports[ type.toUpperCase() ],
			_params = [],
			_ret;

		/**	
		 *  Process each argument
		 */
		while(args.length > 0){

			/**
			 * Take the last argument, always the last...
			 */
			var arg = args.pop(),
			
			/**
			 * Clone the parameters
			 */
			params = _params.slice(0);
	
			/**
			 * Command Function
			 */
			if(MODULE.commands.hasOwnProperty( arg )){
				_ret = MODULE.commands[arg].apply( null, params.reverse() );
			
			/**
			 * "Normal" Function (simple removing the "-", return a function?)
			 */
			}else if(MODULE[ arg.replace('-', '') ]){
				_ret = MODULE[ arg.replace('-', '') ].apply( null, params.reverse() );
			
			/**
			 * That is a parameter?
			 */
			}else{

				// Convert string1|string2 in Array(string1, string2) 
				if(arg.indexOf('+') !== -1 )
					arg = arg.split('+');
					
				_params.push( arg );
			}
			
			/**
			 * If return, stop the process
			 */
			if(_ret != undefined) 
				return _ret;
		}
		
		/**
		 * OK, now lets try this function with the module default command (because no function has been executed)
		 * I think, maybe, this is bugged :)
		 */
		if( !again && _params.length && MODULE.commands.__default ){
		
			return Tuild.command( 
				script.replace( new RegExp('(' + type + ')'), type + ' ' + MODULE.commands.__default ), 
				true
			);
		
		}

		return console.log('I think you wrote something wrong... type "tuild -h"');
	},
	
	/**
	 * Create a simple log
	 * @param [mixed] arguments
	 */
	log: function(/*arguments*/){
		if(!Tuild.__quiet) console.log.apply(null, arguments)
	},
	
	/**
	 * Make a task
	 * @param [string - array] src
	 * @param [string] dest
	 * @param [function] callback
	 * @param [string] messageInit
	 * @param [string] messageSucess
	 * @param [string] messageFail
	 */
	task: function(src, dest, callback, messageInit, messageSucess, messageFail){
		
		/**
		 * Force queit, in case dest is undefined, considering the command ">"
		 */
		if(!dest) Tuild.__quiet = true;
		
 		Tuild.log(messageInit);
		
		var code = Tuild.read( Tuild.getFiles(src, dest) ),
			_ret;
		
		/**
		 * Do callback and stop, if fail
		 */
		if(callback && callback.constructor == Function)
			_ret = callback.call(Tuild, code, dest);

		/**
		 * Change the code or return false, by callback
		 */
		if(_ret){
			code = _ret;
		}else if(_ret === false){
			return false;
		}
		
		/**
		 * Write the file, or print...
		 */
		if(dest){
		
			FS.writeFileSync(dest, code);
			Tuild.log(messageSucess + ' [' + dest + ']');
		
		}else{
			
			console.log(code);
		
		}
				
		return code;
	},
	
	/**
	 * Watch files and trigger the callback, on changes
	 * @param [string - array] src
	 * @param [function] callback
	 */
	watch: function(src, type, callback){
		
		var files = Tuild.getFiles(src, type);

		/**
		 * Watch each file
		 */
		files.forEach(function(file){

			//Watch the file
			FS.watchFile(file, function(current, previous){
			
				if(current.size != previous.size){
					callback.call(null, file);
				}
				
			});

		});
		
		return files;
	},
	
	/**
	 * Read folder/file(s) and return a Array with the files
	 * @param [string - array] src
	 * @param [string] type
	 */
	getFiles: function(src, type){
		
		var itens = [];
		
		/**
		 * IF src is DIR
		 */
		if(src.constructor === String && src.substr(-1, 1) == '/'){
			
			src = PATH.join( process.cwd(), src);
			
			/**
			 * Get the format of files target
			 */
			var format = type.match(/^\.?(css|js|html)$/) ? '.' + type.replace('.', '') : PATH.extname(type);
			
			/**
			 * Process each file
			 */
			FS.readdirSync(src).forEach(function(file){

				if(PATH.extname(file) == format)
					itens.push( src + file );
			
			});
		
		/**		
		 * FILE(S)
		 */
		}else{
			
			/**
			 * Array - files
			 */
			if(src.constructor === Array){
				
				src.forEach(function(file){
					itens.push( PATH.join( process.cwd(), file) );
				});
			
			/**
			 * String - file
			 */
			}else{
				itens.push( PATH.join( process.cwd(), src) );
			}
			
		}

		return itens;
	},
	
	/**
	 * Read files content...
	 * @param [array] files
	 */
	read: function(files){
		
		var code = '';
		
		/**
		 * Reads the contents on each file and add a newline between each file on #code
		 */
		files.forEach(function(file, i){
			
			/**
		 	 * Try read the file
		 	 */
			try{
				code += FS.readFileSync(file, 'UTF-8') + ((i + 1) !== files.length ? '\n\n' : '');
		
			}catch(e){
				Tuild.log('Error reading file [' + file + ']: ' + e.message);
				process.exit(1);
			}

		});

		return code;
	},
	
	/**
	 * Create the development version of code
	 * @param [string - array] src
	 * @param [string] dest
	 * @param [string] namespace
	 * @param [function] callback
	 */
	dev: function(src, dest, namespace, callback){
		
		if(!namespace) namespace = 'Tuild';
		
		return Tuild.task(
			src, 
			dest, 
			callback, 
			(namespace + ': Creating source code.'),
			(namespace + ': Source code created successfully!'),
			(namespace + ': Error to create source code.')
		);
		
	},
	
	/**
	 * Create the minifield version of code
	 * @param [string - array] src
	 * @param [string] dest
	 * @param [string] namespace
	 * @param [function] callback
	 */
	min: function(src, dest, namespace, callback){
	
		if(!namespace) namespace = 'Tuild';
		
		return Tuild.task(
			src, 
			dest, 
			callback, 
			(namespace + ': Creating minifield code.'),
			(namespace + ': Minifield created successfully!'),
			(namespace + ': Error to create minifield.')
		);

	}
	
};

/**
 * Exports
 */
exports.Tuild = Tuild;
exports.CSS = require('./tuild/css');
exports.HTML = require('./tuild/html');
exports.JS = require('./tuild/js');