const marked = require('marked');
const yaml = require('js-yaml');
const fmh = require('./fileManagerHelper.js');

function replaceMarkdownVariables(content, defaultConfig) {
	// Read in the yaml settings in each md file
	let finalConfig;
	if (content.indexOf('---') === content.lastIndexOf('---') || content.lastIndexOf('---') === -1) {
		console.error('There is an issue reading the conf in this file');
		finalConfig = defaultConfig;
		finalConfig.content = content;
	} else {
		let fileConf = content.substring(content.indexOf('---') + 1, content.lastIndexOf('---'));
		finalConfig = mergeConfObjects(defaultConfig, yaml.load(fileConf));
		finalConfig.content = marked.parse(content.substring(content.lastIndexOf('---') + 1));
	}
	
	const layoutLocation = process.cwd() + '\\resources\\templates\\' + finalConfig.layout;
	return {'content' : replaceVariables(fmh.readFile(layoutLocation).toString(), finalConfig), 'name' : finalConfig.pageContent.title};
}

// Merges the default conf to the page conf. Assumes all settings are defined in default conf file
function mergeConfObjects(defaultConf, pageConf) {
	let defaultKeys = Object.keys(defaultConf);
	let finalConf = {};
	console.log(pageConf);
	console.log(defaultConf);
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

module.exports = { replaceMarkdownVariables };
