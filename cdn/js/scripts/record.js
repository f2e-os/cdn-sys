define("record",function(require, exports, module){
    
    // 用户状态
    Handlebars.registerHelper('system_user_status', function(status) {
        return ["禁用","启用"][status];
    });

    // 用户状态
    Handlebars.registerHelper('yes_no', function(yes) {
        return ["否","是"][yes];
    });

	exports.page = "pages/record/exec.html";
    exports.execute = function(){ 

        // $("#container").children().find(".record-inner").html(12345667)


    };
});

define("record/visit",function(require, exports, module){
    exports.page = "pages/record/index.html";
});
define("record/system",function(require, exports, module){
    exports.page = "pages/record/system.html";
});
define("record/safety",function(require, exports, module){
    exports.page = "pages/record/safety.html";
});
define("record/history",function(require, exports, module){
        exports.page = "pages/record/history.html";
    exports.execute = function(toModule){};

});