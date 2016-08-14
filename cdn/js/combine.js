$include["libs/form-util.js"];
$include["libs/date-util.js"];
$include["libs/number-util.js"];
$include["libs/alerts.js"];
$include["libs/template-init.js"];
$include["libs/frame-upload.js"];
$include["libs/fork.js"];
$include["global.js"];
<%  //加载scripts包下所有js文件
	var fs = require("fs"),
		path = (request.util.conf.root + request.$.title).replace(/[^\/\\]+$/,"scripts/");
	fs.readdirSync(path).forEach(function(js){
		__p += fs.readFileSync(path+js);
	});
%>
define("menu",function(require, exports, module){
	var container = $("#container");
	var menuHolder = $("#menu-holder");
	var section = container.parent();
	var compile = Handlebars.compile( menuHolder.html() );
	exports.set = function(module){
		if(!module || !module.menu){
			container.removeClass();
			menuHolder.hide().removeClass();
			section.removeClass("row");
		}else{
			section.addClass("row");
			container.addClass("col-sm-10");
			menuHolder.show().html( compile(module) ).addClass("col-sm-2");
		}
	};
});

define("index",function(require, exports, module){
	var container = $("#container"),
		menu = require("menu"),
		T = require("T"),
		global = require("global");

    var currentModule;
    var delayTime = 0;

    var listenDelayTime = function(){
        delayTime += 1;
        if(delayTime > 30){
            location.href = 'login.html';
        }else{
            setTimeout(listenDelayTime, 60 * 1000);
        }
    };
    // 半小时未操作，跳转登录页面
    listenDelayTime();

	// popstate
	$(window).on("popstate", function() {
		if( history.state && (currentModule = history.state.module) ){
	    	toModule(currentModule, menu.set);										
		}
	});
	var zTnav = $(".zTnav").children().children();

	var toModule = function(moduleNames, cbk){
        delayTime = 0;
		var mds = moduleNames.split(/:/),
			moduleName = mds[0],
			module = require( moduleName ),
			_toModule = arguments.callee,
			query_param = function(arr){
				var m = {}, t;
		        if(arr){
		        	arr.replace( /([^&=]+)[=]([^&=]*)[&=\b]?/g,function(macth,k,v){
		        		switch( typeof m[k] ){
		                	case 'string': //如果是重复参数，包装成数组
		                		m[k] = new Array( m[k], v );
		                		break;
		                	case 'object': //如果已经是数组，push
		                		m[k].push( v );
		                		break; 
		                	default: 	//第一次需要设置为字符串
		                 		m[k] = v;
		                }
		        	} );
		        }
		        return m;
			};
		// 通过一级菜单修改二级菜单
		if(cbk === menu.set && module.menu && module.menu.length){
			var active = module.menu.filter(function(m){return m.active;})[0];
			var activeModule = active ? require(active.module) : module;
			activeModule.menu = module.menu;
			module = activeModule;
		}
		if(module && module.page){
			currentModule = moduleName;
			if( history.pushState && moduleName.match(/^[a-zA-Z]+$/) ){
				history.pushState({module:moduleName}, moduleName, "?module="+moduleName);
				zTnav.removeClass("active");
			}
			$.ajax({
		        url: global.base + '/ApiSystem/getCurUserInfo',
		        dataType: 'json',
		        success: function(res){
		            if (res.code == 1){
                        $.ajax({
                            url: module.page + '?t=<%=+new Date%>',
                            dataType: 'html',
                            success: function(div){
                                container.html(div);
                                $(".zTnav").children().children()
                                    .filter('[data-module="'+moduleName.replace(/[^a-zA-Z].*$/,'')+'"]')
                                    .addClass("active");
                                var param = query_param(mds[1]);
                                typeof module.init === "function" && module.init( _toModule, param );

                                // 预定义 template-init 调用
                                container.find("[data-list]").each(function(){
                                    var _t = $(this);
                                    if( _t.data("list") === "param" ){
                                        new T( _t, {data:param} )   
                                    }else{
                                        new T( $(this) );
                                    }
                                });
                                
                                typeof cbk === "function" && cbk(module);
                                typeof module.execute === "function" && module.execute( _toModule, param );
                                T.cfg.callback(container);
                            }
                        });
                        /*
						container.load(module.page + '?t=<%=+new Date%>', function(e){
							zTnav.filter('[data-module="'+moduleName.replace(/[^a-zA-Z].*$/,'')+'"]').addClass("active");
							var param = query_param(mds[1]);
			                typeof module.init === "function" && module.init( _toModule, param );

							// 预定义 template-init 调用
							container.find("[data-list]").each(function(){
								var _t = $(this);
								if( _t.data("list") === "param" ){
									new T( _t, {data:param} )	
								}else{
									new T( $(this) );
								}
							});
							
							typeof cbk === "function" && cbk(module);
							typeof module.execute === "function" && module.execute( _toModule, param );
			                T.cfg.callback(container);
						});
                        */
		            }
		            else {
		                window.location.href = 'login.html';
		            }
		        },
		        error: function(){
		            window.location.href = 'login.html';
		        }
		    });
		}else{
			$.alert("相关模块(" + moduleName + ")不存在！");
		}
		return module;
	};

	$(document).on("click", "[data-module]", function(e){
		var moduleName = $(this).data("module");
		toModule(moduleName, menu.set);
		e.preventDefault();
	}).on("click", "[data-menu]", function(e){
		var moduleName = $(this).data("menu");
		toModule(moduleName);
		e.preventDefault();
	}).on("click", ".nav>li>a", function(e){
		var t = $(this);
		t.parent().parent().find("a").removeClass("active");
		t.addClass("active");
	}).on("submit", "form.auto-submit", function(e){
		e.preventDefault();
		var _t = $(this), action;
		if( action = _t.attr("action") ){
			$.ajax({
				url: global.base + action,
				data: _t.serializeArray(),
				type: _t.attr("method") || "GET",
				dataType: "json",
				success: function(json){
					$.alert( json.message ).yes(function(){
						if( json.code == 1){
                            var cur = require(currentModule);
                            if( cur.afterAutoSubmit ){
                                cur.afterAutoSubmit.call(cur, json, toModule);
                            }else{
							     toModule( _t.data("target") );
                            }
						}
					});
				},
				error: function(err){
					alert( "服务端未响应或未知响应！\nurl: " + action );
				}
			})
		}
	}).on("click", "form .btn-submit", function(e){
		$(this).parents("form").trigger("submit");
	}).on("click","[data-delete-batch]", function(e){	// 批量删除
        var t = $(this),
            checkbox = t.data("delete-batch"),
            checked = $( checkbox + ":checked"),
            url = t.data("url"),
            name = t.data("name") || "Id";
        if( checked.length ){
            $.confirm('确定要删除这 <span class="text-danger">'+checked.length+'</span> 条记录？').yes(function(){
                var ids = [];
                
                checked.each(function(i,c){ ids.push( c.value ) });

                var data = {};
                data[name] = ids.join(",");
                $.ajax({
                    url: global.base + url,
                    data: data,
                    dataType: "json",
                    success: function(json){
                        alert( json.message );
                        if(json.code == 1){
                            toModule( currentModule );
                        }
                    },
                    error: function(){
                    	alert("服务端错误:\nurl: " + url + "\n" + name + ": " + ids);
                    }
                });
            });
        }else{
            $.alert("请选择要删除的记录", {
            	title: '需要选择',
            	width: 450
            });
        }
    }).on("click","[data-delete]", function(e){	//单个删除
        var t = $(this),
            url = t.data("url"),
            id = t.data("id"),
            name = t.data("delete") || "Id";
        var data = {};
        data[name] = id;
        $.confirm("确定要删除当前记录？", {
        	title: '确定删除',
        	width: 450
        }).yes(function(){
            $.ajax({
                url: global.base + url,
                data: data,
                dataType: "json",
                success: function(json){
                    alert( json.message );
                    if(json.code == 1){
                        toModule( currentModule );
                    }
                },
                error: function(){
                    alert("服务端错误:\nurl: " + url + "\n" + name + ": " + id);
                }
            });
        });
    }).on("click", '.ZUI-url', function(){
        $.prompt('复制 <i>(需要ctrl+c手工复制)</i>', this.title, function(){}, {buttons:{}});
    }).on("click", "[data-check-all]", function(){
        var _t = $(this), checks = $( _t.data("check-all") );
        checks.prop({checked: this.checked});
    });

	new T( $('[data-list]'), {
		callback: function(menu){
			var menus = menu.rows;
			for (var i = 0; i < menus.length; i++) {
				require( menus[i].module ).menu = menus[i].children;
			}
			var module = location.search.match(/module=([\w\\\/]+)/) || [];
			var moduleName = module[1];
			if( !$(".nav-" + moduleName).trigger("click").length ){
				$('[data-module]').first().trigger("click");
			}
		}
	});
});

$include[all.js]

