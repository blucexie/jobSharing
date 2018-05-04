
   $(function(){
    //获取userCode
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); 
        return null;
    }
    var userCode = GetQueryString("uc");
    var codeF = GetQueryString("code");
    if (userCode) {
        $('#code').qrcode({
            text: "https://apix.funinhr.com/hr/employee.html?userCode=" + userCode
        });
    }

    var h = window.innerHeight;
    $('body').height(h);
    $('.swiper-slide').height(h);
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
                    swiperAnimateCache(this); 
                    swiperAnimate(this); 
                },
                slideChangeTransitionEnd: function () {
                    swiperAnimate(this);
                }
            }
        })
    }
    swiper();
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
            async:false,
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
  
                    var c_name = $('.logo').val();
                    if(!c_name){
                        $('.one').remove();
                        swiper();
                    }
     
                    var c_intro = $('.comp_intro').val();
                    if(!c_intro){
                        $('.two').remove();
                        swiper();
                    }
      
                    var j_title = $('.job_title').val();
                    var j_duty = $('.comp_duty_content').val();
                    var j_request = $('.comp_request_content').val();
                    var j_pay = $('.compensation').val();
                    if(!j_title&&!j_duty&&!j_request&&!j_pay){
                        $('.three').remove();
                        swiper();
                    }

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

     var url = window.location.href;
     var dataUrl = {
         url: url,
         code: codeF
     }
     var nativeShare = new NativeShare({
        syncDescToTag: false,
        syncIconToTag: false,
        syncTitleToTag: false,
    });
     $.ajax({
         type: "post",
         url: "https://apix.funinhr.com/api/get/wxconfig",
         dataType: "json",
         async: false,
         data: JSON.stringify(dataUrl),
         success: function (data) {
             var data = JSON.parse(data.plaintext);
             var dataItem = JSON.parse(data.item.params);
             sessionStorage.setItem('secondShareTitle', dataItem.shareTitle);
             sessionStorage.setItem('secondShareIntro', dataItem.shareIntro);

             var link = window.location.href;
             var shareData = {
                 title: dataItem.shareTitle,
                 desc: dataItem.shareIntro,
                 link: link,
                 icon: "http://cdn.funinhr.com/online/image/job/2-120-120.png"
               };
            nativeShare.setShareData(shareData);

             wx.config({
                 debug: true,
                 appId: data.appid,
                 timestamp: data.timestamp,
                 nonceStr: data.nonceStr,
                 signature: data.signature,
                 jsApiList: [
                     'checkJsApi',
                     'onMenuShareTimeline',
                     'onMenuShareAppMessage',
                     'onMenuShareQQ',
                     'onMenuShareWeibo',
                     'onMenuShareQZone'
                 ]
             });
         },
         error: function (xhr, status, error) {
            return false;
         }
     })
 
     wx.ready(function () {
         var link = window.location.href;
         var protocol = window.location.protocol;
         var host = window.location.host;
         var secondShareTitle = sessionStorage.getItem('secondShareTitle');
         var secondShareIntro = sessionStorage.getItem('secondShareIntro');
         //分享朋友圈
         wx.onMenuShareTimeline({
             title: secondShareTitle,
             link: link,
             imgUrl: "http://cdn.funinhr.com/online/image/job/2-120-120.png",
             success:function(){
                return false;
            }
         });
         //分享给好友
         wx.onMenuShareAppMessage({
             title: secondShareTitle, 
             desc: secondShareIntro, 
             link: link, 
             imgUrl: "http://cdn.funinhr.com/online/image/job/2-120-120.png",
             type: 'link', 
             dataUrl: '', 
             success:function(){
                return false;
            }
         });
         //分享给QQ
         wx.onMenuShareQQ({
            title: secondShareTitle,
            desc: secondShareIntro,
            link: link,
            imgUrl: "http://cdn.funinhr.com/online/image/job/2-120-120.png", 
            success:function(){
                return false;
            }
        });

        //分享到腾讯微博
        wx.onMenuShareWeibo({
            title: secondShareTitle, 
            desc: secondShareIntro, 
            link: link, 
            imgUrl: "http://cdn.funinhr.com/online/image/job/2-120-120.png",
            success:function(){
                return false;
            }
        });

        //分享到QQ空间
        wx.onMenuShareQZone({
            title: secondShareTitle,
            desc: secondShareIntro, 
            link: link, 
            imgUrl: "http://cdn.funinhr.com/online/image/job/2-120-120.png", 
            success:function(){
                return false;
            }
        });
     });
    }else{
        var dataJson = {
            userCode:userCode
        }
        $.ajax({
            type:'post',
            url:'https://apix.funinhr.com/api/get/common/enterprise',
            async:false,
            dataType:'json',
            data:JSON.stringify(dataJson),
            success:function(data){
               var enterpriseName =JSON.parse(data.plaintext).enterpriseName ;
               $('.share_title').attr('placeholder',enterpriseName)
            }
        })
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

    //解除绑定
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

    //编辑部分
    // 第一页
    $('.edit1').click(function () {
        edit('.logo');
        unbindEvent();
    })
    // 第二页
    $('.edit2').click(function () {
        edit('.comp_intro');
        unbindEvent();
    })
    // 第三页
    $('.edit3').click(function () {
        edit('.job_title');
        edit('.comp_duty_content');
        edit('.comp_request_content');
        edit('.compensation');
        unbindEvent();
    })
    // 第四页
    $('.edit4').click(function () {
        edit('.element-content>ul>li>textarea');
        unbindEvent();
    })

    // 保存部分
    // 第一页
    $('.save1').click(function () {
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
        $('.up').css({ "animation-play-state": "running" });
        $('.element-content>ul>li>textarea').css({ "border": "none" });
        window.location.reload();
       
    })
    // 第二页
    $('.save2').click(function () {
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
        $('.up').css({ "animation-play-state": "running" });
        $('.element-content>ul>li>textarea').css({ "border": "none" });
        window.location.reload();
    })
    // 第三页
    $('.save3').click(function () { 
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
        $('.up').css({ "animation-play-state": "running" });
        $('.element-content>ul>li>textarea').css({ "border": "none" });
        window.location.reload();
    })
    //第四页
    $('.save4').click(function () {
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
        $('.up').css({ "animation-play-state": "running" });
        $('.element-content>ul>li>textarea').css({ "border": "none" });
        window.location.reload();
    })

    $('.sub').click(function () {
        var shareTitle = $('.logo').val();
        var enterpriseName = $('.share_title').attr('placeholder')+'-正在招聘';
        var one = enterpriseName.indexOf('-正在招聘');
        enterpriseName = enterpriseName.substr(0,one)+'-正在招聘';
        console.log(enterpriseName);
        $('.share_title').attr('placeholder',enterpriseName);   
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
        var share_title = $('.share_title').val();
        var share_intro = $('.share_intro').val();
        var share_placeholder = $('.share_title').attr('placeholder');
        var shareTitle;
        var shareIntro;
        if (share_title) {
            shareTitle = share_title;
        } else {
            var enterpriseName = $('.share_title').attr('placeholder');
            shareTitle = enterpriseName;
        }
        if (share_intro) {
            shareIntro = share_intro;
        } else {
            shareIntro = '快到碗里来';
        }
        var dataJson = {
            userCode: userCode,
            params: {
                company_name2:company_name2,
                company_intro2: company_intro2,
                company_title2:  company_title2,
                company_duty2: company_duty2,
                company_require2: company_require2,
                pay2: pay2,
                benefits2: benefits2,
                shareTitle: shareTitle,
                shareIntro: shareIntro
            }
        }
        
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
                    "inviteTitle": shareTitle,
                    "inviteDescription": shareIntro,
                    "inviteUrl": "https://apix.funinhr.com/templates/position/detail/m2/m2.html?code=" + code,
                    "inviteIcon": "http://cdn.funinhr.com/online/image/job/2-120-120.png"
                })
                if (result === 1001) {
                    sumToJava(recruitConfig);
                }
            }
        })
    })

       //调用弹窗
    function sumToJava(recruitConfig) {
        alert(recruitConfig);
        window.control.onSumResult(recruitConfig);
    }
    
})
   
    