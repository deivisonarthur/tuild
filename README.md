### Tuild
A easy and advanced build/minifier for JS, CSS and HTML.

#### Installing

Type in terminal, with root privileges:

	npm install tuild

Just that!

#### Usage
Open the terminal in your aplication and type:
	tuild -h
	
Now read the help... Some examples:

	-v # Print tuild version
	
	css style1.css|style2.css > styles.min.css # Join all css in a minifield version
	
	html -dev header.html|content.html|footer.html > page.html # This works like a template, but join all in one file :)
	
	js --watch folder/ > scripts.min.js # Watch the folder and automatic update the scripts.min.js, when any changes are made

You can use Tuild via script language (NodeJS)... but i not documented this :P.
	
#### Dependencies

Tuild need JSHint and UglifyJS to work completely. So you need this in you npm packages, if you download this module directly.