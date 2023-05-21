import * as marked from 'marked';
import {load} from 'js-yaml';
import * as fmh from './file-helper.js';
import {runHtmlEdit} from './htmlEdit/html-edit-runner.js';


export function replaceMarkdownVariables(content, defaultPageConfig, resourceDir) {
    // Read in the yaml settings in each md file
    let finalPageConfig;
    if (content.indexOf('---') === content.lastIndexOf('---') || content.lastIndexOf('---') === -1) {
        console.error('There is an issue reading the conf in this file');
        finalPageConfig = defaultPageConfig;
        finalPageConfig.content = marked.parse(content);
    } else {
        let fileConf = content.substring(content.indexOf('---') + 3, content.lastIndexOf('---'));
        finalPageConfig = mergeConfObjects(defaultPageConfig, load(fileConf));
        finalPageConfig.content = marked.parse(content.substring(content.lastIndexOf('---') + 3));
    }
    finalPageConfig.content = runHtmlEdit(finalPageConfig.content);

    const layoutLocation = resourceDir + '\\templates\\' + finalPageConfig.layout;
    return {
        'content': replaceVariables(fmh.readFile(layoutLocation).toString(), finalPageConfig),
        'name': finalPageConfig.title
    };
}

// Merges the default conf to the page conf. Assumes all settings are defined in default conf file
function mergeConfObjects(defaultConf, pageConf) {
    let defaultKeys = Object.keys(defaultConf);
    let finalConf = {};
    defaultKeys.forEach((element) => {
        if (pageConf[element] === undefined) {
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
