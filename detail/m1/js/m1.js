 /*获取userCode*/
 function GetQueryString(name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if (r != null) return unescape(r[2]);
     return null;
 }
 var userCode = GetQueryString("uc");

 var h = $(window).height();
 $('body').height(h);

 var mySwiper = new Swiper('.swiper-container', {
     direction: 'vertical',
     noSwiping: true,
     loop: false,
     parallax: true,
     effect: 'fade',
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
     // 如果需要前进后退按钮
     /*  navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      }, */

     // 如果需要滚动条
     /* scrollbar: {
         el: '.swiper-scrollbar',
     }, */
 })

 //生成二维码

 var url = window.location.href;
 var num = url.indexOf("uc=");
 var uc = url.substr(num + 3, url.length - 1);
 $('#code').qrcode({
     text: "http://192.168.1.87:8081/hr/employee.html?uc=" + uc
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

 function save(el) {
     $(el).css({
         "border": "none"
     });
     $(el).attr('contenteditable', false);
     $('.arrow').css({
         "animation-play-state": "running"
     });
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
         $(b).html();
         $(b).html(sessionStorage.getItem(a));
     }
 }
 isExist('company_name', '.page1-Text p:nth-of-type(1)');
 isExist('company_intro', '.company>p');
 isExist('job_title', '.jobIntroduction>h3');
 isExist('job_duty', '.jobDuty>p');
 isExist('job_require', '.jobRequire>p');
 isExist('pay', '.salary');


 $('.edit1').click(function () {
     edit('.page1-Text p:nth-of-type(1)');
     unbindEvent();
 })
 $('.save1').click(function () {
     var company_name = $('.page1-Text p:nth-of-type(1)').text();
     sessionStorage.company_name = company_name;
     save('.page1-Text p:nth-of-type(1)');
     location.reload();
 })
 $('.edit2').click(function () {
     edit('.company>p');
     unbindEvent();
 })
 $('.save2').click(function () {
     var company_intro = $('.company>p').text();
     sessionStorage.company_intro = company_intro;
     save('.company>p');
     location.reload();
 })
 $('.edit3').click(function () {
     edit('.jobIntroduction>h3');
     edit('.jobDuty>p');
     edit('.jobRequire>p');
     edit('.salary');
     unbindEvent();
 })
 $('.save3').click(function () {
     var job_title = $('.jobIntroduction>h3').text();
     var job_duty = $('.jobDuty>p').text();
     var job_require = $('.jobRequire>p').text();
     var pay = $('.salary').text();
     sessionStorage.job_title = job_title;
     sessionStorage.job_duty = job_duty;
     sessionStorage.job_require = job_require;
     sessionStorage.pay = pay;
     save('.jobIntroduction>h3');
     save('.jobDuty>p');
     save('.jobRequire>p');
     save('.salary');
     location.reload();
 })

 var recruitConfig = JSON.stringify({
    "inviteTitle": "加入易职信， 领取红包大礼！加入易职信， 共同让简历更真实！",
    "inviteDescription": "您的好友【%USER_NAME%】用红包悄悄砸了你一下， 快去查看~~加入易职信， 轻松核验企业人才",
    "inviteUrl": "http://192.168.1.87:8081/templates/position/t1.html?code="+code,
    "inviteIcon": "icon_position_share"
})

 $('.submit').click(function () {
     var company_name = sessionStorage.getItem("company_name"),
         company_intro = sessionStorage.getItem("company_intro"),
         job_title = sessionStorage.getItem("job_title"),
         job_duty = sessionStorage.getItem("job_duty"),
         job_require = sessionStorage.getItem("job_require"),
         pay = sessionStorage.getItem("pay"),

         dataJson = {
             userCode: "5a3b1bb741eefc69813749f3",
             params: {
                 company_name: company_name,
                 company_intro: company_intro,
                 job_duty: job_duty,
                 job_require: job_require,
                 pay: pay
             }
         }
     $.ajax({
         url: "http://192.168.1.6:8080/api/insert/params",
         type: "POST",
         dataType: "json",
         data: JSON.stringify(dataJson),
         success: function (data) {
             var jsonData = JSON.parse(data["plaintext"]);
             var result = jsonData.item.result;
             code = jsonData.item.code;
             //返回状态信息
             var resultInfo = jsonData.item.resultInfo;
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