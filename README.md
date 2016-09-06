# What is this?

This is a stylesheet loader which is useful for controlling the dynamic loading of
CSS. It provides the following features:

* easy one-time dynamic loading of external stylesheets
* easy dynamic loading of CSS using a <style> tag
* returns a promise representing whether the stylesheet has loaded

Inspired by the Filament Group's work on CSS loading: https://github.com/filamentgroup/loadCSS


## Installation

Using NPM:

    # Once installed, the script can be found at:
    # node_modules/load-stylesheet/src/nz_ffx_loadStylesheet
    npm install --save git+https://github.com/fairfaxmedia/load-stylesheet.git


## Usage

    // Load arbitrary styles into a <style> tag, to appear at the end of the <body>
    // (if present in the DOM), otherwise at the end of the <head>.
    // Note that we use the nz.ffx psuedo-namespace to prevent collisions
    var myStylesheet = nz.ffx.loadStylesheet(
        'body {background-color: rgb(255, 0, 0);}',
        'myStylesheetClass',
        'screen'
    );

    // Load an external stylesheet, to appear at the end of the <body>
    // (if present in the DOM), otherwise at the end of the <head>.
    var myStylesheet = nz.ffx.loadStylesheet(
        'http://example.com/stylesheet.css'
        'myStylesheetClass',
        'print'
    );

    myStylesheet.then(function() {
        // The stylesheet is now available for use.
    });


## Tests

    npm test

Note that the karma test results can be view in the browser at:
* http://localhost:9876/
* http://localhost:9876/debug.html


## License

MIT
