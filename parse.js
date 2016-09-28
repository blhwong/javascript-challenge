var acorn = require('acorn');
var walk = require('estree-walker').walk;

var whiteList =
{
    "VariableDeclaration":false,
    "ForStatement":false
};

var blackList =
{
    "WhileStatement":false,
    "IfStatement":false
};

function getResults()
{
    for(var i in whiteList)
    {
        whiteList[i] = false;
    }
    for(var j in blackList)
    {
        blackList[j] = false;
    }
    //console.log(whiteList, blackList);
    var x = document.getElementById("myTextarea").value;
    var ast = acorn.parse(x);
    walk(ast, {
      enter: function(node, parent)
      {
          console.log(node, "node");
          if(whiteList.hasOwnProperty(node.type))
          {
              //console.log("Found White list Item");
              if(!whiteList[node.type])
              {
                  //console.log("Changing to true");
                  whiteList[node.type] = true;
              }
              //console.log(whiteList);
          }
          if(blackList.hasOwnProperty(node.type))
          {
              //console.log("Found Black list Item");
              if(!blackList[node.type])
              {
                  //console.log("Changing to true");
                  blackList[node.type] = true;
              }
              //console.log(blackList);
          }
      }
    });
    var whiteListResult = "";
    for(var i in whiteList)
    {
        if(!whiteList[i])
        {
            if(!whiteListResult)
            {
                whiteListResult = "This program MUST use a " + i;
            }
            else
            {
                whiteListResult += " and a " + i;
            }
        }
    }
    if(whiteListResult)
    {
        whiteListResult +='.';
    }

    document.getElementById("whitelist").innerHTML=whiteListResult;

    var blackListResult = "";
    for(var i in blackList)
    {
        if(blackList[i])
        {
            if(!blackListResult)
            {
                blackListResult = "This program MUST NOT use a " + i;
            }
            else
            {
                blackListResult += " or a " + i;
            }
        }
    }
    if(blackListResult)
    {
        blackListResult +='.';
    }

    document.getElementById("blacklist").innerHTML=blackListResult;
    document.getElementById("parsed").innerHTML=JSON.stringify(ast, null, 2);
}
/*
function traverse(array)
{
    for(var key in array)
    {
        console.log(array[key]);
        if(whiteList.hasOwnProperty(array[key].type))
        {
            //console.log("Found White list Item");
            if(!whiteList[array[key].type])
            {
                //console.log("Changing to true");
                whiteList[array[key].type] = true;
            }
            //console.log(whiteList);
        }
        if(blackList.hasOwnProperty(array[key].type))
        {
            //console.log("Found Black list Item");
            if(!blackList[array[key].type])
            {
                //console.log("Changing to true");
                blackList[array[key].type] = true;
            }
            //console.log(blackList);
        }
    }
}
*/
window.onload = function()
{
    var btn = document.getElementById("myButton");
    btn.onclick = getResults;
}
