function getUrlPath(){
	//获取当前目录
	var url = document.location.toString();				
	if(url.indexOf("/") != -1){
		url = url.substring(0,  url.lastIndexOf("/")) ;
		}
		return url;
	}

function getCurrentSongName() {
	//获取当前歌曲的名字，不带.mp3
	var q = player.src.lastIndexOf('/')
	var e = player.src.lastIndexOf('.')
	currentSongName = player.src.substring(q+1, e)

	return currentSongName
}

var templateTodo = function(SongName, playing) {
	var status =""
	if (playing){
		status ="playing" 
	}
    var t = `
			<div class="list-cell ${status}">
				<span class="list-content">${SongName}</span>
			</div>
		`
    return t
}

var insertMusic = function (songName, playing) {
	var list = document.querySelector(".list")	
	var t = templateTodo(songName, playing)
  	
   	list.insertAdjacentHTML('beforeend', t)
}

var loadList = function(){
	//把playList的每一个歌曲插入到div中
	for (i = 0 ; i < playList.length ; i++){
		insertMusic(playList[i].name, playList[i].playing)
	}
}


var playList =[
	{name:'1',playing:false},
	{name:'2',playing:false},
	{name:'3',playing:false},
	{name:'4',playing:false},
]

var list = document.querySelector(".list")

list.addEventListener('click', function(event) {
    log('list click', event, event.target)
    var target = event.target
    if (target.classList.contains('list-cell')) {
        log('list-cell')
        // 给 list-cell 开关一个状态 class
        toggleClass(target, 'playing')
    } 
})

//切换到歌曲所在目录
var url = getUrlPath() + '/music/' 

var player = document.querySelector("#id-audio-player")

var deAllPlaying = function () {
	//删除歌曲上的playing class
	var listcell = document.querySelectorAll('.list-cell')
	for (var i = 0; i < listcell.length; i++) {
		listcell[i].classList.remove('playing')
	}
}

var progressbar =  document.querySelector("#id-input-progressbar")

var play = function () {
	//播放音乐
	deAllPlaying()
	addCurrentPlaying()
	player.play()
}

var pause = function () {
	//暂停音乐
	player.pause()
}

var addCurrentPlaying = function(){
	//找出是第几首歌
	for (i=0 ; i< playList.length ; i++){
		if (playList[i].name == getCurrentSongName()){
			var o = i
			log(o)
		} 
	}
	//给这第 o 首歌加上 playing class
	list.children[o].classList.add('playing')
}


var next = function(){
	//切到下一首歌
	//先停止歌曲
	//切歌后进度条变为0
	progressbar.value = 0
	progressbar.style.backgroundSize = '0% 100%'

	pause()
	// 找出当前歌曲名，根据歌曲名在playlist找出是第几首歌	
	for (i=0 ; i< playList.length ; i++){
		if (playList[i].name == getCurrentSongName()){
			var o = i
		} 
	}

	var next = o + 1
	if(o + 1 == playList.length ) {
		next = 0
	}
	var currentSongName = playList[next].name


	currentSongUrl = url + currentSongName + '.mp3'

	player.src = currentSongUrl

	play()
}

var prev = function(){
	//切到下一首歌
	//先停止歌曲
	progressbar.value = 0
	progressbar.style.backgroundSize = '0% 100%'
	pause()
	// 找出当前歌曲名，根据歌曲名在playlist找出是第几首歌	
	for (i=0 ; i< playList.length ; i++){
		if (playList[i].name == getCurrentSongName()){
			var o = i
		} 
	}

	var prev = o - 1
	if(o == 0 ) {
		prev = playList.length - 1
	}
	var currentSongName = playList[prev].name


	currentSongUrl = url + currentSongName + '.mp3'

	player.src = currentSongUrl

	play()
}


player.onended = function () {
	next()
}

var volume =  document.querySelector("#id-input-volume")

volume.addEventListener('mousemove', function () {
	//无论有无静音，先打开音量
	if(player.volume > 0){
		player.muted = false
	}
	player.volume = volume.value / 100
	log('player.volume',player.volume)
})



var initProgressbar = function(){

	log('progressbar',progressbar)
	progressbar.value = 0
	//随着音乐进行，进度条改变
	var addonTimeupdate = function () {
		player.ontimeupdate = function () {
			let percent = player.currentTime / player.duration
			progressbar.value = percent * 100
			progressbar.style.backgroundSize = progressbar.value + '%' + ' 100%'
		}
	}	
	var removeonTimeupdate = function () {
		player.ontimeupdate = function () {
			//空
		}
	}	

	//拖动进度条，音乐时间发生改变
	addonTimeupdate()
	//mouseup时清除Timeupdate
	//mousedown时添加Timeupdate
	progressbar.addEventListener('mousedown', function () {
		//MP3总时长 乘以 当前进度条百分比 作为当前进度条时间
		removeonTimeupdate()
		let percent = progressbar.value / 100
		player.currentTime = player.duration * percent
		progressbar.setAttribute('background-size',progressbar.value + '%' + ' 100%')
		log('progressbar.value',progressbar.value + '%' + ' 100%')	
	})

	progressbar.addEventListener('mouseup', function () {
		//MP3总时长 乘以 当前进度条百分比 作为当前进度条时间
		let percent = progressbar.value / 100
		player.currentTime = player.duration * percent
		progressbar.setAttribute('background-size',progressbar.value + '%' + ' 100%')
		log('progressbar.value',progressbar.value + '%' + ' 100%')	
		addonTimeupdate()
	})

	progressbar.addEventListener('mousemove', function () {
		progressbar.style.backgroundSize = progressbar.value + '%' + ' 100%'
		log('progressbar.value',progressbar.value + '%' + ' 100%')	
	})
}

initProgressbar()



//定义一个变量存放上一次的音量
var lastVolume = volume.value

var muted = function(){
	//静音开关
	if (player.muted){
		//不静音
		player.muted = false
		volume.value = lastVolume
	} else {
		//静音同时把音量调为0
		player.muted = true
		lastVolume = volume.value
		volume.value = 0
	}
	log('muted',player.muted)
}



var playbutton = bindEvent("#id-button-play", "click", play)

var pausebutton = bindEvent("#id-button-pause", "click", pause)

var nextSongButton = bindEvent("#id-button-next", "click", next)

var prevButton = bindEvent("#id-button-prev", "click", prev)

var mutedButton = bindEvent("#id-button-muted", "click", muted)

loadList()



