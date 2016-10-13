// 2016/10/09
//
// ============
// 作业 11
//
//

/*
这次作业分 2 块

1, 出一份到 11 课为止学习的内容笔记, 注明自己掌握得不够好的东西

2, 在 vip.cocode.cc:3000/ 可以写代码, 实现一个用 ajax 和后端交互数据的 todo

如果你不会这道题, 请等待我进一步发说明, 或者发帖讨论


'''
todo 后端程序提供了 4 个 API, 说明如下


1, 获得所有的 todo, 返回的是一个数组

GET
http://vip.cocode.cc:3000/todo/<你的qq号>/all


2, 发送 JSON 格式字符串来创建一个 todo
要求设置 Content-Type 为 application/json

POST
{"task": "study"}
http://vip.cocode.cc:3000/todo/<你的qq号>/add


3, 发送 JSON 格式字符串来更新一个 todo
要求设置 Content-Type 为 application/json

POST
{"task": "study"}
http://vip.cocode.cc:3000/todo/<你的qq号>/update/<todo_id>


4, 删除一个 todo
GET
http://vip.cocode.cc:3000/todo/<你的qq号>/delete/<todo_id>

'''

*/
//和之前第一次做的不同的是，这次使用回调函数处理数据，每次add之后，把返回的id
//储存在每个cell的模板字符串的id里面，这样修改每一个的时候，直接利用其id操作即可，
//不用保存当地数组
//log函数
var log = function() {
    console.log.apply(console, arguments)
}
//todoList用来存储服务器读取的全部任务
// var todoList = []
//所有url
var TodoApi = function(){
    this.all = 'http://vip.cocode.cc:3000/todo/576008502/all'
    this.add = 'http://vip.cocode.cc:3000/todo/576008502/add'
    this.update = 'http://vip.cocode.cc:3000/todo/576008502/update/'
    this.del = 'http://vip.cocode.cc:3000/todo/576008502/delete/'
}
//AJAX程序
TodoApi.prototype.ajax = function(request) {
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.method === 'POST') {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function(event) {
        if (r.readyState === 4) {
            request.callback(r.response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}
//请求内容
TodoApi.prototype.request = function(method, url, callback, str) {
    var account = {
        task: str
    }
    var data = JSON.stringify(account)
    var r = {
        method: method,
        url: url,
        contentType: 'application/json',
        data: data,
        callback: callback
    }
    return r
}
//获取所有todo
TodoApi.prototype.getAll = function() {
        this.ajax(this.request('GET',this.all,callGet))
}
//添加一个todo到服务器
TodoApi.prototype.addTodo = function(value, callAdd) {
        this.ajax(this.request('POST',this.add,callAdd,value))
}
//在服务器根据id删除一个todo
TodoApi.prototype.delTodo = function(id) {
        this.ajax(this.request('GET',this.del + id,callDel))
}
//清空后台数据
TodoApi.prototype.clearAll = function() {
        this.ajax(this.request('GET',this.all,callClear))
}
//根据id在服务器更新一个任务
TodoApi.prototype.editTodo = function(id, newtask) {
        this.ajax(this.request('POST', this.update + id, callUp, newtask))
}

//定义一个对象
var api = new TodoApi()

//响应函数
var callGet = function(response) {
    var res = JSON.parse(response)
    log(res)
}
var callAdd = function(response) {
        // api.log('calladd')
        // api.getAll()
        // log('add')
        var input = document.querySelector('#todo-input')
        var value = input.value
        var res = JSON.parse(response)
        // log(res)
        var d = currentTime()
        var todo = {
            task :value,
            time :d,
            timeDone: '未完成'
        }
        var id = 'id' + res.id
        insertTodo(todo, id)
        input.value = ''
        // input.value = ''
        // getAll()
}
var callDel = function(response) {
        api.getAll()
    // var id = response
}
var callUp = function(response) {
    api.getAll()
}
//清空所有后台数据的回调函数
var callClear = function(response) {
    var res = JSON.parse(response)
    for (var i = 0; i < res.length; i++) {
        var id = res[i].id
        api.ajax(api.request('GET',api.del + id,callDel))
    }
}
//往页面里面添加表单，即输入框和add按钮,以及任务container
var addForm = function() {
    var body = document.querySelector('body')
    body.innerHTML = ''
    var t = `<div class="todo-form">
                <input id = "todo-input" type="text">
                <button id = "todo-button" type="button">Add</button>
                <button id = "todo-clear" type="button">Clear</button>
            </div>
            <div id="container"></div>`
    body.insertAdjacentHTML('beforeend', t)
}
//往页面里面添加所需要的样式在style里面
var addCSS = function() {
    var head = document.querySelector('head')
    var t = `<style>
                .done {
                    color: gray;
                    text-decoration: line-through;
                }
            </style>`
    head.insertAdjacentHTML('beforeend', t)
}
//根据服务器返回的数据进行任务的添加相应控件
var insertTodo = function(todo, id) {
        var container = document.querySelector('#container')
        var t = templateTodo(todo, id)
        container.insertAdjacentHTML('beforeend',t)
    }
var templateTodo = function(todo, id) {
        //以下为模板字符串
        var t = `
        <div class="cell" id=${id}>
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
//根据返回的时间返回真实的时间
var currentTime = function(created_time) {
  //时间标准库
    if (created_time) {
        var d = new Date(created_time * 1000)
    } else {
        var d = new Date()
    }
    var month = d.getMonth() + 1
    var date = d.getDate()
    var hours = d.getHours()
    var minutes = (d.getMinutes() > 10) ? d.getMinutes() : '0' + d.getMinutes()
    var seconds = (d.getSeconds() > 10) ? d.getSeconds() : '0' + d.getSeconds()
    var timeString = `${month}/${date} ${hours}:${minutes}:${seconds}`
    return timeString
}
//给add按钮绑定add函数
var bindEventAdd = function() {
    // log(value)
    var a = document.querySelector('#todo-button')
    a.addEventListener('click',function(){
        var input = document.querySelector('#todo-input')
        var value = input.value
        if (value) {
            // log(value)
            api.addTodo(value, callAdd)
        }
    })
}
//给各个按钮绑定完成，删除，编辑事件
var bindEventsbutton = function() {
    var container = document.querySelector('#container')
    container.addEventListener('click',function(event){
        var self = event.target
        if (self.classList.contains('todo-done')) {
            var todoDiv = self.parentElement
            toggle(todoDiv,'done')
            if (todoDiv.classList.contains('done')) {
                todoDiv.querySelector('.timeDone').innerHTML = `完成时间： ` + currentTime()
            } else {
                todoDiv.querySelector('.timeDone').innerHTML = `完成时间： 未完成`
            }
        } else if (self.classList.contains('todo-delete')) {
            var todoDiv = self.parentElement
            var id = todoDiv.id.slice(2)
            api.delTodo(id)
            todoDiv.remove()
        } else if (self.classList.contains('todo-edit')) {
            var todoDiv = self.parentElement
            var task = todoDiv.querySelector('.task')
            task.contentEditable = "true"
            task.focus()
        }
    })
}
//给编辑框blur的时候绑定函数，即在页面保存并更新服务器上的数据
var bindEventBlur = function() {
    var container = document.querySelector('#container')
    container.addEventListener('blur',function(event){
        var self = event.target
        if (self.classList.contains('task')) {
            self.contentEditable = 'false'
            var pa = self.parentElement
            // var index = indexOfElement(pa)
            var id = pa.id.slice(2)
            var newValue = self.innerHTML
            api.editTodo(id, newValue)
        }
    },true)
    // getAll()
}
//给清除按钮绑定消除所有任务和数据的功能
var bindEventClear = function() {
    var c = document.querySelector('#todo-clear')
    var container = document.querySelector('#container')
    c.addEventListener('click',function(){
        container.innerHTML = ''
        api.clearAll()
    })
}
//开关函数
var toggle = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

var __main = function() {
    addCSS()
    addForm()
    bindEventAdd()
    bindEventsbutton()
    bindEventBlur()
    bindEventClear()
}

__main()
