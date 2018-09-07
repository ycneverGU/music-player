var log = function() {
    console.log.apply(console, arguments)
}

var ensure = function(condition, message) {
    // 在条件不成立的时候, 输出 message
    if(!condition) {
        log('*** 测试失败:', message)
    }
}

var toggleClass = function(element, className) {
    //class开关，有就删除，没有就添加，惯用套路
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

var toggleClass2 = function(element, className1, className2) {
    //class开关，有就删除，没有就添加，惯用套路
    if (element.classList.contains(className1)) {
        element.classList.remove(className1)
        element.classList.add(className2)
    } else {
        element.classList.remove(className2)
        element.classList.add(className1)
    }
}

var bindEvent = function(element, event, callback) {
    // element '#id' 'p' '.class'
    // event 'click' 'onmouse'
    var e = document.querySelector(element)

    e.addEventListener(event, callback)
}