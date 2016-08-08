define("pw-config",function(require,exports,module){
    var global = require("global"),
    urlBasePath = global.base,
    config = {};

    config.menu = [
        {name:"修改密码", module: "password", active: "active" ,icon :"icon15"}
    ];

    config.router = {
        index: "password"
    };

    exports.config = config;

});

define("password",function(require, exports, module){
    var config = require("pw-config").config;
	exports.menu = config.menu;

	exports.page = "pages/own/password.html";
    exports.execute = function(toModule){ 

        $('#passForm').show();
        $('#pwSuccess').hide();

        $('#pwSubmit').on('click',function(){
            var pwOld=$('#password_old').val();
            var pwNew=$('#password_new').val();
            var pwConfirm=$('#password_confirm').val();
            if(!pwOld || !pwNew || !pwConfirm){
                alert('输入不能为空值');
                return false;
            }
            if(pwNew!=pwConfirm){
                alert('两次输入密码不一致');
                return false;
            }
            $.ajax({
                type:'post',
                url:require('global').base +'/ApiSystem/changePwd',
                data:{'password_old':pwOld,'password_new':pwNew},
                dataType:'json',
                success:function(data){
                    if(data.code==1){
                        $('#passForm').hide();
                        $('#pwSuccess').show();
                    }else{
                        alert(data.message);
                    }
                }
            })
        })

    };
});
