/**
 * 轮播图插件
 * Created by Joan on 2015/11/12.
 * 支持N多图片，只需要需改主函数传入的参数以及图片命名按照阿拉伯数字.jpg即可
 * 可十分简洁的自由修改是否需要carousel的nav和previous-next 只需根据需要将initDom中的模板注掉即可
 */
define([
    'domReady!',
    "jquery",
    "template",
    'css!../../module-css/carousel.css'
],function(dom, $, template){
    var _$el, _num;
    var arr = [];
    var carousel = {
        $img: null,
        $nav: null,
        //计时器 用来实现“滑到图片的时候暂停图片切换”
        time: null,
        //点击标识 防止用户多次快速点击上一页下一天
        isClick: true,
        initDom: function(){
            var tThis = this;
            for (var i = 0; i < _num; i++) {
                arr.push(i);
            }
            _$el.html(template("carousel/carousel-img", arr));
            _$el.append(template("carousel/carousel-previous-next"));
            _$el.append(template("carousel/carousel-nav", arr));
            tThis.$img = $(".carousel-img").find("li");
            tThis.$nav = $(".carousel-nav").find("li");
            tThis.$img.eq(0).fadeIn().addClass("active");
            tThis.initBtn();
            tThis.initCarousel();
        },
        clearTime: function(a){
            window.clearInterval(a);
        },
        initCarousel: function(){
            var tThis = this;
            //carousel-img的话用的是fadeout的callback会有时间间隔
            var index = $(".carousel-nav").find(".red").index();
            tThis.time = window.setInterval(function(){
                index = (++index) % (arr.length);
                tThis.changeImg(index);
                tThis.changeNav(index);
            }, 3000);
        },
        /**
         * 更改显示的图片
         * @param index 应该显示的图片的索引
         */
        changeImg: function(index){
            var tThis = this;
            $(".carousel-img").find(".active").removeClass("active").fadeOut(300, function(){
                tThis.isClick = true;
                tThis.$img.eq(index).fadeIn().addClass("active");
            });
        },
        /**
         * 更改carousel的nav
         * @param index 应该显示的索引
         */
        changeNav: function(index){
            var tThis = this;
            $(".carousel-nav").find(".red").removeClass("red");
            tThis.$nav.eq(index).addClass("red");
        },
        initBtn: function(){
            var tThis = this;
            //carousel-nav
            $(".carousel-nav").delegate('li', 'click', function(){
                if (!$(this).hasClass("red")) {
                    tThis.clearTime(tThis.time);
                    var nowIndex = $(this).attr("data-index");
                    tThis.changeImg(nowIndex);
                    tThis.changeNav(nowIndex);
                    tThis.initCarousel();
                }
            });
            //滑过显示箭头 暂停滑动 上一页 下一页
            $('.carousel').delegate('.carousel-img,.previous-next', 'mouseover', function(){
                $(".previous-next").show();
                tThis.clearTime(tThis.time);
            }).delegate('.carousel-img,.previous-next', 'mouseout', function(){
                $(".previous-next").hide();
                tThis.initCarousel();
            }).delegate('.previous', 'click', function(){
                if (tThis.isClick == true) {
                    var temp1 = $(".carousel-nav").find(".red").index();
                    temp1 = temp1 == 0 ? (arr.length - 1) : (temp1 - 1);
                    tThis.changeImg(temp1);
                    tThis.changeNav(temp1);
                    tThis.isClick = false;
                }
            }).delegate('.next', 'click', function(){
                if (tThis.isClick == true) {
                    var temp2 = $(".carousel-nav").find(".red").index();
                    temp2 = temp2 == (arr.length - 1) ? 0 : (temp2 + 1);
                    tThis.changeImg(temp2);
                    tThis.changeNav(temp2);
                    tThis.isClick = false;
                }
            });
        }
    };
    return {
        /**
         * 初始化carousel
         * @param dom dom节点下初始化carousel
         * @param num carousel下图片的数量
         */
        init: function(dom, num){
            _$el = $("." + dom);
            _num = num;
            carousel.initDom();
        }
    }
});