// ==UserScript==
// @name          Tumblr.com archives - change archive page background color
// @namespace     https://greasyfork.org
// @description	  Automatically change white background to darker one
// @author        glub, inspired by https://greasyfork.org/en/scripts/7368-anonymous-black-facebook-login-page/code
// @homepage      https://greasyfork.org/scripts/
// @include       *tumblr.com/archive*
// @run-at        document-start
// @version       0.02
// ==/UserScript==

var css = "body,html { background: #212121; } h2 { color: #d01010; }";

var node = document.createElement("style");
node.type = "text/css";
node.appendChild(document.createTextNode(css));
var heads = document.getElementsByTagName("head");
if (heads.length > 0) {
	heads[0].appendChild(node);
} else {
	// no head yet, stick it whereever
	document.documentElement.appendChild(node);
}
