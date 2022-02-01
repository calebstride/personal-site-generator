const yaml = require('js-yaml');
const fmh = require('./fileManagerHelper.js');
const smc = require('./siteMapCreator.js');

function renderFiles(path) {
	const files = fmh.getFilesToPrepare(path);
	console.log('Moving and formatting the following files:');
	console.log(files);

	let defaultSettings = yaml.load(readFile(path + 'resources\\conf.yml'));
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
			let content = readFile(file).toString();
			let newPage;

			if (file.includes('.md')) {
				newPage = replaceMarkdownVariables(content, defaultSettings);
    			// Add the file to the site map object
    			file = file.replace('resources\\siteContent', 'public').replace('.md', '.html');
				smc.addFileToSiteMap(siteMap, file, pageName);
			} else {
				file = file.replace('resources\\siteContent', 'public');
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