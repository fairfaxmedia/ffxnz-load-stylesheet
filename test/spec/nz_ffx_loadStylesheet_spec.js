describe("nz_ffx_loadStylesheet.js", function() {
    'use strict';

    beforeEach(function () {
        // Ensure that all stylesheets have been removed
        ['head style', 'link[rel=stylesheet]'].forEach(function(item){
            var stylesheets = document.querySelectorAll(item);
            for (var i = 0; i < stylesheets.length; i++) {
                stylesheets[i].parentNode.removeChild(stylesheets[i]);
            }
        });
    })

    it("should be available", function() {
        expect(typeof(nz.ffx.loadStylesheet)).toBe('function');
    });

    it("should be able to load CSS into a style tag", function(done) {
        var testLoadingCSS = 'body {background-color: rgb(255, 0, 0);}';
        var testLoadingCSSClass = 'testLoadingCSSString';
        var testLoadingPromise = nz.ffx.loadStylesheet(testLoadingCSS, testLoadingCSSClass);

        testLoadingPromise
            .then(function(styles) {
                expect(styles).toBe(testLoadingCSS);
                expect(document.querySelectorAll('.' + testLoadingCSSClass).length).toBe(1);
                expect(
                    getComputedStyle(document.querySelector('body'))['background-color']
                ).toBe('rgb(255, 0, 0)');
                done()
            })
            .catch(function(error) {
                console.log(error);
                // Force a failure
                expect(error).toBe(null);
                done()
            })
    });

    it("should be able to load an external stylesheet", function(done) {
        var testLoadingUrl = 'base/test/fixture/testStylesheet.css';
        var testLoadingCSSClass = 'testLoadingCSSExternalStylesheet';
        var testLoadingPromise = nz.ffx.loadStylesheet(testLoadingUrl, testLoadingCSSClass);

        // Wrap our test in a timeout to ensure PhantomJS has enough time to render
        // the styles after the stylesheet has been attached to the DOM.
        setTimeout(function() {
            testLoadingPromise
                .then(function(url) {
                    expect(url).toBe(testLoadingUrl);
                    expect(document.querySelectorAll('.' + testLoadingCSSClass).length).toBe(1);
                    expect(
                        getComputedStyle(document.querySelector('body'))['background-color']
                    ).toBe('rgb(0, 255, 0)');
                    done()
                })
                .catch(function(error) {
                    console.log(error);
                    // Force a failure
                    expect(error).toBe(null);
                    done()
                })
        }, 1000);

    });

    afterEach(function () {
    })

});
