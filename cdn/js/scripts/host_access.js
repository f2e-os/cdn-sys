/*
 *访问控制策略管理列表页面 
 */
define("host_accessStatic",function(require,exports,module){
	
    // 用户状态
    Handlebars.registerHelper('host_user_status', function(status) {
        return ["动态","静态"][status];
    });

    // url或ip
    Handlebars.registerHelper('url_ip', function(IsIp) {
        return ["url","ip"][IsIp];
    });

 	// 重定向或阻断
    Handlebars.registerHelper('RedirStop', function(RedirStop) {
        return ["阻断","重定向"][RedirStop];
    });

    exports.page = "pages/host/access/access_static.html";

    exports.execute = function(toModule){

          //下发
        $("#host").delegate("a.host-accessStatic-Issued","click",function(){
            var _this = $(this),
            	r={},
            	_tpl=$('#accessStatic-Issued').html();
             var html = Handlebars.compile(_tpl)(r); 
             html=$(html);
             //弹出框里面全选事件
             var _checkall=html.find('#host-Issued-check-all:input'),
             	_allcheckbox=html.find('input:checkbox');
             _checkall.on('click',function(){
             	var _this=$(this);
             	_this.prop("checked")?_allcheckbox.prop('checked',true):_allcheckbox.prop('checked',false);
             })
            $.dialog(html,{title:"下发的设备"}).yes(function(){
        		var $checked =$('#accessStatic-Issued-form').find("input:checkbox:checked"),
           			tempData={},
            		ids = [];

		            $checked.each(function(){
		                var $this = $(this),
		                id = $this.val();
		                ids.push(id);
		            });
		            tempData.Host_Id=ids.join(",");
		            tempData.Type=$('#accessStatic-Issued-form').find("input[name='Type']:checked").val();
            		 $.ajax({
		                url:require('global').base + "/ApiAccessControl/setDynamicVisit",
		                data:tempData,
		                type:"get",
		                dataType:"json",
		                success: function(data){
		                    if(data.status == "success"){
		                    	alert(data.message);
		                       toModule("host_accessStatic");
		                    }else{
		                    	alert(data.message);
		                    }
		                    
		                }
		            })
            }).no(function(str){
            	
            });
         });
         
         //删除列表
        $("#host").delegate("a.accessStatic-delete","click",function(){
            var _this = $(this),
            _parentTr = _this.parent().parent(),
            id = _parentTr.attr("data-id"),
            tempData={};
			tempData.Id=id;
        	$.confirm('确定删除么').yes(function(){
	            $.ajax({
	                url:require('global').base + "/ApiAccessControl/deleteAccessControl",
	                data:tempData,
	                type:"get",
	                dataType:"json",
	                success: function(data){
	                    if(data.status == "success"){
	                    	alert('删除成功');
	                    	//清缓存
					            var global = require("global");
								global.updateCache("/ApiAccessControl/listAccessControl");
	                        toModule("host_accessStatic");
	                    }
	                    
	                }
	
	            })
            }).no(function(){
            	
            });
         });
          //批量删除列表
        $("#host").delegate("a.host-accessStatic-delM","click",function(){
            var $checked = $(".host-accessStatic:checkbox:checked"),
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
		                url:require('global').base + "/ApiAccessControl/deleteAccessControl",
		                data:tempData,
		                type:"get",
		                dataType:"json",
		                success: function(data){
		                    if(data.status == "success"){
		                    	alert('删除成功');
		                    	//清缓存
					            var global = require("global");
								global.updateCache("/ApiAccessControl/listAccessControl");
		                        toModule("host_accessStatic");
		                    }
		                    
		                }
		
		            })
	            }).no(function(){
	            	
	            });
            }
         });

    }
});
/*
 *访问控制策略管理添加页面
 */
