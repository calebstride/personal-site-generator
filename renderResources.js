// Create reference instance
var marked = require('marked');
var fs = require('fs');

// Used to get the files that need formatting
var getFilesToPrepare = function () {
	const directory = path + '\\resources';
	let filesToCompile = [];
	readAndAddResource(directory, filesToCompile);
	return filesToCompile;
};

// Reads the directories recursively to add files for formatting
var readAndAddResource = function (directory, listOfResources) {
	try {
		let files = fs.readdirSync(directory);

		files.forEach((file) => {
			let wholeDirectory = directory + '\\' + file;

			if (fs.lstatSync(wholeDirectory).isDirectory()) {
				console.log('Reading directory: \\' + file);
				fs.mkdirSync(wholeDirectory.replace('resources', 'website'));
				readAndAddResource(wholeDirectory, listOfResources);
			} else if (!file.includes('template.html')) {
				listOfResources.push(wholeDirectory);
			}
		});
	} catch (err) {
		console.error(err);
	}
}

var findPageTitle = function (pageContents) {
	let title = pageContents.match(/h1(.*)<\/h1>/g);
	if (title != null && title.length == 1) {
		title = title[0].substring(title[0].indexOf('>') + 1, title[0].indexOf('<'));
	}
	return title;
}

//////////// SCRIPT STARTS HERE ///////////////////
// Remove the website directory if it exists
const path = process.cwd();
try {
	fs.rmSync(path + '\\website', {recursive: true, force: true });
	console.log('Cleared website directory');
} catch (err) {
	console.error(err);
}

// Create the website directory
try {
	fs.mkdirSync(path + '\\website');
	console.log('Created website directory');
} catch (err) {
	console.error(err);
	return;
}

// Read the template that's needed for all md pages
let template;
try {
	template = fs.readFileSync(path + '/resources/template.html', 'utf8');
	console.log('Read the template file');
} catch (err) {
	console.error(err);
	return;
}

const files = getFilesToPrepare();
console.log('Moving and formatting the following files:');
console.log(files);

// Read the files and put the rendered ones into /website
files.forEach((file) => {
	try {

		if (file.includes('.md')) {
			const content = fs.readFileSync(file, 'utf8');
			const compiledMd = marked.parse(content.toString());
			let newPage = template.replace('[PAGECONTENT]', compiledMd);
			newPage = newPage.replace('[PAGENAME]', findPageTitle(newPage));
			try {
				fs.writeFileSync((file.replace('resources', 'website')).replace('.md', '.html'), newPage);
				//file written successfully
			} catch (err) {
				console.error(err);
				return;
			}
		} else {
			try {
				fs.copyFileSync(file, file.replace('resources', 'website'));
				//file copied successfully
			} catch (err) {
				console.error(err);
				return;
			}
		}
	} catch (err) {
		console.error(err);
		return;
	}
});

console.log('Finished compiling the files.');