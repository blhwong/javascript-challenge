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

var wantedNodeTypes =
{
    "Functions":true,
    "IfStatement":true,
    "SwitchStatement":true,
    "WhileStatement":true,
    "DoWhileStatement":true,
    "ForStatement":true,
    "ForInStatement":true,
    "FunctionDeclaration":true,
    "VariableDeclaration":true
}



function peek(array)
{
    return array[array.length -1];
}

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

    var endStack = new Array();
    //console.log(whiteList, blackList);
    var x = document.getElementById("myTextarea").value;
    var ast = acorn.parse(x);
    var structureResult = "";
    walk(ast, {
      enter: function(node, parent)
      {

          if(!wantedNodeTypes[node.type])
          {
              //console.log("Returning");
              //console.log('Returned',node.type);
              return;
          }
          console.log(node, endStack, endStack.length, peek(endStack));
          //console.log(endStack[0]);
          if(whiteList.hasOwnProperty(node.type) && !whiteList[node.type])
          {
              //console.log("Found White list Item");
              /*
              if(!whiteList[node.type])
              {
                  //console.log("Changing to true");
                  whiteList[node.type] = true;
              }
              */
              whiteList[node.type] = true;
              //console.log(whiteList);
          }
          if(blackList.hasOwnProperty(node.type) && !blackList[node.type])
          {
              //console.log("Found Black list Item");
              /*
              if(!blackList[node.type])
              {
                  //console.log("Changing to true");
                  blackList[node.type] = true;
              }
              */
              blackList[node.type] = true;
              //console.log(blackList);
          }
          if(!structureResult)
          {
              structureResult = "This program starts with a " + node.type;
              //startStack.push(node.start);
              endStack.push([node.end, node.type]);
              //console.log(peek(startStack), peek(endStack));
          }
          else
          {
              //console.log(node.start, endStack[0]);
              if(node.start > peek(endStack)[0])
              {
                  //next
                  //startStack.pop();
                  console.log("before" + peek(endStack));
                  endStack.pop();
                  //console.log(endStack, endStack.length);
                  console.log("after" + peek(endStack));
                  if(endStack.length > 0)
                  {
                      //var top = peek(endStack);
                      console.log(endStack, peek(endStack), endStack.length);
                      structureResult += ". Continuing within " + peek(endStack)[1] + ", there is a " + node.type;
                  }
                  else
                  {
                      structureResult += ". Next, there is a " + node.type;
                  }

                  //startStack.push(node.start);
                  endStack.push([node.end, node.type]);
              }
              else
              {
                  //go inside
                  structureResult += ", and inside there is a " + node.type;
                  //startStack.push(node.start);
                  endStack.push([node.end, node.type]);
              }
          }


      }
    });

    if(structureResult)
    {
        structureResult+= '.';
    }
    else
    {
        structureResult = "This program is empty";
    }

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
    else
    {
        whiteListResult = "is good."
    }



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
    else
    {
        blackListResult = "is good."
    }
    document.getElementById("whitelist").innerHTML="1. (Whitelist) " + whiteListResult;
    document.getElementById("blacklist").innerHTML="2. (Blacklist) " + blackListResult;
    document.getElementById("structure").innerHTML="3. (Structure) " + structureResult;
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
