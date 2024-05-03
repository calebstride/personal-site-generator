import * as fmh from './src/file-helper.js';
import {renderFiles} from './src/file-renderer.js';
import {ArgumentParser} from 'argparse';


const path = process.cwd();

// Following handles input params
const parser = new ArgumentParser({
    description: 'Arguments for generating website content'
});

parser.add_argument('-v', '--version', {action: 'version', version: process.env.npm_package_version});
parser.add_argument('-o', '--output', {
    help: 'The directory that the generated files should be placed. Is /public by default'
});
parser.add_argument('-r', '--resources', {
    help: 'The directory that contains the resources for generating the website. Default is /resources'
});

let parsedArgs = parser.parse_args();

let outputDir = parsedArgs.output === undefined ? path + '\\public' : parsedArgs.output;
let resourceDir = parsedArgs.resources === undefined ? path + '\\resources' : parsedArgs.resources;

// Now runs the generation of the website from resources
fmh.removeOutputDirectory(outputDir);
fmh.createOutputDirectory(outputDir);

renderFiles(path, outputDir, resourceDir);

console.log('Finished compiling the files.');
