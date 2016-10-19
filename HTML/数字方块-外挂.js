
var solutions = []
$(function () {
    $("#load").click(function () {
        //var numbers = new Array(2, 3, 4, 5, 8, 6, 1, 7, 0);
        var txt = $.map($('.num'), function(value) {
            return Number($(value).text())
        })
        var numbers = []
        for (var i = 0; i < txt.length; i++)
            numbers.push($.trim(txt[i]) - 0)
        solutions = generateSolution(solve(numbers))
        if (solutions.length == 0) {
            alert("无解，已重新生成，请再【读取】")
            random()
            return
        }
    })

    $("#next").click(function () {
        var thisStep = solutions.shift()
        if (thisStep == 'up') {
            upMove()
        } else if (thisStep == 'down') {
            downMove()
        } else if (thisStep == 'right') {
            rightMove()
        } else if (thisStep == 'left') {
            leftMove()
        }
        popup()
    })
})

var solve = function(numbers) {
    var allstatus = new Set() //存放所有状态
    var root = new Node(null, numbers) //根节点
    var nodeList = new Array()
    nodeList.push(root)
    var finalnode = null
    var directions = new Array("up", "down", "left", "right")
    while (true) {
        var currentnode = nodeList.shift()
        if (currentnode == undefined) {
            //alert("无解");
            return []
        }
        if (checkIsOk(currentnode.Data)) {
            finalnode = currentnode
            break
        }
        for (var i = 0; i < directions.length; i++) {
            var step = move(currentnode.Data, directions[i]);
            if (step != null) {
                if (allstatus.has(step.toString()) == false) {
                    allstatus.add(step.toString())
                    var node = new Node(currentnode, step)
                    nodeList.push(node)
                }
            }
        }
    }
    var solutions = new Array()
    var currentnode = finalnode
    while (currentnode != null) {
        solutions.push(currentnode)
        currentnode = currentnode.Parent
    }
    return solutions
}

var checkIsOk = function(numbers) {
    return numbers.toString() == "1,2,3,4,5,6,7,8,0"
}

var move = function(numbers, direction) {
    var returnvalue = numbers.slice()
    //for (var i = 0; i < numbers.length; i++)
    //    returnvalue.push(numbers[i]);

    var position0 = returnvalue.indexOf(0)

    if (direction == "up") {
        if (position0 < 3) {
            return null
        } else {
            returnvalue[position0] = returnvalue[position0 - 3]
            returnvalue[position0 - 3] = 0
        }
    } else if (direction == "down") {
        if (position0 > 5) {
            return null
        } else {
            returnvalue[position0] = returnvalue[position0 + 3]
            returnvalue[position0 + 3] = 0
        }
    } else if (direction == "left") {
        if (position0 == 0 || position0 == 3 || position0 == 6) {
            return null
        } else {
            returnvalue[position0] = returnvalue[position0 - 1]
            returnvalue[position0 - 1] = 0
        }
    } else if (direction == "right") {
        if (position0 == 2 || position0 == 5 || position0 == 8) {
            return null
        } else {
            returnvalue[position0] = returnvalue[position0 + 1]
            returnvalue[position0 + 1] = 0
        }
    }

    return returnvalue
}

function Node(parentNode, data) {
    this.Parent = parentNode
    this.Data = data
}

var generateSolution = function(solution) {
    var solutionArray = []
    for (var i = solution.length - 1; i > 0 ; i--) {
        var direction = generateDirection(solution[i].Data, solution[i-1].Data)
        solutionArray.push(direction)
    }
    return solutionArray
}

var generateDirection = function(before, after) {
    var indexBefore = before.indexOf(0)
    var indexAfter  = after.indexOf(0)
    var indexChange = indexAfter - indexBefore
    if (indexChange == -3) {return "down"}
    if (indexChange ==  3) {return "up"}
    if (indexChange == -1) {return "right"}
    if (indexChange ==  1) {return "left"}
}
