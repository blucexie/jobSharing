$(function(){
    //第五页生成二维码
    var url =  window.location.href;
    var num = url.indexOf("uc=");
    var uc = url.substr(num+3,url.length-1);
    $('#code').qrcode({
        text: "https://apix.funinhr.com/api/hr/employee.html?uc="+ uc
    });
})