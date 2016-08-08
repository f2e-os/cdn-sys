define('host_trace_config',function(require, exports, module){
	var global=require('global'),
	cache = require("host_cache");
	//左侧菜单
	var config={};
	config.menu = [];
	config.trace={
		page:'pages/host/trace/index.html',
		pageAdd:'pages/host/trace/traceAdd.html',
		pageEdit:'pages/host/trace/traceEdit.html',
		add:global.base+'/ApiTraceStrategy/addTraceStrategy',
		update:global.base+'/ApiTraceStrategy/editTraceStrategy',
		del:global.base+'/ApiTraceStrategy/deleteTraceStrategy',
		get:global.base+'/ApiTraceStrategy/getTraceStrategy',
		list:global.base+'/ApiTraceStrategy/listTraceStrategy',
		search:global.base+'/ApiTraceStrategy/listTraceStrategy',
		department:global.base+'/ApiDepartment/listDepartment',
		host:global.base+'/ApiHost/listHost',
		territory:global.base+'/ApiScheduleStrategy/listTerritoryStrategy',
		type:global.base+'/ApiCommon/getHostByType',
		name:'回源策略管理',
		module:'host_trace'
	};
	exports.config=config;
});

define('host_trace',function(require, exports, module){
	var lang=require('fan_lang');
	var config=require('host_trace_config').config;
	exports.menu = config.menu;
	exports.page = config.trace.page;
	// 探测
	Handlebars.registerHelper('host_trace_ProbeType', function(value) {
		return (value && (['默认','大文件','https','不探测'])[value])||'-';
	});
	// 策略
	Handlebars.registerHelper('host_trace_StrategyType', function(value) {
		return (value && (['不采用策略','主备','轮询'])[value])||'-';
	});

	exports.execute = function(toModule, param){
		lang.setSubTabDetail();
		//删除
		lang.setDelOne(config.trace,toModule,'Id');
		//删除多条
		lang.setDelMulti(config.trace,toModule,'Id');
	};
});

define('host_trace_add',function(require, exports, module){
	var config=require('host_trace_config').config,
	Dy = require("Dynamic_add").actions,
    actions = new Dy();

	exports.menu = config.menu;
	exports.page = config.trace.pageAdd;
	exports.execute = function(toModule, param){
		$hostAddBody = $("#host_trace_add");

        actions.setOpt({
            tpl: $("#add_traceTpl").html(),
            container: "#table_body",
            formSelector: "#host_trace_add_form",
            url: config.trace.add
        });

        actions.renderNewTr().
                initDel("a.deleteTr").
                initSave("a.subTr",function($this,$tr){
                    $this.hide();
                    $tr.find("a.editTr").addClass("showInLine");
                    $tr.find("a.ipconfig").attr("data-status","unable");
                }).
                initEdit("a.editTr",function($this,$tr){
                   $this.removeClass("showInLine");
                   $tr.find("a.subTr").show();
                   $tr.find("a.ipconfig").removeAttr("data-status"); 
                });

        $hostAddBody.on("click","a.host_trace-add",function(){
            actions.renderNewTr();
        });

        $("#host_trace_add-sub").on("click",function(){
            actions.submit(function(r){
                $.alert(r.message);
                if(r.code == 1){
                    toModule("host_trace");
                }
            });
        });

        $(".host_trace-del").on("click",function(){
            $.confirm('确定要删除吗?').yes(function(){
                var $checked = $hostAddBody.find(".delCheck:checkbox:checked");

                $checked.each(function(){
                    var $this = $(this),
                    $tr = $this.parents("tr");

                    $tr.remove();
                });
            });
        });

        $hostAddBody.on("click","a.ipconfig",function(){
            var $this = $(this),
            status = $this.attr("data-status");

            if(status){
                return ;
            }

            var html = $("#ipDialog").html(),
            actions2 = new Dy(),
            addIps = require("host_dispatch_add_ips").actions,
            isSave = $this.attr("data-save");
            actions2.setOpt({
                tpl: $("#ipTr").html(),
                container: "#host_ipBody",
                url: config.trace.add
            });
            var selectAction = require("getHostByNode").actions;
            $.dialog(html,{title:"配置回源地址",width:800}).shown(function(){
               
                if(!isSave){
                    actions2.renderNewTr();
                }else{
                    addIps.setDOMToValue($this,actions2);
                    //$this.removeAttr("data-save");
                }

                selectAction();
                actions2.initDel("a.deleteTr").
                initSave("a.subTr",function($this,$tr){
                    $this.hide();
                    $tr.find("a.editTr").addClass("showInLine");
                }).
                initEdit("a.editTr",function($this,$tr){
                   $this.removeClass("showInLine");
                   $tr.find("a.subTr").show(); 
                });
            
                $("a.hostDispatch-ipAdd").on("click",function(){
                    actions2.renderNewTr();
                });
                $("a.hostDispatch-ipDel").on("click",function(){
                    var $ipBody = $("#host_ipBody"),
                    $checked = $ipBody.find("input:checked");

                    $checked.each(function(){
                        var $this = $(this),
                        $parentTd = $this.parents("tr");

                        $parentTd.remove();
                    });
                    /*var trLen = $ipBody.find("tr").length;

                    if(trLen == 0){
                        actions2.renderNewTr();
                    }*/
                });                  
            }).yes(function(){
                if(addIps.ipsIsRepeat()){
                    alert("设备id不能重复，请重新选择!");
                    return false;
                }
                addIps.setValueToDOM($this);
                $this.attr("data-save","true");
            });
        });
	};
});

