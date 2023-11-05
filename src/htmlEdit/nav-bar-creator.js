// Create the nav menu on the page. Needs to be done after a map of the site is created
export function createNavBarOnPage($, siteMap, fileLocation) {
    let $navBar = $('#side-bar');
    if ($navBar === null || $navBar === undefined) {
        console.log('Could not find the area to append the nav menu');
        return;
    }
    $navBar.addClass('hidden-feature-mob');
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
    let $menuHolder = $('<ul id="main-nav-bar"></ul>');
    createNavBarButtons($, siteMap, $menuHolder, fileLocation);
    return $menuHolder;
}

// Creates the nav bar buttons and adds them to the parent
function createNavBarButtons($, siteMapFragment, $elementParent, fileLocation) {
    for (let i = 0; i < siteMapFragment.length; i++) {
        const pageObject = siteMapFragment[i];
        let $menuButton = $('<li></li>');
        if (pageObject.children === undefined) {
            let $buttonContent = $('<div></div>');
            $buttonContent.append($('<div class="drop-down-icon"></div>'));
            $buttonContent.append(createLinkText($, pageObject.name, pageObject.page));
            $menuButton.append($buttonContent);
            setElementSelectedNav($menuButton, pageObject, fileLocation);
        } else {
            createParentNavButton($, $menuButton, pageObject, fileLocation);
        }
        $elementParent.append($menuButton);
    }
}

// Deals with the nav bar button that will contain child links
function createParentNavButton($, $menuButton, pageObject, fileLocation) {
    let $buttonDropdown = $(
        `<div class="drop-down-button" id="${pageObject.name + 'drop-down-b'}" onclick="ContentTools.hideOrShowNavBar(this, '${pageObject.name + '-drop-down'}')"></div>`);
    $buttonDropdown.append($('<div class="drop-down-icon" ></div>'));
    $buttonDropdown.append(createLinkText($, pageObject.name, pageObject.page));
    $menuButton.append($buttonDropdown);

    let $dropDownContent = $(`<ul class="drop-down-content" id="${pageObject.name + '-drop-down'}"></ul>`);
    createNavBarButtons($, pageObject.children, $dropDownContent, fileLocation);
    $dropDownContent.addClass('selected-drop-down');
    setElementSelectedNav($menuButton, pageObject, fileLocation);
    $menuButton.append($dropDownContent);
}

// Sets the nav bar button as selected
function setElementSelectedNav($element, pageObject, fileLocation) {
    if (fileLocation.includes(pageObject.page)) {
        $element.addClass('selected');
    }
}

// Creates a link with the given text
function createLinkText($, linkText, link) {
    // If the link is clicked don't call any parent events unless menu is opened
    let $linkTag = $(
        `<a onclick="if(window.sessionStorage.getItem('${linkText}') === 'true'){event.stopPropagation();}">${linkText}</a>`);
    if (link.length !== 0) {
        $linkTag.attr('href', link);
    }
    return $linkTag;
}

function createCloseButton() {
    return '<div id="close-container" class="hidden-feature-big" onclick="ContentTools.hideOrShow(\'side-bar\', true);">&times;</div>';
}