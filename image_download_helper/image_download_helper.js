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

document.addEventListener ("DOMContentLoaded", DOM_ContentReady);

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
	togglePopup();
	//$('#popup').html(filename);
	document.getElementById('myPopup').innerHTML = filename;
}



var modkey_pressed = false;

document.addEventListener("keydown", function(event){
	if( event.keyCode==87 && event.shiftKey) {
		modkey_pressed = true;
		downloadThis(currentLink);
		updateToolTipStart();
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
			};
		}
	}
});

//====================================================

function DOM_ContentReady () {
	console.log ("==> 2nd part of script run.", new Date() );
	//$("head").append(' <style> \
	GM_addStyle( '.popup {\
position: relative;\
display: inline-block;\
cursor: pointer;\
-webkit-user-select: none;\
-moz-user-select: none;\
-ms-user-select: none;\
user-select: none;\
}\
\
.popup .popuptext {\
visibility: hidden;\
width: 160px;\
background-color: #ffffff;\
color: #ff0000;\
text-align: center;\
border-radius: 6px;\
padding: 8px 0;\
position: absolute;\
z-index: 1;\
bottom: 125%;\
left: 50%;\
margin-left: -80px;\
}\
\
.popup .popuptext::after {\
content: "";\
position: absolute;\
top: 100%;\
left: 50%;\
margin-left: -5px;\
border-width: 5px;\
border-style: solid;\
border-color: #555 transparent transparent transparent;\
}\
\
.popup .show {\
visibility: visible;\
-webkit-animation: fadeIn 1s;\
animation: fadeIn 0.5s;\
}\
\
@-webkit-keyframes fadeIn {\
from {opacity: 0;}\
to {opacity: 1;}\
}\
\
@keyframes fadeIn {\
from {opacity: 0;}\
to {opacity:1 ;}\
}\
' );
	$("body").append('<span class="popuptext" id="myPopup">TESQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQT</span>');
	updateTooltips();
}

var tooltips = document.querySelectorAll('.popuptext');

function updateTooltips(){
	tooltips = document.querySelectorAll('.popuptext');
	for (i = 0; i < tooltips.length; i++){
		console.log("tooltips:" + tooltips[i].id + " / " + tooltips.length);
	}
}


function togglePopup() {
	getCoords(event);
	var popup = document.getElementById("myPopup");
	popup.classList.toggle("show");
	setTimeout(function(){
		popup.classList.toggle("show");
	}, 3000);
}

function getCoords(event) {
	var x_coord = event.clientX + "px";
	var y_coord = event.clientY + "px";
	//$("#popup").css('top', x_coord +'px');
	//$("#popup").css('left', y_coord +'px');
	//document.querySelector('.popuptext').style.position = 'absolute';
	document.querySelector('.popuptext').style.top = y_coord +'px';
	document.querySelector('.popuptext').style.left = x_coord +'px';
	//document.querySelector('.popup').style.top = y_coord +'px';
	//document.querySelector('.popup').style.left = x_coord +'px';
}

function updateToolTipStart(){
	window.onmousemove = function updateTooltipPos(e){
		var x = (e.clientX) + 'px',
			y = (e.clientY) + 'px';
		for (var i = 0; i < tooltips.length; i++) {
			//console.log("tooltips:" + tooltips[i].id + " / " + tooltips.length);
			tooltips[i].style.top = y;
			tooltips[i].style.left = x;
			console.log("update with:" + x + " " + y );
		}
	};
}