define("host/access/host_accessStatic-add",function(require,exports,module){
     // 用户状态
    Handlebars.registerHelper('system_user_status', function(status) {
        return ["禁用","启用"][status];
    });

    // 用户状态
    Handlebars.registerHelper('yes_no', function(yes) {
        return ["否","是"][yes];
    });

    exports.page = "pages/host/access/add.html";

    exports.execute = function(toModule){
        // $('#myTab a:first').tab('show');//初始化显示哪个tab 
        //       
        // $('#myTab a').click(function (e) { 
            // e.preventDefault();//阻止a链接的跳转行为 
            // $(this).tab('show');//显示当前选中的链接及关联的content 
            // $('.detail').text( $(this).text());
        // });
    }
});
/*
 *访问控制策略管理修改页面
 */
define("host/access/host_accessStatic-edit",function(require,exports,module){
	
   var global = require("global");

	global.updateCache("IsIP",{
		rows:[
            {id:"0",type:"URL"},
            {id:"1",type:"IP"}
        ]
	});
	
	global.updateCache("RedirStop",{
		rows:[
            {id:"1",type:"重定向"},
            {id:"0",type:"阻断"}
        ]
	});

    exports.page = "pages/host/access/edit.html";

    exports.execute = function(toModule){
        // $('#myTab a:first').tab('show');//初始化显示哪个tab 
        //       
        // $('#myTab a').click(function (e) { 
            // e.preventDefault();//阻止a链接的跳转行为 
            // $(this).tab('show');//显示当前选中的链接及关联的content 
            // $('.detail').text( $(this).text());
        // });
    }
});

/*
 *访问控制动态策略管理
 */
define("host_accessDynamic",function(require,exports,module){
	
   var global = require("global");

	global.updateCache("IsIP",{
		rows:[
            {id:"0",type:"URL"},
            {id:"1",type:"IP"}
        ]
	});
	
	global.updateCache("RedirStop",{
		rows:[
            {id:"1",type:"重定向"},
            {id:"0",type:"阻断"}
        ]
	});

    exports.page = "pages/host/access/access_dynamic.html";

    exports.execute = function(toModule){
        // $('#myTab a:first').tab('show');//初始化显示哪个tab 
        //       
        // $('#myTab a').click(function (e) { 
            // e.preventDefault();//阻止a链接的跳转行为 
            // $(this).tab('show');//显示当前选中的链接及关联的content 
            // $('.detail').text( $(this).text());
        // });
          $("#host").delegate(":radio[name='RedirStop']","click",function(){
          	var $this=$(this);
          	$this.val()=='1'?$('#holder-RedirUrl').show():$('#holder-RedirUrl').hide();
          });
        //下发
        $("#host").delegate("a.sendAccessConfig","click",function(){
            var _this = $(this),
            	r={},
            	_tpl=$('#accessDynamic-Issued').html();
             var html = Handlebars.compile(_tpl)(r); 
             html=$(html);
             //弹出框里面全选事件
             var _checkall=html.find('#host-Issued-check-all:input'),
             	_allcheckbox=html.find('input:checkbox');
             _checkall.on('click',function(){
             	var _this=$(this);
             	_this.prop("checked")?_allcheckbox.prop('checked',true):_allcheckbox.prop('checked',false);
             })
            $.dialog(html,{title:"下发的设备"}).yes(function(){
        		var $checked =$('#accessDynamic-Issued-form').find("input:checkbox:checked"),
           			tempData={},
            		ids = [];

		            $checked.each(function(){
		                var $this = $(this),
		                id = $this.val();
		                ids.push(id);
		            });
		            tempData.Host_Id=ids.join(",");
		            tempData.UrlIP=$('input[name="UrlIP"]').val();
		            tempData.RedirStop=$(':radio[name="RedirStop"]:checked').val();
		            tempData.RedirUrl=$('input[name="RedirUrl"]').val();
		           // tempData.Type=$('#accessDynamic-Issued-form').find("input[name='Type']:checked").val();
            		 $.ajax({
		                url:require('global').base + "/ApiDynAccessControl/sendAccessConfig",
		                data:tempData,
		                type:"get",
		                dataType:"json",
		                success: function(data){
		                    if(data.status == "success"){
		                    	alert(data.message);
		                       toModule("host_accessDynamic");
		                    }else{
		                    	alert(data.message);
		                    }
		                    
		                }
		            })
            }).no(function(str){
            	
            });
         });
    }
});