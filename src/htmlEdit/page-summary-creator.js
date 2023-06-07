// Create the page menu for the given page. The page is given as the cheerio page object
export function createPageMenuForPage($) {
    const appendArea = $('#docMenuArea');
    if (appendArea === null || appendArea === undefined) {
        console.log('Could not find the area to append the page menu');
        return;
    }
    const areaClass = appendArea.prop('class');
    let useNumbering = areaClass === undefined ? false : areaClass.includes('numbered'); // Add numbering for headers and menu
    let useNumberingMenu = areaClass === undefined ? false : areaClass.includes('numberedMenu'); // Add numbering for menu only

    const pageHeaderTypes = ['H2', 'H3', 'H4', 'H5'];
    const pageHeaders = $('h2, h3, h4, h5');
    let numbering = [0, 0, 0, 0];
    $(appendArea).append('<div></div>');
    const menu = $('#docMenuArea div');
    let lastIndexUpdated = 0;
    let indexToUpdate = 0;

    for (let i = 0; i < pageHeaders.length; i++) {
        indexToUpdate = pageHeaderTypes.indexOf(pageHeaders[i].name);
        if (indexToUpdate < lastIndexUpdated) {
            numbering[lastIndexUpdated] = 0;
        }
        numbering[indexToUpdate]++;
        lastIndexUpdated = indexToUpdate;

        let numbersWithoutZero = removeZerosFromNumbers(numbering);
        createLinkForHeader($(menu), $(pageHeaders[i]), numbersWithoutZero, (useNumberingMenu || useNumbering));
        $(pageHeaders[i]).text(createNumberedHeader($(pageHeaders[i]).text(), numbersWithoutZero, useNumbering));
    }
}

// Create a link for the header
function createLinkForHeader(parentHtml, header, numbers, useNumbering) {
    if (header.prop('id') === false) {
        header.prop('id', header.text().replaceAll(' ', ''));
    }
    parentHtml.append(`<a href="#${header.prop('id')}" class="headerRow${header.prop('tagName')} docMenuLink"> 
            ${createNumberedHeader(header.text(), numbers, useNumbering)} </a>`);
}

// Create a title from the text header and numbered header
function createNumberedHeader(pageHeader, numbersWithoutZero, useNumbering) {
    return useNumbering ? numbersWithoutZero.join('.') + '.' + '\xa0\xa0\xa0' + pageHeader : pageHeader;
}

// Remove zero values from the array
function removeZerosFromNumbers(numbers) {
    return numbers.filter(function (x) {
        return x !== 0;
    });
}