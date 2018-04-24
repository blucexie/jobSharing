
 
 /*获取userCode*/
 function GetQueryString(name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if (r != null) return unescape(r[2]);
     return null;
 }
 var userCode = GetQueryString("uc");
 var codeF  = GetQueryString("code");
 if(codeF){
     $.ajax({
         url: "https://apix.funinhr.com/api/query/param",
         type: "POST",
         dataType: "json",
         data: JSON.stringify({code:codeF}),
         success: function (data) {

             var jsonData = JSON.parse(data["plaintext"]);
             var result = jsonData.item.result;
             var params = JSON.parse(jsonData.item.params);
             //返回状态信息
             var resultInfo = jsonData.item.resultInfo;
             if (result === 1001) {
                 $('.page1-Text p:nth-of-type(1)').text(params.company_name);
                 $('.company>p').text(params.company_intro);
                 $('.jobIntroduction>h3').text(params.job_title);
                 $('.jobDuty>p').text(params.job_duty);
                 $('.jobRequire>p').text(params.job_require);
                 $('.salary').text(params.pay);
                 $('.edit').hide();
             }
         }
     });
 }
    
     var h = window.innerHeight;
    $('body').height(h);
    $('.swiper-slide').height(h);
    

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
     // 如果需要分页器
     /*  pagination: {
          el: '.swiper-pagination',
      }, */
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

 //生成二维码

 var url = window.location.href;
 var num = url.indexOf("uc=");
 var uc = url.substr(num + 3, url.length - 1);
 $('#code').qrcode({
    text: "https://apix.funinhr.com/hr/employee.html?userCode=" + uc
 });

 //封装加动画和边框
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
     sessionStorage.setItem(b,c);  
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
 //数据回填
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
 var company_name1 = $('.page1-Text>input').val();
     sessionStorage.company_name1 = company_name1;
 $('.save1').click(function () {
     save('.page1-Text>input', 'company_name1');
     save('.company_Profile', 'company_intro1');
     save('.job_title', 'job_title1');
     save('.jobDuty>textarea', 'job_duty1');
     save('.jobRequire>textarea', 'job_require1');
     save('.salary', 'pay1');
     window.location.reload();
 })
 
 var company_intro1 = $('.company_Profile').val();
 sessionStorage.company_intro1 = company_intro1;
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
 var job_title1 = $('.jobIntroduction>.job_title').val();
 var job_duty1 = $('.jobDuty>textarea').val();
 var job_require1 = $('.jobRequire>textarea').val();
 var pay1 = $('.salary').val();
 sessionStorage.job_title1 = job_title1;
 sessionStorage.job_duty1 = job_duty1;
 sessionStorage.job_require1 = job_require1;
 sessionStorage.pay1 = pay1;
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
    save('.page1-Text>input', 'company_name1');
    save('.company_Profile', 'company_intro1');
    save('.job_title', 'job_title1');
    save('.jobDuty>textarea', 'job_duty1');
    save('.jobRequire>textarea', 'job_require1');
    save('.salary', 'pay1');   
     var company_name = sessionStorage.getItem("company_name"),
         company_intro = sessionStorage.getItem("company_intro"),
         job_title = sessionStorage.getItem("job_title"),
         job_duty = sessionStorage.getItem("job_duty"),
         job_require = sessionStorage.getItem("job_require"),
         pay = sessionStorage.getItem("pay"),

         dataJson = {
             userCode:userCode,
             params: {
                 company_name: company_name,
                 company_intro: company_intro,
                 job_duty: job_duty,
                 job_require: job_require,
                 pay: pay
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
                "inviteTitle": enterpriseName + "正在招聘",
                "inviteDescription": "快到碗里来",
                "inviteUrl": "https://apix.funinhr.com/templates/position/detail/m1/m1.html?code="+code,
                "inviteIcon": "http://cdn.funinhr.com/online/image/job/1-120-120.png"
            })
             if (result === 1001) {
                 sumToJava(recruitConfig);
             }
         }
     });
 })

 


 //安卓IOS交互方法
 function sumToJava(recruitConfig) {
     alert(recruitConfig);
     window.control.onSumResult(recruitConfig);
 }