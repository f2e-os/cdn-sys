
/*
 *区域管理 
 */
define("source",function(require, exports, module){

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

	exports.page = "pages/source/index.html";
    exports.execute = function(toModule){ 
    	/*
    	 * tab菜单
    	 *
    	 */
    	/*
 		$('#myTab a:first').tab('show');//初始化显示哪个tab 
      
        $('#myTab a').click(function (e) { 
	        e.preventDefault();//阻止a链接的跳转行为 
	        $(this).tab('show');//显示当前选中的链接及关联的content 
	        $('.detail').text( $(this).text());
        }) 
        */
       // alert( $("#container").html() );
		/*
          *区域管理dom操作
          *
          */
		 //删除列表
        $("#source").delegate("a.region-del","click",function(){
            var _this = $(this),
            _parentTr = _this.parent().parent(),
            id = _parentTr.attr("data-id"),
            tempData={};
			tempData.Id=id;
        	$.confirm('确定删除么').yes(function(){
	            $.ajax({
	                url:require('global').base +"/ApiArea/deleteArea",
	                data:tempData,
	                type:"get",
	                dataType:"json",
	                success: function(data){
	                    if(data.status == "success"){
	                    	alert(data.message);
	                    	 //清缓存
				            var global = require("global");
							global.updateCache("/ApiArea/listArea");
	                        toModule("source");
	                    }else{
	                    	alert(data.message)
	                    }
	                    
	                }
	
	            })
            }).no(function(){
            	
            });
         });
          //批量删除列表
        $("#source").delegate("a.region-delM","click",function(){
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
		                url:require('global').base + "/ApiArea/deleteArea",
		                data:tempData,
		                type:"get",
		                dataType:"json",
		                success: function(data){
		                    if(data.status == "success"){
		                    	alert(data.message);
		                    	//清缓存
					            var global = require("global");
								global.updateCache("/ApiArea/listArea");
		                        toModule("source");
		                    }else{
		                    	alert(data.message)
		                    }
		                    
		                }
		
		            })
	            }).no(function(){
	            	
	            });
            }
         });
    };
});

//区域添加
define("source/node/regionAdd", function(require, exports, module){
	var global = require("global");

	global.updateCache("Status",{
		rows:[
            {id:"1",type:"启用"},
            {id:"0",type:"停用"}
        ]
	});
    exports.page = "pages/source/node/regionAdd.html";
});
//区域修改
define("source/node/regionEdit", function(require, exports, module){
	var global = require("global");

	global.updateCache("Status",{
		rows:[
            {id:"1",type:"启用"},
            {id:"0",type:"停用"}
        ]
	});
    exports.page = "pages/source/node/regionEdit.html";
});
/*
 *节点管理 
 */
