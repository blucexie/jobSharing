
     var mySwiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        noSwiping: true,
        loop: false,
        parallax: true,
        effect: 'fade',
        on: {
            init: function () {
                swiperAnimateCache(this); //隐藏动画元素 
                swiperAnimate(this); //初始化完成开始动画
            },
            slideChangeTransitionEnd: function () {
                swiperAnimate(this); //每个slide切换结束时也运行当前slide动画
            }
        }
    })



     //发送数据
     function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    var userCode = GetQueryString("uc");
        //页面请求判断
        var codeF = GetQueryString("code");
        if (codeF) {
            $.ajax({
                url: "https://apix.funinhr.com/api/query/param",
                type: "POST",
                dataType: "json",
                data: JSON.stringify({ code: codeF }),
                success: function (data) {
                    var jsonData = JSON.parse(data["plaintext"]);
                    var requireData =JSON.parse(jsonData.item.params);
                    console.log(requireData);
                    sessionStorage.setItem('requireData',JSON.stringify(requireData));

                    var sessionData =JSON.parse(sessionStorage.getItem('requireData'));
                    console.log(sessionData);
                    var result = jsonData.item.result;
                    //返回状态信息
                    var resultInfo = jsonData.item.resultInfo;
                    if (result === 1001) {
                       $('.logo').html(sessionData.company_name);
                       $('.comp_intro').html(sessionData.company_intro);
                       $('.job_title').html(sessionData.job_title);
                       $('.comp_duty>p').html(sessionData.job_duty);
                       $('.comp_request>p').html(sessionData.job_require);
                       $('.compensation').html(sessionData.pay);
                    }
                }
            });
        }

    // 检测屏幕高度 让屏幕和盒子大小一致
    var h = $(window).height();
    console.log(h);
    $('body').height(h);
    $('.swiper-container').height(h);

    //滑动屏幕 上下页加载
    // var page = $(".container").attr("page");

    // function downLoad() {
    //     if (page == 5) {
    //         return false;
    //     } else {
    //         var currpage = ++page;
    //         window.location.href = currpage + '.html'
    //     }
    // }
    // function upLoad() {
    //     if (page == 1) {
    //         return false;
    //     } else {
    //         var currpage = --page;
    //         window.location.href = currpage + '.html'
    //     }
    // }

    // var startx, starty;
    // //获得角度
    // function getAngle(angx, angy) {
    //     return Math.atan2(angy, angx) * 180 / Math.PI;
    // };

    //根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
    // function getDirection(startx, starty, endx, endy) {
    //     var angx = endx - startx;
    //     var angy = endy - starty;
    //     var result = 0;

    //     //如果滑动距离太短
    //     if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
    //         return result;
    //     }

    //     var angle = getAngle(angx, angy);
    //     if (angle >= -135 && angle <= -45) {
    //         result = 1;
    //     } else if (angle > 45 && angle < 135) {
    //         result = 2;
    //     } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
    //         result = 3;
    //     } else if (angle >= -45 && angle <= 45) {
    //         result = 4;
    //     }

    //     return result;
    // }
    //手指接触屏幕
    // document.addEventListener("touchstart", function (e) {
    //     startx = e.touches[0].pageX;
    //     starty = e.touches[0].pageY;
    // }, false);
    //手指离开屏幕
    // document.addEventListener("touchend", function (e) {
    //     var endx, endy;
    //     endx = e.changedTouches[0].pageX;
    //     endy = e.changedTouches[0].pageY;
    //     var direction = getDirection(startx, starty, endx, endy);
    //     switch (direction) {
    //         case 0:
    //             // alert("未滑动！");
    //             break;
    //         case 1:
    //             // alert("向上！")
    //             downLoad();
    //             break;
    //         case 2:
    //             // alert("向下！")
    //             upLoad();
    //             break;
    //         case 3:
    //             // alert("向左！");
    //             // downLoad();
    //             break;
    //         case 4:
    //             // alert("向右！")
    //             // upLoad();
    //             break;
    //         default:
    //     }
    // }, false);

    //封装加动画和边框
    function edit(a, b) {
        $('.up').css({ "animation-play-state": "paused" });
        $(a).css({ "border": "1px solid #ccc" });
    }
    function save(a, b) {
        $('.up').css({ "animation-play-state": "running" });
        $(a).css({ "border": 'none' });
        var c = $(a).val();
        sessionStorage.setItem(b,c);  
        window.location.reload();
    }

    // //绑定事件
    // function unbindEvent() {
    //     $('body').bind('touchstart', function (event) {
    //         event.stopPropagation();
    //     });
    //     $('body').bind('touchmove', function (event) {
    //         event.stopPropagation();
    //     });
    //     $('body').bind('touchend', function (event) {
    //         event.stopPropagation();
    //     });
    // }
    // //解除绑定
    // function bindEvent() {
    //     $('body').unbind('touchstart');
    //     $('body').unbind('touchmove');
    //     $('body').unbind('touchend');
    // }

    //编辑部分
    $('.edit').click(function () {
        // 第一页
        edit('.logo');
        // 第二页
        edit('.comp_intro');
        // 第三页
        edit('.job_title');
        edit('.comp_duty_content');
        edit('.comp_request_content');
        edit('.compensation');
        //第四页
        edit('.element-content>ul>li>textarea');
        // unbindEvent();
    })


    // 保存部分
    // 第一页
    $('.save1').click(function () {
        save('.logo', 'company_name');
        // bindEvent();
    })
    // 第二页
    $('.save2').click(function () {
        save('.comp_intro', 'company_intro');
        // bindEvent();
    })
    // 第三页
    $('.save3').click(function () {
        save('.job_title', 'job_title');
        save('.comp_duty>textarea', 'job_duty');
        save('.comp_request>textarea', 'job_require');
        save('.compensation', 'pay');
        // bindEvent();
    })
    //第四页
    $('.save4').click(function () {
        var element_content = [];
        $('.element-content>ul>li>textarea').each(function () {
            var a = $(this).val();
            element_content.push(a);
        })
        // bindEvent();
        var benefits =  element_content.join();      
        sessionStorage.setItem('benefits', benefits);  
        $('.up').css({ "animation-play-state": "running" });
        $('.element-content>ul>li').attr('contenteditable', false);
        $('.element-content>ul>li').css({ "border": 'none' });
        window.location.reload();
    })

    //页面渲染
    function isExist(a,b){
        if(sessionStorage.getItem(a)){
            $(b).val();
            $(b).val(sessionStorage.getItem(a));
        }
    }
    isExist('company_name','.logo');
    isExist('company_intro','.comp_intro');
    isExist('job_title','.job_title');
    isExist('job_duty','.comp_duty_content');
    isExist('job_require','.comp_request_content');
    isExist('pay','.compensation');

    if(sessionStorage.getItem('benefits')){
    var element_content = sessionStorage.getItem('benefits').split(',');
       $('.element-content>ul>li>textarea').each(function(i,v){
            $(this).html(element_content[i]);
       })
    }

   
    
    $('.sub').click(function(){
        var dataJson = {
            userCode:userCode,
            params:{
                company_name:sessionStorage.getItem('company_name'),
                company_intro:sessionStorage.getItem('company_intro'),
                company_title:sessionStorage.getItem('job_title'),
                company_duty:sessionStorage.getItem('job_duty'),
                company_require:sessionStorage.getItem('job_require'),
                pay:sessionStorage.getItem('pay'),
                benefits:sessionStorage.getItem('benefits')
            }
        }   
        $.ajax({
            type: 'post',
            url: 'https://apix.funinhr.com/api/insert/params',
            data:JSON.stringify(dataJson),
            dataType: 'json',
            success:function(data){
                var jsonData = JSON.parse(data["plaintext"]);
                var result = jsonData.item.result;
                var code = jsonData.item.code;
                var enterpriseName = jsonData.item.enterpriseName;
                //返回状态信息
                var resultInfo = jsonData.item.resultInfo;
   
                var recruitConfig = JSON.stringify({
                   "inviteTitle": enterpriseName + "正在招聘",
                   "inviteDescription": "快到碗里来",
                   "inviteUrl": "https://apix.funinhr.com/templates/position/detail/m2/m2.html?code="+code,
                   "inviteIcon": "http://cdn.funinhr.com/online/image/job/2-120-120.png"
               })
                if (result === 1001) {
                    sumToJava(recruitConfig);
                }
            }
        })
    })
function sumToJava(recruitConfig) {
    alert(recruitConfig);
    window.control.onSumResult(recruitConfig);
}