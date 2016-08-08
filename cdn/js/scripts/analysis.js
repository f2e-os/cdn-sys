/**
 * @method analysis	
 * @version	0.1.1
 * @createTime 2015/08/26
 * @author jyn
 */
//数据分析
define("data",function(require, exports, module){
	var global = require('global');
	exports.initCascadeSelect = function(){
		var CPId = $('[name=CPId]');
		var DomainGroupId = $('[name=DomainGroupId]');
		var DomainId = $('[name=DomainId]');
		CPId.on('change', function () {
			var id = this.value;
			DomainGroupId.html( '<option value="">请选择域名组</option>' + global.global_show.call('select', '', '/ApiDomainChannel/listDomainChannel?CPId=' + id, 'DomainGName', 'id') );
			DomainId.html( '<option value="">请选择域名</option>' + global.global_show.call('select', '', '/ApiDomain/listDomain?CPId=' + id, 'DomainName', 'Id') );
		});

		DomainGroupId.on('change', function () {
			var id = this.value;
			var cpId = CPId.val();
			var search = '';
			if (id) {
				search = '?DomainGroupId=' + id;
			}
			else {
				search = '?CPId=' + cpId;
			}
			DomainId.html( '<option value="">请选择域名</option>' + global.global_show.call('select', '', '/ApiDomain/listDomain' + search, 'DomainName', 'Id') );
		});
	};
	exports.page = "pages/analysis/hotContent.html";
	exports.execute = function(){
		exports.initCascadeSelect();
		//添加导出链接
		$(".hc-export").on("click",function(){
			$(".hc-export").attr("href", require('global').base + '/ApiStatisAnaly/hotContentExport?'+ $(".hc-form").serialize());
		});
	};
});

