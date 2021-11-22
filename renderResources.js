// Create reference instance
var marked = require('marked');
var fs = require('fs');
var path = process.cwd();

// Read the template that's needed for all pages
let template;
try {
	template = fs.readFileSync(path + '/resources/template.html', 'utf8');
	console.log('Read the template file.');
} catch (err) {
	console.error(err);
	return;
}

// Read the file and put the rendered one into /website
try {
	const content = fs.readFileSync(path + '/resources/projects/project1.md', 'utf8');
	const compiledMd = marked.parse(content.toString());
	const newPage = template.replace('[PAGECONTENT]', compiledMd);

	try {
		fs.writeFileSync(path + '/website/projects/project1.html', newPage);
		//file written successfully
	} catch (err) {
		console.error(err);
		return;
	}
} catch (err) {
	console.error(err);
	return;
}

console.log('Finished compiling the files.');

var tree = function () {
	const directory = path + '/resources/';
	let filesToCompile = [];

	try {
		let files = fs.readdirSync(directory);
		console.log('\nCurrent directory filenames:');

		files.forEach((file) => {
			if (fs.lstatSync(directory + file).isDirectory() || file == 'template.html') {
				console.log('not adding ' + file);
			} else {
				filesToCompile.push(file);
			}
		});

	} catch (err) {
		console.error(err);
	}

	return filesToCompile;
};

const files = tree();
console.log(files);
