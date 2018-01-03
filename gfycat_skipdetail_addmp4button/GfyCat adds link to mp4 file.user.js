// ==UserScript==
// @name         GfyCat adds link to mp4 file
// @namespace    gfycataddmp4link
// @description  Adds a link to the mp4 file of gfycat webm, redirects from detail page to actual file page
// @version      0.7
// @author       https://greasyfork.org/scripts/32493-gfycat-redirect-to-webm-video-file forked by glub
// @updateURL    https://greasyfork.org/en/scripts/34139-gfycat-adds-link-to-mp4-file
// @match        http://gfycat.com/*
// @match        https://gfycat.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==


function add_detail_element(url){
	var detailelement = document.getElementById('video-details-container');
	var myanchor = document.createElement("a");
	if (url !== null){
		let mydetail = document.createTextNode(url);
		myanchor.appendChild(mydetail);
		myanchor.href = url;
	}
	else{
		let mydetail = document.createTextNode("No Source");
		myanchor.appendChild(mydetail);
	}
	myanchor.style.backgroundColor = "black";
	detailelement.appendChild(myanchor);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
// Gfycat has been redirecting to the detail page when trying to access a file page directly
// gifycat.com/gifs/detail/id
// work around that by adding a timer to redirect after 5 seconds

if (window.location.href.indexOf("gifs/detail") > 0){
	sleep(5000).then(() => {
		window.location = window.location.href.replace(/gifs\/detail\//,"");
	});
}
else
{
	var videoPlayer = document.getElementsByTagName('video')[0];
	if (videoPlayer) {
		var children = videoPlayer.childNodes;
		for (var i = 0; i < children.length; ++i) {
			if (children[i].type == "video/webm") {
				var webm = children[i].src;
				break;
			}
		}
	} else {
		// gifycat.com/id
		//var webm = document.getElementById('webmSource').src;
		var webm = superAwesomeGlobalGfyJSON.webmUrl;
		//var mp4 = document.getElementById('mp4Source').src;
		var mp4 = superAwesomeGlobalGfyJSON.mp4Url;
		//var caption = document.getElementsByTagName('figcaption')[0].innerHTML;
		var source_url = superAwesomeGlobalGfyJSON.url;
		if (source_url === null){
			add_detail_element(source_url);
		}
		else if (source_url.indexOf('http') !== -1){ //found http, valid url
			//console.log("source_url: ", source_url);
			//var sourceurl = source_url.substr(source_url.indexOf('http')); //setting whatever is http in figcaption as sourceurl
			add_detail_element(source_url);
		}
		else{
			add_detail_element(null);
		}
	}

	if (mp4) {
		smallgifbutton = document.getElementById('small-gif');
		smallgifbutton.href = mp4;
		smallgifbutton.innerHTML = "MP4 LINK";

		/*sleep(6000).then(() => {
		location.assign(mp4);
	});*/
	}
}
/*
else if (webm) {
	location.assign(webm);
}
*/
