
 
 function GetQueryString(name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if (r != null) return unescape(r[2]);
     return null;
 }
 var userCode = GetQueryString("uc");
 var codeF  = GetQueryString("code");

 if(userCode){
    $('#code').qrcode({
        rander:"table",
        text: "https://apix.funinhr.com/hr/employee.html?userCode=" + userCode
     });
     $('#code').hide();
     var canvas = document.getElementsByTagName('canvas')[0];
    var image = new Image();
    image.src = canvas.toDataURL("image/jpeg");
    document.getElementById('image').src=image.src;
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
    $.ajax({
        url: "https://apix.funinhr.com/api/query/param",
        type: "POST",
        dataType: "json",
        async: false,
        data: JSON.stringify({ code: codeF }),
        success: function (data) {
            var jsonData = JSON.parse(data["plaintext"]);
            var result = jsonData.item.result;
            var params = JSON.parse(jsonData.item.params);
            var codeW = jsonData.item.userCode;
            var resultInfo = jsonData.item.resultInfo;
            $('#code').qrcode({
                rander:"table",
                text: "https://apix.funinhr.com/hr/employee.html?userCode=" + codeW
            });
            $('#code').hide();
            var canvas = document.getElementsByTagName('canvas')[0];
            var image = new Image();
            image.src = canvas.toDataURL("image/jpeg");
            document.getElementById('image').src=image.src;
            if (result === 1001) {
                $('.page1-Text>input').val(params.company_name);
                $('.company_Profile').val(params.company_intro);
                $('.jobIntroduction>.job_title').val(params.job_title);
                $('.jobDuty>textarea').val(params.job_duty);
                $('.jobRequire>textarea').val(params.job_require);
                $('.salary').val(params.pay);
                $('.edit').hide();
                $('.page1-Text>input').attr("disabled", "disabled");
                $('.company_Profile').attr("disabled", "disabled");
                $('.jobIntroduction>.job_title').attr("disabled", "disabled");
                $('.jobDuty>textarea').attr("disabled", "disabled");
                $('.jobRequire>textarea').attr("disabled", "disabled");
                $('.salary').attr("disabled", "disabled");
                $('input').each(function () {
                    $(this).css({ "color": "#fff", "opacity": 1 })
                })
                $('textarea').each(function () {
                    $(this).css({ "color": "#fff", "opacity": 1 })
                })

                var c_name = params.company_name;
                if (!c_name) {
                    $('.one').remove();
                    swiper();
                }

                var c_intro = $('.company_Profile').val();
                if (!c_intro) {
                    $('.two').remove();
                    swiper();
                }

                var j_title = params.job_title;
                var j_duty = params.job_duty;
                var j_request = params.job_require;
                var j_pay = params.pay;
                if (!j_title && !j_duty && !j_request && !j_pay) {
                    $('.three').remove();
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
	            icon: "http://cdn.funinhr.com/online/image/job/1-120-120.png"
              };
        
              $('meta[itemprop="description"]').attr('content',dataItem.shareIntro);
         
		   nativeShare.setShareData(shareData);
			
            wx.config({
                debug: false,
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
        wx.onMenuShareTimeline({
            title: secondShareTitle,
            link: link,
            imgUrl:"http://cdn.funinhr.com/online/image/job/1-120-120.png",
            success:function(){
                return false;
            }
        });
        wx.onMenuShareAppMessage({
            title: secondShareTitle, 
            desc: secondShareIntro, 
            link: link, 
            imgUrl:"http://cdn.funinhr.com/online/image/job/1-120-120.png", 
            type: 'link', 
            dataUrl: '', 
            success:function(){
                return false;
            }
        });
         wx.onMenuShareQQ({
            title: secondShareTitle, 
            desc: secondShareIntro, 
            link: link, 
            imgUrl: "http://cdn.funinhr.com/online/image/job/1-120-120.png",
            success:function(){
                return false;
            }
        });

        wx.onMenuShareWeibo({
            title: secondShareTitle, 
            desc: secondShareIntro, 
            link: link, 
            imgUrl: "http://cdn.funinhr.com/online/image/job/1-120-120.png", 
            success:function(){
                return false;
            }
        });

        //分享到QQ空间
        wx.onMenuShareQZone({
            title: secondShareTitle,
            desc: secondShareIntro, 
            link: link,
            imgUrl: "http://cdn.funinhr.com/online/image/job/1-120-120.png", 
            success:function(){
                return false;
            }
        });
        
    });

} else {
    var dataJson = {
        userCode: userCode
    }
    $.ajax({
        type: 'post',
        url: 'https://apix.funinhr.com/api/get/common/enterprise',
        dataType: 'json',
        data: JSON.stringify(dataJson),
        success: function (data) {
            var enterprise = JSON.parse(data.plaintext);
            var enterpriseName = enterprise.enterpriseName;
            $('.share_title').attr('placeholder', enterpriseName)
        }
    })

}
   
 function edit(a) {
     $('.arrow').css({
         "animation-play-state": "paused"
     });
     $(a).attr('contenteditable', true);
     $(a).css({
         "border": "1px solid #ccc"
     });
 }

 function save(el,b) {
     $(el).css({
         "border": "none"
     });
     $(el).attr('contenteditable', false);
     $('.arrow').css({
         "animation-play-state": "running"
     });
      var c = $(el).val();
      var d = $.trim(c);
     sessionStorage.setItem(b,d);  
 }


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

 function isExist(a, b) {
     if (sessionStorage.getItem(a)) {
         $(b).val("");
         $(b).val(sessionStorage.getItem(a));
     }
 }
 isExist('company_name1', '.page1-Text>input');
 isExist('company_intro1', '.company_Profile');
 isExist('job_title1', '.jobIntroduction>.job_title');
 isExist('job_duty1', '.jobDuty>textarea');
 isExist('job_require1', '.jobRequire>textarea');
 isExist('pay1', '.salary');

 $('.edit1').click(function () {
     edit('.page1-Text>input');
     unbindEvent();
 })

 $('.save1').click(function () {
     save('.page1-Text>input', 'company_name1');
     save('.company_Profile', 'company_intro1');
     save('.job_title', 'job_title1');
     save('.jobDuty>textarea', 'job_duty1');
     save('.jobRequire>textarea', 'job_require1');
     save('.salary', 'pay1');
     window.location.reload();
 })
 
 $('.edit2').click(function () {
     edit('.company_Profile');
     unbindEvent();
 })
 $('.save2').click(function () {
    save('.page1-Text>input', 'company_name1');
    save('.company_Profile', 'company_intro1');
    save('.job_title', 'job_title1');
    save('.jobDuty>textarea', 'job_duty1');
    save('.jobRequire>textarea', 'job_require1');
    save('.salary', 'pay1');
     window.location.reload();
     //window.location.href ="m1.html"
 })

 $('.edit3').click(function () {
     edit('.jobIntroduction>.job_title');
     edit('.jobDuty>textarea');
     edit('.jobRequire>textarea');
     edit('.salary');
     unbindEvent();
 })
 $('.save3').click(function () {
    save('.page1-Text>input', 'company_name1');
    save('.company_Profile', 'company_intro1');
    save('.job_title', 'job_title1');
    save('.jobDuty>textarea', 'job_duty1');
    save('.jobRequire>textarea', 'job_require1');
    save('.salary', 'pay1');
     window.location.reload();
 })

 

 $('.submit').click(function () { 
    var shareTitle = $('.page1-Text>input').val();
    var enterpriseName = $('.share_title').attr('placeholder')+'-正在招聘'
    var one = enterpriseName.indexOf('-正在招聘');
    enterpriseName = enterpriseName.substr(0,one)+'-正在招聘';
    $('.share_title').attr('placeholder',enterpriseName);   
    $('.share_box').show();
 })
 $('.cancel').click(function(){
    $('.share_box').hide();
})
 $('.confirm').click(function () {
    save('.page1-Text>input', 'company_name1');
    save('.company_Profile', 'company_intro1');
    save('.job_title', 'job_title1');
    save('.jobDuty>textarea', 'job_duty1');
    save('.jobRequire>textarea', 'job_require1');
    save('.salary', 'pay1');
    var company_name = sessionStorage.getItem("company_name1"),
        company_intro = sessionStorage.getItem("company_intro1"),
        job_title = sessionStorage.getItem("job_title1"),
        job_duty = sessionStorage.getItem("job_duty1"),
        job_require = sessionStorage.getItem("job_require1"),
        pay = sessionStorage.getItem("pay1");
    var share_title = $('.share_title').val();
    var share_intro = $('.share_intro').val();
    var share_placeholder = $('.share_title').attr('placeholder');
    var shareTitle;
    var shareIntro;
    if (share_title) {
        shareTitle = share_title;
    } else {
        var enterpriseName = $('.share_title').attr('placeholder')
        shareTitle = enterpriseName;
    }
    if (share_intro) {
        shareIntro = share_intro;
    } else {
        shareIntro = '快到碗里来';
    }

    dataJson = {
        userCode: userCode,
        params: {
            company_name: company_name,
            company_intro: company_intro,
            job_title: job_title,
            job_duty: job_duty,
            job_title: job_title,
            job_require: job_require,
            pay: pay,
            shareTitle: shareTitle,
            shareIntro: shareIntro
        }
    }

    $.ajax({
        url: "https://apix.funinhr.com/api/insert/params",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(dataJson),
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
                "inviteUrl": "https://apix.funinhr.com/templates/position/detail/m1/m1.html?code=" + code,
                "inviteIcon": "http://cdn.funinhr.com/online/image/job/1-120-120.png"
            })
            if (result === 1001) {
                sumToJava(recruitConfig);
            }
        }
    });
})

 function sumToJava(recruitConfig) {
     alert(recruitConfig);
     window.control.onSumResult(recruitConfig);
 }

