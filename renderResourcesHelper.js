//////// THE FOLLOWING IS CODE RELATED TO THE SITE MAP
// Adds the given file to the site map to be added directly to a javascript file
function addFileToSiteMap(siteMap, directory, name) {
	let resourceDir = directory.split('\\website\\').pop();
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

	siteMapSegment.push(pageInfo);
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

// Split camelCase names with a space
function splitCamelCaseName(name) {
	return name.match(/[A-Z][a-z]+/g).join(" ");
}

module.exports = { addFileToSiteMap, splitCamelCaseName };