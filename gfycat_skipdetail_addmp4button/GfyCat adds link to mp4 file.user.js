// ==UserScript==
// @name         GfyCat adds link to mp4 file
// @namespace    gfycataddmp4link
// @description  Adds a link to the mp4 file of gfycat webm, redirects from detail page to actual file page
// @version      0.13
// @author       https://greasyfork.org/scripts/32493-gfycat-redirect-to-webm-video-file forked by glub
// @updateURL    https://greasyfork.org/en/scripts/34139-gfycat-adds-link-to-mp4-file
// @match        http*://*.gfycat.com/*
// @match        http*://*.redgifs.com/*
// @match        http*://*.gifdeliverynetwork.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

//HACK: in case we just want to redirect from this
// if(window.location.hostname.indexOf("gifdeliverynetwork.com") > 0)
// {
//    window.location = window.location.href.replace(/gifdeliverynetwork.com/i, "redgifs.com/watch");
// }

//FIXME: broken code here, currently not used
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

/* need to wait a few seconds otherwise gfycrap scripts overwrite us
   we could also try using $(document).ready(function(){[...]}); */
function add_details(url, parentnode){
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
	parentnode.appendChild(document.createElement("br"));
	parentnode.appendChild(mp4lnk);
	parentnode.appendChild(document.createElement("br"));
	parentnode.appendChild(webmlnk);
	// adding a bunch of spaces for padding
	parentnode.appendChild(document.createElement("br"));
	parentnode.appendChild(document.createElement("br"));
	parentnode.appendChild(document.createElement("br"));
	parentnode.appendChild(document.createElement("br"));
	parentnode.appendChild(document.createElement("br"));

	// grey out visited links
	var css = 'a:visited { color: #4c4c5daa }';
	var style = document.createElement("style");
	style.appendChild(document.createTextNode(css));
	document.head.appendChild(style);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

var webmlink, mp4link;

// This is the function that does the magic currently
function updateInfoFrom(videoPlayer){
	var children = videoPlayer.childNodes;
	console.log("DEBUG: player child nodes: ", children);
	for (var i = 0; i < children.length; ++i) {
		if (children[i].type == "video/webm") {
			webmlink = children[i].src;
		}
		if (children[i].type == "video/mp4"){
			if (children[i].src.indexOf('-mobile') != -1){ continue; }
			mp4link = children[i].src;
		}
	}
	addLink();
}

var parentnode;

function __delay__(timer) {
	// https://stackoverflow.com/questions/7307983
	return new Promise(resolve => {
		timer = timer || 3000;
		setTimeout(function () {
			var gifinfo = document.getElementsByClassName('gif-info');
			if (gifinfo.length === 0)
			{
				// try different method as a fallback for gifdeliverynetwork (redirected) pages as they have no gif-info
				parentnode = document.getElementsByClassName('wrapper')[0];
			}
			else
			{
				parentnode = gifinfo[0].children[0];
			}
			//console.log("parentnode is: ", parentnode);
			resolve();
		}, timer);
	});
};
// Gfycat has been redirecting to the detail page when trying to access a file page directly
// gifycat.com/gifs/detail/id
// work around that by adding a timer to redirect after 5 seconds
if (window.location.href.indexOf("gifs/detail") > 0) {
	sleep(500).then(() => {
		window.location = window.location.href.replace(/gifs\/detail\//,"");
	});
}
// Normal video page parsing now
else
{
	var videoPlayer = document.getElementsByTagName('video')[0];
	if (videoPlayer) {
		videoPlayer.addEventListener("change", updateInfoFrom(videoPlayer));
	}
	else {
		console.log("DEBUG: no videoplayer found!");
		// we don't have a videoplayer (yet?)
		// FIXME: broken old code here, currently not used
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
	//addLink();
}

function addLink() {
	if (mp4link) {
		setTimeout(async function(){
			while (!parentnode) { await __delay__(1000); }
			add_details(mp4link, parentnode);
		}, 1);
	}
	else { console.log("Didn't find any mp4 link to display!"); };
	/*sleep(6000).then(() => {
// go to mp4 directly after 6 seconds (not used)
location.assign(mp4);
});*/
}
