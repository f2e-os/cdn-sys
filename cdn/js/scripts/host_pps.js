define("host_pps_config",function(require,exports,module){
    var global = require("global"),
    urlBasePath = global.base,
    config = {};

    config.menu = [
    ];

    config.urls = {
        delHostGroup: urlBasePath+"/ApiPPSWhiteList/deleteHostGroup",
        getHostList: urlBasePath+"/ApiPPSWhiteList/listHost",
        addHostGroup: urlBasePath+"/ApiPPSWhitelist/addHostGroup",
        delWhiteByName: urlBasePath+"/ApiPPSWhiteList/deleteWhiteListByName",
        fxWhite: urlBasePath+"/ApiPPSWhiteList/deleteWhiteListById",
        xfWhite: urlBasePath+"/ApiPPSWhiteList/sendWhiteList",
        hgWhite: urlBasePath+"/ApiPPSWhiteList/rollbackWhiteList",
        addWhite: urlBasePath+"/ApiPPSWhiteList/addWhiteList"
    };

    //zf 添加开始
    config.conf={
        set:global.base+'/ApiPPSCache/setPpsConfig',
        send:global.base+'/ApiPPSCache/sendPpsConfig',
        rollback:global.base+'/ApiPPSCache/rollbackPpsConfig',
        get:global.base+'/ApiPPSCache/getPpsConfig',
        autoCalc:global.base+'/ApiPPSCache/autoCalc',
        type:global.base+'/ApiCommon/getHostByType?type=5',
        name:'WEB PPC配置',
        module:'host_pps'
    };
    config.white={
        add:global.base+"/ApiPPSWhiteList/addWhiteList",
        send:global.base+"/ApiPPSWhiteList/sendWhiteList",
        rollback:global.base+"/ApiPPSWhiteList/rollbackWhiteList",
        type:global.base+'/ApiCommon/getHostByType?type=5',
        name:'白名单域名',
        module:'host_pps'
    };
    global.updateCache('Reg',{
        rows:[
            {id:'0',type:'服务'},
            {id:'1',type:'放行'}
        ]
    });
    //跳转到指定的模块显示是定的Tab
    config.showTab = function(toModule,num)
    {
        num=num||0;
        toModule('host_pps:index='+num);
    }
    //更新缓存
    config.updateCache = function(url)
    {
        global.updateCache(url);
    }
    //zf 添加结束
    /**
    * obj,url,selector,pramName,callback,text
    */
    config.getChecked = function(opt){
            var $checked = opt.obj.find(opt.selector+":checkbox:checked"),
            ids = [];

            $checked.each(function(){
                var $this = $(this),
                dataName = opt.dataName ? opt.dataName : "data-id",
                id = $this.attr(dataName);
                ids.push(id);
            });
            var pram = {},
            text = opt.text ? opt.text : "删除";

            pram[opt.pramName] = ids.join(",");
            //zf 修改开始
            if(pram[opt.pramName])
            {
                $.confirm("确定要"+text+"吗?").yes(function(){
                    $.ajax({
                        url: opt.url,
                        data:pram,
                        type:"post",
                        dataType:"json",
                        success: function(r){
                            if(r.code == 1){
                                $.alert(text+"成功").yes(function(){
                                    opt.callback&opt.callback();
                                });
                            }else{
                                $.alert(text+"失败");
                            }
                        }
                    });
                    return false;
                });
            }
            else
            {
                $.alert('请选择要'+text+'记录');
            }
            //zf 修改结束
        }
    exports.config = config;
});
define("host_pps",function(require,exports,module){
    var config = require("host_pps_config").config;

    exports.menu = config.menu;

    exports.page = "pages/host/pps/index.html";

    Handlebars.registerHelper("regToCN",function(reg){
        return ["服务","放行"][reg];
    });
    //zf 添加开始
    var lang=require('fan_lang');
    // 用户网段规则
    Handlebars.registerHelper('host_pps_Reg', function(value) {
        return (value && (['服务','放行'])[value])||'-';
    });
    // PPC服务器
    Handlebars.registerHelper('host_pps_ppcList', function(value) {
        return lang.renderTemplate('#ppclist-template',value);
    });
    // 用户网段
    Handlebars.registerHelper('host_pps_clientpoolOption', function(value) {
        return lang.renderTemplate('#clientpooloption-template',value);
    });
    exports.init = function(){
        $('#myTab a:first').tab('show');//初始化显示哪个tab 
      
        $('#myTab a').click(function (e) { 
            e.preventDefault();//阻止a链接的跳转行为 
            $(this).tab('show');//显示当前选中的链接及关联的content 
            $('.detail').text( $(this).text());
        });
    }
    //zf 添加结束
    exports.execute = function(toModule,data){
        //zf 添加开始
        config.updateCache('/ApiHost/listHost');
        config.updateCache('/ApiPPSWhiteList/listHostGroup');
        //zf 添加结束
       if(data.index != undefined){
            $("#myTab li").eq(data.index).find("a").trigger("click");
        }
        var $host_pps_list = $("#host_pps_list");

        $host_pps_list.on("click","a.pps_list-del",function(){
            config.getChecked({
                url: config.urls.delHostGroup,
                obj: $host_pps_list,
                selector: ".delCheck",
                pramName: "group_id",
                callback: function(){
                    config.showTab(toModule,0);
                }
            });
        });

        $host_pps_list.on("click","a.delete",function(){
            var $this = $(this),
            $td = $this.parent(),
            id = $td.attr("data-id");

            $.confirm("确定要删除吗?").yes(function(){
                $.ajax({
                    url: config.urls.delHostGroup,
                    data: {group_id: id},
                    type:"post",
                    dataType:"json",
                    success: function(r){
                        if(r.code == 1){
                            $.alert("删除成功").yes(function(){
                                config.showTab(toModule,0);
                            });
                        }else{
                            $.alert("删除失败");
                        }
                    }
                });
                return false;
            });
        });

        /*白名单管理*/
        var $whiteList = $("#whiteList");

        //删除
        /*$whiteList.on("click","a.whiteList-del",function(){
            config.getChecked({
                url: config.urls.delWhiteByName,
                obj: $whiteList,
                selector: ".delWhiteListCheck",
                pramName: "domain_names",
                dataName: "data-domainname",
                callback: function(){
                    config.showTab(toModule,2);
                }
            });
        });*/

        //放行
        $whiteList.on("click","a.whiteList-fx",function(){
            config.getChecked({
                url: config.urls.fxWhite,
                obj: $whiteList,
                selector: ".delWhiteListCheck",
                pramName: "domain_ids",
                dataName: "data-domainIds",
                text: "放行",
                callback: function(){
                    config.showTab(toModule,2);
                }
            });
        });
        //zf 添加开始
        //添加
        $('.whiteList-add').on('click',function(){
            var template = Handlebars.compile('<form>'+$('#white-form-add').html()+'</form>');
            var form=$(template({}));
            $.dialog(form, {title:'添加'+config.white.name}).yes(function(){
                var domains=$('[name=domains]');
                domains.val(domains.val().replace(/\s+/g,'--'));
                $.ajax({
                    type:'POST',
                    dataType:'json',
                    url:config.white.add,
                    data:form.serialize(),
                    success:function(result){
                        if(result.code==1)
                        {
                            $.alert('添加成功').yes(function(){config.showTab(toModule,2);});
                        }
                        else
                        {
                            alert(result.message);
                        }
                    },
                    error:function(){alert('添加失败');}
                });
                return false;
            });
        });
        //删除
        $('.whiteList-del').on('click',function(){
            var template = Handlebars.compile('<form>'+$('#white-form-del').html()+'</form>');
            var form=$(template({}));
            $.dialog(form, {title:'删除'+config.white.name}).yes(function(){
                $.ajax({
                    type:'POST',
                    dataType:'json',
                    url:config.urls.delWhiteByName,
                    data:form.serialize(),
                    success:function(result){
                        if(result.code==1)
                        {
                            $.alert('删除成功').yes(function(){config.showTab(toModule,2);});
                        }
                        else
                        {
                            alert(result.message);
                        }
                    },
                    error:function(){alert('删除失败');}
                });
                return false;
            });
        });
        //下发
        lang.setSend(config.white,null,{url:config.white.type,rows:'info'},'device_ids',undefined,{btn:'.whiteList-xf'},function(){config.showTab(toModule,2);});
        //回滚
        lang.setRollback(config.white,null,{btn:'.whiteList-hg'},function(){config.showTab(toModule,2);});

        /*PPC配置*/
        var Fui = $('.FUI');
        var confData={ppc:null,limit:null,client_pool:null};
        //设备组自动计算
        Fui.on('click','.btn-autoCalc',function(){
            var el=$('.ppc-block input:checkbox:checked:not([data-check-all])');
            if(el.length>0)
            {
                var id=[];
                el.each(function(){
                    id.push($(this).parents('tr').attr('data-id'));
                });
                $.dialog('是否要自动计算？', {title:'自动计算'}).yes(function(){
                    $.ajax({
                        type:'POST',
                        dataType:'json',
                        url:config.conf.autoCalc,
                        data:'ids='+id.join(','),
                        success:function(result){
                            if(result.code==1)
                            {
                                $('.ppc-block tr[data-id]').remove();
                                $('.ppc-block tbody').append(lang.renderTemplate('#ppclist-template',result.info));
                            }
                            else
                            {
                                alert(result.message);
                            }
                        },
                        error:function(){alert('计算失败');}
                    });
                });
            }
            else
            {
                $.alert('请选择要自动计算的记录');
                return false;
            }
        });
        //添加用户网段
        Fui.on('click','.btn-add-clientpool',function(){
            var data={
                start_ip:$('.clientpool-start').val(),
                end_ip:$('.clientpool-end').val(),
                reg:$('.clientpool-reg').val()
            };
            $('.clientpool-list').append(lang.renderTemplate('#clientpooloption-template',[data]));
        });
        //删除用户网段
        Fui.on('click','.btn-del-clientpool',function(){
            var el=$('.clientpool-list option:selected');
            if(el.length>0)
            {
                $.dialog('是否要删除？', {title:'删除'}).yes(function(){
                    el.remove();
                });
            }
            else
            {
                $.alert('请选择要删除的记录');
                return false;
            }
        });
        function getConfData(){
            var endash='--';
            var array=[];
            $('.ppc-block tr[data-id][data-group]').each(function(){
                if($(this).find('input:checkbox').prop('checked'))
                {   
                    array.push($(this).attr('data-id')+endash+$(this).find('.ppc-start').val()+endash+$(this).find('.ppc-end').val()+endash+$(this).attr('data-group'));
                }
            });
            confData.ppc=array.join('|');
            array=[];
            $('.clientpool-list option').each(function(){
                array.push($(this).val());
            });
            confData.client_pool=array.join('|');
            array=[];
            return confData;
        }
        // 保存
        Fui.on('click','.btn-set',function(){
            $.ajax({
                type:'POST',
                dataType:'json',
                url:config.conf.set,
                data:getConfData(),
                success:function(result){
                    if(result.code==1)
                    {
                        $.alert('保存成功');
                    }
                    else
                    {
                        alert(result.message);
                    }
                },
                error:function(){alert('保存失败');}
            });
        });
        //下发
        lang.setSend(config.conf,null,{url:config.conf.type,rows:'info'},'device_ids',{getData:function(){return getConfData();}},{btn:'.conf-xf'},function(){config.showTab(toModule,1);});
        //回滚
        lang.setRollback(config.conf,null,{btn:'.conf-hg'},function(){config.showTab(toModule,1);});
        //zf 添加结束
    };
});
define("host_pps_add",function(require,exports,module){
    var config = require("host_pps_config").config;

    exports.menu = config.menu;

    exports.page = "pages/host/pps/add.html";

    exports.execute = function(){
        var $pps_host_list = $("#host_pps_add_checkBoxs"),
        $checkBox = $pps_host_list.find("input:checkbox"),
        $host_ids = $("#host_add_ids");

        $checkBox.on("click",function(){
            var ids = [];
            setTimeout(function(){
                var $checked = $pps_host_list.find("input[name='hostList']:checked");

                $checked.each(function(){
                    var $this = $(this),
                    val = $this.val();
                    ids.push(val);
                });

                $host_ids.val(ids.join(","));
            });
            
        })
    };
});

define("host/pps/edit",function(require,exports,module){
    var config = require("host_pps_config").config;

    exports.menu = config.menu;

    exports.page = "pages/host/pps/pps_edit.html";

    exports.execute = function(toModule){
        var $pps_host_list = $("#host_pps_edit");
        

        $pps_host_list.on("click","input:checkbox",function(){
            var ids = [],
            $host_ids = $("#host_edit_ids");
            setTimeout(function(){
                var $checked = $pps_host_list.find("input[name='hostList']:checked");

                $checked.each(function(){
                    var $this = $(this),
                    val = $this.val();
                    ids.push(val);
                });

                $host_ids.val(ids.join(","));
            });
            
        });
    };
});

define("host_white_history",function(require,exports,module){
    var config = require("host_pps_config").config;

    exports.menu = config.menu;

    exports.page = "pages/host/pps/white_history.html";

    exports.execute = function(toModule){
    };
});