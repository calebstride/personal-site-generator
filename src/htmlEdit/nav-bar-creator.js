// IN PROGRESS. This might be pointless though as if I want to recreate the expanded menus between pages I'd need to go
// through the whole menu again and expand the selected ones. Which probably isn't that much more effort than just
// creating them as they go along.

// Create the nav menu on the page. Needs to be done after a map of the site is created
export function createNavBarOnPage($, siteMap, fileLocation) {
    let $navBar = $('#sideBar');
    if ($navBar === null || $navBar === undefined) {
        console.log('Could not find the area to append the nav menu');
        return;
    }
    $navBar.addClass('hiddenFeatureMob');
    $navBar.append(createCloseButton());
    $navBar.append(createNavBarFromMap($, siteMap, fileLocation));

    $('head').append(`
    <script type="text/javascript" src="/scripts/ContentTools.js"></script>
    <script type="text/javascript">
        window.onload = function() {
            ContentTools.findAndSetSelectedFromStorage();
        };
    </script>
    `);
}

// Create the nav bar from the given site map
function createNavBarFromMap($, siteMap, fileLocation) {
    let $menuHolder = $('<ul id="mainNavBar"></ul>');
    createNavBarButtons($, siteMap, $menuHolder, fileLocation);
    return $menuHolder;
}

// Creates the nav bar buttons and adds them to the parent
function createNavBarButtons($, siteMapFragment, $elementParent, fileLocation) {
    let isExpand = false;

    for (let i = 0; i < siteMapFragment.length; i++) {
        const pageObject = siteMapFragment[i];
        let $menuButton = $('<li></li>');
        if (pageObject.children === undefined) {
            let $buttonContent = $('<div></div>');
            $buttonContent.append($('<div class="dropDownIcon"></div>'));
            $buttonContent.append(createLinkText($, pageObject.name, pageObject.page));
            $menuButton.append($buttonContent);
            isExpand = setElementSelectedNav($menuButton, pageObject, fileLocation);
        } else {
            isExpand = createParentNavButton($, $menuButton, pageObject, fileLocation);
        }
        $elementParent.append($menuButton);
    }
    return isExpand;
}

// Deals with the nav bar button that will contain child links
function createParentNavButton($, $menuButton, pageObject, fileLocation) {
    let $buttonDropdown = $(`<div class="dropDownButton" id="${pageObject.name + 'DropDownB'}" onclick="ContentTools.hideOrShowNavBar(this, '${pageObject.name + 'DropDown'}')"></div>`);
    $buttonDropdown.append($('<div class="dropDownIcon" ></div>'));
    $buttonDropdown.append(createLinkText($, pageObject.name, pageObject.page));
    $menuButton.append($buttonDropdown);
    let isExpand = setElementSelectedNav($buttonDropdown, pageObject, fileLocation);

    let $dropDownContent = $(`<ul class="dropDownContent" id="${pageObject.name + 'DropDown'}"></ul>`);
    createNavBarButtons($, pageObject.children, $dropDownContent, fileLocation);
    if (!isExpand) {
        $dropDownContent.addClass('hiddenFeature');
    } else {
        $dropDownContent.addClass('selectedDD');
    }
    $menuButton.append($dropDownContent);
    return isExpand;
}

// Sets the nav bar button as selected
function setElementSelectedNav($element, pageObject, fileLocation) {
    if (fileLocation.includes(pageObject.page)) {
        $element.addClass('selected');
        return true;
    }
    return false;
}

// Creates a link with the given text
function createLinkText($, linkText, link) {
    // If the link is clicked don't call any parent events unless menu is opened
    let $linkTag = $(`<a onclick="if(window.sessionStorage.getItem('${linkText}') == 'true'){event.stopPropagation();}">${linkText}</a>`);
    if (link.length !== 0) {
        $linkTag.attr('href', link);
    }
    return $linkTag;
}

function createCloseButton() {
    return '<div id="closeContainer" class="hiddenFeatureBig" onclick="ContentTools.hideOrShow(\'sideBar\', true);">&times;</div>';
}