// Adds the given file to the site map to be added directly to a javascript file
export function addFileToSiteMap(siteMap, directory, pageConfigValues, outputDir) {
    let resourceDir = directory.split(outputDir + '\\').pop();
    let siteMapSegment = siteMap;
    let pageInfo;

    if (resourceDir.includes('\\')) {
        let parentsAndFile = resourceDir.split('\\');
        for (let parI = 0; parI < parentsAndFile.length - 1; parI++) {
            let parentName = parentsAndFile[parI].charAt(0).toUpperCase() + parentsAndFile[parI].slice(1);
            siteMapSegment = findMapSegment(siteMapSegment, splitCamelCaseName(parentName));
        }
        const fileName = '/' + parentsAndFile.join('/');
        pageInfo = createMapSegmentFromConfig(pageConfigValues, fileName);
    } else {
        const fileName = '/' + resourceDir;
        pageInfo = createMapSegmentFromConfig(pageConfigValues, fileName);
    }
    addPageInfoToSegmentMerge(siteMapSegment, pageInfo);
}

// Create the info to be stored in the site map from the configuration values
function createMapSegmentFromConfig(pageConfigValue, fileName) {
    return {
        page: fileName,
        title: pageConfigValue.title,
        type: pageConfigValue.type,
        description: pageConfigValue.description,
        creationDate: pageConfigValue.creationDate
    };
}

// Find the segment of the site map from the given parent name
function findMapSegment(siteMapSegment, parentName) {
    for (let mapI = 0; mapI < siteMapSegment.length; mapI++) {
        if (siteMapSegment[mapI].page === '' && siteMapSegment[mapI].title === parentName) {
            return siteMapSegment[mapI].children;
        }
    }
    let pageInfo = {page: '', title: parentName, children: []};
    siteMapSegment.push(pageInfo);
    return pageInfo.children;
}

// Add the info into the map segment. If there's already a page with the same name then combine the info. 
// Used for when there's a file and a folder with the same name.
function addPageInfoToSegmentMerge(siteMapSegment, pageInfo) {
    let merged = false;
    for (let i = 0; i < siteMapSegment.length; i++) {
        if (siteMapSegment[i].title === pageInfo.title) {
            siteMapSegment[i].page = siteMapSegment[i].page === '' ? pageInfo.page : siteMapSegment[i].page;
            if (siteMapSegment[i].children.length === 0) {
                siteMapSegment[i].children = pageInfo.children;
            }
            merged = true;
        }
    }
    if (!merged) {
        siteMapSegment.push(pageInfo);
    }
}

// Split camelCase names with a space
function splitCamelCaseName(name) {
    return name.match(/[A-Z][a-z]+/g).join(' ');
}