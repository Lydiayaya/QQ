//一个闭包
//js里的面向对象
(function (window) {
    function Progress($ProgerssBar, $ProgerssLine, $ProgerssDot) {
        return new Progress.prototype.init($ProgerssBar, $ProgerssLine, $ProgerssDot);
    }
    Progress.prototype = {
        constructor: Progress,
        init: function ($ProgerssBar, $ProgerssLine, $ProgerssDot) {
            this.$ProgerssBar = $ProgerssBar
            this.$ProgerssLine = $ProgerssLine
            this.$ProgerssDot = $ProgerssDot

        },
        inMove: false,
        progressClick: function (callback) {
            var $this = this
            this.$ProgerssBar.click(function (e) {
                //获取背景距离窗口默认的位置
                var normolLeft = $(this).offset().left
                //获取点击的位置距离窗口默认的位置
                var eventLeft = e.pageX
                //设置前景宽度
                $this.$ProgerssLine.css("width", eventLeft - normolLeft)
                $this.$ProgerssDot.css("left", eventLeft - normolLeft)
                //计算进度条的比例
                var value = (eventLeft - normolLeft) / $(this).width()
                callback(value)
            })
        },
        //进度条拖拽，鼠标按下，鼠标移动，鼠标抬起
        progressMove: function (callback) {
            var $this = this
            var bar = $this.$ProgerssBar.width()
            //获取背景距离窗口默认的位置
            var normolLeft = this.$ProgerssBar.offset().left;
            var eventLeft;
            this.$ProgerssBar.mousedown(function () {
                $this.isMove = true
                $(document).mousemove(function (e) {
                    //获取点击的位置距离窗口默认的位置
                    eventLeft = e.pageX
                    //设置前景宽度
                    var offset = eventLeft - normolLeft
                    if (offset >= 0 && offset <= bar) {
                        $this.$ProgerssLine.css("width", eventLeft - normolLeft)
                        $this.$ProgerssDot.css("left", eventLeft - normolLeft)
                    }
                });
                $(document).mouseup(function () {
                    $(document).off("mousemove")
                    //计算进度条的比例
                    var value = (eventLeft - normolLeft) / $this.$ProgerssBar.width()
                    callback(value)
                    $this.isMove = false
                });
            });
        },
        setprogress: function (value) {
            if (this.isMove) return;
            if (value < 0 || value > 100) return;
            this.$ProgerssLine.css({
                width: value + "%"
            })
            this.$ProgerssDot.css({
                left: value + "%"
            })
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);