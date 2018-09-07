//

var currentTime = document.querySelector('#currentTime')
var allTime = document.querySelector('#allTime')
var changeButton = document.querySelector(".changeButton")
var volumeBar = document.querySelector(".volumeBar")
var volumeInput = document.querySelector("#id-input-volume")
var volumeIcon = document.querySelector("#icon-volume")
var lastVolume = volumeInput.value
function getUrlPath() {
    //获取当前目录
    var url = document.location.toString();
    if (url.indexOf("/") != -1) {
        url = url.substring(0, url.lastIndexOf("/"));
    }
    return url;
}

function getCurrentSongName() {
    //获取当前歌曲的名字，不带.mp3
    var q = player.src.lastIndexOf('/')
    var e = player.src.lastIndexOf('.')
    currentSongName = player.src.substring(q + 1, e)

    return decodeURI(currentSongName)
}

var templateTodo = function(SongName, playing) {
    var status = ""
    if (playing) {
        status = "playing"
    }
    var t = `
			<div class="list-cell ${status}">
				<span class="list-content">${SongName}</span>
			</div>
		`
    return t
}

var insertMusic = function(songName, playing) {
    var list = document.querySelector(".list")
    var t = templateTodo(songName, playing)

    list.insertAdjacentHTML('beforeend', t)
}

var loadList = function() {
    //把playList的每一个歌曲插入到div中
    for (i = 0; i < playList.length; i++) {
        insertMusic(playList[i].name, playList[i].playing)
    }
}

var initcurrentTime = function () {
	min = Math.floor(player.currentTime / 60)
    second = Math.floor(player.currentTime % 60)
    time = min.toString() + ':' + second.toString()
    currentTime.innerHTML = time

}
var playList = [
    { name: 'Lemon', playing: false },
    { name: '一万次悲伤', playing: false },
    { name: '夜空中最亮的星', playing: false },
    { name: '烟火里的尘埃', playing: false },
]

var list = document.querySelector(".list")

list.addEventListener('click', function(event) {
    var target = event.target
    if (target.classList.contains('list-cell')) {
        // 给 list-cell 开关一个状态 class
        toggleClass(target, 'playing')
    }
})

//切换到歌曲所在目录
var url = getUrlPath() + '/music/'

var player = document.querySelector("#id-audio-player")

var deAllPlaying = function() {
    //删除歌曲上的playing class
    var listcell = document.querySelectorAll('.list-cell')
    for (var i = 0; i < listcell.length; i++) {
        listcell[i].classList.remove('playing')
    }
}

var progressbar = document.querySelector("#id-input-progressbar")
var lyricContainer = document.querySelector("#lyricContainer")

initcurrentTime()
var play = function() {
    //播放音乐
    deAllPlaying()
    addCurrentPlaying()
    //初始化时间
    // initALLTime()
    //处理url
    lyricContainer.style.top = '130px'
    var lrcUrl = './lrc/' + getCurrentSongName() + '.lrc'
    getLyric(lrcUrl)
    player.addEventListener("timeupdate", function(e) {
        // if (!that.lyric) return;
        //onceLrc是在lyric.js的全局变量，用来接getLyric()的lyric
        for (var i = 0, l = onceLrc.length; i < l; i++) {
            if (player.currentTime > onceLrc[i][0] - 0.50 /*preload the lyric by 0.50s*/ ) {
                //single line display mode
                // that.lyricContainer.textContent = that.lyric[i][1]
                //scroll mode
                var pp = lyricContainer.querySelectorAll('.current-line-1')
                pp.forEach(function (o) {
                	o.classList.remove('current-line-1')
                })
                var line = document.getElementById('line-' + i)
                var prevLine = document.getElementById('line-' + (i > 0 ? i - 1 : i))
                if (prevLine != null) {
                    prevLine.className = ''
                } 
                if (line != null) {
                    line.className = 'current-line-1'
                    lyricContainer.style.top = 130 - line.offsetTop + 'px'
                }
            }
        }
    })
    player.play()
}

var pause = function() {
    //暂停音乐
    player.pause()
}

var addCurrentPlaying = function() {
    //找出是第几首歌
    for (i = 0; i < playList.length; i++) {
        if (playList[i].name == getCurrentSongName()) {
            var o = i
        }
    }
    //给这第 o 首歌加上 playing class
    list.children[o].classList.add('playing')
}


var next = function() {
    //切到下一首歌
    //先停止歌曲
    //切歌后进度条变为0
    changeButton.innerHTML = '<button id="id-button-pause" class="iconfont icon-pause"></button>'
    progressbar.value = 0
    progressbar.style.backgroundSize = '0% 100%'

    pause()
    // 找出当前歌曲名，根据歌曲名在playlist找出是第几首歌	
    for (i = 0; i < playList.length; i++) {
        if (playList[i].name == getCurrentSongName()) {
            var o = i
        }
    }

    var next = o + 1

    if (o + 1 == playList.length) {
        //如果到了最后一首歌，切回第一首歌
        next = 0
    }
    var currentSongName = playList[next].name


    currentSongUrl = url + currentSongName + '.mp3'

    player.src = currentSongUrl

    play()
}

