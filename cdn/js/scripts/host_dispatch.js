define("host_dispatch_cfg",function(require,exports,module){
    var global = require("global"),
    urlBasePath = global.base,
    cache = require("host_cache"),
    config = {};

    config.urls = {
        getList: urlBasePath+"/ApiScheduleStrategy/listSchStrategy",
        addSchStrategy: urlBasePath+"/ApiScheduleStrategy/addSchStrategy",
        editSchStrategy: urlBasePath+"/ApiScheduleStrategy/editSchStrategy",
        delProbe : urlBasePath+"/ApiProbe/deleteProbe",  
        deleteProbeStrategy : urlBasePath+"/ApiProbe/deleteProbeStrategy",
        addProbeStrategy: urlBasePath+"/ApiProbe/addProbeStrategy",                     
        delSchStrategy: urlBasePath+"/ApiScheduleStrategy/deleteSchStrategy",
        delTerritory: urlBasePath+"/ApiScheduleStrategy/deleteTerritoryStrategy",
        delIpSet: urlBasePath+"/ApiScheduleStrategy/deleteIPStrategy",
        getHostByNode: urlBasePath+"/ApiMonitor/getHostByNodeId",
        sendHeath: urlBasePath+"/ApiScheduleStrategy/sendHealthCheck"
    }

    

    config.global = global;
    exports.config = config;
});
define("host_cache",function(require,exports,module){
    var global = require("global");
    global.updateCache("ProbeTypeData",{
        rows:[
        {id:0,type:"是"},
        {id:1,type:"否"}
        ]
    });
    global.updateCache("StrategyType",{
        rows:[
        {id:2,type:"轮询"},
        {id:0,type:"比率"},
        {id:1,type:"主备"}
        
        ]
    });
   global.updateCache("operator",{
        rows:[
        {id:1,type:"and"},
        {id:0,type:"or"}
        ]
    });

    global.updateCache("Priority",{
        rows:[
        {id:"",type:"无"},
        {id:1,type:"1"},
        {id:2,type:"2"},
        {id:3,type:"3"},
        {id:4,type:"4"},
        {id:5,type:"5"}
        ]
    });
    Handlebars.registerHelper("joinArr",function(arr,value){
        var result = [];
        if(arr == null){
            return ;
        }
        for(var i=0,max=arr.length;i<max;i++){
            result.push(arr[i][value]);
        }
        return result.join(",");
    });
    Handlebars.registerHelper("isFirst",function(index,options){
        if(index == 0){
            return options.fn(this);
        }
    });

    Handlebars.registerHelper("noLocation",function(value,options){
        if(value == undefined){
            return options.fn(this);
        }else{
            return options.inverse(this);
        }
    });
})
define("host_dispatch",function(require,exports,module){
    var config = require("host_dispatch_cfg").config;

    Handlebars.registerHelper('probeTypeToCN', function(value) {
        return ["默认","大文件","https","不探测"][value];
    });
    Handlebars.registerHelper('strategyTypeToCN', function(value) {
        return ["不采用策略","主备","轮询"][value];
    });

    Handlebars.registerHelper('is_traceToCN', function(value) {
        return ["否","是"][value];
    });
    Handlebars.registerHelper('operator', function(value) {
        return ["否","是"][value];
    });
   

    Handlebars.registerHelper("_",function(index){
        return index+1;
    });
    config.global.updateCache("health80",{
        rows:[
        {id:1,type:"是"},
        {id:0,type:"否"}
        ]
    });
    
    exports.menu = config.menu;
    exports.page = "pages/host/manage/hostDispatch.html";

    exports.init = function(){
        $('#myTab a:first').tab('show');//初始化显示哪个tab 
      
        $('#myTab a').click(function (e) { 
            e.preventDefault();//阻止a链接的跳转行为 
            $(this).tab('show');//显示当前选中的链接及关联的content 
            $('.detail').text( $(this).text());
        });
    }
    exports.execute = function(toModule,data){
        if(data.index != undefined){
            $("#myTab li").eq(data.index).find("a").trigger("click");
        }

        var getChecked = function(obj,url,selector,pramName,callback){
            var $checked = obj.find(selector+":checkbox:checked"),
            ids = [];

            $checked.each(function(){
                var $this = $(this),
                id = $this.attr("data-id");
                ids.push(id);
            });
            var pram = {};

            pram[pramName] = ids.join(",");

            $.confirm('确定要删除吗?').yes(function(){
                $.ajax({
                    url: url,
                    data:pram,
                    type:"post",
                    dataType:"json",
                    success: function(r){
                        if(r.code == 1){
                            $.alert("删除成功");
                            toModule("host_dispatch",function(){
                                callback&callback();
                            });
                        }else{
                            $.alert(r.message);
                        }
                    }
                });
                return false;
            });
        }
        //调度策略 操作
        var $dispatch = $("#dispatch_list");

        $dispatch.on("click","a.delete",function(){
            var $this = $(this),
            $td = $this.parent(),
            id = $td.attr("data-id");

            $.confirm('确定要删除吗?').yes(function(){
                $.ajax({
                    url: config.urls.delSchStrategy,
                    data: {Id:id},
                    dataType:"json",
                    success: function(r){
                        
                        if(r.code == 1){
                            toModule("host_dispatch",function(){
                                $("#myTab li").eq(0).find("a").trigger("click");
                            });
                            
                        }else{
                            alert(r.message);
                        }
                    }
                });
            });
        });

        $(".hostDispatch-del").on("click",function(){
            getChecked($dispatch,config.urls.delSchStrategy,".delCheck","Id",function(){
                $("#myTab li").eq(0).find("a").trigger("click");
            });
        });


        /// territory 操作
        var $territory = $("#dispatch_list1");

        $territory.on("click","a.delete",function(){
            var $this = $(this),
            $td = $this.parent(),
            id = $td.attr("data-id");

            $.confirm('确定要删除吗?').yes(function(){
                $.ajax({
                    url: config.urls.delTerritory,
                    data: {Ids:id},
                    dataType:"json",
                    success: function(r){
                        
                        if(r.code == 1){
                            toModule("host_dispatch",function(){
                                $("#myTab li").eq(1).find("a").trigger("click");
                            });
                            
                        }else{
                            $.alert(r.message);
                        }
                    }
                });
            });
            
        });
        $(".territory-del").on("click",function(){
            getChecked($territory,config.urls.delTerritory,".delTCheck","Ids",function(){
                $("#myTab li").eq(1).find("a").trigger("click");
            });
        });

        config.global.updateCache("/ApiScheduleStrategy/listTerritoryStrategy");//清除缓存
        //ipset 删除
        var $ipSet = $("#dispatch_list2");

        $ipSet.on("click","a.delete",function(){
            var $this = $(this),
            $td = $this.parent(),
            id = $td.attr("data-id");

            $.confirm('确定要删除吗?').yes(function(){
                $.ajax({
                    url: config.urls.delIpSet,
                    data: {ids:id},
                    dataType:"json",
                    success: function(r){
                        
                        if(r.code == 1){
                            toModule("host_dispatch",function(){
                                $("#myTab li").eq(2).find("a").trigger("click");
                            });
                            
                        }else{
                            $.alert(r.message);
                        }
                    }
                });
            });
        });
        $(".ipset-del").on("click",function(){
            getChecked($ipSet,config.urls.delIpSet,".delIPCheck","ids",function(){
                $("#myTab li").eq(2).find("a").trigger("click");
            });
        });
        //probe*********************
        
         var $probe = $("#disprobe_list");

        $probe.on("click","a.delete",function(){
            var $this = $(this),
            $td = $this.parent(),
            id = $td.attr("data-id");

            $.confirm('确定要删除吗?').yes(function(){
                $.ajax({
                    url: config.urls.delProbe,
                    data: {ids:id},
                    dataType:"json",
                    success: function(r){

                        if(r.code == 1){
                            toModule("host_dispatch",function(){
                                $("#myTab li").eq(3).find("a").trigger("click");
                            });

                        }else{
                            $.alert(r.message);
                        }
                    }
                });
            });
        });
        $(".probe-del").on("click",function(){
            getChecked($probe,config.urls.delProbe,".delProbeCheck","ids",function(){
                $("#myTab li").eq(3).find("a").trigger("click");
            });
        });
        //探测策略类型


         var $probep = $("#disprobe_list1");

        $probep.on("click","a.delete",function(){
            var $this = $(this),
            $td = $this.parent(),
            id = $td.attr("data-id");

            $.confirm('确定要删除吗?').yes(function(){
                $.ajax({
                    url: config.urls.deleteProbeStrategy,
                    data: {ids:id},
                    dataType:"json",
                    success: function(r){

                        if(r.code == 1){
                            toModule("host_dispatch",function(){
                                $("#myTab li").eq(4).find("a").trigger("click");
                            });

                        }else{
                            $.alert(r.message);
                        }
                    }
                });
            });
        });
        $(".hostDispatch1-del").on("click",function(){
            getChecked($probep,config.urls.deleteProbeStrategy,".delProbePCheck","ids",function(){
                $("#myTab li").eq(4).find("a").trigger("click");
            });
        });
        

        //健康度阀值设置
        var $heath = $("#dispatch_healthy"),
        sendHeathTpl = $("#sendHeathTpl").html(),
        html = Handlebars.compile(sendHeathTpl)({});

        $heath.on("click","#sendHeath",function(){
            $.dialog(html,{title:"下发的设备"}).yes(function(){
                var ids = [];
                $("#sendTpl-form .new-checks input:checked").each(function(){
                    ids.push($(this).val())
                });
                $.ajax({
                    url:config.urls.sendHeath,
                    data:{device_ids:ids.join(",")},
                    type:"get",
                    dataType:"json",
                    success: function(r){
                        $.alert(r.message);
                    }
                });
                return false;
            });
        });
    }
});
define("getHostByNode",function(require,exports,module){
    var config = require("host_dispatch_cfg").config;
    var actions = function(selector){
        $(".dialogTable_dis").on("change",".sForSelect.ZUI-select",function(){
            var $this = $(this),
            val = $this.val(),
            $parent = $this.parents("td"),
            $nextTd = $parent.next(),
            $select = $nextTd.find(".sForSelect"),
            dataType = $select.data("type");
            if(dataType == "Priority"){
                return ;
            }
            $.ajax({
                url: config.urls.getHostByNode,
                data:{NodeId:val},
                type: "get",
                dataType:"json",
                success: function(r){
                    if(r.code == 1){
                        var html = '',
                        data = r.info;
                        for(var i=0,max=data.length;i<max;i++){
                            html += '<option value="'+data[i].Id+'">'+data[i].HostName+'</option>';
                        }
                        $select.empty();
                        $select.append(html);
                    }
                }
            });
        });
    }
    exports.actions = actions;
});
define("Dynamic_add",function(require,exports,module){
    var config = require("host_dispatch_cfg").config;
    var actions = function(){

    }
    
    $.extend(actions.prototype,{
        setOpt: function(opt){
            this.opt = $.extend({data:{index:1}},opt);
        },
        getOpt: function(){
            return this.opt;
        },
        setData: function(data){
            this.opt.data = $.extend({index:1},data);
        },
        renderNewTr: function(){
            var opt = this.opt, 
            tpl = opt.tpl,
            $tableBody = $(opt.container),
            data = this.opt.data,
            initHtml = Handlebars.compile(tpl)(data);
            

            $tableBody.append(initHtml);

            if(data.index){
                data.index++;
            }
            opt.renderCallback&&opt.renderCallback();

            return this;
        },
        initSave: function(selector,callback){
            var opt = this.opt,
            container = opt.editContainer ? opt.editContainer : opt.container;
            $(container).on("click",selector,function(){
                var $this = $(this),
                $tr = $this.parents("tr");
                $tr.find("input").attr("disabled","disabled");
                $tr.find("select").attr("disabled","disabled");
                callback&&callback($this,$tr);
            });
            return this;
        },
        initEdit: function(selector,callback){
            var opt = this.opt,
            container = opt.editContainer ? opt.editContainer : opt.container;
            $(container).on("click",selector,function(){
                var $this = $(this),
                $tr = $this.parents("tr");
                $tr.find("input").removeAttr("disabled");
                $tr.find("select").removeAttr("disabled");
                callback&&callback($this,$tr);
            });
            return this;
        },
        initDel: function(selector,callback){
            var opt = this.opt,
            container = opt.editContainer ? opt.editContainer : opt.container;
            $(container).on("click",selector,function(){
                var $this = $(this),
                $tr = $this.parents("tr");
                if(confirm('确定要删除吗?')){
                    $tr.remove();
                    callback&&callback($this,$tr);
                }
            });
            return this;
        },
        _getResutlData: function(){
            var _t = this,
            opt = _t.opt,
            $form = $(opt.formSelector),
            result = [],
            $form_input = $form.find(".forSub");

            $form_input.each(function(){
                var $this = $(this),
                name = $this.attr("name");
                result.push(name+"="+$this.val());
            });
            result = $.merge(result,_t._getValue());
            return result.join("&");
        },
        //获取radio 和 checkBox
        _getValue: function(){
           var $notInputGroup = $(".notInput_host_dispatch"),
           result = [];

           $notInputGroup.each(function(){
                var $this = $(this),
                type = $this.attr("data-type");

                if(type == "radio"){
                    var $checkedRadio = $this.find("input:checked"),
                    name = $checkedRadio.attr("name").split("_")[0],
                    val = $checkedRadio.val();

                    result.push(name+"[]="+val);
                }
           });

           return result;
        },
        submit: function(callback){
            var _t = this,
            url = _t.opt.url;

            $.ajax({
                url: url,
                data: _t._getResutlData(),
                type: "post",
                dataType: "json",
                success: function(r){
                    callback&&callback(r);
                }
            });
        }
    });
    
    exports.actions = actions;
});
define("host_dispatch_add_ips",function(require,exports,module){

    exports.actions = {
        setValueToDOM: function($this){
            var $tableBody = $("#host_ipBody"),
                $select = $tableBody.find("select.sForSelect"),
                result = {},
                $td = $this.parent();

                $select.each(function(){
                    var $this = $(this),
                    type = $this.attr("data-type"),
                    val = $this.val();

                    if(result[type] == undefined){
                        result[type] = [];
                    }
                    result[type].push(val);
                });
                if(result.IPs){
                    for(var key in result){
                        $td.find("input[name^="+key+"]").val(result[key].join(","));
                    }
                }else{
                    $td.find("input.forSub").val("");
                }
                
        },
        setDOMToValue: function($this,actions){
            var $td = $this.parent(),
            $input = $td.find("input.forSub"),
            result = {},
            result1 = [],
            firstKey = $input.eq(0).attr("data-type");

            $input.each(function(){
                var $this = $(this),
                name = $this.attr("data-type");
                if(result[name] == undefined){
                    result[name] = [];
                }
                result[name] = $this.val().split(",");
            });


            var size = result[firstKey].length,
            temp = {};

            for(var i=0;i<size;i++){
                for(var key in result){
                    temp[key] = result[key][i];
                }
                result1.push($.extend({index:i+1},temp));
            };
            var opt1  = actions.getOpt(),
            opt2 = $.extend(true, {}, opt1);
            opt1.tpl = $("#ipEditTr").html(); 
            actions.setOpt(opt1);
            actions.setData({row:result1});
            if(result1.length == 1 && result1[0].Nodes =="" ){

            }else{
                actions.renderNewTr();
            }
            actions.setOpt(opt2);
        },
        ipsIsRepeat: function(){
            var $tableBody = $("#host_ipBody"),
            $ips = $tableBody.find(".sForSelect[data-type='IPs']"),
            ids = [],
            flage = false;
            $ips.each(function(){
                var $this = $(this),
                id = $this.val();
                ids.push(id);
            });
            var Arrs = ids.join(",")+",";
            for(var i=0,max=ids.length;i<max;i++){
                if(Arrs.replace(ids[i]+",","").indexOf(ids[i]+",")>-1) { 
                    flage = true;
                }
            }
            return flage;
        }
    };
});
define("host_dispatch_add",function(require,exports,module){
    var config = require("host_dispatch_cfg").config,
    Dy = new require("Dynamic_add").actions,
    actions = new Dy();

    exports.menu = config.menu;
    exports.page = "pages/host/dispatch/add.html";

    exports.execute = function(toModule){
        $hostAddBody = $("#hostDispatch_add");

        actions.setOpt({
            tpl: $("#add_dispatchTpl").html(),
            container: "#table_body",
            formSelector: "#addHostDispath_form",
            url: config.urls.addSchStrategy
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

        $hostAddBody.on("click","a.hostDispatchAdd-add",function(){
            actions.renderNewTr();
        });

        $("#hostDispatchAdd-sub").on("click",function(){
            actions.submit(function(r){
                $.alert(r.message);
                if(r.code == 1){
                    toModule("host_dispatch");
                }
            });
        });

        $(".hostDispatchAdd-del").on("click",function(){
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
                url: config.urls.addSchStrategy
            });
            var selectAction = require("getHostByNode").actions;
            $.dialog(html,{title:"配置服务地址",width:800}).shown(function(){
               
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

define("host/dispatch/edit",function(require,exports,module){
    var config = require("host_dispatch_cfg").config,
    Dy = new require("Dynamic_add").actions,
    actions = new Dy();

    exports.menu = config.menu;
    exports.page = "pages/host/dispatch/edit.html";

    exports.execute = function(toModule){
        $hostAddBody = $("#hostDispatch_edit");

        actions.setOpt({
            tpl: $("#add_dispatchTpl").html(),
            container: "#table_body",
            formSelector: "#editHostDispath_form",
            url: config.urls.editSchStrategy,
            editContainer: "#editHostDispath_form"
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

        $hostAddBody.on("click","a.hostDispatchEdit-add",function(){
            var text = $("#table_body tr:last").find("td").eq(1).text(),
            data = {index:parseInt(text)+1};
            actions.setData(data);
            actions.renderNewTr();
        });
        $hostAddBody.on("click","a.hostDispatchEdit-del",function(){
            var $checked = $hostAddBody.find(".delCheck:checkbox:checked");

            $checked.each(function(){
                var $this = $(this),
                $tr = $this.parents("tr");

                $tr.remove();
            });
        });


        $hostAddBody.on("click","#hostDispatchEdit-sub",function(){
            actions.submit(function(r){
                $.alert(r.message);
                if(r.code == 1){
                    toModule("host_dispatch");
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
                url: config.urls.editSchStrategy
            });

            var selectAction = require("getHostByNode").actions;
            $.dialog(html,{title:"配置服务地址",width:800}).shown(function(){
               
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
define("host_territory_add",function(require,exports,module){
    var config = require("host_dispatch_cfg").config;

    exports.menu = config.menu;
    exports.page = "pages/host/dispatch/territoryAdd.html";
});
define("host/territory/edit",function(require,exports,module){
    var config = require("host_dispatch_cfg").config;
    exports.menu = config.menu;
    exports.page = "pages/host/dispatch/territoryEdit.html";
});
// define("host_probep_add",function(require,exports,module){
//     var config = require("host_dispatch_cfg").config;
//      global.updateCache("operator",{
//         rows:[
//         {id:1,type:"and"},
//         {id:0,type:"or"}
//         ]
//     });

//     exports.menu = config.menu;
//     exports.page = "pages/host/dispatch/probepAdd.html";
// });
define("host_probe_add",function(require,exports,module){
    var config = require("host_dispatch_cfg").config;
     config.global.updateCache("is_probe_active",{
        rows:[
        {id:1,type:"是"},
        {id:0,type:"否"}
        ]
    });
      
    exports.menu = config.menu;
    exports.page = "pages/host/dispatch/probeAdd.html";

    exports.execute=function(toModule){

        $('#probe_id').on('change',function(){
           
            switch(this.value){
                case '1':
                    $('#probe100').children('div').hide();
                    $('#probe100').find('#probe1').show();
                    $('#probe100 input:not(.ZUI-radio)').val('');
                    break;
                case '2':
                    $('#probe100').children('div').hide();
                    $('#probe100').find('#probe2').show();
                    $('#probe100').find('#probe3').show();
                    $('#probe100').find('#probe5').show();
                    $('#probe100').find('#probe6').show();
                    $('#probe100').find('#probe7').show();
                    $('#probe100 input:not(.ZUI-radio)').val('');
                    $('#P5').val('3');
                    $('#P6').val('3');
                    $('#P7').val('0');
                    break;
                case '3':
                    $('#probe100').children('div').hide();
                    $('#probe100').find('#probe2').show();
                    $('#probe100').find('#probe3').show();
                    $('#probe100').find('#probe4').show();
                    $('#probe100').find('#probe5').show();
                    $('#probe100').find('#probe6').show();
                    $('#probe100').find('#probe7').show();
                    $('#probe100').find('#probe8').show();
                    $('#probe100 input:not(.ZUI-radio)').val('');
                    $('#P5').val('3');
                    $('#P6').val('2');
                    $('#P7').val('3');
                    break;
                case '4':
                    $('#probe100').children('div').hide();
                    $('#probe100').find('#probe2').show();
                    $('#probe100').find('#probe5').show();
                    $('#probe100 input:not(.ZUI-radio)').val('');
                    $('#P5').val('2');
                    break;
                case '5' :
                    $('#probe100').children('div').hide();
                    $('#probe100').find('#probe2').show();
                    $('#probe100 input:not(.ZUI-radio)').val('');
                    break;
                case '6':
                    $('#probe100').children('div').hide();
                    $('#probe100').find('#probe2').show();
                    $('#probe100 input:not(.ZUI-radio)').val('');
                    break;
                default :
                     $('#probe100').children('div').hide();
            }

        }).change();

        $('input[name=is_probe_active]').on('change',function(){
           switch(this.value){
            case '1' :
                $('#probe_active_timeout').hide();
                $('#P9').hide();
                break;
            default :
                $('#probe_active_timeout').show();
                $('#P9').show();
           }
        }).change();
    };
   
});

define("host_ipset_add",function(require,exports,module){
    
    var config = require("host_dispatch_cfg").config;

    config.global.updateCache("ipSetHY",{
        rows:[
        {id:1,type:"是"},
        {id:0,type:"否"}
        ]
    });
    exports.menu = config.menu;
    exports.page = "pages/host/dispatch/ipsetAdd.html";
});

define("host_health_add",function(require,exports,module){
    var config = require("host_dispatch_cfg").config;

    config.global.updateCache("health80",{
        rows:[
        {id:1,type:"是"},
        {id:0,type:"否"}
        ]
    });

    exports.menu = config.menu;
    exports.page = "pages/host/dispatch/ipsetAdd.html";
});




define("host_probep_add",function(require,exports,module){
    var config = require("host_dispatch_cfg").config,
    Dy = new require("Dynamic_add").actions,
    actions = new Dy();
      config.global.updateCache("health80",{
        rows:[
        {id:1,type:"是"},
        {id:0,type:"否"}
        ]
    });
    exports.menu = config.menu;
    exports.page = "pages/host/dispatch/probepAdd.html";

    exports.execute = function(toModule){
        $hostAddBody = $("#hostDispatch_add");

        actions.setOpt({
            tpl: $("#add_dispatchTpl").html(),
            container: "#table_body",
            formSelector: "#addHostDispath_form",
            url: config.urls.addProbeStrategy
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

        $hostAddBody.on("click","a.hostDispatchAdd-add",function(){
            actions.renderNewTr();
        });

        $("#hostDispatchAdd-sub").on("click",function(){
            actions.submit(function(r){
                $.alert(r.message);
                if(r.code == 1){
                    toModule("host_dispatch:index=4");
                }
            });
        });

        $(".hostDispatchAdd-del").on("click",function(){
            $.confirm('确定要删除吗?').yes(function(){
                var $checked = $hostAddBody.find(".delCheck:checkbox:checked");

                $checked.each(function(){
                    var $this = $(this),
                    $tr = $this.parents("tr");

                    $tr.remove();
                });
            });
        });

      
    };
});