$(function(){
    //第五页生成二维码
    var url =  window.location.href;
    var num = url.indexOf("uc=");
    var uc = url.substr(num+3,url.length-1);
    $('#code').qrcode({
        text: "http://192.168.1.87:8081/hr/employee.html?uc="+ uc
    });
})