// ==UserScript==
// @name         Image download helper
// @namespace    https://github.com/glubsy/userscripts
// @version      0.05
// @description  add keyboard shortcuts to open and download image files quicker
// @author       glubsy
// @license      GPLv2
// @compatible   chrome Chrome_46.0.2490.86 + TamperMonkey + 脚本_1.3 测试通过
// @match        *
// @include      /^https?:\/\/.*tumblr.*/
// @include      /^https?:\/\/.*imgur.*/
// @copyright    Fuck copyrights
//// @require  	 https://code.jquery.com/jquery-1.11.2.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @grant        GM_openInTab
// @grant        GM_download
//// @grant       GM_addStyle
// @run-at       document-idle
//// @noframes
/*jshint multistr: true */
// ==/UserScript==

//TODO: -maybe implement a better save-as system? ie https://gist.github.com/derjanb/4431f674124ef1b11e30
//      -clean up

document.addEventListener ("DOMContentLoaded", DOM_ContentReady);

//=====================================================

var modkey_pressed = false, pointed_obj, pointed_div;
var img_links, img_links_iframe, class_links, currentLink, divs;
var extensions = ["jpg", "jpeg", "png", "gif", "mp4", "webm", "gifv", "tiff", "bmp"];

$(document).ready(get_iframes_id());

function DOM_ContentReady () { gatherImages(); }

function gatherImages(){
	let myimages =  window.document.images;
	for (let i=0; i <= myimages.length; i++){
		if (myimages[i] === undefined) { continue; }
		if (myimages[i].src.indexOf("avatar") > 0) { continue; }
		myimages[i].onmouseenter = function (){ updateLink(this.src); pointed_obj = this; };
		//console.log("gatherImages: " + myimages[i].src);
	}
}


img_links = document.getElementsByTagName('img');
class_links = document.getElementsByClassName('photoset_photo');

/*/============================================================
// Just testing this, in case is becomes useful eventually:
var IMGmatches = [], IMGelems = document.getElementsByTagName("img"),
	iframes = document.getElementsByTagName('iframe'), l = IMGelems.length,
	m = iframes.length, i, j;
for( let i=0; i<l; i++) IMGmatches[i] = IMGelems[i];
for( let j=0; j<m; j++) {
	IMGelems = iframes[j].contentDocument.getElementsByTagName("img");
	l = IMGelems.length;
	for( i=0; i<l; i++) IMGmatches.push(IMGelems[i]);
}
//console.log("IMGelems: " + IMGmatches + IMGelems);

//==========================================================*/

divs = document.getElementsByTagName('div');

isMediaDisplayed();

function get_iframes_id(){
	//console.log("get_iframes_id()");

	//$('iframe').each(function(){
	$('.photoset').each(function(){  //.photoset works?
		var src = $(this).attr("src"); //photoset_number
		if ( src === undefined ) { return; }
		var iframe_numb = "photoset_iframe_" + src.replace(/\/post\/(\d+)\/photoset_iframe.*/, '$1');
		//console.log("get_iframes_id() found iframe:" + iframe_numb);

		var iframe = document.getElementById(iframe_numb);
		var innerDoc = iframe.contentDocument || iframe.contentWindow.document; //TODO: fix the error on cross-origin iframes
		//console.log("get_iframes_id(): iframe innerdoc: " + iframe + " " + innerDoc);

		/*TESTING deferring after fully loaded iframes
		if (iframe.addEventListener)
			iframe.addEventListener("load", function(){ console.log("TESTLOADED");}, false);
		else
			iframe.attachEvent("onload", function(){ console.log("TESTLOADEDELSE");});
		//END TESTING*/

		iframe.addEventListener("load", function() {
			//console.log("get_iframes_id(): LOADED iFRAME!");
			/*iframe.addEventListener("keydown", function(event){ //not needed apparently
				if( event.keyCode==87 && event.shiftKey ) {
					modkey_pressed = true;
					downloadThis(currentLink);
				}
				console.log("%c get_iframes_id(): Key currentLink:" + currentLink, 'background: #222; color: #bb55cc' );
			});*/

			img_links_iframe = innerDoc.getElementsByTagName('img');  //	or img_links_iframe = innerDoc.links; ??
			//console.log("get_iframes_id(): img_links_iframe: " + img_links_iframe.length);
			for(let i =0; i < img_links_iframe.length; i++){
				img_links_iframe[i].onmousemove = function (){ updateLink(this.src); pointed_obj = this; };
				//console.log("get_iframes_id(): img_links_iframes[" + i + "]: " + img_links_iframe[i].src);
			}

		},false);
	}
					   );
}

//=======================================================

