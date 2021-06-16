(function (window) {
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor: Lyric,
        init: function (path) {
            this.path = path
        },
        times: [],
        lyrics: [],
        index:-1,
        loadLyric: function (callback) {
            var $this = this
            $.ajax({
                //从哪儿加载
                url: $this.path,
                //什么类型
                dataType: "text",
                //加载成功
                success: function (data) {
                    // console.log(data);
                    $this.parseLyric(data)
                    callback()
                },
                //加载失败
                error: function (e) {
                    console.log(e);
                }
            })
        },
        parseLyric: function (data) {
            var $this = this
            //一定要清空上一首歌曲的歌词和时间
            $this.times=[];
            $this.lyrics=[]
            var array = data.split("\n")
            //匹配时间
            var timeReg = /\[(\d*:\d*\.\d*)\]/
            //遍历取出每一条歌词
            $.each(array, function (index, ele) {
                //处理歌词
                var lyric = ele.split("]")[1]
                //排除空字符串
                if (lyric.length == 1) return true
                $this.lyrics.push(lyric)
                //处理时间
                var reg = timeReg.exec(ele)
                //   console.log(reg);
                if (reg == null) return true;
                var timeStr = reg[1]
                var timeStr2 = timeStr.split(":")
                var min = parseInt(timeStr2[0]) * 60
                var sec = parseFloat(timeStr2[1])
                var time = parseFloat(Number(min + sec).toFixed(2))
                $this.times.push(time)

            })
            console.log($this.times);
            console.log($this.lyrics);
        },
        currentIndex: function (currentTime) {
            console.log(currentTime);
            if(currentTime>=this.times[0]){
                this.index++;
                this.times.shift();//shift用来删除数组最前面的一个元素
            }
            return this.index
        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);