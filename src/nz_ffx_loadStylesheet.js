;
/**
 * This is a stylesheet loader which is useful for controlling the dynamic loading of
 * CSS. It provides the following features:
 * - load CSS from a string or a stylesheet URL
 * - returns a promise representing whether the CSS has loaded
 * Inspired by the Filament Group's work on CSS loading: https://github.com/filamentgroup/loadCSS
 */

(function(window) {
    'use strict';

    // Create an array for storing our stylesheet promises.
    var stylesheetsLoaded = [];

    /**
     * Load the supplied stylesheet url at the end of the <body>
     * @param  {string} url         The stylesheet URL to load
     * @param  {string} stylesClass An optional class that we'll attach to the
     *                              rendered <style> element.
     * @param  {string} media       The media to which we wish the stylesheet to apply.
     *                              Defaults to 'all'.
     * @return {window.Promise}     The promise representing whether the stylesheet has loaded.
     */
    function _loadStylesheetFromURL(url, stylesClass, media) {
        // https://github.com/filamentgroup/loadCSS/blob/master/src/loadCSS.js
        var stylesheetPromise = new window.Promise(function(resolve, reject) {

            var doc = window.document;
            var refs = (doc.body || doc.getElementsByTagName('head')[0]).childNodes;
            var ref = refs[ refs.length - 1];

            // Create a new link tag
            var link = document.createElement('link');

            // Use the url argument as source attribute
            link.rel = 'stylesheet';
            link.href = url;

            // Temporarily set media to something inapplicable to ensure
            // it'll fetch without blocking render
            link.media = 'only x';

            if (stylesClass) {
                link.classList.add(stylesClass);
            }

            function loadCB() {
                if (link.addEventListener) {
                    link.removeEventListener( 'load', loadCB );
                }

                link.media = media || 'all';
                resolve(url);
            }

            // Call resolve when it’s loaded
            if (link.addEventListener) {
                link.addEventListener('load', function() {
                    loadCB();
                }, false);
            } else {
                link.attachEvent('load', function() {
                    loadCB();
                });
            }

            // Reject the promise if there’s an error
            if (link.addEventListener) {
                link.addEventListener('error', function() {
                    reject(url);
                }, false);
            } else {
                link.attachEvent('error', function() {
                    reject(url);
                });
            }

            // wait until body is defined before injecting link. This ensures a non-blocking load in IE11.
            function ready(cb) {
                if (doc.body) {
                    return cb();
                }
                setTimeout(function() {
                    ready(cb);
                });
            }

            // Inject link
            // Note: `insertBefore` is used instead of `appendChild`, for safety
            // re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
            ready(function() {
                ref.parentNode.insertBefore(link, ref.nextSibling);
            });
        });

        // Add our script to the stylesheetsLoaded array so other parts of the application
        // can determine whether a given stylesheet is / has been script loaded.
        stylesheetsLoaded.push({
            urlOrStyles: url,
            promise: stylesheetPromise,
        });

        return stylesheetPromise;
    }

    /**
     * Load the supplied styles into the head.
     * @param  {string} styles      The styles we wish to load
     * @param  {string} stylesClass An optional class that we'll attach to the
     *                              rendered <style> element.
     * @param  {string} media       The media to which we wish the stylesheet to apply.
     *                              Defaults to 'all'.
     * @return {window.Promise}     A promise that indicates when the styles are available.
     */
    function _loadStylesheetFromCSS(styles, stylesClass, media) {
        var stylesheetPromise = new window.Promise(function(resolve, reject) {

            var doc = window.document;
            var refs = (doc.body || doc.getElementsByTagName('head')[0]).childNodes;
            var ref = refs[ refs.length - 1];

            var stylesheet = document.createElement('style');

            try {
                stylesheet.type = 'text/css';

                if (stylesheet.styleSheet) {
                    stylesheet.styleSheet.cssText = styles;
                } else {
                    stylesheet.appendChild(document.createTextNode(styles));
                }

                if (stylesClass) {
                    stylesheet.classList.add(stylesClass);
                }

                stylesheet.media = media || 'all';
                ref.parentNode.insertBefore(stylesheet, ref.nextSibling);

                resolve(styles);
            } catch (error) {
                reject(error, styles);
            }
        });

        // Add our script to the stylesheetsLoaded array so other parts of the application
        // can determine whether a given stylesheet is / has been script loaded.
        stylesheetsLoaded.push({
            urlOrStyles: styles,
            promise: stylesheetPromise,
        });

        return stylesheetPromise;
    }

    /**
     * Return the promise of the supplied stylesheet.
     * If the stylesheet has not already been loaded, force the load.
     * @param  {string} urlOrStyles  A script URL
     * @param  {string} stylesClass  An optional class that we'll attach to the
     *                               rendered <style> element.
     * @param  {string} media        The media to which we wish the stylesheet to apply.
     *                               Defaults to 'all'.
     * @return {window.Promise}      The promise representing whether the stylesheet has loaded.
     */
    var ffxnzLoadStylesheet = function(urlOrStyles, stylesClass, media) {
        var promise;

        var stylesheets = stylesheetsLoaded.filter(function(item) {
            return item.urlOrStyles === urlOrStyles;
        });

        if (stylesheets.length) {
            promise = stylesheets[0].promise;
        } else {
            // Our stylesheet hasn't been previously requested for load,
            // so let's determine if it's a URL or a string of CSS and load it.
            if (/\.css$/.test(urlOrStyles)) {
                promise = _loadStylesheetFromURL(urlOrStyles, stylesClass, media);
            } else {
                promise = _loadStylesheetFromCSS(urlOrStyles, stylesClass, media);
            }
        }

        return promise;
    };

    if (typeof module !== 'undefined' && module.exports) {
        // commonjs
        exports = module.exports = ffxnzLoadStylesheet;
    } else {
        // browserland
        window.nz = window.nz || {};
        window.nz.ffx = window.nz.ffx || {};
        window.nz.ffx.loadStylesheet = ffxnzLoadStylesheet;
        window.nz.ffx.stylesheetsLoaded = stylesheetsLoaded;
    }

}(typeof global !== 'undefined' ? global : this));