function isMediaDisplayed(){
	let extension = window.location.pathname.replace(/.*\./, '').toLowerCase();
	if (extensions.indexOf(extension) < 0) { return false; }
	else { currentLink = window.location.href; return true; }
}

function updateLink(arg) {
	//console.log("%c BEFORE updateLink  :" + currentLink,'background: #222; color: #ccaa99');
	currentLink = arg;
	//console.log("%c AFTER updateLink   :" + currentLink ,'background: #222; color: #bada99');
}

function downloadThis(thelink) {
	if( !modkey_pressed ) {
		return;
	}
	//GM_openInTab( currentLink );
	//console.log("%c Downloading currentlink :" + currentLink, 'background: #222; color: #bada55' );
	checkSize(0, thelink);
	//console.log("%c new_url                 :" + new_url, 'background: #222; color: #f46b42');
	if ( new_url.indexOf("NOLINK!") > -1) { return; }
	//=========================================================
	var filename = new_url.substring(new_url.lastIndexOf('/')+1);
	GM_download({url: new_url, name: filename, saveAs: true});
	//===========================================================*/
	if ( window.location.href.substring("imgur") > -1) {
		fadeImg(pointed_div);
	}
	else { fadeImg(pointed_obj); }
}

function openThisInTab(thelink) { //requires Tumblr Image Size script for best results
	//console.log("openThisInTab(): " + thelink);
	if( !modkey_pressed || thelink === undefined ) { return; }
	GM_openInTab( thelink );
}

document.addEventListener("keydown", function(event){
	if( event.keyCode==87 && event.shiftKey && !isMediaDisplayed()) {
		modkey_pressed = true;
		downloadThis(currentLink);
	}
	else if (!isMediaDisplayed() && event.altKey){
		modkey_pressed = true;
		openThisInTab(currentLink);
	}
	else if (isMediaDisplayed() && currentLink !== undefined && event.shiftKey ){  //Download with only one key press
		var filename = currentLink.substring(currentLink.lastIndexOf('/')+1);
		GM_download({url: currentLink, name: filename, saveAs: true});
	}
	//console.log("%c Key currentLink        :" + currentLink, 'background: #222; color: #bb55cc' );
});

document.addEventListener("keyup", function(event){
	//if( event.keyCode==87 && event.shiftKey) {
	//    modkey_pressed = false;
	//}
	if (event.keycode!==0) {
		modkey_pressed = false;
		currentLink = undefined;
		//console.log("ctrl_pressed is:" + modkey_pressed);
	}
});

document.addEventListener("keypress", onKeyPress);

function onKeyPress(event){
	if( event.keyCode!=87 && !event.shiftKey ) {
		modkey_pressed = false;
	}
}

window.document.addEventListener("mousemove",function(event){ //or "mousemove" or "mouseover" or mouseenter
	if( event.keyCode!=87 && !event.shiftKey ) {
		//get_iframes_id();
		monitorLinks();
	}
});

function monitorLinks(){
	for(var i =0; i < img_links.length; i++){
		img_links[i].onmouseenter = function(){
			//console.log("monitorLinks(): img_links[" + i + "]: updateLink with: " + this.src);
			updateLink(this.src);
			pointed_obj = this;
		};
	}
	for(var j =0; i < divs.length; i++){
		divs[i].onmouseenter = function(){
			pointed_div = this;
		};
	}
}

//====================================================================
// Tumblr/imgur specific checks

var sizes = [ '_raw.', '_1280.' ];
var new_url;

function checkSize(index, url) {
	if (url === undefined) { console.log("checkSize(): arg was undefined."); new_url = "NOLINK!"; return; }
	if (url.indexOf("tumblr") > -1) {
		if(url.indexOf("avatar") > -1) { new_url = url ; return; }
		if (index >= sizes.length) return;
		new_url = url.replace(/(https?:\/\/)?\d+\.(.*(?=_))(_\d*.)(.*)/, '$1' + '$2' + sizes[index] + '$4');
		if (new_url == url) return;
		$.ajax({
			url: new_url,
			type: 'HEAD',
			success: function(data, textStatus, jqXHR) {
				//console.log("New url is:" + new_url);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				checkSize(index + 1);
			}
		});
	}
	else if (url.indexOf("imgur.com") > -1) {
		new_url = url.replace(/(https?:\/\/.*)&t.*/, '$1');  //remove imgur junk
		new_url = new_url.replace(/(https?:\/\/.*)g(\..*)/, '$1' + '$2' ); //don't fetch thumbnail
		//console.log("imgur new link: " + new_url);
	}
	else { new_url = url; return; }
}



//====================================================

function fadeImg(img){
	//console.log("fadeImg(): " + img);
	img.style.opacity = "0.4";
}
