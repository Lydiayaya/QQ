//一个闭包
//js里的面向对象
(function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor: Player,
        musicList: [],
        init: function ($audio) {
            //jQ包装好的对象audio
            this.$audio = $audio;
            //原生的audio
            this.audio = $audio.get(0);
        },
        currentIndex: -1,
        playMusic: function (index, music) {
            //判断是否是同一首音乐
            if (this.currentIndex == index) {
                //同一首音乐
                if (this.audio.paused) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
            } else {
                //不是同一首音乐
                this.$audio.attr("src", music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        preIndex: function () {
            var index = this.currentIndex - 1;
            if (index < 0) {
                index = this.musicList.length - 1
            }
            return index

        },
        nextIndex: function () {
            var index = this.currentIndex + 1;
            if (index > this.musicList.length - 1) {
                index = 0
            }
            return index

        },
        changeMusic: function (index) {
            //删除从index开始的第1个元素 
            this.musicList.splice(index, 1);
            //当前删除的歌曲是否是正在播放音乐前面的音乐
            if (index < this.currentIndex) {
                this.currentIndex = this.currentIndex - 1
            }
        },
        musicTimeUpdate: function (callback) {
            var $this = this
            //8监听播放的进度
            this.$audio.on("timeupdate", function () {
                var duration = $this.audio.duration
                var currentTime = $this.audio.currentTime
                var time = $this.formatDate(currentTime, duration)
                callback(duration, currentTime, time)

            })
        },
        formatDate: function (currentTime, duration) {
            var endMin = parseInt(duration / 60);
            var endSec = parseInt(duration % 60);
            if (endMin < 10) {
                endMin = "0" + endMin
            }
            if (endSec < 10) {
                endSec = "0" + endSec
            }
            var startMin = parseInt(currentTime / 60);
            var startSec = parseInt(currentTime % 60);
            if (startMin < 10) {
                startMin = "0" + startMin
            }
            if (startSec < 10) {
                startSec = "0" + startSec
            }
            return startMin + ":" + startSec + "/" + endMin + ":" + endSec
        },
        //跳转到指定播放位置
        musicSeekTo: function (value) {
            if(isNaN(value))return
            this.audio.currentTime = this.audio.duration * value
        },
        musicVioceSeekTo:function (value) { 
            if(isNaN(value))return
            if(value>0&&value>1)return
            this.audio.volume=value
         }
    }
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window);