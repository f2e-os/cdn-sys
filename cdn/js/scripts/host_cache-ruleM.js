define("host_cacheRuleM",function(require,exports,module){
     // 用户状态
    Handlebars.registerHelper('system_user_status', function(status) {
        return ["禁用","启用"][status];
    });

    // 用户状态
    Handlebars.registerHelper('yes_no', function(yes) {
        return ["否","是"][yes];
    });

    exports.page = "pages/host/cache/cacheRuleM.html";

    exports.execute = function(toModule){
        
        //增加列表
        $("#host").delegate("a.host-cacheRuleM-add","click",function(){
            var _this = $(this),
            	r={},
            	_tpl=$('#cacheRuleM-addInfo').html();
             var html = Handlebars.compile(_tpl)(r); 
            var dialog = $.dialog(html,{title:"增加缓存规则策略"}).yes(function(){
            	var tempData={};
            		tempData.Regexp=dialog.find("input[name='Regexp']").val();
            		 $.ajax({
		                url:require('global').base + "/ApiCacheRegManage/addCacheReg",
		                data:tempData,
		                type:"get",
		                dataType:"json",
		                success: function(data){
		                    if(data.status == "success"){
		                    	alert('成功');
	                    		//清缓存
					            var global = require("global");
								global.updateCache("/ApiCacheRegManage/listCacheReg");
		                       toModule("host_cacheRuleM");
		                    }
		                    
		                }
		            })
            });
         });
         
         //删除列表
        $("#host").delegate("a.cacheRuleM-delete","click",function(){
            var _this = $(this),
            _parentTr = _this.parent().parent(),
            id = _parentTr.attr("data-id"),
            tempData={};
			tempData.Id=id;
        	$.confirm('确定删除么').yes(function(){
	            $.ajax({
	                url:require('global').base + "/ApiCacheRegManage/deleteCacheReg",
	                data:tempData,
	                type:"get",
	                dataType:"json",
	                success: function(data){
	                    if(data.status == "success"){
	                    	alert('删除成功');
	                    	//清缓存
					            var global = require("global");
								global.updateCache("/ApiCacheRegManage/listCacheReg");
	                        toModule("host_cacheRuleM");
	                    }
	                    
	                }
	
	            })
            }).no(function(){
            	
            });
         });
          //批量删除列表
        $("#host").delegate("a.host-cacheRuleM-delM","click",function(){
            var $checked = $(".host-cacheRuleM:checkbox:checked"),
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
		                url:require('global').base + "/ApiCacheRegManage/deleteCacheReg",
		                data:tempData,
		                type:"get",
		                dataType:"json",
		                success: function(data){
		                    if(data.status == "success"){
		                    	alert('删除成功');
		                    	//清缓存
					            var global = require("global");
								global.updateCache("/ApiCacheRegManage/listCacheReg");
		                        toModule("host_cacheRuleM");
		                    }
		                    
		                }
		
		            })
	            }).no(function(){
	            	
	            });
            }
         });

    }
});