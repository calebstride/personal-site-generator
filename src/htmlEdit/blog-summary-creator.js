// Create a list of blog pages
export function createBlogPageList($, siteMap) {
    let $blogContainer = $('#blog-summary');
    if ($blogContainer === null || $blogContainer === undefined) {
        return;
    }
    console.log('Found the area to append the blog summary menu');
    let allPages = findPagesWithBlog(siteMap);
    let $blogList = $('<ul class="blog-list"></ul>');
    for (let page in allPages) {
        createLinkForPage($, $blogList, allPages[page]);
    }
    $blogContainer.append($blogList);
}

// Finds all the blog pages
function findPagesWithBlog(siteMap) {
    let pageList = [];
    addBlogPagesToList(siteMap, pageList);
    return pageList;
}

// Adds all the blog pages to a list
function addBlogPagesToList(siteMapFragment, pageList) {
    for (let i = 0; i < siteMapFragment.length; i++) {
        const pageObject = siteMapFragment[i];
        if (pageObject.type === 'blog') {
            pageList.push(pageObject);
        }
        if (pageObject.children !== undefined) {
            addBlogPagesToList(pageObject.children, pageList);
        }
    }
}

// Create the element for the blog page
function createLinkForPage($, $blogListHolder, pageInfo) {
    let $blogItem = $('<div></div>');
    $blogItem.append(`<a href=${pageInfo.page} class="blog-link">${pageInfo.title}</a>`);
    let creationString = pageInfo.creationDate.toISOString().substring(0, 10);
    if (creationString !== '' && creationString !== undefined) {
        $blogItem.append(`<div class="blog-date">${creationString}</div>`);
    }
    $blogItem.append(`<div class="blog-summary">${pageInfo.description}</div>`);
    $blogListHolder.append($blogItem);
}