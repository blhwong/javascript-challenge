# javascript-challenge
Author: Brandon Wong
Date Modified: 9/29/2016

This is a Javascript framework project to detect nodes within whitelist,
blacklist, and the general structure of program.

parse.js is my original code and I used browserify to create bundle.js
so that require functions are working for acorn and estree-walker.

Create more whiteList and blackList elements by creating more node types
following the estree spec within the whiteList and blackList objects under 
parse.js and setting the elements to false. 
e.g. 
var whiteList =
{
    "VariableDeclaration":false,
    "ForStatement":false
};

Make sure it is compiled within browserify since html file is linked with
bundle.js

Open index.html in browser to run framework. CodeMirror was used to wire
my textarea. Add code within text editor and hit submit to view results.
