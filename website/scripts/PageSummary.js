class PageSummary {

    // Create the nav menu for the given page
    static createNavMenuForPage(idMenuArea = "docMenuArea") {
        const pageHeaderTypes = ["H2", "H3", "H4", "H5"];
        const pageHeaders = document.querySelectorAll("h2, h3, h4, h5");
        let numbering = [0, 0, 0, 0];
        let menu = document.createElement("div");
        let lastIndexUpdated = 0;
        let indexToUpdate = 0;

        for (let i = 0; i < pageHeaders.length; i++) {
            indexToUpdate = pageHeaderTypes.indexOf(pageHeaders[i].tagName);
            if (indexToUpdate < lastIndexUpdated) {
                numbering[lastIndexUpdated] = 0;
            }
            numbering[indexToUpdate]++;
            lastIndexUpdated = indexToUpdate;
            
            menu.appendChild(this.createLinkForHeader(pageHeaders[i], numbering.filter(function(x){return x !== 0;})));
        }

        const appendArea = document.getElementById(idMenuArea);
        appendArea.appendChild(menu);
    } 

    // Create a link for the header
    static createLinkForHeader(header, numbers) {
        let row = document.createElement("a");
        row.textContent = numbers.join(".") + "\xa0\xa0\xa0" + header.textContent;
        row.classList.add("headerRow" + header.nodeName, "docMenuLink");

        if (header.id == false) {
            header.id = header.textContent.replaceAll(" ", "");
        }
        row.href = "#" + header.id;
        return row;
    }

}