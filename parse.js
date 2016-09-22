var acorn = require('acorn');

//console.log(JSON.stringify(test, null, 4));

function test()
{
    console.log("hi");
}


function displayParsed()
{
    var x = document.getElementById("myTextarea").value;
    var test = acorn.parse(x);
    document.getElementById("demo").innerHTML=JSON.stringify(test, null, 2);
}

window.onload = function() {
    var btn = document.getElementById("myButton");
    btn.onclick = displayParsed;
}
