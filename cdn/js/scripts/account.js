define("account",function(require, exports, module){
    var global = require("global");
	exports.page = "pages/account/ratePrice.html";
    exports.execute = function(){
        var form = $('form');
        form.on('click', '.btn-export', function(){
            var t = $(this);
            var url = t.data('url');
            var success = false;
            $.ajax({
                url: global.base + url,
                async: false,
                data: form.serializeArray(),
                dataType: "json",
                success: function(res){
                    alert(res.message);
                    if(res.code == 1){
                        t.attr("href",  res.info);
                        success = true;
                    }
                },
                error: function(){
                    alert("导出失败！");
                }
            });
            if(!success){
                e.preventDefault();
            }
        });
    };
    exports.afterAutoSubmit = function(res){ 
        var form = $('form');
        var o = res.info;
        for(var k in o){
            $('[name=' + k + ']').val(o[k]);    
        }
    };
});

define("account/timePrice",function(require, exports, module){
    var account = require("account");
    exports.afterAutoSubmit = account.afterAutoSubmit;
    exports.execute = account.execute;
    exports.page = "pages/account/timePrice.html";
});
define("account/widthPrice",function(require, exports, module){
    var account = require("account");
    exports.afterAutoSubmit = account.afterAutoSubmit;
    exports.execute = account.execute;
    exports.page = "pages/account/widthPrice.html";
});
define("account/nodePrice",function(require, exports, module){
    var account = require("account");
    exports.afterAutoSubmit = account.afterAutoSubmit;
    exports.execute = account.execute;
    exports.page = "pages/account/nodePrice.html";
});
define("account/ratePrice",function(require, exports, module){
    var account = require("account");
    exports.afterAutoSubmit = account.afterAutoSubmit;
    exports.execute = account.execute;
    exports.page = "pages/account/throughputPrice.html";
});