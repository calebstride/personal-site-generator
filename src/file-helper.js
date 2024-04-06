import * as fs from 'fs';

export function removeOutputDirectory(path) {
    try {
        fs.rmSync(path, {recursive: true, force: true});
        console.log('Cleared output directory (' + path + ')');
    } catch (err) {
        console.error(err);
    }
}

export function createOutputDirectory(path) {
    try {
        fs.mkdirSync(path);
        console.log('Created output directory (' + path + ')');
    } catch (err) {
        console.error(err);
    }
}

export function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error(err);
    }
}

export function getFilesToPrepare(contentDir) {
    let listOfFiles = [];
    getFilesAndDirsToPrepare(contentDir, listOfFiles);
    return listOfFiles;
}

// Finds all files and returns them also reads the directories recursively 
// and creates them in output area.
function getFilesAndDirsToPrepare(contentDir, listOfResources) {
    try {
        let files = fs.readdirSync(contentDir);

        files.forEach((file) => {
            let wholeDirectory = contentDir + '\\' + file;

            if (fs.lstatSync(wholeDirectory).isDirectory()) {
                listOfResources.push(wholeDirectory);
                getFilesAndDirsToPrepare(wholeDirectory, listOfResources);
            } else {
                listOfResources.push(wholeDirectory);
            }

        });
    } catch (err) {
        console.error(err);
    }
}

export function createJsSiteMap(path, siteMap) {
    try {
        let content = 'const siteMap = ' + JSON.stringify(siteMap) + ';';
        fs.writeFileSync(path + '\\siteMap.js', content);
    } catch (err) {
        console.error(err);
    }
}