define("source/node/packing",function(require, exports, module){

	  // 用户状态
    Handlebars.registerHelper('source_checked', function(status) {
        return ["",'checked="checked"'][status];
    });

    // 用户状态
    Handlebars.registerHelper('yes_no', function(yes) {
        return ["否","是"][yes];
    });
	exports.page = "pages/source/node/packing.html";
    exports.execute = function(toModule){ 
    	/*
    	 * tab菜单
    	 *
    	 */
    	/*
 		$('#myTab a:first').tab('show');//初始化显示哪个tab 
      
        $('#myTab a').click(function (e) { 
	        e.preventDefault();//阻止a链接的跳转行为 
	        $(this).tab('show');//显示当前选中的链接及关联的content 
	        $('.detail').text( $(this).text());
        }) 
        */
       // alert( $("#container").html() );
       
       
       //清缓存
       
       	var global = require("global");
		global.updateCache("/ApiDepartment/listDepartment");
		global.updateCache("/ApiCommon/getNodeByType?type=1");
		global.updateCache("/ApiCommon/getNodeByType?type=2");
		global.updateCache("/ApiCommon/getNodeByType?type=3");
         /*
          *节点管理dom操作
          *
          */
         //删除列表
         $("#source").delegate("a.packing-del","click",function(){
            var _this = $(this),
            _parentTr = _this.parent().parent(),
            id = _parentTr.attr("data-id"),
            tempData={};
			tempData.Id=id;
			$.confirm('确定删除么').yes(function(){
				$.ajax({
	                url:require('global').base + "/ApiDepartment/deleteDepartment",
	                data:tempData,
	                type:"get",
	                dataType:"json",
	                success: function(data){
	                    if(data.status == "success"){
	                    	alert(data.message)
	                    	//清缓存
				            var global = require("global");
							global.updateCache("/ApiDepartment/listDepartment");
							global.updateCache("/ApiCommon/getNodeByType?type=1");
							global.updateCache("/ApiCommon/getNodeByType?type=2");
							global.updateCache("/ApiCommon/getNodeByType?type=3");
	                        toModule("source/node/packing");
	                    }else{
	                    	alert(data.message);
	                    }
	                }
	
	            })
			}).no(function(){
				
			});
          
         });
          //节点批量删除列表
         $("#source").delegate("a.packing-delM","click",function(){
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
		                url:require('global').base + "/ApiDepartment/deleteDepartment",
		                data:tempData,
		                type:"get",
		                dataType:"json",
		                success: function(data){
		                    if(data.status == "success"){
		                    	alert(data.message)
		                    	//清缓存
				            var global = require("global");
							global.updateCache("/ApiDepartment/listDepartment");
							global.updateCache("/ApiCommon/getNodeByType?type=1");
							global.updateCache("/ApiCommon/getNodeByType?type=2");
							global.updateCache("/ApiCommon/getNodeByType?type=3");
		                        toModule("source/node/packing");
		                    }else{
		                    	alert(data.message);
		                    }
		                }
		
		            })
				}).no(function(){
					
				});
         }
         });
    };
});

//节点添加
define("source/node/packingAdd", function(require, exports, module){
	var global = require("global");

	global.updateCache("Status",{
		rows:[
            {id:"1",type:"启用"},
            {id:"0",type:"停用"}
        ]
	});
	global.updateCache("Level",{
		rows:[
            {id:"1",type:"1"},
            {id:"2",type:"2"},
            {id:"3",type:"3"},
            {id:"4",type:"4"},
            {id:"5",type:"5"}
        ]
	});
    exports.page = "pages/source/node/packingAdd.html";
});
//节点修改
define("source/node/packingEdit", function(require, exports, module){
	var global = require("global");

	global.updateCache("Status",{
		rows:[
            {id:"1",type:"启用"},
            {id:"0",type:"停用"}
        ]
	});
	global.updateCache("Level",{
		rows:[
            {id:"1",type:"1"},
            {id:"2",type:"2"},
            {id:"3",type:"3"},
            {id:"4",type:"4"},
            {id:"5",type:"5"}
        ]
	});
    exports.page = "pages/source/node/packingEdit.html";
    exports.execute = function(toModule,data){ 
    	$("input[name='Id']").val(data.Id);
    };
});
/*
 *设备管理
 */
