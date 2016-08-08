
/*
 * 内容注入、分发
 */
define("source_contentZ",function(require, exports, module){

    // 用户状态
    Handlebars.registerHelper('system_user_status', function(status) {
        return ["禁用","启用"][status];
    });

    // 用户状态
    Handlebars.registerHelper('yes_no', function(yes) {
        return ["否","是"][yes];
    });

    // 内容热度阈值
    Handlebars.registerHelper('hot_num', function(hot_num) {
        return hot_num?hot_num:0;
    });

    // 注入方式
    Handlebars.registerHelper('DisWay', function(yes) {
        return ["即时注入","定时注入"][yes];
    });

    // 分发方式
    Handlebars.registerHelper('distribute', function(yes) {
        return ["即时分发","定时分发"][yes];
    });

    exports.page = "pages/source/contentZ/subInto.html";
    exports.execute = function(toModule){
        /*
         *内容注入分发dom操作
         *
         */
        // var clock=setInterval(function(){
        // if($('a[data-menu="source_subInto"]').hasClass('active')){
        // toModule("source_subInto");
        // }
        // clearInterval(clock);
        // },3000);
        //批量删除列表
        $("#source").delegate("a.subInto-delM","click",function(){
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
                        url:require('global').base + "/ApiContentPortInjectXml/reqContentDelete",
                        data:tempData,
                        type:"get",
                        dataType:"json",
                        success: function(data){
                            if(data.status == "success"){
                                alert(data.message);
                                toModule("source_contentZ");
                            }else{
                                alert(data.message);
                            }

                        }

                    })
                }).no(function(){

                });
            }
        });


        //批量主动分发操作
        $("#source").delegate("a.subInto-handoutM","click",function(){
            var _this=$(this),
                $checked = $(".host-source:checkbox:checked"),
                tempData={},
                ids = [];

            $checked.each(function(){
                var $this = $(this),
                    id = $this.attr("data-id");
                ids.push(id);
            });
            tempData.Id=ids.join(",");

            //清缓存
            var global = require("global");
            global.updateCache("/ApiDispatchStrategy/listDisStrategy");

            var injectStatusTd=$checked.parent().siblings('.inject_status'),
                injectStatus=true;
            injectStatusTd.each(function(){
                var $this = $(this);
                if($this.text().indexOf('正在注入')>=0||$this.text().indexOf('注入失败')>=0){
                    injectStatus=false;
                    return;
                }
            });
            if(!injectStatus){
                $.alert('有项目正在注入或注入失败   请勿下发');
            }else{
                if(tempData.Id==''){
                    $.alert('请选择主动分发的项');
                }else{
                    toModule('source/contentZ/handoutD',function(){
                        //var tpl = $("#sys-editUser").html();
                        $("#userId").val(tempData.Id);
                        /*$.ajax({
                         url:config.urls.getUser,
                         data:{Id:id},
                         type:"get",
                         dataType:"json",
                         success: function(r){
                         if(r.code == 1){
                         var html = Handlebars.compile(tpl)(r);
                         $("#sys-editUserBox").append(html);
                         }else{
                         $.alert(r.message);
                         }
                         }
                         });*/

                    });
                }
            }
        });
        //主动分发操作
        $("#source").delegate("a.subInto-handout","click",function(){
            var _this=$(this),
                _parentTr = _this.parent().parent(),
                _parentTd=_this.parent().siblings('.inject_status');
            id = _parentTr.attr("data-id");
            //清缓存
            var global = require("global");
            global.updateCache("/ApiDispatchStrategy/listDisStrategy");
            if(_parentTd.text().indexOf('正在注入')>=0||_parentTd.text().indexOf('注入失败')>=0){
                $.alert(_parentTd.text()+' 请勿下发');
            }else{
                toModule('source/contentZ/handoutD',function(){
                    //var tpl = $("#sys-editUser").html();
                    $("#userId").val(id);
                    /*$.ajax({
                     url:config.urls.getUser,
                     data:{Id:id},
                     type:"get",
                     dataType:"json",
                     success: function(r){
                     if(r.code == 1){
                     var html = Handlebars.compile(tpl)(r);
                     $("#sys-editUserBox").append(html);
                     }else{
                     $.alert(r.message);
                     }
                     }
                     });*/

                });
            }
        });


    };
});
define("source/contentZ/batchImport", function(require, exports, module){
    exports.page = "pages/source/contentZ/batchImport.html";
    exports.execute = function(toModule){
        var btnBatch = $("#frame-upload");
        //批量导入
        seajs.use(["frameUpload"], function(FrameUpload){
            var fu = new FrameUpload({
                el: btnBatch[0],
                src: "pages/source/contentZ/misc/upload.html",
                action: require('global').base +"/ApiContentInject/importInject",
                afterUpload: function(json){
                    if(json){
                        $.alert(json.message);
                        btnBatch.find('input').val( json.info );
                    }
                },
                onchange: function(){
                    this.submit();
                },
                ready: function(){
                    this.name = "files";
                }
            });
        });
    };
});

