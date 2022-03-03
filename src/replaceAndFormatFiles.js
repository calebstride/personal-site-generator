const marked = require('marked');
const yaml = require('js-yaml');
const fmh = require('./FileManagerHelper.js');

function replaceMarkdownVariables(content, defaultPageConfig) {
	// Read in the yaml settings in each md file
	let finalPageConfig;
	// TODO potentially set some smarter defaults e.g. page title and name are file name
	// Somehow order files - add number in name then remove when doing above and when moving/creating file. 
	// Or add conf property to set order. Will need to change the sitemap as this controls order. 
	
	// So two options. Change file system order or change sitemap order
	 
	if (content.indexOf('---') === content.lastIndexOf('---') || content.lastIndexOf('---') === -1) {
		console.error('There is an issue reading the conf in this file');
		finalPageConfig = defaultPageConfig;
		finalPageConfig.content = marked.parse(content);
	} else {
		let fileConf = content.substring(content.indexOf('---') + 3, content.lastIndexOf('---'));
		finalPageConfig = mergeConfObjects(defaultPageConfig, yaml.load(fileConf));
		finalPageConfig.content = marked.parse(content.substring(content.lastIndexOf('---') + 3));
	}
	
	const layoutLocation = process.cwd() + '\\resources\\templates\\' + finalPageConfig.layout;
	return {'content' : replaceVariables(fmh.readFile(layoutLocation).toString(), finalPageConfig), 'name' : finalPageConfig.title};
}

// Merges the default conf to the page conf. Assumes all settings are defined in default conf file
function mergeConfObjects(defaultConf, pageConf) {
	let defaultKeys = Object.keys(defaultConf);
	let finalConf = {};
	defaultKeys.forEach((element) => {
		if (pageConf[element] == undefined) {
			finalConf[element] = defaultConf[element];
		} else {
			finalConf[element] = pageConf[element];
		}
	});
	return finalConf;
}

// Replaces the placeholder values with the values found in the config object
function replaceVariables(template, pageConfig) {
	let keysToFind = Object.keys(pageConfig);
	keysToFind.forEach((element) => {
		template = template.replace('[pageContent.' + element + ']', pageConfig[element]);
	});
	return template;
}

module.exports = { replaceMarkdownVariables };
