// ==UserScript==
// @name         View Full Twitter Image
// @version      1.2.6
// @description  Undo Twitter's insistence to down-res images when viewing on its dedicated page and add a button to download the full image without the weird file extensions which don't count as actual images.
// @author       ForgottenUmbrella https://greasyfork.org/users/83187
// @match        https://pbs.twimg.com/media/*
// @grant        none
// @noframes
// @namespace    https://greasyfork.org/en/scripts/382443-view-full-twitter-image
// ==/UserScript==

// function createButton(text, func) {
//     "use strict";
//     var button = document.createElement("button");
//     button.value = text;
//     button.onclick = func;
//     document.body.appendChild(button);
// }

function download(filename) {
    "use strict";
    var element = document.createElement("a");
    // The `download` attribute only works if `href` is set.
    element.href = location.href;
    element.download = filename;
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// function domCreate(type, after, func, text, style) {
//     "use strict";
//     var element = document.createElement(type);
//     document.body.insertBefore(element, after);
//     if (typeof func !== "undefined") {
//         element.onclick = func;
//     }
//     if (typeof text !== "undefined") {
//         var t = document.createTextNode(text);
//         element.appendChild(t);
//     }
//     if (typeof style !== "undefined") {
//         element.style.height = style.height;
//         element.style.width = style.width;
//         element.style.marginLeft = style.margin_left;
//         element.style.marginRight = style.margin_right;
//         element.style.marginTop = style.margin_top;
//         element.style.marginBottom = style.margin_bottom;
//     }
//     return element;
// }

// function downloadPic() {
//     "use strict";
//     var link = document.createElement("a");
//     var notFilename = "https://pbs.twimg.com/media/";
//     var notFiletype = ":orig";
//     var filename = location.href.slice(
//         notFilename.length, location.href.length - notFiletype.length);
//     link.href = location.href;
//     link.setAttribute("download", filename);
//     link.click();
// }

// function iqdbSearch() {
//     "use strict";
//     location.href = "https://iqdb.org?url=" + location.href;
// }

(function() {
    "use strict";
    console.log("(Full Image) Running.");
	let params = location.search;
	if (params != "") { // "?" means we detected the new twitter API parameter format
		if (!location.href.includes("name=orig")){
			let vars = [], hash;
			var baseurl = decodeURIComponent(window.location.href.slice(0, window.location.href.indexOf('?') + 1));
			var hashes = decodeURIComponent(window.location.href.slice(window.location.href.indexOf('?') + 1 )).split('&');
			// building parameter array
			for(var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				if ((hash[0] == 'name') && (hash[1] != 'orig')){
					vars[hash[0]] = 'orig'; // enforces 'name' key
					continue;
				}
				//vars.push(hash[0]); // probably not needed
				vars[hash[0]] = hash[1];
			}
			// adding back parameters to the base url
			var queryString = Object.keys(vars).map(key => key + '=' + vars[key]).join('&');
			location.href = baseurl + queryString;
		}
	}
	else {
		if (location.href.includes(":large")) {
			console.log("(Full Image) Will replace large with original.");
			window.location.assign(location.href.replace(":large", ":orig"));
		} else if (!location.href.includes(":orig")) {
			console.log("(Full Image) Will change legacy API URL to original.");
			location.href += ":orig";
		}
	}

/*
    var spacing = document.createElement("p");
    var image = document.getElementsByTagName("img")[0];
    document.body.insertBefore(spacing, image);

    var button = document.createElement("button");
    button.innerHTML = "Download";
    var filename = location.href.slice(
        "https://pbs.twimg.com/media/".length,
        location.href.length - ":orig".length
    );
    button.onclick = function() {
        download(filename);
    };
    document.body.insertBefore(button, spacing);
*/
    // On Chrome, the button appears atop the image; on Firefox, to the left.

    // var spacing = domCreate("p", image);
    // var btn = domCreate("button", spacing, downloadPic, "Download");
    // var btn_2 = domCreate(
    //     "button", spacing, iqdbSearch, "IQDB Search", {
    //             margin_left: "20px"});
})();
