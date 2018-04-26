
   $(function(){
       
       $('input[type="text"],textarea').on('click', function () {
           var target = this;
           setTimeout(function () {
               target.scrollIntoViewIfNeeded();
           }, 400);
       });

    // 检测屏幕高度 让屏幕和盒子大小一致
    // doucument.documentElement.style.height = window.innerHeight+'px';
    var h = document.documentElement.clientHeight;
    $('body').height(h);
    $('.swiper-container').height(h);

    function swiper(){
        var mySwiper = new Swiper('.swiper-container', {
            direction: 'vertical',
            noSwiping: true,
            loop: false,
            parallax: true,
            effect: 'fade',
            autoHeight: true,
            longSwipes: false,
            longSwipesMs : 5000,
            passiveListeners : false,
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
    }
    swiper();
    


    // 第一页存数据
    // var company_name2 = sessionStorage.getItem('company_name2');
    // if (!company_name2) {
    //     var com_name2 = $('.logo').val();
    //     sessionStorage.setItem('company_name2', com_name2);
    // } else {
    //     var com_name = $('.logo').val();
    //     $('.logo').val();
    //     $('.logo').val(com_name);
    // }
    // 第二页存数据
    // var company_intro2 = sessionStorage.getItem('company_intro2');
    // if (!company_intro2) {
    //     var com_intro2 = $('.comp_intro').html();
    //     sessionStorage.setItem('company_intro2', com_intro2);
    // }
    // 第三页存数据
    // var job_title2 = sessionStorage.getItem('job_title2');
    // if (!job_title2) {
    //     var j_title2 = $('.job_title').val();
    //     sessionStorage.setItem('job_title2', j_title2);
    // };
    // var job_duty2 = sessionStorage.getItem('job_duty2');
    // if (!job_duty2) {
    //     var j_duty2 = $('.comp_duty_content').val();
    //     sessionStorage.setItem('job_duty2', j_duty2);
    // };
    // var job_require2 = sessionStorage.getItem('job_require2');
    // if (!job_require2) {
    //     var j_require2 = $('.comp_request_content').val();
    //     sessionStorage.setItem('job_require2', j_require2);
    // };
    // var pay2 = sessionStorage.getItem('pay');
    // if (!pay2) {
    //     var pay_content2 = $('.compensation').val();
    //     sessionStorage.setItem('pay2', pay_content2);
    // };
    // 第四页存数据
    // var bene_fits2 = sessionStorage.getItem('benefits2');
    // if (!bene_fits2) {
    //     var element_content = [];
    //     $('.element-content>ul>li>textarea').each(function () {
    //         var a = $(this).val();
    //         element_content.push(a);
    //     })
    //     var benefits2 = element_content.join();
    //     sessionStorage.setItem('benefits2', benefits2);
    // };

 

    //发送数据
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); 
        return null;
    }
    var userCode = GetQueryString("uc");
    var codeF = GetQueryString("code");

   //第五页生成二维码
    if (userCode) {
        $('#code').qrcode({
            text: "https://apix.funinhr.com/hr/employee.html?userCode=" + userCode
        });
    }

    if (codeF) {
        $('.bottom').hide();
        $('.sub').hide();
        $('input').each(function(){
            $(this).attr('disabled','disabled');
            $(this).css({'color':'#000','opacity':1});
        })
        $('textarea').each(function(){
            $(this).attr('disabled','disabled');
            $(this).css({'color':'#000','opacity':1});
        })
        $.ajax({
            url: "https://apix.funinhr.com/api/query/param",
            type: "POST",
            dataType: "json",
            data: JSON.stringify({ code: codeF}),
            success: function (data) {
                var jsonData = JSON.parse(data["plaintext"]);
                var result = jsonData.item.result;
                var params = JSON.parse(jsonData.item.params);
                var codeW = jsonData.item.userCode;
                var benefitArr = params.benefits2.split(',');
             //返回状态信息
             var resultInfo = jsonData.item.resultInfo;
             $('#code').qrcode({
                text: "https://apix.funinhr.com/hr/employee.html?userCode=" + codeW
             });

                if (result === 1001) {
                    $('.logo').val(params.company_name2);
                    $('.comp_intro').val(params.company_intro2);
                    $('.job_title').val(params.company_title2);
                    $('.comp_duty_content').val(params.company_duty2);
                    $('.comp_request_content').val(params.company_require2);
                    $('.compensation').val(params.pay2);
                    $('.element-content>ul>li>textarea').each(function(i,v){
                       $(this).val(benefitArr[i]);
                    })
                    // 判断第一个页面是否存在
                    var c_name = $('.logo').val();
                    if(!c_name){
                        $('.one').remove();
                        swiper();
                    }
                    //判断第二个页面是否存在
                    var c_intro = $('.comp_intro').val();
                    if(!c_intro){
                        $('.two').remove();
                        swiper();
                    }
                    //判断第三个页面是否存在
                    var j_title = $('.job_title').val();
                    var j_duty = $('.comp_duty_content').val();
                    var j_request = $('.comp_request_content').val();
                    var j_pay = $('.compensation').val();
                    if(!j_title&&!j_duty&&!j_request&&!j_pay){
                        $('.three').remove();
                        swiper();
                    }
                    // 判断第四个页面是否存在
                    function trimSpace(benefitArr) {
                        for (var i = 0; i < benefitArr.length; i++) {
                            if (benefitArr[i] == "" || typeof (benefitArr[i]) == "undefined") {
                                benefitArr.splice(i, 1);
                                i = i - 1;
                            }
                        }
                        return benefitArr;
                    }  
                    trimSpace(benefitArr);
                    if(benefitArr.length == 0){
                        $('.four').remove();
                        swiper();
                    }

                }
            }
        });
    }



    //封装加动画和边框
    function edit(a, b) {
        $('.up').css({ "animation-play-state": "paused" });
        $(a).css({ "border": "1px solid #ccc" });
    }
    function save(a, b) {
        $('.up').css({ "animation-play-state": "running" });
        $(a).css({ "border": 'none' });
        var c = $(a).val();
        var d = $.trim(c);
        sessionStorage.setItem(b, d);
    }


    //编辑部分
    // 第一页
    $('.edit1').click(function () {
        edit('.logo');
    })
    // 第二页
    $('.edit2').click(function () {
        edit('.comp_intro');
    })
    // 第三页
    $('.edit3').click(function () {
        edit('.job_title');
        edit('.comp_duty_content');
        edit('.comp_request_content');
        edit('.compensation');
    })
    // 第四页
    $('.edit4').click(function () {
        edit('.element-content>ul>li>textarea');
    })

    // 保存部分
    // 第一页
    $('.save1').click(function () {
        save('.logo', 'company_name2');
        // save('.comp_intro', 'company_intro2');
        // save('.job_title', 'job_title2');
        // save('.comp_duty>textarea', 'job_duty2');
        // save('.comp_request>textarea', 'job_require2');
        // save('.compensation', 'pay2');
        // var element_content = [];
        // $('.element-content>ul>li>textarea').each(function () {
        //     var a = $(this).val();
        //     element_content.push(a);
        // })
        // var benefits2 = element_content.join();
        // sessionStorage.setItem('benefits2', benefits2);
        // $('.up').css({ "animation-play-state": "running" });
        // $('.element-content>ul>li>textarea').css({ "border": "none" });
        window.location.reload();
       
    })
    // 第二页
    $('.save2').click(function () {
        // save('.logo', 'company_name2');
        save('.comp_intro', 'company_intro2');
        // save('.job_title', 'job_title2');
        // save('.comp_duty>textarea', 'job_duty2');
        // save('.comp_request>textarea', 'job_require2');
        // save('.compensation', 'pay2');
        // // bindEvent();
        // var element_content = [];
        // $('.element-content>ul>li>textarea').each(function () {
        //     var a = $(this).val();
        //     element_content.push(a);
        // })
        // // bindEvent();
        // var benefits2 = element_content.join();
        // sessionStorage.setItem('benefits2', benefits2);
        // $('.up').css({ "animation-play-state": "running" });
        // $('.element-content>ul>li>textarea').css({ "border": "none" });
        window.location.reload();
    })
    // 第三页
    $('.save3').click(function () { 
        // save('.logo', 'company_name2');
        // save('.comp_intro', 'company_intro2');
        save('.job_title', 'job_title2');
        save('.comp_duty>textarea', 'job_duty2');
        save('.comp_request>textarea', 'job_require2');
        save('.compensation', 'pay2');
        // bindEvent();
        // var element_content = [];
        // $('.element-content>ul>li>textarea').each(function () {
        //     var a = $(this).val();
        //     element_content.push(a);
        // })
        // // bindEvent();
        // var benefits2 = element_content.join();
        // sessionStorage.setItem('benefits2', benefits2);
        // $('.up').css({ "animation-play-state": "running" });
        // $('.element-content>ul>li>textarea').css({ "border": "none" });
        window.location.reload();
    })
    //第四页
    $('.save4').click(function () {
        // save('.logo', 'company_name2');
        // save('.comp_intro', 'company_intro2');
        // save('.job_title', 'job_title2');
        // save('.comp_duty>textarea', 'job_duty2');
        // save('.comp_request>textarea', 'job_require2');
        // save('.compensation', 'pay2');
        var element_content = [];
        $('.element-content>ul>li>textarea').each(function () {
            var a = $(this).val();
            element_content.push(a);
        })
        // bindEvent();
        var benefits2 = element_content.join();
        sessionStorage.setItem('benefits2', benefits2);
        $('.up').css({ "animation-play-state": "running" });
        $('.element-content>ul>li>textarea').css({ "border": "none" });
        window.location.reload();
    })

    //页面渲染
    function isExist(a, b) {
        if (sessionStorage.getItem(a)) {
            $(b).val();
            $(b).val(sessionStorage.getItem(a));
        }
    }
    isExist('company_name2', '.logo');
    isExist('company_intro2', '.comp_intro');
    isExist('job_title2', '.job_title');
    isExist('job_duty2', '.comp_duty_content');
    isExist('job_require2', '.comp_request_content');
    isExist('pay2', '.compensation');

    if (sessionStorage.getItem('benefits2')) {
        var element_content = sessionStorage.getItem('benefits2').split(',');
        $('.element-content>ul>li>textarea').each(function (i, v) {
            $(this).html(element_content[i]);
        })
    }

    //键盘遮挡问题
    // $('input[type="text"],textarea').on('click', function () {
    //     var target = this;
    //     setTimeout(function(){
    //         target.scrollIntoViewIfNeeded();
    //         console.log('scrollIntoViewIfNeeded');
    //     },400);
    // });



   //调用弹窗
    function sumToJava(recruitConfig) {
        alert(recruitConfig);
     window.control.onSumResult(recruitConfig);
    }

    $('.sub').click(function () {
        $('.share_box').show();
       
    })

    //分享遮罩
    $('.cancel').click(function(){
        $('.share_box').hide();
    })

    $('.confirm').click(function(){
        save('.logo', 'company_name2');
        save('.comp_intro', 'company_intro2');
        save('.job_title', 'job_title2');
        save('.comp_duty>textarea', 'job_duty2');
        save('.comp_request>textarea', 'job_require2');
        save('.compensation', 'pay2');
        var element_content = [];
        $('.element-content>ul>li>textarea').each(function () {
            var a = $(this).val();
            element_content.push(a);
        })
        var benefits2 = element_content.join();
        sessionStorage.setItem('benefits2', benefits2);

        var company_name2 = sessionStorage.getItem('company_name2');
        var company_intro2 = sessionStorage.getItem('company_intro2');
        var company_title2 =  sessionStorage.getItem('job_title2');
        var company_duty2 = sessionStorage.getItem('job_duty2');
        var company_require2 = sessionStorage.getItem('job_require2');
        var pay2 = sessionStorage.getItem('pay2');
        var benefits2 = sessionStorage.getItem('benefits2');
        
        var dataJson = {
            userCode: userCode,
            params: {
                company_name2:company_name2,
                company_intro2: company_intro2,
                company_title2:  company_title2,
                company_duty2: company_duty2,
                company_require2: company_require2,
                pay2: pay2,
                benefits2: benefits2
            }
        }
        var share_title = $('.share_title').val();
        var share_intro = $('.share_intro').val();
        $.ajax({
            type: 'POST',
            url: 'https://apix.funinhr.com/api/insert/params',
            data: JSON.stringify(dataJson),
            dataType: 'json',
            success: function (data) {
                var jsonData = JSON.parse(data["plaintext"]);
                var result = jsonData.item.result;
                var code = jsonData.item.code;
                var enterpriseName = jsonData.item.enterpriseName;
                //返回状态信息
                var resultInfo = jsonData.item.resultInfo;
                var recruitConfig = JSON.stringify({
                    "inviteTitle": share_title,
                    "inviteDescription": share_intro,
                    "inviteUrl": "https://apix.funinhr.com/templates/position/detail/m2/m2.html?code=" + code,
                    "inviteIcon": "http://cdn.funinhr.com/online/image/job/2-120-120.png"
                })
                if (result === 1001) {
                    sumToJava(recruitConfig);
                }
            }
        })
    })
    
})
   
    