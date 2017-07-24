// ==UserScript==
// @name       Custom keyboard shortcuts
// @namespace  test
// @version    0.1
// @description  add keyboard + mouse shortcut to open images in new tab
// @match      *
// @include *
// @copyright  Fuck copyrights
//// @require  	   https://code.jquery.com/jquery-1.11.2.min.js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @grant    GM_openInTab
// @grant    GM_download
// @grant    GM_addStyle
// @run-at      document-start
// @noframes
/*jshint multistr: true */
// ==/UserScript==

/*==================================================
//  Update size of to-be-downloaded-file to best size available from server
//==================================================*/

//document.addEventListener ("DOMContentLoaded", DOM_ContentReady);

var sizes = [ '_raw.', '_1280.' ];
var new_url;

function checkSize(index, url) {
	if (url.indexOf("NOLINK!") > - 1) { new_url = url; return; }
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
		new_url = url.replace(/(https?:\/\/.*)&t.*/, '$1');
	}
	else { new_url = url; return; }
}

/*
//display element under mouse
$(window).mouseenter(function(e) {
    var x = e.clientX, y = e.clientY,
        elementMouseIsOver = document.elementFromPoint(x, y);

    alert(elementMouseIsOver);
});
*/

//=====================================================

var links = document.getElementsByTagName('img'),
	//linkDisplay = document.getElementById('currentLink'),
	currentLink = "NOLINK!";

/*
for(var i =0; i < links.length; i++){
    links[i].onmouseover = function(){updateLink(this.src);};
    links[i].onfocus= function(){updateLink(this.src);};
}
*/

//=======================================================

function updateLink(newlink) {
	console.log("%c BEEFORE updateLink :" + currentLink,'background: #222; color: #ccaa99');
	currentLink = newlink;
	console.log("%c AFTER updateLink   :" + currentLink ,'background: #222; color: #bada99');
}

function downloadThis(currentLink) {
	if( !modkey_pressed ) {
		return;
	}
	//GM_openInTab( currentLink );
	console.log("%c Downloading currentlink :" + currentLink, 'background: #222; color: #bada55' );
	checkSize(0, currentLink);
	console.log("%c new_url                 :" + new_url, 'background: #222; color: #f46b42');
	if ( new_url.indexOf("NOLINK!") > -1) { return; }
	//=========================================================
	var filename = new_url.substring(new_url.lastIndexOf('/')+1);
	//GM_download({url: new_url, name: filename, saveAs: true});
	//===========================================================*/
	fadeImg(pointed_obj);
}



var modkey_pressed = false, pointed_obj;

document.addEventListener("keydown", function(event){
	if( event.keyCode==87 && event.shiftKey) {
		modkey_pressed = true;
		downloadThis(currentLink);
	}
	console.log("%c Key currentlink        :" + currentLink, 'background: #222; color: #bb55cc' );
});

document.addEventListener("keyup", function(event){
	//if( event.keyCode==87 && event.shiftKey) {
	//    modkey_pressed = false;
	//}
	if (event.keycode!==0) {
		modkey_pressed = false;
		//console.log("ctrl_pressed is:" + modkey_pressed);
	}
});

document.addEventListener("keypress", function(event){
	if( event.keyCode!=87 && !event.shiftKey ) {
		modkey_pressed = false;
	}
});

document.addEventListener("mousemove",function(event){ //or "mousemove" or "mouseover" or mouseenter
	if( event.keyCode!=87 && !event.shiftKey ) {
		for(var i =0; i < links.length; i++){
			links[i].onmouseenter = function(){
				updateLink(this.src);
				pointed_obj = this;
			};
		}
	}
});

//====================================================

function fadeImg(img){
	img.style.opacity = "0.4";
}

function DOM_ContentReady () {
}
