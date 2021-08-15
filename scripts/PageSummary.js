class PageSummary {

    // Create the nav menu for the given page
    static createNavMenuForPage(idMenuArea) {
        const pageHeaders = document.querySelectorAll("h2, h3, h4, h5");
        let menu = document.createElement("div");

        for (let i = 0; i < pageHeaders.length; i++) {
            menu.appendChild(this.createLinkForHeader(pageHeaders[i], i));
        }

        const appendArea = document.getElementById(idMenuArea);
        appendArea.appendChild(menu);
    } 

    // Create a link for the header
    static createLinkForHeader(header, headerNum) {
        let row = document.createElement("a");
        row.textContent = header.textContent;
        row.classList.add("headerRow" + header.nodeName);

        if (header.id == false) {
            header.id = "headerGenId" + headerNum;
        }
        row.href = "#" + header.id;
        return row;
    }

}