define('host/httpcache/edit',function(require, exports, module){
	var config=require('host_trace_config').config,
	Dy = require("Dynamic_add").actions,
    actions = new Dy();;
	exports.menu = config.menu;
	exports.page = config.trace.pageEdit;
	exports.execute = function(toModule){
		$hostAddBody = $("#host_trace_edit");

        actions.setOpt({
            tpl: $("#add_traceTpl").html(),
            container: "#table_body",
            formSelector: "#host_trace_edit_form",
            url: config.trace.update,
            editContainer: "#host_trace_edit_form"
        });

        actions.renderNewTr().
                initDel("a.deleteTr").
                initSave("a.subTr",function($this,$tr){
                    $this.hide();
                    $tr.find("a.editTr").addClass("showInLine");
                    $tr.find("a.ipconfig").attr("data-status","unable");
                }).
                initEdit("a.editTr",function($this,$tr){
                   $this.removeClass("showInLine");
                   $tr.find("a.subTr").show();
                   $tr.find("a.ipconfig").removeAttr("data-status"); 
                });

        $hostAddBody.on("click","a.host_trace_edit-add",function(){
            var text = $("#table_body tr:last").find("td").eq(1).text(),
            data = {index:parseInt(text)+1};
            actions.setData(data);
            actions.renderNewTr();
        });
        $hostAddBody.on("click","a.host_trace_edit-del",function(){
            var $checked = $hostAddBody.find(".delCheck:checkbox:checked");

            $checked.each(function(){
                var $this = $(this),
                $tr = $this.parents("tr");

                $tr.remove();
            });
        });


        $hostAddBody.on("click","#host_trace_edit-sub",function(){
            actions.submit(function(r){
                $.alert(r.message);
                if(r.code == 1){
                    toModule("host_trace");
                }
            });
        });

        $hostAddBody.on("click","a.ipconfig",function(){
            var $this = $(this),
            status = $this.attr("data-status");

            if(status){
                return ;
            }

            var html = $("#ipDialog").html(),
            actions2 = new Dy(),
            addIps = require("host_dispatch_add_ips").actions,
            isSave = $this.attr("data-save");
            actions2.setOpt({
                tpl: $("#ipTr").html(),
                container: "#host_ipBody",
                url: config.trace.update
            });
            var selectAction = require("getHostByNode").actions;
            $.dialog(html,{title:"配置回源地址",width:800}).shown(function(){
               
                if(!isSave){
                    actions2.renderNewTr();
                }else{
                    addIps.setDOMToValue($this,actions2);
                    //$this.removeAttr("data-save");
                }

                selectAction();
                actions2.initDel("a.deleteTr").
                initSave("a.subTr",function($this,$tr){
                    $this.hide();
                    $tr.find("a.editTr").addClass("showInLine");
                }).
                initEdit("a.editTr",function($this,$tr){
                   $this.removeClass("showInLine");
                   $tr.find("a.subTr").show(); 
                });
            
                $("a.hostDispatch-ipAdd").on("click",function(){
                    var text = $("#host_ipBody tr:last").find("td").eq(1).text(),
                    data = {index:parseInt(text)+1};
                    actions2.setData(data);
                    actions2.renderNewTr();
                });
                $("a.hostDispatch-ipDel").on("click",function(){
                    var $ipBody = $("#host_ipBody"),
                    $checked = $ipBody.find("input:checked");

                    $checked.each(function(){
                        var $this = $(this),
                        $parentTd = $this.parents("tr");

                        $parentTd.remove();
                    });
                    /*var trLen = $ipBody.find("tr").length;

                    if(trLen == 0){
                        actions2.renderNewTr();
                    }*/
                });                  
            }).yes(function(){
                if(addIps.ipsIsRepeat()){
                    alert("设备id不能重复，请重新选择!");
                    return false;
                }
                addIps.setValueToDOM($this);
                $this.attr("data-save","true");
            });
        });
	};
});
