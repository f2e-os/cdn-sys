define("dashboard",function(require, exports, module){
    var DU = require("date-util"),
        global = require("global"),
        base = global.base;

	exports.page = "pages/dashboard.html";
    exports.execute = function(){

        // 最近24小时流量显示
            
        $.ajax({
            url: base + "/ApiStream/getDomainStream",
            dataType: "json",
            success: function(json){
                var DateList = [],
                    USList = [],
                    DSList = [];
				/*
                $.each(json.info, function(i,r){
                    DateList.push( r.Date );
                    USList.push( r.US | 0 );
                    DSList.push( r.DS | 0 );
                });
				*/
				$.each(json.info, function(i,r){
					DateList.push( r.Date );
					USList.push( Number(r.US ? r.US.toFixed(2):0) );
					DSList.push( Number(r.DS ? r.DS.toFixed(2):0) );
				});
                $(".dashboard-last24h").highcharts({
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
                    categories: DateList,
                    labels: {
                        rotation: -35,
                        style: {
                            fontFamily: 'Verdana, sans-serif'
                        },
						step:12,
						formatter: function() {
							return  this.value;                 
						}
					}
					
                },
                yAxis: {
                    title: {
                        text: ' '
                    },
					labels: {
						formatter: function () {
							return this.value + json.show;
						}
					}
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.series.name + '</b><br/>' +
                            this.x + ': ' + this.y + json.show;;
                    }
                },
                plotOptions: {
                    area: {
                        fillOpacity: 0.5
                    }
                },
                credits: {
                    enabled: false
                },
                series: [{
                    color: "#eded7b",
                    name: '上行流量',
                    data: USList
                }, {
                    color: "#3caeef",
                    name: '下行流量',
                    data: DSList
                }]
            });
            }
        });

        // 浏览器占比
        $.ajax({
            url: base + "/ApiStatisAnaly/userBrowserStatis",
            dataType: "json",
            success: function(json){
                var data = $.map(json.rows,function(r){
                            return {
                                name: r.browser_name,
                                y: r.flow_convert | 0 ,
								show : r.show
                            }
                        });

                $('.dashboard-browser').highcharts({
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
                        pointFormat: '{point.show} <br>占比:{point.percentage:.1f}%'
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


                var xList = [],
                    yList = [],
                    showList = [];

                $.each(json.rows, function(i,r){
                    xList.push( r.browser_name );
                    yList.push( parseInt(r.flow_convert) );
                    showList.push( r.show );
                });

                var allchartVals1 = [{name: '',data:yList}];

                $('.dashboard-column-browser').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: ' '
                    },
                    xAxis: {
                        categories:xList,
                        title: { text: ''},  //Y轴坐标标题  labels:纵柱标尺
                        gridLineWidth:1
                    },
                    yAxis: {
                        title: { text: json.unit },  //Y轴坐标标题  labels:纵柱标尺
                        min: 0,
                        gridLineDashStyle:'Dash'

                    },
                    tooltip: {
                        pointFormat: '{point.y}',
                        style: {lineHeight: 1}
                    },

                    plotOptions: {
                        column: {
                            pointPadding: 0.3,
                            borderWidth: 0,
                            borderRadius:5
                        }
                    },
                    legend:false,
                    title: { text: '浏览器类型占比' }, //图表主标题
                    subtitle: { text: '最近24小时',
                        align:'right',
                        x:-50
                    }, //图表副标题
                    series: allchartVals1,
                    tooltip: {
                        formatter: function () {
                            //当鼠标悬置数据点时的格式化提示
                            return '总流量:' + Highcharts.numberFormat(this.y, 2) + json.unit+'<br/>浏览器:' + this.x;
                        }
                    }

                    //series: data.map(function(o){
                    //    return {
                    //        name: o.name,
                    //        data: [o.y]
                    //    }
                    //})
                });
            }
        });
        

        // 终端占比
        $.ajax({
            url: base + "/ApiStatisAnaly/userTerminalStatis",
            dataType: "json",
            success: function(json){
                var data = $.map(json.rows, function(r){
                            return {
                                name: r.terminal_name,
                                y: r.flow_convert | 0 ,
								show: r.show
                            }
                        });

                $('.dashboard-terminal').highcharts({
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
                        pointFormat: '{point.show} <br>占比:{point.percentage:.1f}%'
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
                
                // 柱状图
                var xList = [],
                    yList = [],
                    showList = [];

                $.each(json.rows, function(i,r){
                    xList.push( r.terminal_name );
                    yList.push( parseInt(r.flow_convert) );
                    showList.push( r.show );
                });

                var allchartVals1 = [{name: '',data:yList}];
                $('.dashboard-column-terminal').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: ' '
                    },
                    xAxis: {
                        categories:xList,
                        title: { text: ''},  //Y轴坐标标题  labels:纵柱标尺
                        gridLineWidth:1
                    },
                    yAxis: {
                        title: { text: json.unit },  //Y轴坐标标题  labels:纵柱标尺
                        min: 0,
                        gridLineDashStyle:'Dash'

                    },
                    tooltip: {
                        pointFormat: '{point.y}',
                        style: {lineHeight: 1}
                    },

                    plotOptions: {
                        column: {
                            pointPadding: 0.3,
                            borderWidth: 0,
                            borderRadius:5
                        }
                    },
                    legend:false,
                    title: { text: '终端类型占比' }, //图表主标题
                    subtitle: { text: '最近24小时',
                        align:'right',
                        x:-70

            }, //图表副标题
                    series: allchartVals1,
                    tooltip: {
                        formatter: function () {
                            //当鼠标悬置数据点时的格式化提示
                            return '总流量:' + Highcharts.numberFormat(this.y, 2) + json.unit+'<br/>终端:' + this.x;
                        }
                    }

                    //series: data.map(function(o){
                    //    return {
                    //        name: o.name,
                    //        data: [o.y]
                    //}
                    //})
                });
            }
        });

    };
});