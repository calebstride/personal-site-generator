import {Marked} from 'marked';
import {load} from 'js-yaml';
import * as fmh from './file-helper.js';
import {markedHighlight} from 'marked-highlight';
import hljs from 'highlight.js';

// Loads in the template file and replaces the values with details in the markdown file
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
    const layoutLocation = resourceDir + '\\templates\\' + finalPageConfig.layout;
    finalPageConfig.content = replaceVariables(fmh.readFile(layoutLocation).toString(), finalPageConfig);
    return finalPageConfig;
}

// Create a marked object that will format the code using highlight.js
const marked = new Marked(markedHighlight({
    langPrefix: 'hljs language-', highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, {language}).value;
    }
}));

// Merges the default conf to the page conf
function mergeConfObjects(defaultConf, pageConf) {
    let defaultKeys = Object.keys(defaultConf);
    defaultKeys.forEach((element) => {
        if (pageConf[element] === undefined) {
            pageConf[element] = defaultConf[element];
        }
    });
    return pageConf;
}

// Replaces the placeholder values with the values found in the config object
function replaceVariables(template, pageConfig) {
    let keysToFind = Object.keys(pageConfig);
    keysToFind.forEach((element) => {
        template = template.replace('[pageContent.' + element + ']', pageConfig[element]);
    });
    return template;
}
