class SimpleAjax {

	// Send a get or post request to a designated location
	static sendData(post_bool, sendData, send_location, to_function, toObject) {
	    var xhttp = new XMLHttpRequest();

	    // Decide what to do when the state changes
	    xhttp.onreadystatechange = function() {
	        // If response ready and http request OK
	        if (this.readyState === 4 && this.status === 200) {
	            to_function(JSON.parse(this.responseText), toObject);
	        }
	    };  

	    const sendEncodedData = this.#createEncodedData(sendData);

	    // Decide whether to post or get the values
	    if (post_bool === true) {
	        xhttp.open("POST", send_location, true);
			xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhttp.send(sendEncodedData);
	    } else {
	        // Send the link off to the destination
			xhttp.open("GET", send_location + "?" + sendEncodedData, true);
			xhttp.send();
	    }
	}

	// Ecode the data in key value link
	static #createEncodedData(sendData) {
		let varsLink = "";
		for (var key in sendData) {
			varsLink += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(sendData[key]);
		}
		return varsLink.slice(1, varsLink.length);
	}
};