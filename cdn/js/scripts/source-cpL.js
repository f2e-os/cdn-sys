
/*
 *区域管理 列表
 */
define("source/node/regionL",function(require, exports, module){

	  // 用户状态
    Handlebars.registerHelper('system_user_status', function(status) {
        return ["禁用","启用"][status];
    });

    // 用户状态
    Handlebars.registerHelper('yes_no', function(yes) {
        return ["否","是"][yes];
    });
    // 用户状态
    Handlebars.registerHelper('start-no', function(start) {
        return ["","checked"][start];
    });

	exports.page = "pages/source/node/regionL.html";
    exports.execute = function(toModule){ 
       
    };
});

/*
 *节点管理 列表
 */
define("source/node/packingL",function(require, exports, module){

	  // 用户状态
    Handlebars.registerHelper('source_checked', function(status) {
        return ["",'checked="checked"'][status];
    });

    // 用户状态
    Handlebars.registerHelper('yes_no', function(yes) {
        return ["否","是"][yes];
    });

	exports.page = "pages/source/node/packingL.html";
    exports.execute = function(toModule){ 
    	
    };
});

