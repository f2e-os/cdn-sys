
/*
 * ip地址管理
 */
define("source_ipmanage",function(require, exports, module){

	  // 用户状态
    Handlebars.registerHelper('system_user_status', function(status) {
        return ["禁用","启用"][status];
    });

    // 用户状态
    Handlebars.registerHelper('yes_no', function(yes) {
        return ["否","是"][yes];
    });

	exports.page = "pages/source/ip/index.html";
    exports.execute = function(toModule){ 
    	
		/*
          *ip地址管理
          *
          */
        //删除列表
        $("#source").delegate("a.ipmanage-del","click",function(){
            var _this = $(this),
            _parentTr = _this.parent().parent(),
            id = _parentTr.attr("data-id"),
            tempData={};
			tempData.Id=id;
        	$.confirm('确定删除么').yes(function(){
	            $.ajax({
	                url:require('global').base + "/ApiIPLib/deleteIP",
	                data:tempData,
	                type:"get",
	                dataType:"json",
	                success: function(data){
	                    if(data.status == "success"){
	                    	alert('删除成功');
	                        toModule("source_ipmanage");
	                    }
	                    
	                }
	
	            })
            }).no(function(){
            	
            });
         });
          //批量删除列表
        $("#source").delegate("a.ipmanage-delM","click",function(){
            var $checked = $(".host-source:checkbox:checked"),
            tempData={},
            ids = [];

            $checked.each(function(){
                var $this = $(this),
                id = $this.attr("data-id");
                ids.push(id);
            });
            tempData.Id=ids.join(",");
            if(tempData.Id==''){
            	$.alert('请选择删除的项');
            }else{
	        	$.confirm('确定删除么').yes(function(){
		            $.ajax({
		                url:require('global').base + "/ApiIPLib/deleteIP",
		                data:tempData,
		                type:"get",
		                dataType:"json",
		                success: function(data){
		                    if(data.status == "success"){
		                    	alert('删除成功');
		                        toModule("source_ipmanage");
		                    }
		                    
		                }
		
		            })
	            }).no(function(){
	            	
	            });
            }
         });
         //批量上传
         var FrameUpload = require("frameUpload");

		var fu = new FrameUpload({
			el: $("#frame-upload")[0],
			src: "pages/source/ip/misc/upload.html",
			action: require('global').base +"/ApiIPLib/importIP",
			afterUpload: function(json){
				if(json){
    				$.alert(json.message);
					toModule('source_ipmanage',function(){
		            });
				}
			},
			onchange: function(){
				// alert(this.value);
				this.submit();
			},
			ready: function(){
				this.name = "files";
				this.multiple = "multiple";
			}
		});
       
    };
});

/*
 * 新增Ip页面
 * 
 */
define("source/ip/ip_add",function(require, exports, module){

	  // 用户状态
    Handlebars.registerHelper('system_user_status', function(status) {
        return ["禁用","启用"][status];
    });

    // 用户状态
    Handlebars.registerHelper('yes_no', function(yes) {
        return ["否","是"][yes];
    });

	exports.page = "pages/source/ip/ip_add.html";
    exports.execute = function(toModule){ 
		/*
         *ip添加dom操作
         *
         */
        
    };
});

/*
 * 修改Ip页面
 * 
 */
define("source/ip/ip_edit",function(require, exports, module){

	  // 用户状态
    Handlebars.registerHelper('system_user_status', function(status) {
        return ["禁用","启用"][status];
    });

    // 用户状态
    Handlebars.registerHelper('yes_no', function(yes) {
        return ["否","是"][yes];
    });

	exports.page = "pages/source/ip/ip_edit.html";
    exports.execute = function(toModule){ 
		/*
         *ip添加dom操作
         *
         */
        
    };
});

define("source/user/group", function(require, exports, module){
    exports.page = "pages/source/user/group.html";
});

define("source/user/add", function(require, exports, module){
    exports.page = "pages/source/user/add.html";
});
