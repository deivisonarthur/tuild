# Tuild 1.0.2
A easy and advanced build/minifier for JS, CSS and HTML.

### Installing

Type in terminal, with root privileges:

	npm install tuild

Just that!

### Usage
Open the terminal in your aplication and type:
	tuild -h
	
Now read the help... Some examples:

	tuild -v # Print tuild version
	
	tuild css style1.css+style2.css > styles.min.css # Join all css in a minifield version
	
	tuild html -dev header.html+content.html+footer.html > page.html # This works like a template, but join all in one file :)
	
	tuild js --watch folder/ scripts.min.js # Watch the folder and automatic update the scripts.min.js, when any changes are made

You can use Tuild via script language (NodeJS)... but I will not document this :P.
	
### Dependencies

Tuild need JSHint (<https://github.com/jshint/jshint>) and UglifyJS (<https://github.com/mishoo/UglifyJS>) to work completely. So you need this in you npm packages, if you download this module directly.

### License

MIT and GPL License - <http://www.opensource.org/licenses/mit-license.php> || <http://www.gnu.org/licenses/gpl.html>

### Changelog

 * <b>1.0.2</b> - Fixed problems with path of the files
 * <b>1.0.1</b> - Fixed problems with watch mode
 * <b>1.0.0</b> - Initial