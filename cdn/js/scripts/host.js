define("host",function(require, exports, module){
	var global = require("global");

	global.updateCache("DisWay",{
		rows:[
            {id:"0",type:"即时分发"},
            {id:"1",type:"定时分发"}
        ]
	});
	// 优先级
	Handlebars.registerHelper('host_priority', function(Priority) {
		return (Priority && ({"top":"置顶"})[Priority])||'-';
	});
	Handlebars.registerHelper('host_disway', function(disway) {
		return ["即时分发","定时分发"][disway]||'-';
	});

	exports.page = "pages/host/policy/distribute.html";

	function DisTime(){
		$('[name=DisTime]').prop({
			disabled: $('[name=DisWay][value=0]').is(':checked')
		});
		setTimeout(DisTime,100);
	}
	DisTime();
});

define("host/policy/add", function(require, exports, module){
	var host = require("host");
	exports.page = "pages/host/policy/add.html";
});

define("host/policy/edit", function(require, exports, module){
	var host = require("host");
	exports.page = "pages/host/policy/edit.html";
});


// 缓存策略管理
define("host/manage/policy", function(require, exports, module){
	var global = require("global");

	global.updateCache("SwitchCompress",{
		rows:[
            {id:"1",type:"开"},
            {id:"0",type:"关"}
        ]
	});
	exports.page = "pages/host/manage/policy.html";
});


// GSLB黑名单
define("host/gslb", function(require, exports, module){
	var global = require("global");
	// 2精确匹配，1泛域名匹配，0正则表达式
	Handlebars.registerHelper('host_matchway', function(MatchWay) {
		return ["正则表达式","泛域名匹配","精确匹配"][MatchWay] || "-";
	});
	exports.page = "pages/host/gslb/list.html";
});
define("host/gslb/add", function(require, exports, module){
	var global = require("global");

	global.updateCache("MatchWay",{
		rows:[
            {id:"2",type:"精确匹配"},
            {id:"1",type:"泛域名匹配"},
            {id:"0",type:"正则表达式"}
        ]
	});

	exports.page = "pages/host/gslb/add.html";
});
define("host/gslb/edit", function(require, exports, module){
	require("host/gslb/add");
	exports.page = "pages/host/gslb/edit.html";
});


//内容复制配置
define("host/content/conf", function(require, exports, module){
	exports.page = "pages/host/content/conf.html";
});


//WebCache 配置
define("host/webcache/list", function(require, exports, module){
	var global = require("global");

	exports.page = "pages/host/webcache/list.html";
	exports.execute = function(toModule){
		var clicked = false;
		$('.host').on('click', '.region-post', function(e){
			if(clicked){ return; }
			clicked = true;
			var id = $(this).data("id");
			$.ajax({
				url: global.base + '/ApiWebConfig/sendWebConfig',
				dataType: "json",
				data: {
					HostId: id
				},
				success: function(data) {
					alert( data.message );
					clicked = false;
				},
				error: function(){
					alert("服务端错误！");
					clicked = false;
				}
			});
		});
	}
});
define("host/webcache/add", function(require, exports, module){
	var global = require("global");
	exports.page = "pages/host/webcache/add.html";
	exports.execute = function(toModule, param){
		$(".btn-synWebConfig").on("click", function(){
			$.ajax({
				url: global.base + "/ApiWebConfig/synWebConfig",
				data:{
					Host_Id: $('[name=Host_Id]').val()
				},
				dataType: "text",
				success: function(data) {
					$("#webcache-content").val(data);
				},
				error: function(){
					alert("服务端错误！");
				}
			});
		});
	};
});
define("host/webcache/edit", function(require, exports, module){
	exports.page = "pages/host/webcache/edit.html";
	exports.execute = require('host/webcache/add').execute;
});

//用户访问日志
define("host/record", function(require, exports, module){
	exports.page = "pages/host/record.html";
});

//内容复制配置
define("host/content/conf", function(require, exports, module){
    exports.page = "pages/host/content/conf.html";
});



