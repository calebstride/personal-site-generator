import {load} from 'js-yaml';
import * as fmh from './FileManagerHelper.js';
import * as fs from 'fs';
import {addFileToSiteMap} from './siteMapCreator.js';
import * as rfm from './ReplaceAndFormatFiles.js';

export function renderFiles(path, outputDir, resourceDir) {
    let files = fmh.getFilesToPrepare(resourceDir + '\\siteContent');
    console.log('Moving and formatting the following files and folders:');
    console.log(files);

    let defaultSettings = load(fmh.readFile(resourceDir + '\\conf.yml'));
    let siteMap = [];

    // Read the files and put the rendered ones into output directory
    files.forEach((file) => {
        renderFile(file, siteMap, defaultSettings, resourceDir, outputDir);
    });

    fmh.createJsSiteMap(outputDir, siteMap);
}

function renderFile(file, siteMap, defaultSettings, resourceDir, outputDir) {
    const contentDir = resourceDir + '\\siteContent';
    try {
        if (file.includes('.md')) {
            let content = fmh.readFile(file).toString();
            let newPage;

            if (file.includes('.md')) {
                let formattedObject = rfm.replaceMarkdownVariables(content, defaultSettings.pageContent, resourceDir);
                newPage = formattedObject.content;
                file = changeFileNameToOutput(file, contentDir, outputDir).replace('.md', '.html');
                // Add the file to the site map object
                addFileToSiteMap(siteMap, file, formattedObject.name, outputDir);
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
    }
}

function changeFileNameToOutput(fileName, contentDir, outputDir) {
    return fileName.replace(contentDir, outputDir).replaceAll(/[0-9]+_/g, '');
}