define("analysis/trend",function(require, exports, module){
	exports.page = "pages/analysis/trend.html";
	exports.execute = function(){
		var trend = function(){
			var _this = this;
			this.column = (function(){	  //当前栏目id数组	  并在本次遍历时为a标签添加href属性
				var arr = [];
				$(".trend .nav-tabs li").each(function(i,v){
					arr.push( $(v).children("a").attr("aria-controls") );
					$(v).children("a").attr("href",("#"+$(v).children("a").attr("aria-controls")) )
				})
				return arr;
			})();	   
			this.htmlTab = (function(){	   //用于被切换的tab html代码
				var	ht = '';
				$( _this.column ).each(function(i,v){
					ht+='<div role="tabpanel" class="tab-pane" id="' + v + '">'+
							'<div class="tab-formtab-form">'+
								'<div class="tab-form" >'+
									'开始时间<input type="text"  class="start-date data-picker">'+
									'<input type="number" class="start-hour" max="23" min="0">小时'+
									'<input type="number" class="start-min" max="59" min="0">分钟'+
								'</div>'+
								'<div class="tab-form" >'+
									'结束时间<input type="text"  class="end-date data-picker">'+
									'<input type="number" class="end-hour" max="24" min="0">小时'+
									'<input type="number" class="end-min" max="60" min="0">分钟'+
								'</div>'+
								'<div class="tab-form">'+
									'选择建议协议类型'+
									'<select name="" id="" class="file-type">'+
										'<option value="">1</option>'+
										'<option value="">2</option>'+
										'<option value="">3</option>'+
									'</select>'+
									'<a href="#" class="btn show-btn">√ 显示图形</a>'+
								'</div>'+
							'</div>'+
							'<div class="show-par">'+
								'<span>'+
									'<img src="" alt="">'+
								'</span>'+
								'<span class="equipment">'+
								'</span>'+
							'</div>'+
						'</div>';
				})
				return ht;
			})();
			this.getMonitoPic = function(data,url,callback){	  //异步请求图片数据
				$.ajax({
					type: "post",
					url: url,
					async: false,
					data: data,
					dataType: "json",
					success: function(data){
						callback(data);
					}
				});
			}
			this.init = function(){
				$(".trend-cont .tab-pane").eq(0).addClass("active");
				$(".data-traffic .d-search").on("click",function(){
					var callback = function(data){};
					_this.getMonitoPic("","",callback(data))	
				});
				$(".trend-export").on("click",function(){
					$(".trend-export").attr("href", require('global').base + $(this).attr("data-href")+"?"+ $(this).parent().serialize());
				});
			}
		}
		var t = new trend();
		t.init();
	};
});
define("analysis/dataTraffic",function(require, exports, module){
    var DU = require("date-util"),
        global = require("global"),
        base = global.base;
	var analysis = require('data');

	exports.page = "pages/analysis/dataTraffic.html";
	exports.execute = function(){
		analysis.initCascadeSelect();
		var dataTraffic = function(){
			var _this = this;
			this.chart = function( index ){
				$.ajax({
					type: 'post',
					url: require('global').base + '/ApiStream/getDomainStream',	   //url: '/index.php/ApiStream/getDomainStream' ,
					data: $("#data-traffic-form").serialize() ,
					success: function(data){
						data = $.parseJSON(data);
						if(data.code){
							var DateList = [],
								USList = [],
								DSList = [];
							$.each(data.info, function(i,r){
								DateList.push( r.Date );
								USList.push( Number(r.US ? r.US.toFixed(2):0) );
								DSList.push( Number(r.DS ? r.DS.toFixed(2):0) );
							});
							$( index ).highcharts({
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
										rotation: -85,
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
											return this.value + data.show;
										}
									}
								},
								tooltip: {
									formatter: function (fd) {
										return '<b>' + this.series.name + '</b><br/>' +
											this.x + ':  ' + this.y + data.show;
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
					}
				});
			};
			this.getTree = function(){
				$.ajax({
					type: "post",
					url: require('global').base + '/ApiDepartment/displayTree',//url: "/index.php/ApiDepartment/displayTree",
					async: false,
					dataType: "json",
					success: function(data){
						var setting = {
							check: {
								enable: true,
								chkStyle: "checkbox",
								chkboxType: { "Y": "s", "N": "ps" }
							},
							data: {
								simpleData: {
									enable: true
								}
							}
						};
						var zNodes =  data.rows;
						$.fn.zTree.init($(".render-tree"), setting, zNodes);
					}
				});
			}

			this.treeVal = function(){
				var tree = $.fn.zTree.getZTreeObj("traffic-tree");
				var nodes = tree.getCheckedNodes(true);
				var value = "";
				for(var i=0;i<nodes.length;i++){
					value+=nodes[i].id+",";
				}
				$("#HostId").val( value.substring(0,value.length-1) )
				//return value.substring(0,value.length-1);			
			}
			this.init = function(){
				_this.getTree();
				$(".data-traffic .form-submit").on("click",function(){
					_this.treeVal();
					_this.chart(".show-chart")
				});
				//$(".render-tree").before("<input type='checkbox' id='tree-all' checked='checked' style='margin-left:22px;margin-top:10px;'>全选")
				//初始化全部选中
				var tree = $.fn.zTree.getZTreeObj("traffic-tree");
				tree.checkAllNodes(true);
				$("#tree-all").on("change",function(){
					tree.checkAllNodes( $(this).context.checked );
				})
			}
		}
		var dt = new dataTraffic();
		dt.init();
		$(".data-traffic .form-submit").click();
	};
});
define("analysis/other",function(require, exports, module){
	var DU = require("date-util"),
        global = require("global"),
        base = global.base,
		render = 2;
		var analysis = require('data');
	exports.page = "pages/analysis/other.html";
	exports.execute = function(){
		analysis.initCascadeSelect();
		$('.nav-tabs').on('click', 'li', function(){
			setTimeout(function(){
				$(window).trigger('resize');
			}, 300);
		});
        $("#file_type").change(function(){
            //如果当前选择的option的值为1
            if( $(this).val() == 0){
                //吧下面这三个的style属性删除了
                $("option[size='300KB']").removeAttr("style");
                $("option[size='300KB2M']").removeAttr("style");
                $("option[size='2M']").removeAttr("style");
                //吧下面这三个的style属性加回来
                $("option[size='1M']").attr("style","display:none");
                $("option[size='1M10M']").attr("style","display:none");
                $("option[size='10M']").attr("style","display:none");
            }
            if($(this).val()==""){
                $("option[size='300KB']").attr("style","display:none");
                $("option[size='300KB2M']").attr("style","display:none");
                $("option[size='2M']").attr("style","display:none");
                $("option[size='1M']").attr("style","display:none");
                $("option[size='1M10M']").attr("style","display:none");
                $("option[size='10M']").attr("style","display:none");
            };
            //如果选择的 值是2  或者3
            if( $(this).val()==1|| $(this).val()==2){
                //吧下面这三个的style属性删除了
                $("option[size='1M']").removeAttr("style");
                $("option[size='1M10M']").removeAttr("style");
                $("option[size='10M']").removeAttr("style");
                //吧下面这三个的style属性加回来
                $("option[size='300KB']").attr("style","display:none");
                $("option[size='300KB2M']").attr("style","display:none");
                $("option[size='2M']").attr("style","display:none");
            }
        });
		// 图表处理
		Handlebars.registerHelper('_fileTypePie', function( data , index ) {
			if(render) $("#objSize").addClass("active");
			data = $.map(data,function(r){
				return {
						name: r.type || r.size,
						y: parseInt(r.flow),
						show: r.show
						}
					});
			$( index ).highcharts({
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

			if(render){
				$("#objSize").removeClass("active");
				render--;
			}
			return "";
		});

		$(".trend-export").on("click",function(){
			$(".trend-export").attr("href", require('global').base + $(this).attr("data-href")+"?"+ $(this).parent().serialize());
		});
	};
});

define("analysis/userBehavior",function(require, exports, module){
	var DU = require("date-util"),
        global = require("global"),
        base = global.base;

	exports.page = "pages/analysis/userBehavior.html";
	exports.execute = function(){
		var getChartData = null;
		$("#behavior").on("click",".rChart",function(){
			//alert($(this).attr("id"));
			var data={}
			data.NodeId = $(this).attr("id");
			data.StartTime = $(".start-date").val();
			data.EndTime = $(".end-date").val();
			renderChart(data);
		})

		var renderChart = function(obj){
			getChartData = obj;
			/*
			浏览器类型占比图	ApiStatisAnaly/userBrowserStatis
			终端类型占比图	ApiStatisAnaly/userTerminalStatis
			 */
			$(".behavior-charts").show();
			var urls = ["/ApiStatisAnaly/userBrowserStatis","/ApiStatisAnaly/userTerminalStatis"];
			var getChartData = function(url){
				$.ajax({
					type: "post",
					url: base + url,
					async: false,
					data: obj,
					dataType: "json",
					success: function(data){
						var index = "#"+url.split("/ApiStatisAnaly/")[1];  //渲染图表容器id与接口名相同
						renderchart(data.rows,index)
					}
				});
			}									
			var renderchart = function(data,index){
				data = $.map(data,function(r){
					return {											  
								name: r.browser_name ? r.browser_name : r.terminal_name,
								y: parseInt(r.flow),
								show: r.show
							}
						});
				$( index ).highcharts({
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
						pointFormat: '流量:{point.show} <br>占比:{point.percentage:.1f}%'
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
			}
			$(urls).each(function(i,v){
				getChartData(v)
			})
		}
	};
});
/*分级存储统计*/
define("analysis/storage",function(require, exports, module){
	var analysis = require('data');

	exports.page = "pages/analysis/storage.html";
	exports.execute = function(toModule){
		analysis.initCascadeSelect();
		$(".del-storage").click(function(){
			$.confirm('确认删除该记录吗？').yes(function(){
				var delData = "";
				$(".storage .disk-table .storage-disk:checkbox:checked").each(function(i,v){
					delData += $(v).val() + ",";
				})
				var dd = {
					key: delData.substring(0,delData.length-1)
				}
				$.ajax({
					type: "post",
					url: require('global').base + '/ApiGradeStorage/deleteDiskResource',//url: "/index.php/ApiGradeStorage/deleteDiskResource",
					//async: false,
					data: dd,
					dataType: "json",
					success: function(data){
						if(data.status === "success"){
							alert("删除成功");
							toModule("analysis/storage",function(){$("#disk-tab a").click()});
						}else{
							alert("删除失败");
						}
					}
				});
			}).no(function(str){});
		});

		$("body").on("click",".storage-update",function(e){
			e.preventDefault();
			var _this = $(this);
			var span = _this.find("span");
			var parent = _this.parents("tr");
			if("更新中。。" === span.text()){
				return;
			}
			span.text("更新中。。");
			$.ajax({
				type: "post",
				url: require('global').base + '/ApiGradeStorage/updateDiskResource',
				data: {
						"urlhash": parent.find(".urlhash").attr("title"),
						"infohash": parent.find(".urlhash").attr("title"),
						"ppcip": parent.find(".ppcip").attr("title")
					   },
				dataType: "json",
				success: function(data){
					$.alert(data.message)
					span.text("更新");
				}
			});
		})
	};
});