
// ruler配置
define("host/ruler/list", function(require, exports, module){
	var global = require("global");
    var rulerConf = null;

	global.updateCache("ClientPooltype",{
		rows:[
            {id:"1",type:"服务"},
            {id:"0",type:"放行"}
        ]
	});

	global.updateCache("host_type",{
		rows:[
            {id:"-1",type:"不检查"},
            {id:"0",type:"检查ip"},
            {id:"1",type:"检查域名"}
        ]
	});

	global.updateCache("agent_type",{
		rows:[
            {id:"0",type:"代理模式"},
            {id:"1",type:"热点触发模式"}
        ]
	});

	exports.page = "pages/host/ruler/list.html";
    exports.execute = function(toModule){

        rulerConf = rulerConf || Handlebars.compile( $('#ruler-conf-dialog').html() );

        $( ".host-rollback" ).on("click", function(e){
            $.ajax({
                url: global.base + '/ApiRuler/rollbackRuler',
                dataType: 'json',
                success: function(data) {
                    alert( data.message );
                },
                error: function(){
                    alert("服务端错误！\nurl: /ApiRuler/rollbackRuler" );
                }
            });
        });

        $( ".host" ).on("click", ".ruler-conf", function(e){
            var rulerItems = $.extend( true, {}, global.getCache("/ApiRuler/getRulerItemType") );
            var id = $(this).data("id");
            $.ajax({
                url: global.base + '/ApiRuler/getRulerItem',
                data: {id:id},
                dataType: "json",
                success: function(res){
                    if(res.code == 1){
                        
                        $.each( rulerItems.info, function(i,item){
                            $.each( res.info, function(j,item1){
                                if( item1.item_type === item.par_name ){
                                    item.per_value = item1.item_value;
                                }
                            });
                        });

                        $.confirm( rulerConf( rulerItems ), {
                            title: "参数配置"
                        } ).yes(function(){
                            var items = $('.ruler-conf-list input');
                            var data = {host_id: id};

                            items.each(function(){
                                var t = $(this), name = t.attr('name');
                                data[ name ] = t.val();
                            });
                            $.ajax({
                                url: global.base + '/ApiRuler/setRulerItem',
                                data: data,
                                success: function(res){
                                    alert( res.message );
                                },
                                error: function(){
                                    alert( '保存失败: ');
                                }
                            });
                        });
                    }else{
                        alert( res.message );
                    }
                },
                error: function(){
                    alert("服务端错误！\nurl: /ApiRuler/getRulerItem" );
                }
            });
        });
    };
});

define("host/ruler/add", function(require, exports, module){
    var global = require("global");
	var list = require("host/ruler/list");

	exports.page = "pages/host/ruler/add.html";
    exports.afterAutoSubmit = function(res, toModule){
        var items = $('.ruler-items .ruler-item');
        var data = {host_id: res.info.Id};

        items.each(function(){
            var t = $(this), name = t.attr('name');
            data[ name ] = t.val();
        });
        $.ajax({
            url: global.base + '/ApiRuler/setRulerItem',
            data: data,
            success: function(res){
                if( res.code == 1 ){
                    toModule( $('.auto-submit').data('target') );
                }
                alert( res.message );
            },
            error: function(){
                alert( '保存失败: ');
            }
        });
    };
});

define("host/ruler/edit", function(require, exports, module){
	require("host/ruler/list");
	exports.page = "pages/host/ruler/edit.html";
});

define("host/ruler/conf", function(require, exports, module){
    require("host/ruler/list");

    exports.page = "pages/host/ruler/item-edit.html";
});
