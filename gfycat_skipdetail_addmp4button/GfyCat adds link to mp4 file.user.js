// ==UserScript==
// @name         GfyCat adds link to mp4 file
// @namespace    gfycataddmp4link
// @description  Adds a link to the mp4 file of gfycat webm, redirects from detail page to actual file page
// @version      0.8
// @author       https://greasyfork.org/scripts/32493-gfycat-redirect-to-webm-video-file forked by glub
// @updateURL    https://greasyfork.org/en/scripts/34139-gfycat-adds-link-to-mp4-file
// @match        http://gfycat.com/*
// @match        https://gfycat.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

//FIXME: broken code here
function add_detail_element(url){
	var detailelement = document.getElementById('block-2');
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
var webmlink, mp4link;

// Gfycat has been redirecting to the detail page when trying to access a file page directly
// gifycat.com/gifs/detail/id
// work around that by adding a timer to redirect after 5 seconds
if (window.location.href.indexOf("gifs/detail") > 0){
	sleep(5000).then(() => {
		window.location = window.location.href.replace(/gifs\/detail\//,"");
	});
}
// Normal video page parsing now
else
{
	var videoPlayer = document.getElementsByTagName('video')[0];
	if (videoPlayer) {
		var children = videoPlayer.childNodes;
		for (var i = 0; i < children.length; ++i) {
			if (children[i].type == "video/webm") {
				webmlink = children[i].src;
			}
			if (children[i].type == "video/mp4"){
				if (children[i].src.indexOf('-mobile') != -1){ continue; }
				mp4link = children[i].src;
			}
		}
		console.log("video player was there. webm:", webmlink, " mp4:", mp4link);
	}
	else {
		// we don't have a videoplayer (yet?)
		// FIXME: broken old code here
		var superAwesomeGlobalGfyJSON = document.getElementById('webmSource').src;
		webmlink = document.getElementById('webmSource').src;
		//webm = superAwesomeGlobalGfyJSON.webmUrl;
		mp4link = document.getElementById('mp4Source').src;
		//mp4link = superAwesomeGlobalGfyJSON.mp4Url;
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

	if (mp4link) {
		// need to wait a few seconds otherwise gfycrap scripts overwrite us
		sleep(1000).then(() => {
		let parent = document.getElementsByClassName('source-link').item(0);
		let newdiv = document.createElement("div");
		// let mp4text = document.createTextNode("Download MP4");
		// let webmtext = document.createTextNode("Download WEBM");
		// newdiv.appendChild(mp4text);
		// newdiv.appendChild(webmtext);
		let mp4lnk = document.createElement("a");
		let webmlnk = document.createElement("a");
		mp4lnk.innerText = "Download MP4 here.";
		webmlnk.innerText = "Download WEBM here.";
		mp4lnk.setAttribute('href', mp4link);
		mp4lnk.setAttribute('class', 'value');
		mp4lnk.setAttribute('target', '_blank');
		webmlnk.setAttribute('href', webmlink);
		webmlnk.setAttribute('target', '_blank');
		webmlnk.setAttribute('class', 'value');
		parent.appendChild(document.createElement("br"));
		parent.appendChild(mp4lnk);
		parent.appendChild(document.createElement("br"));
		parent.appendChild(webmlnk);

		// go to mp4 directly after 6 seconds (not used)
		/*sleep(6000).then(() => {
		location.assign(mp4);
	});*/
	})}
}
/*
// if for some reason we only have webm link and no mp4, just go to mp4 directly.
else if (webm) {
	location.assign(webm);
}
*/