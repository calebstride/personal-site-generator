class ContentTools {

    // Expand the navigation menu
	static expandMenu(id_menu) {
		var x = document.getElementById(id_menu);
		if (x.className === "dropdown-content") {
			x.className += "_responsive";
		}
		else if (x.className === "m_drop") {
			x.className += "_responsive";
		}
		else if (x.className === "m_drop_responsive") {
			x.className = "m_drop";
		}
		else {
			x.className = "dropdown-content";
		}
	};
    
    // Remove all child elements of an element
    static removeChildren(elementId) {
        // Remove all current accounts
        let tiles = document.getElementById(elementId);
        while (tiles.firstChild) {
            tiles.removeChild(tiles.firstChild);
        }
    }

    // Shows an element
    static show(element) {
        if (element.classList.contains("hiddenFeature")) {
            element.classList.remove("hiddenFeature");
        };
    }

    // Hides an element
    static hide(element) {
        element.classList.add("hiddenFeature");
    }
}