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
    var endStack = [];
    var x = document.getElementById("myTextarea").value;
    var ast = acorn.parse(x);
    var structureResult = "";
    walk(ast, {
      enter: function(node, parent)
      {
          if(!wantedNodeTypes[node.type])
          {
              return;
          }
          if(whiteList.hasOwnProperty(node.type) && !whiteList[node.type])
          {
              whiteList[node.type] = true;
          }
          if(blackList.hasOwnProperty(node.type) && !blackList[node.type])
          {
              blackList[node.type] = true;
          }
          if(!structureResult)
          {
              structureResult = "This program starts with a " + node.type;
              endStack.push([node.end, node.type]);
          }
          else
          {
              if(node.start > peek(endStack)[0])
              {
                  while(endStack.length > 0 && node.start > peek(endStack)[0])
                  {
                      endStack.pop();
                  }
                  if(endStack.length > 0)
                  {
                      structureResult += ". Continuing within " + peek(endStack)[1] + ", there is a " + node.type;
                  }
                  else
                  {
                      structureResult += ". Next, there is a " + node.type;
                  }
                  endStack.push([node.end, node.type]);
              }
              else
              {
                  //go inside
                  if(parent.type == "ForStatement" && node.type == "VariableDeclaration")
                  {
                      return;
                  }
                  structureResult += ", and inside there is a " + node.type;
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
    //document.getElementById("parsed").innerHTML=JSON.stringify(ast, null, 2);
}

window.onload = function()
{
    var btn = document.getElementById("myButton");
    btn.onclick = getResults;
    var text = document.getElementById('myTextarea');

    var editableCodeMirror = CodeMirror.fromTextArea(text, {
        mode: "javascript",
        theme: "default",
        lineNumbers: true,
    });
    editableCodeMirror.on('change', function (cm) {
        text.value = cm.getValue();
    });
}
