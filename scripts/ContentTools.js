class ContentTools {

    // Send a get request to the html page needed
	static getPage(send_location) {
        this.removeChildren("dynamicContent");
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


}