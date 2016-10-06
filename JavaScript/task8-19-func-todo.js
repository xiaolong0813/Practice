
var todoList = []

var log = function() {
  //log函数
    console.log.apply(console, arguments)
}

var currentTime = function() {
  //时间标准库
    var d = new Date()
    var month = d.getMonth() + 1
    var date = d.getDate()
    var hours = d.getHours()
    var minutes = (d.getMinutes() > 10) ? d.getMinutes() : '0' + d.getMinutes()
    var seconds = (d.getSeconds() > 10) ? d.getSeconds() : '0' + d.getSeconds()
    var timeString = `${month}/${date} ${hours}:${minutes}:${seconds}`
    return timeString
}
//注意，需要事件委托时，给父元素绑定属性之后，需要先判定这是不是所需的子元素，如果是在进行相应操作。
//如给container绑定时判定是哪个按钮，或者是不是span，这样避免其他子元素有相同操作时干扰
var bindEventAdd = function() {
  //获取input的值，并利用insertAdjacentHTML插入新代码
  var add = document.querySelector('#todo-button')
  add.addEventListener('click',function(){
    //   log(document.activeElement)
      var input = document.querySelector('#todo-input')
      var inputValue = input.value
    //   log('add',inputValue)
      if (inputValue) {
          var todo = {
              task :inputValue,
              time :currentTime(),
              timeDone :'未完成'
          }
          insertTodo(todo)
          //将新的todo项目添加入todoList中，并保存
          todoList.push(todo)
          saveTodos()
          // log(todoList)
      }
  })
}
var insertTodo = function(todo) {
        var container = document.querySelector('#container')
        var t = templateTodo(todo)
        container.insertAdjacentHTML('beforeend',t)
    }
var templateTodo = function(todo) {
        //以下为模板字符串
        var t = `
        <div class="cell">
            <span class = "task">${todo.task}</span>
            <div class='timeBox'>
            <span class = 'time'>开始时间： ${todo.time}</span>
            <span class = 'timeDone'>完成时间： ${todo.timeDone}</span>
            </div>
            <button class = "todo-done button" name="button" >完成</button>
            <button class = "todo-delete button" name="button">删除</button>
            <button class = "todo-edit button" name="button">编辑</button>
        </div>
        `
        return t
    }
var inputBlur = function() {
  //给输入框增加失去焦点保存的功能
  var input = document.querySelector('#todo-input')
  input.addEventListener('blur',function(){
      var inputValue = input.value
    //   var add = document.querySelector('body')
      if (inputValue) {
        //   log(add,'and',document.activeElement)
          var todo = {
              task :inputValue,
              time :currentTime()
          }
          insertTodo(todo)
          //将新的todo项目添加入todoList中，并保存
          todoList.push(todo)
          saveTodos()
          input.value = ''
      }
  })
}
var bindEventsbutton = function() {
  //给父元素container添加两个按钮的click属性
  var container = document.querySelector('#container')
  container.addEventListener('click',function(event){
      var self = event.target
      //用event.target获取点击的元素，并检查包含的class以确定为哪个按钮
      if (self.classList.contains('todo-done')) {
          //如果是完成按钮，就添加可以开关done的属性
          var todoDiv = self.parentElement
          toggle(todoDiv,'done')
          //如果完成，导入完成时间,如果没有，撤销完成时间
          if (todoDiv.classList.contains('done')) {
            var index = indexOfElement(todoDiv)
            // log('done')
            todoDiv.querySelector('.timeDone').innerHTML = `完成时间： ` + currentTime()
            todoList[index].timeDone = currentTime()
            saveTodos()
            // log(todoList)
        } else {
            var index = indexOfElement(todoDiv)
            todoDiv.querySelector('.timeDone').innerHTML = `完成时间： 未完成`
            todoList[index].timeDone = '未完成'
            saveTodos()
        }
          //如果是删除按钮，就删掉该div
      } else if (self.classList.contains('todo-delete')) {
        // log('edit')
          var todoDiv = self.parentElement
          //获取目标元素target的父元素（即todo-cell）的index，将todoList中的该元素删除并保存
          var index = indexOfElement(todoDiv)
          //splice 函数，可以删去数组的某个元素,先再todoList里面删去，再remove掉
          todoList.splice(index,1)
          // log(todoList)
          todoDiv.remove()
          saveTodos()
      } else if (self.classList.contains('todo-edit')) {
          // log('edit')
          var todoDiv = self.parentElement
          // log(todoDiv)
          // var index = indexOfElement(todoDiv)
          var task = todoDiv.querySelector('.task')
        //   用以下的代码选择task也可以，他是父元素的第四个子元素
        //   var task = todoDiv.children[3]
          task.contentEditable = "true"
          //   也可以用以下的代码定义可编辑性，注意contenteditable都是小写
        //   task.setAttribute('contenteditable', 'true')
          task.focus()
          // log(task.focus())
      }
  })
}
var bindEventBlur = function() {
  var container = document.querySelector('#container')
  container.addEventListener('blur',function(event){
      var self = event.target
      if (self.classList.contains('task')) {
        self.contentEditable = "false"
        var parent = self.parentElement
        var index = indexOfElement(parent)
        var newValue = self.innerHTML
        todoList[index].task = newValue
        saveTodos()
      }
  },true)
}
var bindEventEnter = function() {
  container.addEventListener('keydown',function(event){
          var self = event.target
          var parent = self.parentElement
          if(event.key === 'Enter') {
              log('按了回车')
              //使焦点不在输入框并且阻止默认行为的发生, 也就是不插入回车
              self.blur()
              event.preventDefault()
              //更新todoList并且保存
              //找到其父元素，即todo-cell是第几个，在对应的todoList里面修改
              var index = indexOfElement(parent)
              //获取修改后的值
              var newValue = self.innerHTML
              todoList[index].task = newValue
              saveTodos()
          }
  })
}
var toggle = function(element,className) {
      if (element.classList.contains(className)) {
          element.classList.remove(className)
      } else {
          element.classList.add(className)
      }
  }
var indexOfElement = function(element) {
  //用indexOfElement返回子元素element在父元素中的下标
  //注意，父元素.children为包含所有子元素的数组,下面的element为一个子元素
        var parent = element.parentElement
        // log(parent)
        for (var i = 0; i < parent.children.length; i++) {
            var e = parent.children[i]
            if (e === element) {
                return i
            }
        }
    }

    //saveTodos将todoList的数据保存到本地，用JSON
var saveTodos = function() {
        var s = JSON.stringify(todoList)
        localStorage.todoList = s
        // log(s)
    }
var loadTodos = function() {
      //loadTodos将todoList的数据读取，并返回原数组
        var a = localStorage.todoList
        return JSON.parse(a)
    }

var initTodos = function() {
  //刚打开页面时，用loadTodos将之前保存的数据todoList导入
  todoList = loadTodos()
  for (var i = 0; i < todoList.length; i++) {
      insertTodo(todoList[i])
  }
}

var bindEvents = function() {
  bindEventAdd()
  //调用inputblur会使add按钮失去作用，因为只要按add，就会使input blur
  // inputBlur()
  bindEventsbutton()
  bindEventBlur()
  bindEventEnter()
}

var __main = function() {
  bindEvents()
  initTodos()
}

__main()
