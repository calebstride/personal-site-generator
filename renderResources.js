// Create reference instance
var marked = require('marked');
var fs = require('fs');
const renderHelper = require("./renderResourcesHelper.js");
const { title } = require('process');

// Used to get the files that need formatting
var getFilesToPrepare = function () {
	const directory = path + '\\resources';
	let filesToCompile = [];
	readAndAddResource(directory, filesToCompile);
	// Put the files that form pages at the beginning so we can create a site map
	filesToCompile.sort((a, b) => {
		if (a.includes('.md') && b.includes('.md')) {
			if (a.includes('contact.md')) {
				return 1;
			} else if (b.includes('contact.md')) {
				return -1;
			}
			if (a.includes('index.md')) {
				return -1;
			} else if (b.includes('index.md')) {
				return 1;
			}
			return 0;
		} else if (a.includes('.md')) {
			return -1;
		} else {
			return 1;
		}
	});
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
};

// Used to find a name (used in nav bar and tab) or title (used in page title) based on the given file and map to change it to
var findPageTitle = function (fileName, nameMap) {
	let tempName = fileName.split('\\').pop();
	let title = findBetterDisplayName(tempName, nameMap);
	if (title == null) {
		tempName = tempName.charAt(0).toUpperCase() + tempName.slice(1, tempName.indexOf('.'));
		title = renderHelper.splitCamelCaseName(tempName);
	}
	return title;
};

// Using the nameMap, finds a better name
var findBetterDisplayName = function (fileName, nameMap) {
	if (nameMap.get(fileName) == undefined) {
		return null;
	} else {
		return nameMap.get(fileName);
	}
}

//////////// SCRIPT STARTS HERE ///////////////////
// Remove the website directory if it exists
const path = process.cwd();
const nameMap = new Map();
nameMap.set('index.md', 'Home');

const titleMap = new Map();
titleMap.set('about.md', 'About Me');
titleMap.set('contact.md', 'Contact Me');
titleMap.set('index.md', '');

try {
	fs.rmSync(path + '\\website', { recursive: true, force: true });
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

let siteMap = [];

// Read the files and put the rendered ones into /website
files.forEach((file) => {
	try {
		if (file.includes('.md') || file.includes('ContentTools.js')) {
			let content = fs.readFileSync(file, 'utf8');
			let newPage;

			if (file.includes('.md')) {
				// Replace the page content with rendered md
				const compiledMd = marked.parse(content.toString());
				newPage = template.replace('[PAGECONTENT]', compiledMd);

				// Replace the title with the page title
				let pageName = findPageTitle(file, nameMap);
				newPage = newPage.replace('[PAGENAME]', pageName);	
				newPage = newPage.replace('[PAGETITLE]', findPageTitle(file, titleMap));	

				// Add the file to the site map object
				file = file.replace('resources', 'website').replace('.md', '.html');
				renderHelper.addFileToSiteMap(siteMap, file, pageName);
			} else {
				newPage = content.toString().replace('[SITEMAP]', JSON.stringify(siteMap));
				file = file.replace('resources', 'website');
			}
		
			fs.writeFileSync(file, newPage);
		} else {
			fs.copyFileSync(file, file.replace('resources', 'website'));
		}
	} catch (err) {
		console.error(err);
		return;
	}
});

console.log('Finished compiling the files.');
