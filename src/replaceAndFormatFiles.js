const marked = require('marked');
const yaml = require('js-yaml');
const fmh = require('./fileManagerHelper.js');

function replaceMarkdownVariables(content, defaultSettings) {
	// Read in the yaml settings in each md file
	let fileConf = content.substring(content.indexOf('---') + 1, content.lastIndexOf('---'));
	let pageConfig = mergeConfObjects(defaultSettings, yaml.load(fileConf));
	pageConfig.content = marked.parse(content.substring(content.lastIndexOf('---') + 1));

	return replaceVariables(
		fmh.readFile(process.cwd() + '\\resources\\templates\\' + pageConfig.layout + '.html').toString()
	);
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
		template = template.replace('[pageContent.' + element + ']', pageConfig.element);
	});
	return template;
}

module.exports = {replaceMarkdownVariables};