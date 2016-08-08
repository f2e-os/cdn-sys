
define("all",function(require, exports, module){
    var global = require("global");
    $.ajax({
        url: global.base + '/ApiSystem/getCurUserInfo',
        dataType: 'json',
        success: function(res){
            if (res.code == 1){
                require('index');
                $('#user_name').text(res.info.UserName);
            }
            else {
                window.location.href = 'login.html';
            }
        },
        error: function(){
            window.location.href = 'login.html';
        }

    });
/*
    $.ajax({
        url:global.base+'/ApiSystem/selectPop',
        dataType:'json',
        success:function(result){
            var each1="";
            if(result.code == 1){
               $.each(result.info,function(i,value) {
                   each1 += "<div class='dialog_box_bottom'>" + "<p>" + result.info[i]['dev_name'] + result.info[i]['msg'] + "</p>" + "</div>";
               });
               var  boarddiv =  "<div id='winpop'  class='dialog_box'> " + "<div id='kk' class='dialog_box_top'>" +
                                "<span style='color:#000;font-weight: bold;'>告警信息</span> <span class='close' id='kk1'>X</span></div>"+
                                "</div>";
               $(document.body).append(boarddiv);
               $('#winpop').append(each1);
            }else{
                //alert("111");
            }
            $('#kk1').on('click',function(){
                $("#winpop").hide();
            });
            setInterval(function(){
                $("#winpop").show();
            },60000);

        }
    });
*/
    $('#systemEsc').on('click',function(){
        $.ajax({
            type:'get',
            url: global.base + '/ApiSystem/userLogout',
            dataType: 'json',
            data:'',
            success: function(res){
                // console.log(res);
                if (res.code == 1){
                    window.location.href = 'login.html';
                }
                else {
                   alert(res.message);
                }
            },
            error: function(){
                // window.location.href = 'login.html';
            }
        });
    });


});