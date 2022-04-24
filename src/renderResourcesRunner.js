const fs = require('fs');
const yaml = require('js-yaml');
const fmh = require('./FileManagerHelper.js');
const smc = require('./SiteMapCreator.js');
const rfm = require('./ReplaceAndFormatFiles.js');

function renderFiles(path, outputDir, contentDir) {
	let files = fmh.getFilesToPrepare(contentDir);
	console.log('Moving and formatting the following files and folders:');
	console.log(files);

	let defaultSettings = yaml.load(fmh.readFile(path + '\\resources\\conf.yml'));
	let siteMap = [];

	// Read the files and put the rendered ones into output directory
	files.forEach((file) => {
		renderFile(file, siteMap, defaultSettings, contentDir, outputDir);
	});

	fmh.createJsSiteMap(outputDir, siteMap);
}

function renderFile(file, siteMap, defaultSettings, contentDir, outputDir) {
	try {
		if (file.includes('.md')) {
			let content = fmh.readFile(file).toString();
			let newPage;

			if (file.includes('.md')) {
				let formattedObject = rfm.replaceMarkdownVariables(content, defaultSettings.pageContent);
				newPage = formattedObject.content;
				file = changeFileNameToOutput(file, contentDir, outputDir).replace('.md', '.html');
    			// Add the file to the site map object
				smc.addFileToSiteMap(siteMap, file, formattedObject.name);
			}
			fs.writeFileSync(file, newPage);
			
		} else {
			if (fs.lstatSync(file).isDirectory()) {
				fs.mkdirSync(changeFileNameToOutput(file, contentDir, outputDir));
			} else {
				fs.copyFileSync(file, changeFileNameToOutput(file, contentDir, outputDir));
			}
		}
		console.log('Finished writing the new file: ' + file);
	} catch (err) {
		console.error(err);
		return;
	}
}

function changeFileNameToOutput(fileName, contentDir, outputDir) {
	return fileName.replace(contentDir, outputDir).replaceAll(/[0-9]+_/g, '');
}

module.exports = {renderFiles};