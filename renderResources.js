// Create reference instance
var marked = require('marked');
var fs = require('fs');

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

var findPageTitle = function (fileName, pageContents) {
	let title = findBetterDisplayName(fileName.split('\\resources\\').pop());
	if (title == null) {
		title = pageContents.match(/h1(.*)<\/h1>/g);
		if (title != null && title.length == 1) {
			title = title[0].substring(title[0].indexOf('>') + 1, title[0].indexOf('<'));
		}
	}
	return title;
};

// Using the nameMap; finds a better display name (Used in the ui for describing the page) if one is provided
var findBetterDisplayName = function (fileName) {
	if (nameMap.get(fileName) == undefined) {
		return null;
	} else {
		return nameMap.get(fileName);
	}
}

// Adds the given file to the site map to be added directly to a javascript file
var addFileToSiteMap = function (siteMap, directory, name) {
	let resourceDir = directory.split('\\website\\').pop();
	let siteMapSegment = siteMap;
	let pageInfo;

	if (resourceDir.includes('\\')) {
		let parentsAndFile = resourceDir.split('\\');
		for (let parI = 0; parI < parentsAndFile.length - 1; parI++) {
			let parentName = parentsAndFile[parI].charAt(0).toUpperCase() + parentsAndFile[parI].slice(1);
			
			siteMapSegment = findMapSegment(siteMapSegment, parentName);
		}
		pageInfo = { page: '/' + parentsAndFile.join('/'), name: name};
	} else {
		let fileName = '/' + resourceDir;
		pageInfo = { page: fileName, name: name };
	}

	siteMapSegment.push(pageInfo);
};

// Find the segment of the site map from the given parent name
var findMapSegment = function (siteMapSegment, parentName) {
	for (let mapI = 0; mapI < siteMapSegment.length; mapI++) {
		if (siteMapSegment[mapI].page === '' && siteMapSegment[mapI].name === parentName) {
			return siteMapSegment[mapI].children;
		}
	}
	let pageInfo = { page: '', name: parentName, children: []};
	siteMapSegment.push(pageInfo);
	return pageInfo.children;
}

//////////// SCRIPT STARTS HERE ///////////////////
// Remove the website directory if it exists
const path = process.cwd();
const nameMap = new Map();
nameMap.set('about.md', 'About');
nameMap.set('index.md', 'Home');
nameMap.set('contact.md', 'Contact');

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
				const compiledMd = marked.parse(content.toString());
				newPage = template.replace('[PAGECONTENT]', compiledMd);
				let pageTitle = findPageTitle(file, newPage);
				newPage = newPage.replace('[PAGENAME]', pageTitle);	
				// Add the file to the site map object
				file = file.replace('resources', 'website').replace('.md', '.html');
				addFileToSiteMap(siteMap, file, pageTitle);
			} else {
				newPage = content.toString().replace('[SITEMAP]', JSON.stringify(siteMap));
				file = file.replace('resources', 'website');
			}
		
			try {
				fs.writeFileSync(file, newPage);
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
