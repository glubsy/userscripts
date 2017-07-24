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

/* TODO
 * check iframes structues, traverse them instead of img tags
 * check back on the css issue, demo page
 * investigate DM_download
 * create multiple tooltips, generated
 * investigate reblogs in Eza's script
 * /

/*==================================================
//  Update size of to-be-downloaded-file to best size available from server
//==================================================*/

//document.addEventListener ("DOMContentLoaded", DOM_ContentReady);

var sizes = [ '_raw.', '_1280.' ];
var new_url;

function checkSize(index, url) {
	if (url.indexOf("NOLINK!") > -1) { new_url = url; return; }
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
		console.log("imgur new link: " + new_url);
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

var modkey_pressed = false, pointed_obj, pointed_div;

var links = document.getElementsByTagName('img'),
	//linkDisplay = document.getElementById('currentLink'),
	currentLink = "NOLINK!",
	divs = document.getElementsByTagName('div');

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
	if ( window.location.href.substring("imgur") > -1) {
		fadeImg(pointed_div);
	}
	else { fadeImg(pointed_obj); }

	togglePopup();
	document.getElementById('myPopup').innerHTML = filename;
}




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

document.addEventListener("keypress", onKeyPress);

function onKeyPress(event){
	if( event.keyCode!=87 && !event.shiftKey ) {
		modkey_pressed = false;
	}
}

document.addEventListener("mousemove",function(event){ //or "mousemove" or "mouseover" or mouseenter
	if( event.keyCode!=87 && !event.shiftKey ) {
		for(var i =0; i < links.length; i++){
			links[i].onmouseenter = function(){
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
	else if ( event.shiftKey ) {
		getCoords(event);
	}
});

//====================================================

function fadeImg(img){
	console.log("fading: " + img);
	img.style.opacity = "0.4";
}

/* /===================================================

function DOM_ContentReady () {
	console.log ("==> 2nd part of script run.", new Date() );
	//$("head").append(' <style> \
	GM_addStyle( '.popup {\
position: fixed;\
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
position: fixed;\
z-index: 1;\
bottom: 10%;\
left: 50%;\
margin-left: -80px;\
}\
\
.popup .popuptext::after {\
content: "after-test";\
position: fixed;\
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
	addGlobalStyle('.popup .popuptext { position: fixed; }');

	$("body").append('<span class="popuptext" id="myPopup">TESQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQT</span>');
	updateToolTipsStart();
}

var tooltips = document.querySelectorAll('.popuptext');
//var x_coord, ycoord;
var mousePosition = {x:0, y:0};

function updateToolTips(){
	tooltips = document.querySelectorAll('.popuptext');
	for (i = 0; i < tooltips.length; i++){
		console.log("tooltips:" + tooltips[i].id + " / " + tooltips.length);
	}
}


function togglePopup() {
	console.log("togglePopup()");
	updateToolTipCoords();
	var popup = document.getElementById("myPopup");
	//popup.classList.toggle("show");
	//setTimeout(function(){
	//	popup.classList.toggle("show");
	//}, 3000);
}

function getCoords(mouseMoveEvent) {
	//x_coord = event.clientX + 'px';
	//y_coord = event.clientY + 'px';
	mousePosition.x = mouseMoveEvent.clientX + 'px';
	mousePosition.y = mouseMoveEvent.clientY + 'px';
}

function updateToolTipCoords(){
	//jQuery needed here
	$("#myPopup").css('position', "fixed");
	$("#myPopup").css('top', mousePosition.y);
	$("#myPopup").css('left', mousePosition.x);
	console.log("getCoords(): " + mousePosition.x + ", " + mousePosition.x);
	for (var i = 0; i < tooltips.length; i++) {
		tooltips[i].style.position = 'fixed';
		tooltips[i].style.top = mousePosition.y;
		tooltips[i].style.left = mousePosition.x;
	}
	//document.querySelector('.popup').style.top = y_coord +'px';
	//document.querySelector('.popup').style.left = x_coord +'px';
}

function updateToolTipsStart(){
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

function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}
*/
