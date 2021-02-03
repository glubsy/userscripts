// ==UserScript==
// @name            GFYCAT | Show all Download Links (GIF, MP4, WEBP, WEBM)
// @namespace       de.sidneys.userscripts
// @homepage        https://gist.githubusercontent.com/sidneys/1af7b31282fa5019b6213d48e3b47c88/raw/
// @version         2.0.1
// @description     Adds direct links to all image (.gif, .webp) and video (.mp4, .webm) formats and sizes on Gfycat.
// @author          sidneys
// @updateURL       https://greasyfork.org/scripts/408129-gfycat-show-all-download-links-gif-mp4-webp-webm/code/GFYCAT%20%7C%20Show%20all%20Download%20Links%20(GIF,%20MP4,%20WEBP,%20WEBM).user.js
// @icon            https://gfycat.com/assets/apple-touch-icon/apple-touch-icon-180x180.png
// @include         http*://*.gfycat.com/*
// @include         http*://gfycat.com/*
// @include         http*://redgifs.com/*
// @include         http*://*.redgifs.com/*
// @require         https://greasyfork.org/scripts/38888-greasemonkey-color-log/code/Greasemonkey%20%7C%20Color%20Log.js
// @require         https://greasyfork.org/scripts/374849-library-onelementready-es6/code/Library%20%7C%20onElementReady%20ES6.js
// @grant           GM.addStyle
// @grant           unsafeWindow
// @run-at          document-idle
// ==/UserScript==

/**
 * ESLint
 * @global
 */
/* global onElementReady */
let Debug = false

const formats = {
'mp4': {'type' : 'video/mp4', 'name': 'MP4', 'def_size': 'large'},
'webm': {'type': 'image/webm', 'name': 'WEBM', 'def_size': ''},
'webp': {'type': 'image/webp', 'name': 'WEBP', 'def_size': ''},
'max5mbGif': {'type': 'image/gif', 'name': 'GIF', 'def_size': '< 5M'},
'max2mbGif': {'type': 'image/gif', 'name': 'GIF', 'def_size': '< 2M'},
'max1mbGif': {'type': 'image/gif', 'name': 'GIF', 'def_size': '< 1M'},
'mobile': {'type': 'video/mp4', 'name': 'MOBILE', 'def_size': 'mobile'}
}

/**
 * Inject Stylesheet
 */
let injectStylesheet = () => {
    console.debug('injectStylesheet')

    GM.addStyle(`
        /* Container
           ======================================= */

        .gif-info__direct-download-links
        {
            display: block;
            animation: var(--animation-fade-in);
        }


        /* Header
           ======================================= */

        .gif-info__direct-download-links h4
        {
            margin: 1rem 0 0.5rem 0;
            font-weight: 700;
        }

        /* Data
           ======================================= */

        .gif-info__direct-download-links p,
        .gif-info__direct-download-links a
        {
            margin: 0;
        }

        .gif-info__direct-download-links a
        {
            display: inline;
            list-style: none;
            transition: all 150ms ease-in-out;
        }

        .gif-info__direct-download-links a:after
        {
            content: "\\A";
            white-space: pre;
        }

        .gif-info__direct-download-links a:hover
        {
            text-decoration: underline;
            color: white;
        }


        /* Animations
           ======================================= */
        :root
        {
            --animation-fade-in: 'fade-in' 500ms ease-in-out 0s 1 normal forwards running;
        }

        @keyframes fade-in {
            from {
                filter: opacity(0);
            }
            to {
                filter: opacity(1);
            }
        }
    `)
}

/**
 * Convert filesize in bytes to human-readable format
 * @param {Number} bytes - Filesize in bytes
 * @return {String} - Filesize, human-readable
 */
let bytesToSize = (bytes = 0) => {
    console.debug('bytesToSize')

    const sizeList = ['B', 'K', 'M', 'G', 'T']
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))

    return `${Math.round(bytes / Math.pow(1024, i), 2)}${sizeList[i]}`
}

/**
 * Get GIF Info
 * @return {Object} - GIF Info
 */
let getGifInfo = () => {
    console.debug('getGifInfo')

    // Get url of current GIF
    const canonicalHref = document.querySelector('link[rel="canonical"]').href

    // Parse id of current GIF, removing trailing tags
    const gifIdFull = canonicalHref.split(/[\\/]/).pop()
    const gifId = gifIdFull.split('-')[0]

    // Use GIF Id to lookup GIF Info
    const cachedGifsMap = new Map(Object.entries(unsafeWindow.___INITIAL_STATE__.cache.gifs))
    const gifInfo = cachedGifsMap.get(gifId)

    return gifInfo
}

/**
 * Add buttons
 * @param {Element} targetElement - Target Element
 * @param {Object} gifInfo - GIF Info
 * @param {function=} callback - Callback
 */
let addButtons = (targetElement, gifInfo, callback = () => {}) => {
    console.debug('addButtons')

    // Create link menu from gifInfo.content_urls property
    const containerElement = document.createElement('div')
    containerElement.className = 'gif-views gif-info__direct-download-links'

    let inner_html = `
<h4>GIF Name:</h4>
<p>${gifInfo.gfyName}</p>
<h4>GIF Download Links:</h4>`

    for (const [key, value] of Object.entries(formats)) {
        if (!gifInfo.content_urls[key]) {
            continue
        }
        inner_html += `<a href="${gifInfo.content_urls[key]}" target="_blank" type="${value.type}">${value.name} (${!!gifInfo.content_urls[key].size ? bytesToSize(gifInfo.content_urls[key].size) : value.def_size})</a>`
    }

    containerElement.innerHTML = inner_html;

    // Render link menu
    targetElement.insertBefore(containerElement, targetElement.firstChild.nextSibling)

    // DEBUG
    console.debug('buttons added:', `${document.querySelectorAll('.gif-info__direct-download-links a').length}`)

    // Callback
    callback()
}


/**
 * Init
 */
let init = () => {
    console.debug('init')

    // Add Stylesheet
    injectStylesheet()

    // Wait for button container
    //onElementReady('.share-desktop-container .actual-gif-image', false, () => {
    onElementReady('link[rel="canonical"]', false, () => {
        console.debug('onElementReady', 'link[rel="canonical"]')

        // Lookup GIF info
        const gifInfo = getGifInfo()

        if (!gifInfo) {
            console.error('Could not find GIF info, aborting.')
            return
        }

        // Add buttons to container element
        addButtons(document.querySelector('.share-desktop-container .gif-info'), gifInfo, () => {
            // Status
            console.info('Added Download Links for GIF:', gifInfo.gfyName)
        })
    })
}

/**
 * @listens window:Event#load
 */
window.addEventListener('load', () => {
    console.debug('window#load')

    init()
})
