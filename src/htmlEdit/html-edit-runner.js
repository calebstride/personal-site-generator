//Run the html editing on the given html string
import {createNavMenuForPage} from './page-summary-creator.js';
import * as cheerio from 'cheerio';

export function runHtmlEdit(htmlPage) {
    const $ = cheerio.load(htmlPage);
    createNavMenuForPage($);
    return $.html();
}