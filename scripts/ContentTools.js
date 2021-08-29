class ContentTools {

    // Remove all child elements of an element
    static removeChildren(elementId) {
        let element = document.getElementById(elementId);
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
    
    // Hides or show an element from the nav bar
    static hideOrShowNavBar(element, id) {

        if (element.classList.contains("selected")) {
            this.hideOrShow(id);
            this.toggleSelected(element)
        } else {
            if (element.nextElementSibling.classList.contains("hiddenFeature")) {
                this.hideOrShow(id);
            } 
            this.toggleSelected(element)
        }

    }

    // Hides or show an element
    static hideOrShow(id, mobile) {
        let element = document.getElementById(id);
        let classString;

        if (mobile === true) {
            classString = "hiddenFeatureMob";
        } else if (mobile === false) {
            classString = "hiddenFeatureBig";
        } else {
            classString = "hiddenFeature";
        }

        if (element.classList.contains(classString)) {
            element.classList.remove(classString);
        } else {
            element.classList.add(classString);
        }
    }

    // Toggle the element as selected
    static toggleSelected(element) {
        let elements = document.getElementsByClassName("selected");
        let removed = false;
        for (let i = 0; i < elements.length; i++) {
            if (element == elements[i]) {
                removed = true;
            }
            elements[i].classList.remove("selected");
        }
        if (!removed) {
            element.classList.add("selected");
        }
    }

    // Add click event listeners onto the nav bar buttons
    static addClickListenersOnNav() {
        let elements = document.querySelectorAll("#mainNavBar li > div:not(.dropDownButton)");

        for (let i = 0; i < elements.length; i++) {
            elements[i].addEventListener("click", function() {
                ContentTools.toggleSelected(this);
            });
        }
    }

    // Get the map of webpages on the website
    static getWebPagesMap() {
        return [{"page" : "index.html", "name" : "Home"},
                {"page" : "about.html", "name" : "About"},
                {"page" : "projects.html", "name" : "Projects", "children" : [
                    {"page" : "projects/project1.html", "name" : "Project One"},
                    {"page" : "projects.html", "name" : "Projects"}
                ]},
                {"page" : "contact.html", "name" : "Contact"}];
    }


    // Create the web page nav bar that's used on each page
    static createMainNavBar() {
        const placeArea = document.body;
        placeArea.insertBefore(this.createBurgerMenu(), placeArea.firstChild);

        let menu = document.createElement("nav");
        menu.id = "sideBar";
        menu.className = "hiddenFeatureMob";

        menu.appendChild(this.createCloseButton());
        menu.appendChild(this.creatNavBarFromLayout(this.getWebPagesMap()));
        placeArea.insertBefore(menu, placeArea.firstChild);
    }

    // Create the nav bar from the given web page layout
    static creatNavBarFromLayout(webLayout) {
        let menuHolder = document.createElement("ul");
        menuHolder.id = "mainNavBar";
        this.createNavBarButtons(webLayout, menuHolder);
        return menuHolder;
    }

    // Creates the nav bar buttons and adds them to the elementParent
    static createNavBarButtons(webLayoutArray, elementParent) {
        for (let i = 0; i < webLayoutArray.length; i++) {
            const pageObject = webLayoutArray[i];
            let menuButton = document.createElement("li");
            if (pageObject.children == undefined) {

                let buttonContent = document.createElement("div");
                buttonContent.onclick = function(){
                    ContentTools.toggleSelected(this);
                };
                buttonContent.appendChild(this.createLinkText(pageObject.name, pageObject.page));
                menuButton.appendChild(buttonContent);
            } else {

                let buttonDropdown = document.createElement("div");
                buttonDropdown.className = "dropDownButton";
                buttonDropdown.appendChild(this.createLinkText(pageObject.name, pageObject.page));
                buttonDropdown.onclick = function(){
                    ContentTools.hideOrShowNavBar(this, pageObject.name + 'DropDown');
                };
                menuButton.appendChild(buttonDropdown);
                let dropDownContent = document.createElement("ul");
                dropDownContent.classList.add("dropDownContent", "hiddenFeature");
                dropDownContent.id = pageObject.name + 'DropDown';
                this.createNavBarButtons(pageObject.children, dropDownContent);
                menuButton.appendChild(dropDownContent);
            }
            elementParent.appendChild(menuButton);
        }
    }

    // Creates a link with the given text
    static createLinkText(linkText, link) {
        let linkTag = document.createElement('a');
        linkTag.href = link;
        linkTag.textContent = linkText;
        return linkTag;
    }

    // Creates the close button used on the mobile menu
    static createCloseButton() {
        let closeButton = document.createElement("div");
        closeButton.id = "closeContainer";
        closeButton.className = "hiddenFeatureBig";
        closeButton.onclick = function(){ContentTools.hideOrShow('sideBar', true);};
        closeButton.textContent = "&times;";
        return closeButton;
    }

    // Creates the burger menu when used on mobile
    static createBurgerMenu() {
        let burgerMenu = document.createElement("div");
        burgerMenu.id = "burgerHug";

        let burgerLineHolder = document.createElement("div");
        burgerLineHolder.id = "b_menu";
        burgerLineHolder.className = "hiddenFeatureBig";
        burgerLineHolder.onclick = function(){ContentTools.hideOrShow('sideBar', true);};

        for (let i = 0; i < 3; i++) {
            let burgerLine = document.createElement("div");
            burgerLine.className = "b_men";
            burgerLineHolder.appendChild(burgerLine);
        }

        burgerMenu.appendChild(burgerLineHolder);
        return burgerMenu;
    }

}