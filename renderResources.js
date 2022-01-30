// Create reference instance
const fmh = require('./src/fileManagerHelper.js');
const rRR = require('./src/renderResourcesRunner.js');
const path = process.cwd();

fmh.removePublicDirectory(path);
fmh.createPublicDirectory(path);

rRR.renderFiles(fs, path);

console.log('Finished compiling the files.');