var prev = function() {
    //切到下一首歌
    //先停止歌曲
  
    changeButton.innerHTML = '<button id="id-button-pause" class="iconfont icon-pause"></button>'


    progressbar.value = 0
    progressbar.style.backgroundSize = '0% 100%'
    pause()
    // 找出当前歌曲名，根据歌曲名在playlist找出是第几首歌	
    for (i = 0; i < playList.length; i++) {
        if (playList[i].name == getCurrentSongName()) {
            var o = i
        }
    }

    var prev = o - 1
    if (o == 0) {
        prev = playList.length - 1
    }
    var currentSongName = playList[prev].name


    currentSongUrl = url + currentSongName + '.mp3'

    player.src = currentSongUrl

    play()
}


player.onended = function() {
    next()
}




volumeInput.style.backgroundSize = '0% 100%'
volumeIcon.addEventListener('click', function(event){
	//最先显示音量图标
	//点击一下显示静音图标，volumeInput.value = 0 ,  player.volume = 0
	//再点一下显示回音量图标，volumeInput.value player.volume 等于之前的值
	var target = event.target
	log('event.target:',target)
	// target.classList.contains
    //class开关，有就删除，没有就添加，惯用套路
    if (target.classList.contains("icon-volume")) {
        target.classList.remove("icon-volume")
        target.classList.add("icon-muted")
        lastVolume = volumeInput.value
        volumeInput.value = 0
        player.volume = 0
        player.volume = volumeInput.value / 100
        volumeInput.style.backgroundSize = volumeInput.value + '%' + ' 100%'
    } else {
        volumeInput.value = lastVolume
        player.volume = volumeInput.value / 100
        target.classList.remove("icon-muted")
        target.classList.add("icon-volume")
        volumeInput.style.backgroundSize = volumeInput.value + '%' + ' 100%'
    }

    event.cancelBubble = true
})


volumeInput.addEventListener('mousemove', function() {
	if (player.volume > 0) {
    	player.muted = false
	}
	if (volumeInput.value == 0) {
    	player.muted = true
        volumeIcon.classList.remove("icon-volume")
        volumeIcon.classList.add("icon-muted")
    } else {
		player.muted = false
        volumeIcon.classList.remove("icon-muted")
        volumeIcon.classList.add("icon-volume")
    }
	player.volume = volumeInput.value / 100
	volumeInput.style.backgroundSize = volumeInput.value + '%' + ' 100%'
	log("volumeInput.value", volumeInput.value)
})







var initProgressbar = function() {

    progressbar.value = 0
    //随着音乐进行，进度条改变
    var addonTimeupdate = function() {
        player.ontimeupdate = function() {


            let percent = player.currentTime / player.duration
            progressbar.value = percent * 100
            progressbar.style.backgroundSize = progressbar.value + '%' + ' 100%'
        }
    }
    var removeonTimeupdate = function() {
        player.ontimeupdate = function() {
            //空
        }
    }

    //拖动进度条，音乐时间发生改变
    addonTimeupdate()
    //mouseup时清除Timeupdate
    //mousedown时添加Timeupdate
    progressbar.addEventListener('mousedown', function() {
        //MP3总时长 乘以 当前进度条百分比 作为当前进度条时间
        removeonTimeupdate()
        let percent = progressbar.value / 100
        player.currentTime = player.duration * percent
        progressbar.setAttribute('background-size', progressbar.value + '%' + ' 100%')
    })

    progressbar.addEventListener('mouseup', function() {
        //MP3总时长 乘以 当前进度条百分比 作为当前进度条时间
        let percent = progressbar.value / 100
        player.currentTime = player.duration * percent
        progressbar.setAttribute('background-size', progressbar.value + '%' + ' 100%')
        addonTimeupdate()
    })

    progressbar.addEventListener('mousemove', function() {
        progressbar.style.backgroundSize = progressbar.value + '%' + ' 100%'
    })
}

initProgressbar()

player.addEventListener('timeupdate', function () {
	initcurrentTime()
})


player.oncanplay = function() {
    min = Math.floor(player.duration / 60)
    second = Math.floor(player.duration % 60)
    time = min.toString() + ':' + second.toString()
    allTime.innerHTML = time
}




changeButton.addEventListener('click', function(event){
	var target  = event.target
	log("changeButton")
	if (target.id == "id-button-play"){
		changeButton.innerHTML = '<button id="id-button-pause" class="iconfont icon-pause"></button>'
		// bindEvent("#id-button-pause", "click", play)
		play()
	} else {
		changeButton.innerHTML = '<button id="id-button-play" class="iconfont icon-play"></button>'		
	 	// bindEvent("#id-button-play", "click", pause)
	 	pause()
	}
})



var nextButton = bindEvent("#id-button-next", "click", next)

var prevButton = bindEvent("#id-button-prev", "click", prev)


loadList()