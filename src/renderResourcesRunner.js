const fs = require('fs');
const yaml = require('js-yaml');
const fmh = require('./FileManagerHelper.js');
const smc = require('./SiteMapCreator.js');
const rfm = require('./ReplaceAndFormatFiles.js');

function renderFiles(path) {
	const files = fmh.getFilesToPrepare(path);
	console.log('Moving and formatting the following files:');
	console.log(files);

	let defaultSettings = yaml.load(fmh.readFile(path + '\\resources\\conf.yml'));
	let siteMap = [];

	// Read the files and put the rendered ones into /public
	files.forEach((file) => {
		renderFile(file, siteMap, defaultSettings);
	});

	fmh.createJsSiteMap(path, siteMap);
}

function renderFile(file, siteMap, defaultSettings) {
	try {
		if (file.includes('.md')) {
			let content = fmh.readFile(file).toString();
			let newPage;

			if (file.includes('.md')) {
				let formattedObject = rfm.replaceMarkdownVariables(content, defaultSettings.pageContent);
				newPage = formattedObject.content;
				file = file.replace('resources\\siteContent', 'public').replace('.md', '.html').replaceAll(/[0-9]+_/g, '');
    			// Add the file to the site map object
				smc.addFileToSiteMap(siteMap, file, formattedObject.name);
			}

			fs.writeFileSync(file, newPage);
		} else {
			fs.copyFileSync(file, file.replace('resources\\siteContent', 'public'));
		}
	} catch (err) {
		console.error(err);
		return;
	}
}

module.exports = {renderFiles};