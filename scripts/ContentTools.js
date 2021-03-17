class ContentTools {

    // Send a get request to the html page needed
	static getPage(send_location) {
	    var xhttp = new XMLHttpRequest();

	    // Decide what to do when the state changes
	    xhttp.onreadystatechange = function() {
	        // If response ready and http request OK
	        if (this.readyState === 4 && this.status === 200) {
	            document.getElementById("dynamicContent").innerHTML = this.responseText;
	        }
	    };  

	    // Decide whether to post or get the values
		xhttp.open("GET", send_location, true);
		xhttp.send();
	}
    
    // Remove all child elements of an element
    static removeChildren(elementId) {
        // Remove all current accounts
        let tiles = document.getElementById(elementId);
        while (tiles.firstChild) {
            tiles.removeChild(tiles.firstChild);
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
}