/*
 * 内容注入、分发添加页面
 *
 */
define("source/contentZ/handoutAdd",function(require, exports, module){

    // 用户状态
    Handlebars.registerHelper('system_user_status', function(status) {
        return ["禁用","启用"][status];
    });

    // 用户状态
    Handlebars.registerHelper('yes_no', function(yes) {
        return ["否","是"][yes];
    });

    exports.page = "pages/source/contentZ/handoutAdd.html";
    exports.execute = function(toModule){
        var InjectTimeCon=$(".Inject_TimeCon");
        InjectTimeCon.hide();
        $("input[name='Inject_Type']").on('click',function(){
            var _this=$(this);
            if(_this.val()=='0'){
                InjectTimeCon.hide();
            }else if(_this.val()=="1"){
                InjectTimeCon.show();
            }
        });

        //取消按钮
        $("#source").delegate("#source-addstrategy-cancle","click",function(){
            toModule("source_contentZ");
        });

    };
});
/*
 * 内容注入、分发下主动分发页面
 *
 */
define("source/contentZ/handoutD",function(require, exports, module){

    // 用户状态
    Handlebars.registerHelper('system_user_status', function(status) {
        return ["禁用","启用"][status];
    });

    // 用户状态
    Handlebars.registerHelper('yes_no', function(yes) {
        return ["否","是"][yes];
    });
    exports.page = "pages/source/contentZ/handoutD.html";
    exports.execute = function(toModule){
        /*
         * tab菜单
         * xxhhxxhxxhhxxh
         */
        $('#myTab a:first').tab('show');//初始化显示哪个tab

        $('#myTab a').click(function (e) {
            e.preventDefault();//阻止a链接的跳转行为
            $(this).tab('show');//显示当前选中的链接及关联的content
            $('.detail').text( $(this).text());
        })
        /*
         *内容注入分发dom操作
         *
         */
        var addstrategyDate=$('.addstrategy-date');
        addstrategyDate.hide();
        $("input[name='DisWay']").on('click',function(){
            var _this=$(this);
            if(_this.val()=='0'){
                addstrategyDate.hide();
            }else if(_this.val()=="1"){
                addstrategyDate.show();
            }
        });

        //选择已有策略点击确定按钮
        $("#source").delegate("#source-handoutD-sub","click",function(){
            var _this = $(this),
                id = $('#userId').val(),
                $radio=$("input:radio:checked"),
                tempData={},
                ids = [];

            tempData.inject_id=id;
            tempData.strategy_id=$radio.val();
            //tempData.push({name:'id',value:id});
            //toModule("source_subInto");
            try{
                $.ajax({
                    url:require('global').base + "/ApiContentSendInjectXml/reqContentSend",
                    data:tempData,
                    type:"post",
                    dataType:"json",
                    success: function(data){
                        if(data.status == "success"){
                            $.alert(data.message);
                            toModule("source_contentZ");
                        }else{
                            $.alert(data.message);
                        }
                    },
                    error : function(){
                        $.alert('保存失败');
                    }
                });
            }catch(e){
                alert('保存失败');
            }

        });
        //选择已有策略点击取消按钮
        $("#source").delegate("#source-handoutD-cancle","click",function(){
            toModule("source_contentZ");
        });

        //新增策略点击确定按钮
        $("#source").delegate("#source-addstrategy-sub","click",function(){
            var _this = $(this),
                id = $('#userId').val(),
                tempData={};
            tempData = $("#handoutD-addstrategy-form").serializeArray();
            tempData.push({name:'id',value:id});
            //toModule("source_subInto");
            $.ajax({
                url:require('global').base + "/ApiDispatchStrategy/addDisStrategy ",
                data:tempData,
                type:"post",
                dataType:"json",
                success: function(data){
                    if(data.status == "success"){
                        $.alert(data.message);
                        //清缓存
                        var global = require("global");
                        global.updateCache("/ApiDispatchStrategy/listDisStrategy");
                        toModule("source/contentZ/handoutD");
                    }else{
                        alert(data.message);
                    }
                }
            });

        });
        //新增策略点击取消按钮
        $("#source").delegate("#source-addstrategy-cancle","click",function(){
            toModule("source_contentZ");
        });

    };
});

