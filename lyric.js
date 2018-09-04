var parseLyric = function(text) {
    //将文本分隔成一行一行，存入数组
    var lines = text.split('\n'),
        //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
        pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
        //保存最终结果的数组
        result = [];
    //去掉不含时间的行
    while (!pattern.test(lines[0])) {
        lines = lines.slice(1);
    };
    //上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
    lines[lines.length - 1].length === 0 && lines.pop();
    lines.forEach(function(v /*数组元素值*/ , i /*元素索引*/ , a /*数组本身*/ ) {
        //提取出时间[xx:xx.xx]
        var time = v.match(pattern),
            //提取歌词
            value = v.replace(pattern, '');
        //因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
        time.forEach(function(v1, i1, a1) {
            //去掉时间里的中括号得到xx:xx.xx
            var t = v1.slice(1, -1).split(':');
            //将结果压入最终数组
            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
        });
    });
    //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
    result.sort(function(a, b) {
        return a[0] - b[0];
    });
    return result;
}

var lyr =[]

var a = `
[ti:记兰生襄铃]
[ar:HITA]
[al:在线热搜（华语）系列30]
[offset:0]
[00:05.91]记兰生襄铃
[00:07.54]填词：三日月
[00:09.41]原曲：夏川里美
[00:11.48]演唱：HITA 肉肉
[00:13.35]后期：HITA
[00:27.16]青石路 青石桥 书生哼着江南调
[00:33.60]谁家女儿颜色娇 穿花扑蝶尚年少
[00:40.17]金铃响 金铃摇 黄衣少女拍手笑
[00:46.66]呆瓜呆瓜瞧一瞧 天边大鹰正飞高
[00:53.35]都说当时年纪小 无忧无虑乐逍遥
[00:59.73]芳梅林边花盛放 珍珠滩旁看江潮
[01:06.60]江都城外茶水香 再尝一口桂花糕
[01:12.85]清风吹入梦一遭 曾有仙人上九霄
`