define("source/node/device",function(require, exports, module){

	  // 用户状态
    Handlebars.registerHelper('source_checked', function(status) {
        return ["",'checked="checked"'][status];
    });
    
      // 用户状态
    Handlebars.registerHelper('device_status', function(status) {
    	status=status>=0?1:0;
        return ["故障","正常"][status];
    });

    // 用户状态
    Handlebars.registerHelper('yes_no', function(yes) {
        return ["否","是"][yes];
    });

    Handlebars.registerHelper('pps_set', function(is_pps) {
        //return ['<a href="#" class="ZUI-operate device-set" data-menu="source/node/devicePpsSet:host_id={{Id}}"><span class="iconfont">&#xe603;</span>配置</a>','<a href="#" class="ZUI-operate device-set" data-menu="source/node/devicePpsSet:host_id={{Id}}"><span class="iconfont">&#xe603;</span>配置</a>'][is_pps];
        is_pps=is_pps==true?1:0;
        return ['','disabled=\"disabled\"'][is_pps];
    });
	exports.page = "pages/source/node/device.html";
    exports.execute = function(toModule){
    	var global = require('global');
    	// 不管是新增、更新、删除之后都会进入当前模块，所有直接在这里更新缓存
        global.updateCache('/ApiCommon/getHostByType');
        global.updateCache('/ApiHttpCache/listHost');
    	global.updateCache('/ApiHost/listHost');
    	global.updateCache('/ApiPPSWhiteList/listHost');
    	/*
    	 * tab菜单
    	 *
    	 */
    	/*
 		$('#myTab a:first').tab('show');//初始化显示哪个tab 
      
        $('#myTab a').click(function (e) { 
	        e.preventDefault();//阻止a链接的跳转行为 
	        $(this).tab('show');//显示当前选中的链接及关联的content 
	        $('.detail').text( $(this).text());
        }) 
        */
       // alert( $("#container").html() );
         /*
          *节点管理dom操作
          *
          */
         //删除列表
         $("#source").delegate("a.device-del","click",function(){
            var _this = $(this),
            _parentTr = _this.parent().parent(),
            id = _parentTr.attr("data-id"),
            tempData={};
			tempData.Id=id;
			$.confirm('确定删除么').yes(function(){
				$.ajax({
	                url:require('global').base + "/ApiHost/deleteHost",
	                data:tempData,
	                type:"get",
	                dataType:"json",
	                success: function(data){
	                    if(data.status == "success"){
	                    	alert(data.message);
	                    		//清缓存
				            var global = require("global");
							global.updateCache("/ApiHost/listHost");
							global.updateCache('/ApiPPSWhiteList/listHost');
                        	toModule("source/node/device");
	                    }else{
	                    	alert(data.message);
	                    }
	                    
	                }
            	})
			}).no(function(){
				
			})
           
         });
         //设备批量删除列表
         $("#source").delegate("a.device-delM","click",function(){
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
		                url:require('global').base + "/ApiHost/deleteHost",
		                data:tempData,
		                type:"get",
		                dataType:"json",
		                success: function(data){
		                    if(data.status == "success"){
		                    	alert(data.message);
		                    		//清缓存
				            var global = require("global");
							global.updateCache("/ApiHost/listHost");
							global.updateCache('/ApiPPSWhiteList/listHost');
	                        	toModule("source/node/device");
		                    }else{
		                    	alert(data.message);
		                    }
		                    
		                }
	            	})
				}).no(function(){
					
				})
          }
         });
         
    };
});
//设备添加
define("source/node/deviceAdd",function(require, exports, module){
    exports.page = "pages/source/node/deviceAdd.html";
    exports.execute = function(toModule){
        $("body").on("blur","input[name='IPV6']",function(){
          var matchStr =/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
           var str =$("input[name='IPV6']").val();
                if(!matchStr.test(str)&&str!=""){
                    $("#ipv6").show();
                }else{
                    $("#ipv6").hide();
                }
       });
    }

});
//pps配置
define("source/node/devicePpsSet",function(require, exports, module){
    exports.page = "pages/source/node/devicePpsSet.html";
    // exports.execute = function(toModule){
    // ｝
});

//设备修改123
define("source/node/deviceEdit", function(require, exports, module){
	var global = require("global");

	global.updateCache("ProtocalId",{
		rows:[
            {id:"1",type:"HTTP"},
            {id:"2",type:"WEB"}
        ]
	});
	global.updateCache("Backbone",{
		rows:[
            {id:"1",type:"是"},
            {id:"0",type:"否"}
        ]
	});
    exports.page = "pages/source/node/deviceEdit.html";
    exports.execute = function(toModule){
       $("body").on("blur","input[name='IPV6']",function(){
            var matchStr =/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
            var str =$("input[name='IPV6']").val();
            if(!matchStr.test(str)&&str!=""){
                $("#ipv6").show();
            }else{
                $("#ipv6").hide();
            }
       });
    }
});

