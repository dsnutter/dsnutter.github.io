---
layout: post
title: "Unit Testing an HTML5 Canvas with Canteen"
description: "This post describes how to test a HTML5 canvas using Canteen and AngularJS with a Karma/Jasmine unit test harness."
---

What is Canteen?
----------------

[The Canteen home
page](http://labs.platfora.com/introducing-canteen-ultimate-html5-canvas-testing-library/)
describes the project as follows:

    [...Canteen...] records all of the drawing instructions, such as method calls and property changes, by creating a wrapper around the HTML5 Canvas context object that records all of these instructions and then proxies them to the native HTML5 Canvas context for rendering. 

I use Canteen to monitor the HTML5 canvas interface to build unit tests.
Canteen keeps track of all the drawing commands sent to the canvas and
you can export the commands as an array of the canvas instruction stack,
JSON, or md5sum. This yields a repeatable canvas structure that you can
compare to for unit testing. Canteen offers a simpler way to test HTML5
canvas without having to do image diffs, image recognition, or something
more complex with image or SVG exports of the canvas.

Why would I want to unit test the canvas object?
------------------------------------------------

When unit testing the canvas object, Canteen offers a way to repeatedly
verify that the drawing on the canvas executes the same canvas
instructions as when you developed the canvas codebase. I develop what I
want to draw on the canvas and use Karma and Jasmine to run tests
against it.

Installing Jasmine, PhantomJS, AngularJS, and Canteen
-----------------------------------------------------

For development I use a Windows 7 x64 machine.
[Here](https://github.com/node-xmpp/node-expat/issues/57) are some
specific notes on using node.js with Windows 7. If you are running
Windows 7 then install the [Windows
SDKs](http://www.microsoft.com/en-us/download/details.aspx?id=8279), if
you are running some other OS then ignore the instructions for Windows
7.

First, install [Node.js](https://nodejs.org/) for your platform.

If you are running Windows 7 open a Node.js command prompt, and execute
either

    call "C:\\Program Files\\Microsoft SDKs\\Windows\\v7.1\\bin\\Setenv.cmd" /Release /x86

for x86 Windows 7 or\

    call "C:\\Program Files\\Microsoft SDKs\\Windows\\v7.1\\bin\\Setenv.cmd" /Release /x64

for x64 Windows 7.

Then install [AngularJS](https://angularjs.org/) and [Angular
Mocks](https://docs.angularjs.org/api/ngMock/object/angular.mock):

    npm install angular angular-mocks

Then install [PhantomJS](http://phantomjs.org/) and
[Jasmine](http://jasmine.github.io/)

    npm install phantomjs jasmine

Then install Karma Runner and the associated Karma Plugins for Jasmine
and PhantomJS

    npm install karma karma-jasmine karma-phantomjs-launcher --save-dev

Also, under Windows 7, ignore any warnings when installing.

Clone the [Canteen](https://github.com/platfora/Canteen) github
repository (you must have [git](http://git-scm.com/) installed if you
don't already)

    git clone https://github.com/platfora/Canteen.git

Karma Configuration File
------------------------

    // Karma configuration
    module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: 'D:/projects/',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
        // referenced libraries
        'node_modules/angular/angular.min.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'Canteen/build/canteen.js',

        // application files
        'canvas.module.js',

        // unit tests
        'test.canvas.module.js'
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
        });
    };

AngularJS Code To Test
----------------------

The following AngularJS service draws a circle on a canvas.

    angular.module("lec.canvas", [])

    .factory('lec.canvas.service.draw', function() {
        // the HTML5 drawing context and items to set defaults for
        var _canvas, _context;

        return {
            // initializes parameters for the segmented drawing service
            initialize: function(canvas) {
                _canvas = canvas;
                _context = _canvas.getContext('2d');
                // clears the canvas, and resets vars
                this.clear();
            },
            context: function() {
            return _context;
            },
            // clear the canvas of any previous drawings
            clear: function() {
                _context.clearRect(0, 0, _canvas.width, _canvas.height);
            },
            // draws a circle on the canvas
            circle: function(center, radius, color) {
                _context.beginPath();
                _context.arc(center.x, center.y, radius, 0, 2*Math.PI, false);
                _context.lineWidth = 2;
                _context.strokeStyle = color;
                _context.stroke();
            },
        };
    });

Jasmine Tests
-------------

The following is the jasmine test developed to test the service that
draws the circle.

    describe('lec.canvas', function() {
    // test the segmented ring drawing functionality
    describe('lec.canvas.service.draw', function() {
        var draw;
        beforeEach(function() {
        // load the module.
        module('lec.canvas');

        inject(function($injector) {
            draw = $injector.get('lec.canvas.service.draw');
            var canvas = document.createElement('canvas');
            canvas.id     = "testCanvas";
            canvas.width  = 500;
            canvas.height = 500;
            // initialize the canvas for drawing
            draw.initialize(canvas);
        });
        });
        describe('clear', function() {
        it('erases the canvas', function() {
            draw.clear();
            var expected = 'c62e5ecf5bead7be72f252325e55bc02';

            var hash = draw.context().hash();

            //console.log('json: ' + json);
            //console.log('hash: ' + hash);

            // example unit test assertion
            expect(hash).toBe(expected);

            // clear the stack
            draw.context().clean();
        });
        });
        describe('circle', function() {
        it('creates a circle', function() {
            var expected = '';
            
            draw.circle({x: 250, y: 250}, 100, 'red');

            json = draw.context().json();
            hash = draw.context().hash();

            console.log('json: ' + json);
            console.log('hash: ' + hash);

            // example unit test assertion
            expect(hash).toBe(expected);

            // clear the stack
            draw.context().clean();
        });
        });
    });
    });

Test Runs
---------

Execute the unit test with:

karma start canvas.conf.js

The first test run is an unsuccessful test, and the code will output the
JSON and md5sum representing the canvas generated.

    [32mINFO [karma]: [39mKarma v0.12.31 server started at http://localhost:9876/
    [32mINFO [launcher]: [39mStarting browser PhantomJS
    [32mINFO [PhantomJS 1.9.8 (Windows 7)]: [39mConnected on socket nCQUhrfMg-pT57ifPpfN with id 9109488
    PhantomJS 1.9.8 (Windows 7): Executed 0 of 2[32m SUCCESS[39m (0 secs / 0 secs)
    [1A[2KPhantomJS 1.9.8 (Windows 7): Executed 1 of 2[32m SUCCESS[39m (0 secs / 0.024 secs)
    [1A[2KLOG: [36m'json: [{"method":"clearRect","arguments":[0,0,500,500]},{"method":"beginPath","arguments":[]},{"method":"arc","arguments":[250,250,100,0,6.283185307179586,false]},{"attr":"lineWidth","val":2},{"attr":"strokeStyle","val":"red"},{"method":"stroke","arguments":[]}]'[39m
    PhantomJS 1.9.8 (Windows 7): Executed 1 of 2[32m SUCCESS[39m (0 secs / 0.024 secs)
    [1A[2KLOG: [36m'hash: 00f624e6dff2bf91662a1f80f6981ad9'[39m
    PhantomJS 1.9.8 (Windows 7): Executed 1 of 2[32m SUCCESS[39m (0 secs / 0.024 secs)
    [1A[2K[31mPhantomJS 1.9.8 (Windows 7) lec.canvas lec.canvas.service.draw circle creates a circle FAILED[39m
        Expected '00f624e6dff2bf91662a1f80f6981ad9' to be ''.
            at D:/projects/Websites/content/entropteria/articles/canteen/codebase/test.canvas.module.js:50
    PhantomJS 1.9.8 (Windows 7): Executed 2 of 2[31m (1 FAILED)[39m (0 secs / 0.033 secs)
    [1A[2KPhantomJS 1.9.8 (Windows 7): Executed 2 of 2[31m (1 FAILED)[39m (0 secs / 0.033 secs)

The json canvas command result and the hash of the commands were printed
out with "console.log". You can now base a test off of either the JSON
or md5sum results. I chose the md5sum, and assigned the md5sum
'00f624e6dff2bf91662a1f80f6981ad9' in the 'expected' string, commented
out the console.log() commands, and the result is below.

    [32mINFO [karma]: [39mKarma v0.12.31 server started at http://localhost:9876/
    [32mINFO [launcher]: [39mStarting browser PhantomJS
    [32mINFO [PhantomJS 1.9.8 (Windows 7)]: [39mConnected on socket R1DzjSZ7qVhKA0l7RGp8 with id 11436839
    PhantomJS 1.9.8 (Windows 7): Executed 0 of 2[32m SUCCESS[39m (0 secs / 0 secs)
    [1A[2KPhantomJS 1.9.8 (Windows 7): Executed 1 of 2[32m SUCCESS[39m (0 secs / 0.024 secs)
    [1A[2KPhantomJS 1.9.8 (Windows 7): Executed 2 of 2[32m SUCCESS[39m (0 secs / 0.03 secs)
    [1A[2KPhantomJS 1.9.8 (Windows 7): Executed 2 of 2[32m SUCCESS[39m (0 secs / 0.03 secs)

Conclusion
----------

I really like Canteen as it offers a way to test HTML5 canvas in a
simpler way. To view an example of a more complex web application I
developed using Canteen, see
[this](/segmented-bowl-ring-calculator/).
