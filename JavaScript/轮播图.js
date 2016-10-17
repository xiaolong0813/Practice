var log = function() {
    console.log.apply(console, arguments)
}
//初始化图片，使active在第一个图片，指示图也在第一个
var iniImags = function() {
    $('.long-slide-imgs').data('active', 0)
    // 注意，用$()[i]的方式选择出来的对象是dom对象，需要转换为jQuery，即$($()[i])
    $($('.long-slide-img')[0]).addClass('long-slide-img-active')
    $($('.long-slide-indicator')[0]).addClass('long-slide-indicator-active')
}
//切换图片函数，根据offset判断往上还是下或前进几个
var nextSlideimg = function(offset) {
    // 获取现在的激活编号以及图片数量（都放在图片父元素的data里面）
    var indexActive = $('.long-slide-imgs').data('active')
    var numberOfImages = $('.long-slide-imgs').data('imags')
    var i = (indexActive + numberOfImages + offset) % numberOfImages
    // 定义新的index，即i，并赋予data，这是data的用法。
    $('.long-slide-imgs').data('active', i)
    //把现有激活的删掉，给下一个加上-图片的激活属性，以淡入的方式出现
    $('.long-slide-img-active').fadeOut()
    $('.long-slide-img-active').removeClass('long-slide-img-active')
    $($('.long-slide-img')[i]).fadeIn()
    $($('.long-slide-img')[i]).addClass('long-slide-img-active')
    //把现有激活的删掉，给下一个加上-indicator的激活属性
    $('.long-slide-indicator-active').removeClass('long-slide-indicator-active')
    $($('.long-slide-indicator')[i]).addClass('long-slide-indicator-active')
}
// 显示上一个
var previousImag = function() {
    nextSlideimg(-1)
}
// 显示下一个
var nextImag = function() {
    nextSlideimg(1)
}
// 给各个按钮（包括指示标志）绑定事件
var bindEvents = function() {
    // 1.激活上一个图片按钮
    $(".long-slide-button-left").on('click', previousImag)
    // 2.激活下一个图片按钮
    $(".long-slide-button-right").on('click', nextImag)
    // 在指示图indicator上面绑定，点击某个indicator，获取其text，即可以知道这是第几个图片的index，
    // 先初始化使第一张图激活，再按照index和上面定义的选择函数激活那张图片
    $(".long-slide-indicator").on('mouseover', function(event){
        var self = $(event.target)
        var value = self.text()
        iniImags()
        nextSlideimg(value - 1)
    })
}
// 绑定鼠标事件，即进入图片区显示按钮并变化指针形式，移出鼠标就隐藏
var bindMouse = function() {
    $('.long-slide').on('mouseover', function(){
        $('.long-slide-button').addClass('long-slide-button-active')
        $('.long-slide').addClass('long-slide-active')
    })
    $('.long-slide').on('mouseout', function(){
        $('.long-slide-button').removeClass('long-slide-button-active')
        // setInterval(nextImag,3000)
    })
}

//这是之前直接使用的HTML代码
// <div class="long-slide">
//     <!-- 把当前激活的图片号以及图片数等信息放入data，可以直接调用 -->
//     <div class="long-slide-imgs" data-active='0' data-imags='3'>
//         <img src="1.jpg" alt="1" class="long-slide-img"/>
//         <img src="2.jpg" alt="2" class="long-slide-img"/>
//         <img src="3.jpg" alt="3" class="long-slide-img"/>
//         <!-- 给每个按钮按照功能增加相应的class -->
//         <button type="button" name="button" class="long-slide-button long-slide-button-left vertical-center">&lt</button>
//         <button type="button" name="button" class="long-slide-button long-slide-button-right vertical-center">&gt</button>
//     </div>
//     <div class="long-slide-indicators">
//         <div class="long-slide-indicator">1</div>
//         <div class="long-slide-indicator">2</div>
//         <div class="long-slide-indicator">3</div>
//     </div>
// </div>
//
//模板字符串函数,其参数为单个img元素
var imgTemplate = function(imag) {
    var t = `<img src="${imag}" class="long-slide-img"/>`
    return t
}
//模板字符串函数,其参数为单个indicator元素
var indicatorTemplate = function(index) {
    var t = `<div class="long-slide-indicator">${index}</div>`
    return t
}
//通过导入图片名称组成的数组，形成由这些图片组成的轮播图
var slide = function(imgArray) {
    //用map方式，给数组的每个元素用imgTemplate函数处理后返回新的数组
    var imagArray = $.map(imgArray, function(str){
        var t = imgTemplate(str)    //注意map方法必须要有一个返回值，所以这里得用一个参数获取，
        return t                    //再返回这个参数
    })
    //用map方式，和上面处理相同，得到indicator的模板字符串数组。
    var len = imgArray.length
    var index = []
    for (var i = 0; i < len; i++) {
        index.push(i + 1)
    }
    var indicatorArray = $.map(index, function(str){
        var t = indicatorTemplate(str)
        return t
    })
    var imags = imagArray.join(' ')
    var indicators = indicatorArray.join(' ')
    //模板字符串，将要导入body，其中外面的div和按钮等不用动，改变img和indicator就好
    //用上面建立的字符串
    var t = `<div class="long-slide">
        <div class="long-slide-imgs" data-active='0' data-imags='${len}'>
            ${imags}
            <button type="button" name="button" class="long-slide-button long-slide-button-left vertical-center">&lt</button>
            <button type="button" name="button" class="long-slide-button long-slide-button-right vertical-center">&gt</button>
        </div>
        <div class="long-slide-indicators">
            ${indicators}
        </div>
    </div>`
    //将模板字符串导入body
    $('body').append(t)
    //css模板字符串
    var c = `<style>
    .long-slide {
        width: 500px;
        height: 300px;
    }
    .long-slide-active {
        cursor: pointer;
    }
    .long-slide-imgs {
        width: 500px;
        height: 300px;
        border: 2px solid red;
        text-align: center;
        position: relative;
    }
    .long-slide-img {
        width: 100%;
        height: 100%;
        display: none;
        position: absolute;
        left: 0;
    }
    .long-slide-img-active {
        display: inline-block;
    }
    .long-slide-button {
        position: absolute;
        height: 80px;
        width: 20px;
        text-align:center;
        padding: 0;
        font-size: 20px;
        opacity: 0.7;
        display: none;
    }
    .long-slide-button-active {
        display: block;
    }
    .long-slide-button-left {
        left: 0;
    }
    .long-slide-button-right {
        right: 0;
    }
    .vertical-center {
        top: 50%;
        transform: translateY(-50%);
    }
    .long-slide-indicators {
        position: relative;
        bottom: 20px;
        text-align: center;
    }
    .long-slide-indicator {
        display: inline-block;
        background-color: darkblue;
        color: white;
        border-radius: 50%;
        padding: 0 5px;
        font-weight: bold;
    }
    .long-slide-indicator-active {
        background-color: red;
    }
    </style>`
    $('head').append(c)
}
//自动轮播函数
var autoPlay = function() {
    timer = setInterval(nextImag,3000)
}
//主函数
var __main = function(imgArray) {
    slide(imgArray)
    iniImags()
    bindEvents()
    bindMouse()
    autoPlay()
    $('.long-slide').hover(function(){
        clearInterval(timer)
    }, autoPlay)

    // setInterval(nextImag,3000)
}

// __main()
