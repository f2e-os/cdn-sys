/*
 *重定向黑名单管理
 */
define("host_blacklist",function(require,exports,module){
	
	var global = require("global");
    // 用户状态
    Handlebars.registerHelper('host_user_status', function(status) {
        return ["动态","静态"][status];
    });
    Handlebars.registerHelper('protocol_status', function(protocol) {
    	if(protocol==56){
    		protocol=1;
    	}
        return ["","BT","HTTP","EMULE","XL"][protocol];
    });

	//生成下拉框
	global.updateCache("strategy",{
		rows:[
            {id:"-1",type:"阻断"},
            {id:"-2",type:"放行"},
            {id:"3",type:"重定向"}
        ]
	});

    exports.page = "pages/host/blacklist/blacklist.html";

    exports.execute = function(toModule){
        // $('#myTab a:first').tab('show');//初始化显示哪个tab 
        //       
        // $('#myTab a').click(function (e) { 
            // e.preventDefault();//阻止a链接的跳转行为 
            // $(this).tab('show');//显示当前选中的链接及关联的content 
            // $('.detail').text( $(this).text());
        // });
        
          //批量导入黑名单
         seajs.use(["frameUpload"], function(FrameUpload){
         	
	    		var fu = new FrameUpload({
	    			el: $("#frame-upload")[0],
	    			src: "pages/host/blacklist/misc/upload.html",
	    			action: "/upload",
	    			afterUpload: function(json){
	    				if(json){
		    				$.alert('上传成功');
	    					toModule('host_blacklist',function(){
				            });
	    				}
	    				
	    				console.log( json );
	    			},
	    			onchange: function(){
	    				this.submit();
	    			},
	    			ready: function(){
	    				this.name = "files";
	    				this.multiple = "multiple";
	    			}
	    		});
	    	});
	  
          //批量删除列表
        $("#host").delegate("a.host-blacklist-delM","click",function(){
            var $checked = $(".host-blacklist:checkbox:checked"),
            tempData={},
            ids = [],
            checkmethods=[];

            $checked.each(function(){
                var $this = $(this),
                _checkmethod=$this.attr("checkmethod"),
                id = $this.attr("data-id");
                ids.push(id);
                checkmethods.push(_checkmethod);
            });
            tempData.Id=ids.join(",");
            tempData.checkmethod=checkmethods.join(",");
            if(tempData.Id==''){
            	$.alert('请选择删除的项');
            }else{
	        	$.confirm('确定删除么').yes(function(){
		            $.ajax({
		                url:require('global').base + "/ApiRedirectBlacklist/deleteblacklist",
		                data:tempData,
		                type:"get",
		                dataType:"json",
		                success: function(data){
		                    if(data.status == "success"){
		                    	alert('删除成功');
		                    	//清缓存
					            var global = require("global");
								global.updateCache("/ApiRedirectBlacklist/blacklist");
		                        toModule("host_blacklist");
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
 *重定向黑名单添加页面
 */
define("host/blacklist/host_blacklist-add",function(require,exports,module){
	var global = require("global");
	
     // 用户状态
    Handlebars.registerHelper('system_user_status', function(status) {
        return ["禁用","启用"][status];
    });

    global.updateCache("strategy",{
		rows:[
            {id:"-1",type:"阻断"},
            {id:"-2",type:"放行"},
            {id:"3",type:"重定向"}
        ]
	});
	
	global.updateCache("config_dis",{
		rows:[
            {id:"0",type:"HTTP网站配置"},
            {id:"1",type:"其他"},
            {id:"2",type:"关键字"},
            {id:"3",type:"host"}
        ]
	});
	
	global.updateCache("protocol",{
		rows:[
            {id:"2",type:"HTTP"},
            {id:"1",type:"BT"},
            {id:"3",type:"EMULE"},
            {id:"4",type:"XL"}
        ]
	});

    exports.page = "pages/host/blacklist/add.html";

    exports.execute = function(toModule){
        // $('#myTab a:first').tab('show');//初始化显示哪个tab 
        //       
        // $('#myTab a').click(function (e) { 
            // e.preventDefault();//阻止a链接的跳转行为 
            // $(this).tab('show');//显示当前选中的链接及关联的content 
            // $('.detail').text( $(this).text());
        // });
        
        
        var radioBox=$('.config-dis-radio'),
        	configCommon=$('.config-dis-common'),
        	radios=radioBox.find('input:radio');
        radios.eq(0).attr('checked','checked');
    	configCommon.hide();
    	var  initValue=radioBox.find('input:radio:checked').val();
    	hideShow(initValue);
    	//根据配置区分显示隐藏一些项
    	function hideShow(value){
    		configCommon.hide();
    		configCommon.find('input').attr('name','');
    		$('#strategy').find('option[value="3"]').show();
        	switch(value){
        		case '0':
        			configCommon.filter('.config-dis-infohash').show();
        			configCommon.filter('.config-dis-infohash').find('input').attr('name','infohash');
        			$('#protocol').val('2').attr('disabled','disabled');
        			$('#protocol').before('<input type="hidden" class="tempProtocol" name="protocol" value="2"/>');
        			$('#strategy').find('option[value="3"]').hide();
        			$('.con-RedirUrl').hide();
        			break;
        		case '1':
        			configCommon.filter('.config-dis-infohash').show();
        			configCommon.filter('.config-dis-refer').show();
        			configCommon.filter('.config-dis-infohash').find('input').attr('name','infohash');
        			configCommon.filter('.config-dis-refer').find('input').attr('name','refer');
        			$('#protocol').attr('disabled',false);
        			$('.tempProtocol').remove();
        			$('.con-RedirUrl').show();
        			$('#strategy').val()=='3'?$('#RedirUrl').attr('disabled',false):$('#RedirUrl').attr('disabled','disabled');
        			break;
        		case '2':
        			configCommon.filter('.config-dis-keyword').show();
        			configCommon.filter('.config-dis-keyword').find('input').attr('name','infohash');
        			$('#protocol').attr('disabled',false);
        			$('.tempProtocol').remove();
        			$('.con-RedirUrl').show();
        			$('#strategy').val()=='3'?$('#RedirUrl').attr('disabled',false):$('#RedirUrl').attr('disabled','disabled');
        			break;
        		case '3':
        			configCommon.filter('.config-dis-host').show();
        			configCommon.filter('.config-dis-host').find('input').attr('name','infohash');
        			$('#protocol').attr('disabled',false);
        			$('.tempProtocol').remove();
        			$('.con-RedirUrl').show();
        			$('#strategy').val()=='3'?$('#RedirUrl').attr('disabled',false):$('#RedirUrl').attr('disabled','disabled');
        			break;
        	}
    	}
        radios.on('click',function(){
        	var _this=$(this),
        		_value=_this.val();
        		hideShow(_value);
        });
        
        $('#protocol').on('change',function(){
        	var _this=$(this);
        	if(_this.val()=='2'){
        		$('#strategy').find('option[value="3"]').show();
        	}else{
        		$('#strategy').find('option[value="3"]').hide();
        	}
        });
        $('#strategy').on('change',function(){
        	var _this=$(this);
        	if(_this.val()=='3'){
        		$('#RedirUrl').attr('disabled',false);
        	}else{
        		$('#RedirUrl').attr('disabled','disabled');
        	}
        });
    }
});
/*
 *重定向黑名单修改页面
 */
define("host/blacklist/host_blacklist-edit",function(require,exports,module){
	
	
	Handlebars.registerHelper("isShow",function(checkmethod,value,options){
        if(checkmethod == value){
            return options.fn(this);
        }
    });
	
   var global = require("global");

	
	global.updateCache("strategy",{
		rows:[
            {id:"-1",type:"阻断"},
            {id:"-2",type:"放行"},
            {id:"3",type:"重定向"}
        ]
	});
	
	global.updateCache("config_dis",{
		rows:[
            {id:"0",type:"HTTP网站配置"},
            {id:"1",type:"其他"},
            {id:"2",type:"关键字"},
            {id:"3",type:"host"}
        ]
	});
	
	global.updateCache("protocol",{
		rows:[
            {id:"1",type:"BT"},
            {id:"2",type:"HTTP"},
            {id:"3",type:"EMULE"},
            {id:"4",type:"XL"}
        ]
	});

    exports.page = "pages/host/blacklist/edit.html";

    exports.execute = function(toModule,data){
        // $('#myTab a:first').tab('show');//初始化显示哪个tab 
        //       
        // $('#myTab a').click(function (e) { 
            // e.preventDefault();//阻止a链接的跳转行为 
            // $(this).tab('show');//显示当前选中的链接及关联的content 
            // $('.detail').text( $(this).text());
        // });
        $("input[name='Id']").val(data.Id);
        $('.host').delegate('input:radio','click',function(){
        	
		        var radioBox=$('.config-dis-radio'),
	        	configCommon=$('.config-dis-common'),
	        	radios=radioBox.find('input:radio');
	        radios.eq(0).attr('checked','checked');
	    	configCommon.hide();
	    	var  initValue=radioBox.find('input:radio:checked').val();
	    	hideShow(initValue);
	    	//根据配置区分显示隐藏一些项
	    	function hideShow(value){
	    		configCommon.hide();
	    		configCommon.find('input').attr('name','');
	    		$('#strategy').find('option[value="3"]').show();
	        	switch(value){
	        		case '0':
	        			configCommon.filter('.config-dis-infohash').show();
	        			configCommon.filter('.config-dis-infohash').find('input').attr('name','infohash');
	        			$('#protocol').val('2').attr('disabled','disabled');
	        			$('#protocol').before('<input type="hidden" name="protocol" value="2"/>');
	        			$('#strategy').find('option[value="3"]').hide();
	        			$('.con-RedirUrl').hide();
	        			break;
	        		case '1':
	        			configCommon.filter('.config-dis-infohash').show();
	        			configCommon.filter('.config-dis-refer').show();
	        			configCommon.filter('.config-dis-infohash').find('input').attr('name','infohash');
	        			configCommon.filter('.config-dis-refer').find('input').attr('name','refer');
	        			$('#protocol').attr('disabled',false);
	        			$('.tempProtocol').remove();
	        			$('.con-RedirUrl').show();
	        			$('#strategy').val()=='3'?$('#RedirUrl').attr('disabled',false):$('#RedirUrl').attr('disabled','disabled');
	        			break;
	        		case '2':
	        			configCommon.filter('.config-dis-keyword').show();
	        			configCommon.filter('.config-dis-keyword').find('input').attr('name','infohash');
	        			$('#protocol').attr('disabled',false);
	        			$('.tempProtocol').remove();
	        			$('.con-RedirUrl').show();
	        			$('#strategy').val()=='3'?$('#RedirUrl').attr('disabled',false):$('#RedirUrl').attr('disabled','disabled');
	        			break;
	        		case '3':
	        			configCommon.filter('.config-dis-host').show();
	        			configCommon.filter('.config-dis-host').find('input').attr('name','infohash');
	        			$('#protocol').attr('disabled',false);
	        			$('.tempProtocol').remove();
	        			$('.con-RedirUrl').show();
	        			$('#strategy').val()=='3'?$('#RedirUrl').attr('disabled',false):$('#RedirUrl').attr('disabled','disabled');
	        			break;
	        	}
	    	}
	    	radios.unbind('click');
	        radios.bind('click',function(){
	        	var _this=$(this),
	        		_value=_this.val();
	        		hideShow(_value);
	        });
	        $('#protocol').unbind('change');
	        $('#protocol').bind('change',function(){
	        	var _this=$(this);
	        	if(_this.val()=='2'){
	        		$('#strategy').find('option[value="3"]').show();
	        	}else{
	        		$('#strategy').find('option[value="3"]').hide();
	        	}
	        });
	        $('#strategy').unbind('change');
	        $('#strategy').bind('change',function(){
	        	var _this=$(this);
	        	if(_this.val()=='3'){
	        		$('#RedirUrl').attr('disabled',false);
	        	}else{
	        		$('#RedirUrl').attr('disabled','disabled');
	        	}
	        });
        })	
    }
});
