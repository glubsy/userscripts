// ==UserScript==
// @name        Tumblr Image Size
// @description When directly viewing an image on Tumblr, ensures that the highest resolution image is loaded.
// @version     1.2
// @namespace   Dimethyl
// @include     /^https?://\d+\.media\.tumblr\.com/(.+/)*tumblr_.+_\d+\.(jpe?g|gif|png|bmp)(\?.*)?$/
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @grant       none
// ==/UserScript==

var sizes = [ '_raw.', '_1280.', '_540.', '_500.', '_400.', '_250.', '_100.' ];

function checkSize(index) {
    if (index >= sizes.length) return;
    var url = "";
    if (index <= 1) {
        url = window.location.href.replace(/(https?:\/\/)\d+\.(.*(?=_))(_\d*.)(.*)/, '$1' + '$2' + sizes[index] + '$4');
    }
    else if (index > 1) {
        url = window.location.href.replace(/\d+\.(.*(?=_))(_\d*.)(.*)/, '$1' + sizes[index] + '$3');
    }
    if (url == window.location.href) return;
    $.ajax({
        url: url,
        type: 'HEAD',
        success: function(data, textStatus, jqXHR) {
            window.location.replace(url);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            checkSize(index + 1);
        }
    });
}

checkSize(0);
