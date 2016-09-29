var acorn = require('acorn');
var walk = require('estree-walker').walk;

/*
add more items to whiteList by creating Node types and setting them to false.
*/
var whiteList =
{
    "VariableDeclaration":false,
    "ForStatement":false
};

/*
add more items to blackList by creating Node types and setting them to false.
*/
var blackList =
{
    "WhileStatement":false,
    "IfStatement":false
};

/*
add more items to wantedNodeTypes so that the walker function traverses
through the relevant Nodes.
*/
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

/*
Checks the top of the stack
*/
function peek(array)
{
    return array[array.length -1];
}

/*
Gets results of whiteList, blackList, and structure.
*/
function getResults()
{
    for(var i in whiteList)
    {
        //clears whiteList previously detected
        whiteList[i] = false;
    }
    for(var j in blackList)
    {
        //clears blackList previously detected
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
              //skips nodes that aren't wanted
              return;
          }
          if(whiteList.hasOwnProperty(node.type) && !whiteList[node.type])
          {
              //whiteList node detected!
              whiteList[node.type] = true;
          }
          if(blackList.hasOwnProperty(node.type) && !blackList[node.type])
          {
              //blackList node detected!
              blackList[node.type] = true;
          }
          //structure algorithm begins here
          if(!structureResult)
          {
              //this is the first node in the structure detected!
              structureResult = "This program starts with a " + node.type;
              endStack.push([node.end, node.type]);
          }
          else
          {
              if(node.start > peek(endStack)[0])
              {
                  //if the current start position of node is greater than
                  //the top of the stack then we need to continue to next node
                  while(endStack.length > 0 && node.start > peek(endStack)[0])
                  {
                      //pops nodes off the stack that are previous to current node
                      endStack.pop();
                  }
                  if(endStack.length > 0)
                  {
                      //if the current node is still within a node
                      structureResult += ". Continuing within " + peek(endStack)[1] + ", there is a " + node.type;
                  }
                  else
                  {
                      //if the current node is not within a node
                      structureResult += ". Next, there is a " + node.type;
                  }
                  endStack.push([node.end, node.type]);
              }
              else
              {
                  //need to traverse inside the node
                  if(parent.type == "ForStatement" && node.type == "VariableDeclaration")
                  {
                      //ignores variable delecration within forloop control
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
        //if there was a result then concat a period
        structureResult+= '.';
    }
    else
    {
        //result was blank
        structureResult = "This program is empty.";
    }
    var whiteListResult = "";
    for(var i in whiteList)
    {
        //iterate whiteList to detect those unused
        if(!whiteList[i])
        {
            if(!whiteListResult)
            {
                //first whiteList element was not used
                whiteListResult = "This program MUST use a " + i;
            }
            else
            {
                //subsequent whiteList elements not used
                whiteListResult += " and a " + i;
            }
        }
    }
    if(whiteListResult)
    {
        //add period if result is not empty
        whiteListResult +='.';
    }
    else
    {
        //all whiteList elements were used
        whiteListResult = "is good."
    }
    var blackListResult = "";
    for(var i in blackList)
    {
        //iterate whiteList to detect those used
        if(blackList[i])
        {
            if(!blackListResult)
            {
                //first blackList element used
                blackListResult = "This program MUST NOT use a " + i;
            }
            else
            {
                //subsequent blackList elements used
                blackListResult += " or a " + i;
            }
        }
    }
    if(blackListResult)
    {
        //add period if result is not empty.
        blackListResult +='.';
    }
    else
    {
        //all blackList elements were unused
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
