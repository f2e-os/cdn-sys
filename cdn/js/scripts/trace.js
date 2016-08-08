
//溯源评估
/*
 *回溯流量评估 
 */
define("trace",function(require, exports, module){
	var DU = require("date-util"),
        global = require("global"),
        base = global.base;
	exports.page = "pages/trace/flow.html";
	exports.execute = function(){
		// 图表处理
		Handlebars.registerHelper('_flowsavePie', function( data , info, dom ) {
			//return (Priority && ({"top":"置顶"})[Priority])||'-';
			var datetimeArray = [],
				saveArray = [],
				inArray = [],
				outArray = []; 
			var tickInterval=Math.ceil(data.length/20);
			if(tickInterval<1){
				tickInterval=1;
			}
			//处理数据
			var tempData=[],
				len=data.length;
			if(len>20){
				var space=Math.floor(len/20);
				for(var i=0;i<len;i+=space){
					tempData.push(data[i]);
				}
			}else{
				tempData=data;
			}
			
			var temptype=info.display_type?info.display_type:'bps';
			
				//date_time: "2015-08-25 17:50", upstream: "80000", downstream: "350000"
			$( data).each(function(i,v){
				datetimeArray[i] = v.tm_insert;
				saveArray[i] = v.SUM_sum_flow_save?parseFloat( (v.SUM_sum_flow_save).toFixed(2)):0;
				inArray[i] = v.SUM_sum_flow_in?parseFloat ((v.SUM_sum_flow_in).toFixed(2)):0;
				outArray[i] =v.SUM_sum_flow_out? parseFloat ((v.SUM_sum_flow_out).toFixed(2)):0;
			})

			$( dom ).highcharts({
				chart: {
					type: 'area',
					spacingBottom: 30
				},
				legend: {
					align: 'center',
					verticalAlign: 'top',
					floating: true,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				xAxis: {
					categories: datetimeArray,
						/*(function(){
						var arr = [], date = DU.format(new Date,"MM-dd/"); 
						for (var i = 0; i < 24; i++) {
							arr[i] = date + i + ":00"
						};
						return arr;
					})()*/
					labels: {
						x:20,
						rotation: -45,
						style: {
							fontFamily: 'Verdana, sans-serif'
						},
						step:tickInterval,
						formatter: function() {
		                 	return  this.value;                 
						}
					}
				},
				yAxis: {
					title: {
						text: '节约网间流量'
					},
					labels: {
						formatter: function () {
							return this.value +temptype;
						}
					}
				},
				tooltip: {
					formatter: function () {
						return '<b>' + this.series.name + '</b><br/>' +
							this.x + ': ' + this.y +temptype;
					}
				},
				plotOptions: {
		            area: {
		               fillOpacity: 0.5,
		                marker: {
		                    enabled: false,
		                    symbol: 'circle',
		                    radius: 2,
		                    states: {
		                        hover: {
		                            enabled: true
		                        }
		                    }
		                }
		            }
		        },
				credits: {
					enabled: true
				},
				series: [{
					color: "#8be28b",
					name: '节约流量',
					data: saveArray/*[200, 100, 40, 32, 55, 200, 300, 720, 1024, 1005, 890, 600, 768, 589, 1200, 1100, 546, 466, 743, 1200, 876, 943, 400]*/
				}]
			});
			return "";
		});
		Handlebars.registerHelper('_flowinoutPie', function( data ,info, dom ) {
			//return (Priority && ({"top":"置顶"})[Priority])||'-';
				var datetimeArray = [],
				saveArray = [],
				inArray = [],
				outArray = []; 
				//date_time: "2015-08-25 17:50", upstream: "80000", downstream: "350000"
				var tickInterval=Math.ceil(data.length/20);
				if(tickInterval<1){
					tickInterval=1;
				}
				//处理数据
				var tempData=[],
					len=data.length;
				if(len>20){
					var space=Math.floor(len/20);
					for(var i=0;i<len;i+=space){
						tempData.push(data[i]);
					}
				}else{
					tempData=data;
				}
				var temptype=info.display_type?info.display_type:'bps';

			$( data).each(function(i,v){
				datetimeArray[i] = v.tm_insert;
				saveArray[i] = v.SUM_sum_flow_save?parseFloat( (v.SUM_sum_flow_save).toFixed(2)):0;
				inArray[i] = v.SUM_sum_flow_in?parseFloat ((v.SUM_sum_flow_in).toFixed(2)):0;
				outArray[i] =v.SUM_sum_flow_out? parseFloat ((v.SUM_sum_flow_out).toFixed(2)):0;
			})

			$( dom ).highcharts({
				chart: {
					type: 'area',
					spacingBottom: 30
				},
				legend: {
					align: 'center',
					verticalAlign: 'top',
					floating: true,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				xAxis: {
					categories: datetimeArray,
						/*(function(){
						var arr = [], date = DU.format(new Date,"MM-dd/"); 
						for (var i = 0; i < 24; i++) {
							arr[i] = date + i + ":00"
						};
						return arr;
					})()*/
					labels: {
						x:20,
						rotation: -45,
						style: {
							fontFamily: 'Verdana, sans-serif'
						},
						step:tickInterval,
						formatter: function() {
		                 	return  this.value;                 
						}
					}
				},
				yAxis: {
					title: {
						text: '回源流量评估'
					},
					labels: {
						formatter: function () {
							return this.value +temptype;
						}
					}
				},
				tooltip: {
					formatter: function () {
						return '<b>' + this.series.name + '</b><br/>' +
							this.x + ': ' + this.y+temptype;
					}
				},
				plotOptions: {
		            area: {
		               fillOpacity: 0.5,
		                marker: {
		                    enabled: false,
		                    symbol: 'circle',
		                    radius: 2,
		                    states: {
		                        hover: {
		                            enabled: true
		                        }
		                    }
		                }
		            }
		        },
				credits: {
					enabled: false
				},
				series: [{
					color: "#ff9900",
					name: '回源流量',
					data: inArray/*[200, 100, 40, 32, 55, 200, 300, 720, 1024, 1005, 890, 600, 768, 589, 1200, 1100, 546, 466, 743, 1200, 876, 943, 400]*/
					},{
					color: "#5cadff",
					name: '服务流量',
					data: outArray/*[200, 100, 40, 32, 55, 200, 300, 720, 1024, 1005, 890, 600, 768, 589, 1200, 1100, 546, 466, 743, 1200, 876, 943, 400]*/
					}
				]
			});
			return "";
		});
		
		Handlebars.registerHelper('_flowcountSave', function( data , dom ) {
			//return (Priority && ({"top":"置顶"})[Priority])||'-';
			var temptype=data.display_type?data.display_type:'bps';
			var tempdata=data.save_flow;
			tempdata.cur=tempdata.cur?tempdata.cur:0;
			tempdata.avg=tempdata.avg?tempdata.avg:0;
			tempdata.max=tempdata.max?tempdata.max:0;
			tempdata.min=tempdata.min?tempdata.min:0;
			var countList='<ul class="clearfix"><li>节约流量</li><li>当前:'+tempdata.cur+'</li><li>平均:'+tempdata.avg+'</li><li>最大值:'+tempdata.max+'</li><li>最小值:'+tempdata.min+'</li></ul>'
			$(dom).empty().append(countList);
			return "";
		});
		Handlebars.registerHelper('_flowcountInout', function( data , dom ) {
			//return (Priority && ({"top":"置顶"})[Priority])||'-';
			var temptype=data.display_type?data.display_type:'bps';
			var tempIn=data.in_flow,
				tempOut=data.out_flow;
			tempIn.cur=tempIn.cur?tempIn.cur:0;
			tempIn.avg=tempIn.avg?tempIn.avg:0;
			tempIn.max=tempIn.max?tempIn.max:0;
			tempIn.min=tempIn.min?tempIn.min:0;
			
			tempOut.cur=tempOut.cur?tempOut.cur:0;
			tempOut.avg=tempOut.avg?tempOut.avg:0;
			tempOut.max=tempOut.max?tempOut.max:0;
			tempOut.min=tempOut.min?tempOut.min:0;
			tempOut.rate=data.rate_value?data.rate_value:0;
			var countList='<ul class="clearfix"><li>回源流量</li><li>当前:'+tempIn.cur+'</li><li>平均:'+tempIn.avg+'</li><li>最大值:'+tempIn.max+'</li><li>最小值:'+tempIn.min+'</li></ul>'+
						  '<ul class="clearfix"><li>服务流量</li><li>当前:'+tempOut.cur+'</li><li>平均:'+tempOut.avg+'</li><li>最大值:'+tempOut.max+'</li><li>最小值:'+tempOut.min+'</li><li>放大比值:'+tempOut.rate+'</li></ul>'
			$(dom).empty().append(countList);
			return "";
		});
	};
});

/*
 *回溯次数评估 
 */
define("trace/frequency",function(require, exports, module){
	var DU = require("date-util"),
        global = require("global"),
        base = global.base;

	exports.page = "pages/trace/frequency.html";
	exports.execute = function(){
		// 图表处理
		Handlebars.registerHelper('_frequencyPie', function( data , dom ) {
			//return (Priority && ({"top":"置顶"})[Priority])||'-';
				var datetimeArray = [],
				hitRateArray = []; 
				//date_time: "2015-08-25 17:50", upstream: "80000", downstream: "350000"
				var tickInterval=Math.ceil(data.length/20);
				if(tickInterval<1){
					tickInterval=1;
				}
				//处理数据
				var tempData=[],
					len=data.length;
				if(len>20){
					var space=Math.floor(len/20);
					for(var i=0;i<len;i+=space){
						tempData.push(data[i]);
					}
				}else{
					tempData=data;
				}

			$( data).each(function(i,v){
				datetimeArray[i] = v.tm_insert;
				hitRateArray[i] = v.hitRate?parseInt((( v.hitRate )*100)):0;
			})

			$( dom ).highcharts({
				chart: {
					type: 'spline',
					spacingBottom: 30
				},
				legend: {
					align: 'center',
					verticalAlign: 'top',
					floating: true,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				xAxis: {
					categories: datetimeArray,
						/*(function(){
						var arr = [], date = DU.format(new Date,"MM-dd/"); 
						for (var i = 0; i < 24; i++) {
							arr[i] = date + i + ":00"
						};
						return arr;
					})()*/
					labels: {
						x:20,
						rotation: -45,
						style: {
							fontFamily: 'Verdana, sans-serif'
						},
						step:tickInterval,
						formatter: function() {
		                 	return  this.value;                 
						}
					}
				},
				yAxis: {
					title: {
						text: '回源次数评估'
					},
					min: 0, 
					labels: {
						formatter: function () {
							return this.value + "%";
						}
					}
				},
				tooltip: {
					formatter: function () {
						return '<b>' + this.series.name + '</b><br/>' +
							this.x + ': ' + this.y+'%';
					}
				},
				plotOptions: {
		            spline: {
		               fillOpacity: 0.5,
		                marker: {
		                    enabled: false,
		                    symbol: 'circle',
		                    radius: 2,
		                    states: {
		                        hover: {
		                            enabled: true
		                        }
		                    }
		                }
		            }
		        },
				credits: {
					enabled: false
				},
				series: [{
					color: "#2f7ed8",
					name: '回源次数评估（回源次数/总请求次数）',
					data: hitRateArray/*[200, 100, 40, 32, 55, 200, 300, 720, 1024, 1005, 890, 600, 768, 589, 1200, 1100, 546, 466, 743, 1200, 876, 943, 400]*/
				}]
			});
			return "";
		});
	};
});

/*
 *缓存内容重复利用率 
 */
define("trace/cache",function(require, exports, module){
	var DU = require("date-util"),
        global = require("global"),
        base = global.base;
	exports.page = "pages/trace/cache.html";
	exports.execute = function(){
		// 图表处理
		Handlebars.registerHelper('_cachePie', function( data , dom ) {
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
						text: '缓存内容重复利用率'
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
 *回吐成功率评估 
 */
define("trace/backspit",function(require, exports, module){
	var DU = require("date-util"),
        global = require("global"),
        base = global.base;
	exports.page = "pages/trace/backspit.html";
	exports.execute = function(){
		// 图表处理
		Handlebars.registerHelper('_backspitSuPie', function( data , dom ) {
			//return (Priority && ({"top":"置顶"})[Priority])||'-';
				var datetimeArray = [],
				successrateArray = [];
				//date_time: "2015-08-25 17:50", upstream: "80000", downstream: "350000"
				var tickInterval=Math.ceil(data.length/20);
				if(tickInterval<1){
					tickInterval=1;
				}
				//处理数据
				var tempData=[],
					len=data.length;
				if(len>20){
					var space=Math.floor(len/20);
					for(var i=0;i<len;i+=space){
						tempData.push(data[i]);
					}
				}else{
					tempData=data;
				}

			$( data).each(function(i,v){
				datetimeArray[i] = v.tm_insert;
				successrateArray[i] = v.successrate?parseFloat( v.successrate )*100:0;
			})

			$( dom ).highcharts({
				chart: {
					type: 'spline',
					spacingBottom: 30
				},
				legend: {
					align: 'center',
					verticalAlign: 'top',
					floating: true,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				xAxis: {
					categories: datetimeArray,
						/*(function(){
						var arr = [], date = DU.format(new Date,"MM-dd/"); 
						for (var i = 0; i < 24; i++) {
							arr[i] = date + i + ":00"
						};
						return arr;
					})()*/
					labels: {
						x:20,
						rotation: -45,
						style: {
							fontFamily: 'Verdana, sans-serif'
						},
						step:tickInterval,
						formatter: function() {
		                 	return  this.value;                 
						}
					}
				},
				yAxis: {
					title: {
						text: '回吐成功率评估--(非4xx,非5xx)/请求总数'
					},
					min: 0, 
					labels: {
						formatter: function () {
							return this.value + "%";
						}
					}
				},
				tooltip: {
					formatter: function () {
						return '<b>' + this.series.name + '</b><br/>' +
							this.x + ': ' + this.y+'%';
					}
				},
				plotOptions: {
		            spline: {
		               fillOpacity: 0.5,
		                marker: {
		                    enabled: false,
		                    symbol: 'circle',
		                    radius: 2,
		                    states: {
		                        hover: {
		                            enabled: true
		                        }
		                    }
		                }
		            }
		        },
				credits: {
					enabled: false
				},
				series: [{
					color: "#2f7ed8",
					name: '回吐成功率',
					data: successrateArray/*[200, 100, 40, 32, 55, 200, 300, 720, 1024, 1005, 890, 600, 768, 589, 1200, 1100, 546, 466, 743, 1200, 876, 943, 400]*/
				}]
			});
			return "";
		});
		Handlebars.registerHelper('_backspitFaPie', function( data , dom ) {
			//return (Priority && ({"top":"置顶"})[Priority])||'-';
				var datetimeArray = [],
				failrateArray = []; 
				//date_time: "2015-08-25 17:50", upstream: "80000", downstream: "350000"
				var tickInterval=Math.ceil(data.length/20);
				if(tickInterval<1){
					tickInterval=1;
				}
				//处理数据
				var tempData=[],
					len=data.length;
				if(len>20){
					var space=Math.floor(len/20);
					for(var i=0;i<len;i+=space){
						tempData.push(data[i]);
					}
				}else{
					tempData=data;
				}

			$( data).each(function(i,v){
				datetimeArray[i] = v.tm_insert;
				failrateArray[i] = v.successrate?(1.00-parseFloat( v.successrate ))*100:0;
			})

			$( dom ).highcharts({
				chart: {
					type: 'spline',
					spacingBottom: 30
				},
				legend: {
					align: 'center',
					verticalAlign: 'top',
					floating: true,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				xAxis: {
					categories: datetimeArray,
						/*(function(){
						var arr = [], date = DU.format(new Date,"MM-dd/"); 
						for (var i = 0; i < 24; i++) {
							arr[i] = date + i + ":00"
						};
						return arr;
					})()*/
					labels: {
						x:20,
						rotation: -45,
						style: {
							fontFamily: 'Verdana, sans-serif'
						},
						step:tickInterval,
						formatter: function() {
		                 	return  this.value;                 
						}
					}
				},
				yAxis: {
					title: {
						text: '源站失败比例评估--源站返回错误次数(4xx,5xx)/总的错误次数'
					},
					min: 0, 
					labels: {
						formatter: function () {
							return this.value + "%";
						}
					}
				},
				tooltip: {
					formatter: function () {
						return '<b>' + this.series.name + '</b><br/>' +
							this.x + ': ' + this.y+'%';
					}
				},
				plotOptions: {
		            spline: {
		               fillOpacity: 0.5,
		                marker: {
		                    enabled: false,
		                    symbol: 'circle',
		                    radius: 2,
		                    states: {
		                        hover: {
		                            enabled: true
		                        }
		                    }
		                }
		            }
		        },
				credits: {
					enabled: false
				},
				series: [{
					color: "#2f7ed8",
					name: '源站失败比例',
					data: failrateArray/*[200, 100, 40, 32, 55, 200, 300, 720, 1024, 1005, 890, 600, 768, 589, 1200, 1100, 546, 466, 743, 1200, 876, 943, 400]*/
				}]
			});
			return "";
		});
	};
});

/*
 *回源占比分析
 */
define("trace/proportion",function(require, exports, module){
	var DU = require("date-util"),
        global = require("global"),
        base = global.base;
        
	exports.page = "pages/trace/proportion.html";
	exports.execute = function(){
		// 图表处理
		Handlebars.registerHelper('_proportionPie', function( data , dom ) {
			//return (Priority && ({"top":"置顶"})[Priority])||'-';
				var datetimeArray = [],
				proportionArray = [];
				//date_time: "2015-08-25 17:50", upstream: "80000", downstream: "350000"
				var tickInterval=Math.ceil(data.length/20);
				if(tickInterval<1){
					tickInterval=1;
				}
				//处理数据
				var tempData=[],
					len=data.length;
				if(len>20){
					var space=Math.floor(len/20);
					for(var i=0;i<len;i+=space){
						tempData.push(data[i]);
					}
				}else{
					tempData=data;
				}

			$( data).each(function(i,v){
				datetimeArray[i] = v.tm_insert;
				proportionArray[i] =v.SUM_sum_num_log? parseFloat( (v.SUM_sum_num_log).toFixed(2) ):0;
			})

			$( dom ).highcharts({
				chart: {
					type: 'spline'
				},
				legend: {
					align: 'center',
					verticalAlign: 'top',
					floating: true,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				xAxis: {
					categories: datetimeArray,
						/*(function(){
						var arr = [], date = DU.format(new Date,"MM-dd/"); 
						for (var i = 0; i < 24; i++) {
							arr[i] = date + i + ":00"
						};
						return arr;
					})()*/
					labels: {
						x:20,
						rotation: -45,
						style: {
							fontFamily: 'Verdana, sans-serif'
						},
						step:tickInterval,
						formatter: function() {
		                 	return  this.value;                 
						}
					}
				},
				yAxis: {
					title: {
						text: '回源次数变化趋势'
					},
					min: 0, 
					labels: {
						formatter: function () {
							return (this.value/1000) + "k";
						}
					}
				},
				tooltip: {
					formatter: function () {
						return '<b>' + this.series.name + '</b><br/>' +
							this.x + ': ' + this.y;
					}
				},
				plotOptions: {
		            spline: {
		               fillOpacity: 0.5,
		                marker: {
		                    enabled: false,
		                    symbol: 'circle',
		                    radius: 2,
		                    states: {
		                        hover: {
		                            enabled: true
		                        }
		                    }
		                }
		            }
		        },
				credits: {
					enabled: false
				},
				series: [{
					color: "#2f7ed8",
					name: '回源次数绝对值',
					data: proportionArray/*[200, 100, 40, 32, 55, 200, 300, 720, 1024, 1005, 890, 600, 768, 589, 1200, 1100, 546, 466, 743, 1200, 876, 943, 400]*/
				}]
			});
			return "";
		});
		Handlebars.registerHelper('_servicePie', function( data ,info, dom ) {
			//return (Priority && ({"top":"置顶"})[Priority])||'-';
				var datetimeArray = [],
				serviceArray = [];
				//date_time: "2015-08-25 17:50", upstream: "80000", downstream: "350000"
				var tickInterval=Math.ceil(data.length/20);
				if(tickInterval<1){
					tickInterval=1;
				}
				//处理数据
				var tempData=[],
					len=data.length;
				if(len>20){
					var space=Math.floor(len/20);
					for(var i=0;i<len;i+=space){
						tempData.push(data[i]);
					}
				}else{
					tempData=data;
				}

			$( data).each(function(i,v){
				datetimeArray[i] = v.tm_insert;
				serviceArray[i] = v.SUM_sum_flow_out?parseFloat( (v.SUM_sum_flow_out).toFixed(2)):0;
			});
			var temptype=info.display_type?info.display_type:'bps';

			$( dom ).highcharts({
				chart: {
					type: 'spline'
				},
				legend: {
					align: 'center',
					verticalAlign: 'top',
					floating: true,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				xAxis: {
					categories: datetimeArray,
						/*(function(){
						var arr = [], date = DU.format(new Date,"MM-dd/"); 
						for (var i = 0; i < 24; i++) {
							arr[i] = date + i + ":00"
						};
						return arr;
					})()*/
					labels: {
						x:20,
						rotation: -45,
						style: {
							fontFamily: 'Verdana, sans-serif'
						},
						step:tickInterval,
						formatter: function() {
		                 	return  this.value;                 
						}
					}
				},
				yAxis: {
					title: {
						text: '服务流量变化趋势'
					},
					min: 0, 
					labels: {
						formatter: function () {
							return this.value + temptype;
						}
					}
				},
				tooltip: {
					formatter: function () {
						return '<b>' + this.series.name + '</b><br/>' +
							this.x + ': ' + this.y+temptype;
					}
				},
				plotOptions: {
		            spline: {
		               fillOpacity: 0.5,
		                marker: {
		                    enabled: false,
		                    symbol: 'circle',
		                    radius: 2,
		                    states: {
		                        hover: {
		                            enabled: true
		                        }
		                    }
		                }
		            }
		        },
				credits: {
					enabled: false
				},
				series: [{
					color: "#2f7ed8",
					name: '服务流量绝对值',
					data: serviceArray/*[200, 100, 40, 32, 55, 200, 300, 720, 1024, 1005, 890, 600, 768, 589, 1200, 1100, 546, 466, 743, 1200, 876, 943, 400]*/
				}]
			});
			return "";
		});
		
		Handlebars.registerHelper('_provincePie', function( data , dom ) {
			//return (Priority && ({"top":"置顶"})[Priority])||'-';
				var data = $.map(data,function(r){
                    return {
                        name: r.CompanyName,
                        y: r.SUM_sum_flow_out | 0
                    }
                });
				$( dom ).highcharts({
					chart: {
						type: 'pie'
					},
					title: {
						text: '回源占比省节点比例'
					},
					legend: {
						align: 'right',
						layout: 'vertical',
						verticalAlign: 'top',
						x: -20
					},
					tooltip: {
						title: " ",
						pointFormat: '占比:{point.percentage:.1f}%'
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
 *各省缓存溯源白名单
 */
define("trace/whitelist",function(require, exports, module){
	var DU = require("date-util"),
        global = require("global"),
        base = global.base;
        
	exports.page = "pages/trace/whitelist.html";
	exports.execute = function(){
		
	};
});

/*
 *pps重定向评估
 */
define("trace/redirect",function(require, exports, module){
	var DU = require("date-util"),
        global = require("global"),
        base = global.base;
	exports.page = "pages/trace/redirect.html";
	exports.execute = function(){
		// 图表处理
		Handlebars.registerHelper('_redirectPie', function( data , dom ) {
			//return (Priority && ({"top":"置顶"})[Priority])||'-';
				var datetimeArray = [],
				redirectArray = [];
				//date_time: "2015-08-25 17:50", upstream: "80000", downstream: "350000"
				var tickInterval=Math.ceil(data.length/20);
				if(tickInterval<1){
					tickInterval=1;
				}
				//处理数据
				var tempData=[],
					len=data.length;
				if(len>20){
					var space=Math.floor(len/20);
					for(var i=0;i<len;i+=space){
						tempData.push(data[i]);
					}
				}else{
					tempData=data;
				}

			$( data).each(function(i,v){
				datetimeArray[i] = v.tm_insert;
				redirectArray[i] = v.redirectRate?parseFloat( v.redirectRate )*100:0;
			})

			$( dom ).highcharts({
				chart: {
					type: 'spline'
				},
				legend: {
					align: 'center',
					verticalAlign: 'top',
					floating: true,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				xAxis: {
					categories: datetimeArray,
						/*(function(){
						var arr = [], date = DU.format(new Date,"MM-dd/"); 
						for (var i = 0; i < 24; i++) {
							arr[i] = date + i + ":00"
						};
						return arr;
					})()*/
					labels: {
						x:20,
						rotation: -45,
						style: {
							fontFamily: 'Verdana, sans-serif'
						},
						step:tickInterval,
						formatter: function() {
		                 	return  this.value;                 
						}
					}
				},
				yAxis: {
					title: {
						text: 'PPS重定向评估(PPS重定向数/总请求次数)'
					},
					min: 0, 
					labels: {
						formatter: function () {
							return this.value + "%";
						}
					}
				},
				tooltip: {
					formatter: function () {
						return '<b>' + this.series.name + '</b><br/>' +
							this.x + ': ' + this.y+'%';
					}
				},
				plotOptions: {
		            spline: {
		               fillOpacity: 0.5,
		                marker: {
		                    enabled: false,
		                    symbol: 'circle',
		                    radius: 2,
		                    states: {
		                        hover: {
		                            enabled: true
		                        }
		                    }
		                }
		            }
		        },
				credits: {
					enabled: false
				},
				series: [{
					color: "#2f7ed8",
					name: 'pps重定向率',
					data: redirectArray/*[200, 100, 40, 32, 55, 200, 300, 720, 1024, 1005, 890, 600, 768, 589, 1200, 1100, 546, 466, 743, 1200, 876, 943, 400]*/
				}]
			});
			return "";
		});
		Handlebars.registerHelper('_dnsredirectPie', function( data , dom ) {
			//return (Priority && ({"top":"置顶"})[Priority])||'-';
				var datetimeArray = [],
				dnsredirectArray = [];
				//date_time: "2015-08-25 17:50", upstream: "80000", downstream: "350000"

			// $( data).each(function(i,v){
				// datetimeArray[i] = v.tm_insert;
				// serviceArray[i] = parseFloat( v.SUM_sum_flow_in )/1024;
			// })
			var tickInterval=Math.ceil(data.length/20);
			if(tickInterval<1){
				tickInterval=1;
			}
			$( dom ).highcharts({
				chart: {
					type: 'spline'
				},
				legend: {
					align: 'center',
					verticalAlign: 'top',
					floating: true,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
				xAxis: {
					categories: datetimeArray,
						/*(function(){
						var arr = [], date = DU.format(new Date,"MM-dd/"); 
						for (var i = 0; i < 24; i++) {
							arr[i] = date + i + ":00"
						};
						return arr;
					})()*/
					labels: {
						x:20,
						rotation: -45,
						style: {
							fontFamily: 'Verdana, sans-serif'
						},
						step:tickInterval,
						formatter: function() {
		                 	return  this.value;                 
						}
					}
				},
				yAxis: {
					title: {
						text: 'DNS重定向评估(DNS重定向数/总请求次数)'
					},
					labels: {
						formatter: function () {
							return this.value + "M";
						}
					}
				},
				tooltip: {
					formatter: function () {
						return '<b>' + this.series.name + '</b><br/>' +
							this.x + ': ' + this.y;
					}
				},
				plotOptions: {
		            spline: {
		               fillOpacity: 0.5,
		                marker: {
		                    enabled: false,
		                    symbol: 'circle',
		                    radius: 2,
		                    states: {
		                        hover: {
		                            enabled: true
		                        }
		                    }
		                }
		            }
		        },
				credits: {
					enabled: false
				},
				series: [{
					color: "#2f7ed8",
					name: 'dns重定向率',
					data: dnsredirectArray/*[200, 100, 40, 32, 55, 200, 300, 720, 1024, 1005, 890, 600, 768, 589, 1200, 1100, 546, 466, 743, 1200, 876, 943, 400]*/
				}]
			});
			return "";
		});
	};
});