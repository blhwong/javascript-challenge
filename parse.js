var esprima = require('acorn');
//var x = document.getElementById("myTextarea").value;
var test = esprima.parse('var i = 0;');
console.log(JSON.stringify(test, null, 4));
