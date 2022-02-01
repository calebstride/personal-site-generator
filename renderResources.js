// Create reference instance
const fmh = require('./src/fileManagerHelper.js');
const rrr = require('./src/renderResourcesRunner.js');
const path = process.cwd();

fmh.removePublicDirectory(path);
fmh.createPublicDirectory(path);

rrr.renderFiles(path);

console.log('Finished compiling the files.');
