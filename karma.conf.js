module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS2'],
    frameworks: ['jasmine', 'fixture'],
    reporters: ['spec'],
    plugins: [
        'karma-jasmine',
        'karma-fixture',
        'karma-html2js-preprocessor',
        'karma-phantomjs2-launcher',
        'karma-spec-reporter'
    ],
    preprocessors: {
      '**/*.html': ['html2js']
    },
    files: [
        'node_modules/promise-polyfill/promise.js',
        'src/*.js',
        'test/spec/*',
        {pattern: 'test/fixture/*', included: false, served: true, nocache: false},
    ],
  });
};
