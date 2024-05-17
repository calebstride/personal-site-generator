// Create the page menu for the given page. The page is given as the cheerio page object
export function createPageMenuForPage($, numberHeaders) {
    const appendArea = $('#doc-menu-area');
    let createMenu = appendArea !== null && appendArea !== undefined;
    if (createMenu) {
        $(appendArea).append('<div></div>');
    }

    const pageHeaderTypes = ['H2', 'H3', 'H4', 'H5'];
    const $pageHeaders = $('h2, h3, h4, h5');
    let numbering = [0, 0, 0, 0];
    let lastIndexUpdated = 0;
    let indexToUpdate = 0;

    const $menu = $('#doc-menu-area div');
    for (let i = 0; i < $pageHeaders.length; i++) {
        indexToUpdate = pageHeaderTypes.indexOf($($pageHeaders[i]).prop('tagName'));
        if (indexToUpdate < lastIndexUpdated) {
            // If the index is below the last updated index (the header is of higher order) then reset all counters
            // after the current index
            numbering.forEach((value, index) => {
                if (index > indexToUpdate) {
                    numbering[index] = 0;
                }
            });
        }
        numbering[indexToUpdate]++;
        lastIndexUpdated = indexToUpdate;

        let numbersWithoutZero = removeZerosFromNumbers(numbering);
        let headerName = createNumberedHeader($($pageHeaders[i]).text(), numbersWithoutZero, numberHeaders);
        if (createMenu) {
            createLinkForHeader($menu, $($pageHeaders[i]), numbersWithoutZero, headerName);
        }
        $($pageHeaders[i]).html(headerName);
    }
}

// Create a link for the header
function createLinkForHeader($parentHtml, $header, numbers, headerName) {
    if ($header.prop('id') === undefined) {
        $header.prop('id', $header.text().replaceAll(' ', ''));
    }
    $parentHtml.append(`<a href="#${$header.prop('id')}" class="header-row-${$header.prop('tagName').toLowerCase()} doc-menu-link"> 
            ${headerName} </a>`);
}

// Create a title from the text header and numbered header
function createNumberedHeader(pageHeader, numbersWithoutZero, useNumbering) {
    return useNumbering ? '<div class="header-num">' + numbersWithoutZero.join('.') + '.</div>' + '\xa0\xa0' + pageHeader : pageHeader;
}

// Remove zero values from the array
function removeZerosFromNumbers(numbers) {
    return numbers.filter(function (x) {
        return x !== 0;
    });
}