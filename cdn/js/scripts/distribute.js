
//分发评估
/*
 *分发成功率评估 
 */
define("distribute",function(require, exports, module){
	var DU = require("date-util"),
        global = require("global"),
        base = global.base;

	exports.page = "pages/distribute/success_rate.html";
	exports.execute = function(){
		// 图表处理
		Handlebars.registerHelper('_successRatePie', function( data , dom ) {
			//return (Priority && ({"top":"置顶"})[Priority])||'-';
				var data = $.map(data,function(r){
                    return {
                        name: r.name,
                        y: r.val | 0
                    }
                });
				$( dom ).highcharts({
					chart: {
						type: 'pie'
					},
					title: {
						text: ' '
					},
					legend: {
						align: 'right',
						layout: 'vertical',
						verticalAlign: 'top',
						x: -20
					},
					tooltip: {
						title: " ",
						pointFormat: '{point.y}次 <br>占比:{point.percentage:.1f}%'
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							dataLabels: {
								enabled: false
							},
							showInLegend: true
						}
					},
					series: [{
						data: data
					}]
				});
			return "";
		});
	};
});

/*
 *用户行为统计
 */
define("distribute/conflow",function(require, exports, module){
	var DU = require("date-util"),
        global = require("global"),
        base = global.base;
        
	exports.menu = [
		{name:"分发成功率评估", icon:"icon14", module: "distribute"},
		{name:"分发内容流量统计", icon:"icon15", module: "distribute/conflow", active: "active"},
		{name:"服务对象统计", icon:"icon19", module: "distribute/service_object"}
	];
	exports.page = "pages/distribute/conflow.html";
	exports.execute = function(){
		// 图表处理
		Handlebars.registerHelper('_conflowPie', function( data , dom ) {
			//return (Priority && ({"top":"置顶"})[Priority])||'-';
				var data = $.map(data,function(r){
                    return {
                        name: r.ContentTypeName,
                        y: r.SUM_sum_flow_out | 0
                    }
                });
				$( dom ).highcharts({
					chart: {
						type: 'pie'
					},
					title: {
						text: ' '
					},
					legend: {
						align: 'right',
						layout: 'vertical',
						verticalAlign: 'top',
						x: -20
					},
					tooltip: {
						title: " ",
						pointFormat: '{point.percentage:.1f}%'
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							dataLabels: {
								enabled: false
							},
							showInLegend: true
						}
					},
					series: [{
						data: data
					}]
				});
			return "";
		});
	};
});


/*
 *服务对象统计
 */
define("distribute/service_object",function(require, exports, module){
	var DU = require("date-util"),
        global = require("global"),
        base = global.base;
        
	exports.menu = [
		{name:"分发成功率评估", icon:"icon14", module: "distribute"},
		{name:"分发内容流量统计", icon:"icon15", module: "distribute/conflow"},
		{name:"服务对象统计", icon:"icon19", module: "distribute/service_object", active: "active"}
	];
	exports.page = "pages/distribute/service_object.html";
	exports.execute = function(){
		// 图表处理
		Handlebars.registerHelper('_service_objectPie', function( data , dom ) {
			//return (Priority && ({"top":"置顶"})[Priority])||'-';
				var data = $.map(data,function(r){
                    return {
                        name: r.DepartName,
                        y: r.SUM_sum_flow_out | 0
                    }
                });
				$( dom ).highcharts({
					chart: {
						type: 'pie'
					},
					title: {
						text: ' '
					},
					legend: {
						align: 'right',
						layout: 'vertical',
						verticalAlign: 'top',
						x: -20
					},
					tooltip: {
						title: " ",
						pointFormat: '{point.y}次 <br>占比:{point.percentage:.1f}%'
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							dataLabels: {
								enabled: false
							},
							showInLegend: true
						}
					},
					series: [{
						data: data
					}]
				});
			return "";
		});
	};
});
