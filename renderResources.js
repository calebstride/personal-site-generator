// Create reference instance
const fmh = require('./src/FileManagerHelper.js');
const rrr = require('./src/RenderResourcesRunner.js');
const path = process.cwd();

fmh.removePublicDirectory(path);
fmh.createPublicDirectory(path);

rrr.renderFiles(path);

console.log('Finished compiling the files.');
