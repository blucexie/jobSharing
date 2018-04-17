$(function () {

    // 检测屏幕高度 让屏幕和盒子大小一致
    var h = window.innerHeight;
    $('body').height(h);
    $('.scroll').height(h);


    //滑动屏幕 上下页加载

    var page = $(".container").attr("page");

    function downLoad() {
        if (page == 5) {
            return false;
        } else {
            var currpage = ++page;
            window.location.href = currpage + '.html'
        }
    }
    function upLoad() {
        if (page == 1) {
            return false;
        } else {
            var currpage = --page;
            window.location.href = currpage + '.html'
        }
    }

    var startx, starty;
    //获得角度
    function getAngle(angx, angy) {
        return Math.atan2(angy, angx) * 180 / Math.PI;
    };

    //根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
    function getDirection(startx, starty, endx, endy) {
        var angx = endx - startx;
        var angy = endy - starty;
        var result = 0;

        //如果滑动距离太短
        if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
            return result;
        }

        var angle = getAngle(angx, angy);
        if (angle >= -135 && angle <= -45) {
            result = 1;
        } else if (angle > 45 && angle < 135) {
            result = 2;
        } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            result = 3;
        } else if (angle >= -45 && angle <= 45) {
            result = 4;
        }

        return result;
    }
    //手指接触屏幕
    document.addEventListener("touchstart", function (e) {
        startx = e.touches[0].pageX;
        starty = e.touches[0].pageY;
    }, false);
    //手指离开屏幕
    document.addEventListener("touchend", function (e) {
        var endx, endy;
        endx = e.changedTouches[0].pageX;
        endy = e.changedTouches[0].pageY;
        var direction = getDirection(startx, starty, endx, endy);
        switch (direction) {
            case 0:
                // alert("未滑动！");
                break;
            case 1:
                // alert("向上！")
                downLoad();
                break;
            case 2:
                // alert("向下！")
                upLoad();
                break;
            case 3:
                // alert("向左！");
                downLoad();
                break;
            case 4:
                // alert("向右！")
                upLoad();
                break;
            default:
        }
    }, false);

    //封装加动画和边框
    function edit(a, b) {
        $('.up').css({ "animation-play-state": "paused" });
        $(a).attr('contenteditable', true);
        $(a).css({ "border": "1px solid #ccc" });
    }
    function save(a, b) {
        $('.up').css({ "animation-play-state": "running" });
        $(a).attr('contenteditable', false);
        $(a).css({ "border": 'none' });
        var a = $(a).html();
        sessionStorage.setItem(b, a);
        window.location.reload();
        // window.location.href = '1.html';
    }

    //绑定事件
    function unbindEvent() {
        $('body').bind('touchstart', function (event) {
            event.stopPropagation();
        });
        $('body').bind('touchmove', function (event) {
            event.stopPropagation();
        });
        $('body').bind('touchend', function (event) {
            event.stopPropagation();
        });
    }
    //解除绑定
    function bindEvent() {
        $('body').unbind('touchstart');
        $('body').unbind('touchmove');
        $('body').unbind('touchend');
    }

    //编辑部分
    $('.edit').click(function () {
        // 第一页
        edit('.logo');
        // 第二页
        edit('.comp_intro');
        // 第三页
        edit('.job_title');
        edit('.comp_duty>p');
        edit('.comp_request>p');
        edit('.compensation');
        //第四页
        edit('.element-content>ul>li');
        unbindEvent();
    })


    // 保存部分
    // 第一页
    $('.save1').click(function () {
        save('.logo', 'company_name');
        bindEvent();
    })
    // 第二页
    $('.save2').click(function () {
        save('.comp_intro', 'company_intro');
        bindEvent();
    })
    // 第三页
    $('.save3').click(function () {
        save('.job_title', 'job_title');
        save('.comp_duty>p', 'job_duty');
        save('.comp_request>p', 'job_require');
        save('.compensation', 'pay');
        bindEvent();
    })
    //第四页
    $('.save4').click(function () {
        var element_content = [];
        $('.element-content>ul>li').each(function () {
            var a = $(this).html();
            element_content.push(a);
        })
        bindEvent();
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
            $(b).html();
            $(b).html(sessionStorage.getItem(a));
            console.log(sessionStorage.getItem(a));
        }
    }
    isExist('company_name','.logo');
    isExist('company_intro','.comp_intro');
    isExist('job_title','.job_title');
    isExist('job_duty','.comp_duty>p');
    isExist('job_require','.comp_request>p');
    isExist('pay','.compensation');

    if(sessionStorage.getItem('benefits')){
    var element_content = sessionStorage.getItem('benefits').split(',');
       $('.element-content>ul>li').each(function(i,v){
            $(this).html(element_content[i]);
       })
    }

    //发送数据
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    var userCode = GetQueryString("uc");

    
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
            url: 'http://192.168.1.6:8080/api/insert/params',
            data:JSON.stringify(dataJson),
            dataType: 'json',
            success:function(data){
                var jsonData = JSON.parse(data["plaintext"]);
                var result = jsonData.item.result;
                code = jsonData.item.code;
                //安卓IOS交互方法
                var recruitConfig = JSON.stringify({
                    "inviteTitle": "加入易职信， 领取红包大礼！加入易职信， 共同让简历更真实！",
                    "inviteDescription": "您的好友【%USER_NAME%】用红包悄悄砸了你一下， 快去查看~~加入易职信， 轻松核验企业人才",
                    "inviteUrl": "http://192.168.1.87:8081/templates/position/t1.html?code="+code,
                    "inviteIcon": "icon_position_share"
                    })
                function sumToJava(recruitConfig) {
                    alert(recruitConfig);
                    window.control.onSumResult(recruitConfig);
                }
                sumToJava(recruitConfig);
            }
        })
    })
  
})
