//////// THE FOLLOWING IS CODE RELATED TO THE SITE MAP

// Adds the given file to the site map to be added directly to a javascript file
function addFileToSiteMap(siteMap, directory, name) {
	let resourceDir = directory.split('\\public\\').pop();
	let siteMapSegment = siteMap;
	let pageInfo;

	if (resourceDir.includes('\\')) {
		let parentsAndFile = resourceDir.split('\\');
		for (let parI = 0; parI < parentsAndFile.length - 1; parI++) {
			let parentName = parentsAndFile[parI].charAt(0).toUpperCase() + parentsAndFile[parI].slice(1);
			siteMapSegment = findMapSegment(siteMapSegment, splitCamelCaseName(parentName));
		}
		pageInfo = { page: '/' + parentsAndFile.join('/'), name: name};
	} else {
		let fileName = '/' + resourceDir;
		pageInfo = { page: fileName, name: name };
	}

	addPageInfoToSegmentMerge(siteMapSegment, pageInfo);
};

// Find the segment of the site map from the given parent name
function findMapSegment(siteMapSegment, parentName) {
	for (let mapI = 0; mapI < siteMapSegment.length; mapI++) {
		if (siteMapSegment[mapI].page === '' && siteMapSegment[mapI].name === parentName) {
			return siteMapSegment[mapI].children;
		}
	}
	let pageInfo = { page: '', name: parentName, children: []};
	siteMapSegment.push(pageInfo);
	return pageInfo.children;
}

// Add the info into the map segment. If there's already a page with the same name then combine the info. 
// Used for when there's a file and a folder with the same name.
function addPageInfoToSegmentMerge(siteMapSegment, pageInfo) {
	let merged = false;
	for (let i = 0; i < siteMapSegment.length; i++) {
		if (siteMapSegment[i].name === pageInfo.name)  {
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
	return name.match(/[A-Z][a-z]+/g).join(" ");
}

module.exports = {addFileToSiteMap};