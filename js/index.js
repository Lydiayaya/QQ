$(function () {
    //0 自定义滚动条
    $(".content_list").mCustomScrollbar();
    var $audio = $("audio")
    var player = new Player($audio)
    var progress;
    var voiceprogress;
    var lyric;
    //1加载歌曲列表
    getPlarList()
    function getPlarList() {
        $.ajax({
            //从哪儿加载
            url: "../source/musiclist.json",
            //什么类型
            dataType: "json",
            //加载成功
            success: function (data) {
                //将数据传给播放控制
                player.musicList = data
                //遍历获取到的数据，创建每一条音乐
                var $musiclist = $(".content_list ul")
                $.each(data, function (index, ele) {
                    var $item = createMusicItem(index, ele)
                    $musiclist.append($item)
                });
                //初始化歌曲信息
                initMusicInfo(data[0])
                initLyricInfo(data[0])

            },
            //加载失败
            error: function (e) {
                console.log(e);
            }
        })
    }
    //初始化歌曲信息
    function initMusicInfo(music) {
        var $musicInage = $(".song_info_pic img")
        var $musicNAme = $(".song_info_name a")
        var $musicSinger = $(".song_info_singer a")
        var $musicAblum = $(".song_info_ablum a")
        var $musicProgressName = $(".music_progress_name")
        var $musicProgressTime = $(".music_progress_time")
        var $musicMaskBg = $(".mask_bg")
        $musicInage.attr("src", music.cover)
        $musicNAme.text(music.name)
        $musicSinger.text(music.singer)
        $musicAblum.text(music.album)
        $musicProgressName.text(music.name + "/" + music.singer)
        $musicProgressTime.text("00:00/" + music.time)
        $musicMaskBg.css("background", "url('" + music.cover + "')")
    }
    //初始化歌词信息
    function initLyricInfo(music) {
        lyric = new Lyric(music.link_lrc)
        var $lyricContainer = $(".song_lyric")
        //清空上一首音乐的歌词
        $lyricContainer.html("")
        lyric.loadLyric(function (param) {
            //创建歌词列表
            $.each(lyric.lyrics, function (index, ele) {
                var $item = $("<li>" + ele + "</li>")
                $lyricContainer.append($item)
            })
        })

    }
    //初始化进度条
    initProgress()
    function initProgress() {
        var $ProgerssBar = $(".music_progress_bar")
        var $ProgerssLine = $(".music_progress_line")
        var $ProgerssDot = $(".music_progress_dot")
        progress = Progress($ProgerssBar, $ProgerssLine, $ProgerssDot)
        progress.progressClick(function (value) {
            player.musicSeekTo(value)
        })
        progress.progressMove(function (value) { player.musicSeekTo(value) })
        var $voiceProgerssBar = $(".music_voice_bar")
        var $voiceProgerssLine = $(".music_voice_line")
        var $voiceProgerssDot = $(".music_voice_dot")
        voiceprogress = Progress($voiceProgerssBar, $voiceProgerssLine, $voiceProgerssDot)
        voiceprogress.progressClick(function (value) {
            player.musicVioceSeekTo(value)
        })
        voiceprogress.progressMove(function (value) {
            player.musicVioceSeekTo(value)

        })

    }

    //2定义一个方法，创建一个列（创建歌曲列表
    function createMusicItem(index, music) {
        var $item = $("" +
            "<li class=\"list_music\">\n" +
            "<div class=\"list_check\"><i></i></div>\n" +
            "<div class=\"list_number \">" + (index + 1) + "</div>\n" +
            "<div class=\"list_name\">" + music.name + "" +
            "     <div class=\"list_menu\">\n" +
            "          <a href=\"javascript:;\" title=\"播放\" class='list_menu_play'></a>\n" +
            "          <a href=\"javascript:;\" title=\"添加\"></a>\n" +
            "          <a href=\"javascript:;\" title=\"下载\"></a>\n" +
            "          <a href=\"javascript:;\" title=\"分享\"></a>\n" +
            "     </div>\n" +
            "</div>\n" +
            "<div class=\"list_singer\">" + music.singer + "</div>\n" +
            "<div class=\"list_time\">\n" +
            "     <span>" + music.time + "</span>\n" +
            "     <a href=\"javascript:;\" title=\"删除\" class='list_menu_del'></a>\n" +
            "</div>\n" +
            "</li>");
        $item.get(0).index = index
        $item.get(0).music = music
        return $item
    }
    //3初始化事件监听
    inintEvents()
    function inintEvents() {
        //1监听歌曲的移入移出事件(委托事件)$(".content_list").mCustomScrollbar();
        $(".content_list").delegate(".list_music", "mouseenter", function () {
            // 显示子菜单
            $(this).find(".list_menu").stop().fadeIn(100);
            $(this).find(".list_time a").stop().fadeIn(100);
            // 隐藏时长
            $(this).find(".list_time span").stop().fadeOut(100);
        });
        $(".content_list").delegate(".list_music", "mouseleave", function () {
            // 隐藏子菜单
            $(this).find(".list_menu").stop().fadeOut(100);
            $(this).find(".list_time a").stop().fadeOut(100);
            // 显示时长
            $(this).find(".list_time span").stop().fadeIn(100);
        });
        // 2监听复选框的点击事件
        $(".content_list").delegate(".list_check", "click", function () {
            $(this).toggleClass("list_checked");
        });
        // 3添加子菜单播放按钮的监听
        var $musicplay = $(".music_play")
        $(".content_list").delegate(".list_menu_play", "click", function () {
            var $item = $(this).parents(".list_music")
            $(this).toggleClass("list_menu_play2");

            //復原其他的播放圖標
            $item.siblings().find(".list_menu_play").removeClass("list_menu_play2");
            //實現播放按鈕同步(需要判斷當前是播放韓式暫停，不然或出錯)
            if ($(this).attr("class").indexOf("list_menu_play2") != -1) {
                //当前是播放状态
                $musicplay.addClass("music_play2")
                //让文字高亮
                $item.find("div").css("color", "#fff")
                //去掉其他歌曲的样式（排他）
                $item.siblings().find("div").css("color", "rgba(255,255,255,0.5)")
                $item.siblings().find(".list_number").removeClass("list_number2")
                //切换序号状态
                $item.find(".list_number").addClass("list_number2")
            } else {
                $musicplay.removeClass("music_play2")
                $item.find("div").css("color", "rgba(255,255,255,0.5)")
                $item.find(".list_number").removeClass("list_number2")

            }
            //播放音乐
            player.playMusic($item.get(0).index, $item.get(0).music)
            //初始化歌曲信息
            initMusicInfo($item.get(0).music)
            initLyricInfo($item.get(0).music)
        });
        //4底部播放按钮的控制
        $musicplay.click(function (e) {
            //判断有没有播放过音乐
            if (player.currentIndex == -1) {
                //没有播放过就播放第0首,找到第o首音乐的播放按钮，自动触发他的播放事件
                $(".list_music").eq(0).find(".list_menu_play").trigger("click")
            } else {
                $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click")
            }
        });
        //5底部pre按钮的控制
        $(".music_pre").click(function (e) {
            $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click")

        });
        //6底部next按钮的控制
        $(".music_next").click(function (e) {
            $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click")
        });
        //7监听删除按钮的点击：后台前台的数据一起删掉
        $(".content_list").delegate(".list_menu_del", "click", function () {
            //找到点击的音乐
            var $item = $(this).parents(".list_music")
            //判断当前删除的音乐是否是正在播放的
            if ($item.get(0).index == player.currentIndex) {
                $(".music_next").trigger("click")

            }
            $item.remove()
            player.changeMusic($item.get(0).index)
            //重新排序
            $(".list_music").each(function (index, ele) {
                ele.index = index;
                $(ele).find(".list_number").text(index + 1);
            })

        })
        //监听播放的进度
        player.musicTimeUpdate(function (duration, currentTime, time) {
            //同步时间
            $(".music_progress_time").text(time)
            //同步不进度条
            var value = currentTime / duration * 100
            progress.setprogress(value);
            //实现歌词的同步
            var index = lyric.currentIndex(currentTime)
            var $item = $(".song_lyric li").eq(index)
            $item.addClass("cur")
            $item.siblings().removeClass("cur")
            if (index <= 2) return
            $(".song_lyric").css({
                marginTop: ((-index +2)* 30)
            })


        })
        //监听声音按钮的点击
        $(".music_voice_icon").click(function (param) {
            //图标切换
            $(this).toggleClass("music_voice_icon2")
            //声音切换
            if ($(this).attr("class").indexOf("music_voice_icon2") != -1) {
                //静音
                player.musicVioceSeekTo(0)

            } else {
                //有声音
                player.musicVioceSeekTo(1)
            }

        })

    }

})