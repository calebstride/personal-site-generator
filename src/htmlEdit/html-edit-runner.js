//Run the html editing on the provided html pages
import {createPageMenuForPage} from './page-summary-creator.js';
import * as cheerio from 'cheerio';
import * as fmh from '../file-helper.js';
import fs from 'fs';
import {createNavBarOnPage} from './nav-bar-creator.js';

// From the site map get the html pages and update their html content for editing
export function runHtmlEdit(siteMap, fileDir) {
    console.log('Updating the html on all rendered pages');
    let pageList = [];
    findPageRecursive(siteMap, pageList);

    pageList.forEach(page => {
        const fileLocation = fileDir + page.page;
        let file = fmh.readFile(fileLocation);
        const fileContent = file.toString();

        // Apply the html editing that needs doing for each file
        const $ = cheerio.load(fileContent);
        createPageMenuForPage($);
        createNavBarOnPage($, siteMap, fileLocation);

        console.log('Updating ' + fileLocation + ' with the new html content');
        fs.writeFileSync(fileLocation, $.html());
    });
}

function findPageRecursive(siteMap, pageList) {
    for (let i = 0; i < siteMap.length; i++) {
        pageList.push(siteMap[i]);
        if (siteMap[i].children !== undefined) {
            findPageRecursive(siteMap[i].children, pageList);
        }
    }
}