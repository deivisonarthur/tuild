# Tuild 1.0.3
A easy and advanced build/minifier for JS, CSS and HTML.

### Installing

Type in terminal, with root privileges:

	npm install -g tuild #if this fail, run with sudo

Just that!

### Make require('tuild') globally

NPM dont make require() global, so, if you need tuild working globally (installing tuild in all projects is sucks) you need add it in your NODE_PATH:

	cd ~ # Go to home folder
	npm install tuild # yes, without -g flag
	echo export NODE_PATH = $NODEPATH:$HOME/node_modules >> .bashrc

Restart the terminal. Now, if you need another require in global scope, you just need install it in you home folder, like tuild.

### Usage
Open the terminal in your aplication and type:
	tuild -h
	
Now read the help... Some examples:

	tuild -v # Print tuild version
	
	tuild css style1.css+style2.css > styles.min.css # Join all css in a minified version
	
	tuild html -dev header.html+content.html+footer.html > page.html # This works like a template, but join all in one file :)
	
	tuild js --watch folder/ scripts.min.js # Watch the folder and automatic update the scripts.min.js, when any changes are made

You can use Tuild via script language (NodeJS)... but I will not document this :P.

<b>Windows users</b>
You need run tuild in a js file, because command line dont work (and this is not tuild fault). Eg:

build.js

	#!/usr/bin/env node
	
	var Tuild = require('tuild').Tuild;
	Tuild.command('css file.css file2.css');

The script above works like a command line... to execute, type in terminal "node build.js".

### Dependencies

Tuild need JSHint (<https://github.com/jshint/jshint>) and UglifyJS (<https://github.com/mishoo/UglifyJS>) to work completely. So you need this in you npm packages, if you download this module directly.

### License

MIT and GPL License - <http://www.opensource.org/licenses/mit-license.php> || <http://www.gnu.org/licenses/gpl.html>

### Changelog
 * <b>1.0.4</b> - Best minify for HTML & Clean spaces
 * <b>1.0.3</b> - Force global installation + code cleanup
 * <b>1.0.2</b> - Fixed problems with path of the files
 * <b>1.0.1</b> - Fixed problems with watch mode
 * <b>1.0.0</b> - Initial