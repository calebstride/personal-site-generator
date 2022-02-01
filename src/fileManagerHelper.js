const fs = require('fs');

function removePublicDirectory(path) {
    try {
	    fs.rmSync(path + '\\public', { recursive: true, force: true });
	    console.log('Cleared public directory');
    } catch (err) {
        console.error(err);
    }
}

function createPublicDirectory(path) {
    try {
        fs.mkdirSync(path + '\\public');
        console.log('Created public directory');
    } catch (err) {
        console.error(err);
    } 
}

function readFile(filePath) {
	try {
		let file = fs.readFileSync(filePath, 'utf8');
		console.log('Read the template file');
		return file;
	} catch (err) {
		console.error(err);
		return;
	}
}

// Used to get the files that need formatting
function getFilesToPrepare(path) {
	const directory = path + '\\resources\\siteContent';
	let filesToCompile = [];
	readAndAddResource(directory, filesToCompile);
	return filesToCompile;
};

// Reads the directories recursively to add files for formatting
function readAndAddResource(directory, listOfResources) {
	try {
		let files = fs.readdirSync(directory);

		files.forEach((file) => {
			let wholeDirectory = directory + '\\' + file;

			if (fs.lstatSync(wholeDirectory).isDirectory()) {
				console.log('Reading directory: \\' + file);
				fs.mkdirSync(wholeDirectory.replace('\\resources\\siteContent', 'public'));
				readAndAddResource(wholeDirectory, listOfResources);
			} else {
				listOfResources.push(wholeDirectory);
			}
		});
	} catch (err) {
		console.error(err);
	}
};

function createJsSiteMap(path, siteMap) {
	try {
		let content = "const siteMap = " + JSON.stringify(siteMap);
		fs.writeFileSync(path + '\\public', content);
	} catch (error) {
		console.error(err);
		return;
	}
	
}

module.exports = {removePublicDirectory, createPublicDirectory, readFile, getFilesToPrepare, createJsSiteMap};