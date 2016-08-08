/**
 * @method monitor alert
 * @version	1.0
 * @createTime 2015/08/26
 * @author jyn
 */

//设备监控
define("monitor",function(require, exports, module){

	var global = require('global');
	exports.page = "pages/monitor/monitor.html";
	exports.execute = function(){
		var monitor = function(){
			var _this = this;
			this.column = (function(){	  //当前栏目id数组	  并在本次遍历时为a标签添加href属性
				var arr = [];
				$(".monitor .nav-tabs li").on("click","a",function(){
					if($(this).parent().hasClass("multiselect-tree")){
						$("#"+$(this).attr("aria-controls")+" .show-btn").click();
					}
				}).each(function(i,v){
					arr.push( $(v).children("a").attr("aria-controls") );
					$(v).children("a").attr("href",("#"+$(v).children("a").attr("aria-controls")) )
				})
				return arr;

			})();

			var treeType = '0';
			this.htmlTab = (function(){	   //用于被切换的tab html代码
				var	ht = '';
				$( _this.column ).each(function(i,v){
					var dHtml = "";
					switch (v)
					{
						case "getAllDrawGraph":
						dHtml = '<a class="ZUI-btn btnicon01 mr dl" data-href="ApiStatusExport/exportAllPerformance"><span>整体性能分析报表</span></a>';break;
						case "getCPUDrawGraph":
						dHtml = '<a class="ZUI-btn btnicon01 mr dl" data-href="ApiStatusExport/exportCpuUsed"><span>CPU占有率分析报表</span></a>';break;
						case "getHarddiskDrawGraph":
						dHtml = '<a class="ZUI-btn btnicon01 mr dl" data-href="ApiStatusExport/exportStorage"><span>磁盘占用空间分析报表</span></a>';break;
						case "getTaskDrawGraph":

						dHtml = '<a class="ZUI-btn btnicon01 mr dl" data-href="ApiStatusExport/exportTaskNumber"><span>任务数分析报表</span></a>';break;
						case "getConnectDrawGraph":

						dHtml = '<a class="ZUI-btn btnicon01 mr dl" data-href="ApiStatusExport/exportLinkNumber"><span>连接数分析报表</span></a>';break;
						case "getHitDrawGraph":

						dHtml = '<a class="ZUI-btn btnicon01 mr dl" data-href="ApiStatusExport/exportPpcHitRate"><span>PPC命中比例分析报表</span></a>';break;
						case "getFlowDrawGraph":

						dHtml = '<a class="ZUI-btn btnicon01 mr dl" data-href="ApiStatusExport/exportTraffic"><span>缓存速率报表</span></a>'+
								'<a class="ZUI-btn btnicon01 mr dl" data-href="ApiStatusExport/exportTrafficTrend"><span>缓存速率趋势报表</span></a>';break;
						case "getRequestDrawGraph":

						dHtml = '<a class="ZUI-btn btnicon01 mr dl" data-href="ApiStatusExport/exportReqNumber"><span>请求数分析报表</span></a>';break;
						case "getCacheHitDrawGraph":

						dHtml = '<a class="ZUI-btn btnicon01 mr dl" data-href="ApiStatusExport/exportRRDExcel"><span>缓存命中率报表</span></a>';break;
						case "getTrafficDrawGraph":
						//case  'getTrafficAnalysisDrawGraph':


					}


					if ( v=="getCacheHitDrawGraph") {
							ht+='<div role="tabpanel" class="tab-pane m-tab" id="' + v + '">'+
							'<form class="" action="">'+
								'<input type="text" name="StartTime"  class="start-date ZUI-input d-input data-picker mr" placeholder="请选择时间"  onclick="WdatePicker({dateFmt:\'yyyy-MM-dd HH:mm\'})">'+
								'<span class="mr">至</span>'+
								'<input type="text" name="EndTime" class="end-date ZUI-input d-input data-picker mr" placeholder="请选择时间"  onclick="WdatePicker({dateFmt:\'yyyy-MM-dd HH:mm\'})">'+
							' 显示图形:&nbsp;&nbsp;'+
							'<select id="protocol_id"  name="protocol_id" >'+
                                '<option value="0">全部</option>'+
                                '<option value="1">bt</option>'+
                                '<option value="2">http</option>'+
                                '<option value="3">xl</option>'+
                                '<option value="4">ppstream</option>'+
                                '<option value="5">pplive</option>'+
                                '<option value="6">qqlive</option>'+
                                '<option value="7">baofeng</option>'+
                            '</select>'+


								'<a class="ZUI-btn btnicon04 mr show-btn1"><span>显示</span></a>'+
								dHtml +	//下载按钮
							'</form>'+

								'<div class="show-par clearfix">'+
								'<div class="show-img col-sm-8">'+
										'<img src="" alt="">'+
									'</div>'+
									'<div class="show-tree col-sm-4">'+
										'<ul class="ztree render-tree"></ul>'+
									'</div>'+
								'</div>'+
						'</div>';
					}else if(v=="getTrafficDrawGraph"){
						ht+='<div role="tabpanel" class="tab-pane m-tab" id="' + v + '">'+
							'<form class="" action="">'+
								'<input type="text" name="StartTime"  class="start-date ZUI-input d-input data-picker mr" placeholder="请选择时间"  onclick="WdatePicker({dateFmt:\'yyyy-MM-dd HH:mm\'})">'+
								'<span class="mr">至</span>'+
								'<input type="text" name="EndTime" class="end-date ZUI-input d-input data-picker mr" placeholder="请选择时间"  onclick="WdatePicker({dateFmt:\'yyyy-MM-dd HH:mm\'})">'+
								' 显示设备:&nbsp;&nbsp;'+
								'<select name="select_pps" id="select_pps" class="select_pps">'+
                                '<option value="0">全部</option>'+
                                require('global').global_show.call("select" ,"", "/ApiCommon/getHostByType?type=5", "HostName" ,"Id",null,"info")+
                            '</select>'+

                            '&nbsp;&nbsp;&nbsp;监控链路:&nbsp;&nbsp;'+

						'<select name="select_pps_port" id="select_pps_port" class="select_pps_port">'+
							'<option value="0">全部</option>'+
							require('global').global_show.call("select" ,"", "/ApiDomainGroup/getEquipmentLink", "if_desc" ,"id",null,"rows")+

						'</select>'+
						'<a class="ZUI-btn btnicon04 mr show-btn2"><span>显示</span></a>'+

							'</form>'+
								'<div class="show-par clearfaaix">'+
									'<div class="show-img col-sm-8">'+
										'<img src="" alt="">'+
									'</div>'+
									'<div class="show-tree col-sm-4" style="display:none">'+
										'<ul class="ztree render-tree"></ul>'+
									'</div>'+
								'</div>'+
						'</div>';

                    }else if(v=="getFlowDrawGraph") {
                        ht += '<div role="tabpanel" class="tab-pane m-tab" id="' + v + '">' +
                        '<form class="" action="">' +
                            '<input type="text" name="StartTime"  class="start-date ZUI-input d-input data-picker mr" placeholder="请选择时间"  onclick="WdatePicker({dateFmt:\'yyyy-MM-dd HH:mm\'})">' +
                            '<span class="mr">至</span>' +
                            '<input type="text" name="EndTime" class="end-date ZUI-input d-input data-picker mr" placeholder="请选择时间"  onclick="WdatePicker({dateFmt:\'yyyy-MM-dd HH:mm\'})">' +
                        ' 选择协议类型:&nbsp;&nbsp;' +
                        '<select name="protocol_type" id="protocol_type" class="protocol_type">' +
                            '<option value="-1">全部</option>' +
                            '<option value="1">P2P_PPC</option>' +
                            '<option value="2">HTTP_PPC</option>' +
                            '<option value="3">WEB_PPC</option>' +
                        '</select>' +

                        '&nbsp;&nbsp;&nbsp显示方式:&nbsp;&nbsp;' +

                        '<select name="graph_type" id="graph_type" class="graph_type">' +
                            '<option value="0">按宽带显示</option>' +
                            '<option value="1">按字节显示</option>' +

                        '</select>' +
                        '<a class="ZUI-btn btnicon04 mr show-btn"><span>显示</span></a>' +
                        dHtml +	//下载按钮
                        '</form>'+

                            '<div class="show-par clearfix">'+
                                '<div class="show-img col-sm-8">'+
                                     '<img src="" alt="">'+
                                 '</div>'+
                                '<div class="show-tree col-sm-4">'+
                                     '<ul class="ztree render-tree"></ul>'+
                                 '</div>'+
                            '</div>'+
                        '</div>';
                    }else{

					    ht+='<div role="tabpanel" class="tab-pane m-tab" id="' + v + '">'+
							'<form class="" action="">'+
								'<input type="text" name="StartTime"  class="start-date ZUI-input d-input data-picker mr" placeholder="请选择时间"  onclick="WdatePicker({dateFmt:\'yyyy-MM-dd HH:mm\'})">'+
								'<span class="mr">至</span>'+
								'<input type="text" name="EndTime" class="end-date ZUI-input d-input data-picker mr" placeholder="请选择时间"  onclick="WdatePicker({dateFmt:\'yyyy-MM-dd HH:mm\'})">'+
								'<a class="ZUI-btn btnicon04 mr show-btn"><span>显示</span></a>'+
								dHtml +	//下载按钮
							'</form>'+
								'<div class="show-par clearfix">'+
									'<div class="show-img col-sm-8">'+
										'<img src="" alt="">'+
									'</div>'+
									'<div class="show-tree col-sm-4">'+
										'<ul class="ztree render-tree"></ul>'+
									'</div>'+
								'</div>'+
						'</div>';

					}


				})
				return ht;
			})();
			this.getMonitoPic = function(data,url,callback){	  //异步请求图片数据
				$.ajax({
					type: "post",
					url: require('global').base + '/ApiStatus/'+url,
					async: false,
					data: data,
					dataType: "json",
					success: function(data){
						if(data.status =="fail"){
							$.alert(data.message)
						}else{
							callback(data);
						}
					}
				});
			}
			this.setDefaultTime = function(){
				var curDate = new Date(),preDate = new Date(curDate.getTime() - 24*60*60*1000);  //前一天
				var y = curDate.getFullYear(),m = curDate.getMonth()+1,d = curDate.getDate(),h = curDate.getHours(),mm = curDate.getMinutes()-(curDate.getMinutes())%5;
				var py = preDate.getFullYear(),pm = preDate.getMonth()+1,pd = preDate.getDate(),ph = preDate.getHours(),pmm = preDate.getMinutes()-(curDate.getMinutes())%5;
				mm=(mm<10)?('0'+mm):mm;pmm=(pmm<10)?('0'+pmm):pmm;
				var cd =  y+"-"+m+"-"+d+" "+h+":"+mm,pd =  py+"-"+pm+"-"+pd+" "+ph+":"+pmm;
				$(".start-date").val(pd);
				$(".end-date").val(cd);
			}
			this.getTree = function(){

					var data_pps;
					$.ajax({
						type: "post",
						url: require('global').base + '/ApiDepartment/displayTree?host_type=5',//url: "/index.php/ApiDepartment/displayTree",
						async: false,
						dataType: "json",
						success: function(data){
							data_pps =  data.rows;
							}
						});

						var data_cache;
					$.ajax({
						type: "post",
						url: require('global').base + '/ApiDepartment/displayTree?host_type=1,2',//url: "/index.php/ApiDepartment/displayTree",
						async: false,
						dataType: "json",
						success: function(data){
							data_cache =  data.rows;
							}
						});
                var data_ppc;
                $.ajax({
                    type: "post",
                    url: require('global').base + '/ApiDepartment/displayTree?host_type=1,2,9,10,11,12,13,14,15,16,17,18',//url: "/index.php/ApiDepartment/displayTree",
                    async: false,
                    dataType: "json",
                    success: function(data){
                        data_ppc =  data.rows;
                    }
                });

					var data_cachepps;
					$.ajax({
						type: "post",
						url: require('global').base + '/ApiDepartment/displayTree?host_type=1,2,5',//url: "/index.php/ApiDepartment/displayTree",
						async: false,
						dataType: "json",
						success: function(data){
							data_cachepps =  data.rows;
							}
						});
						//单选树结构配置参数
                var setting = {
                    data: {
                        simpleData: {
                            enable: true
                        }
                    }
                };

                //复选树结构配置参数
                var multiselectSetting = {
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

                $(".render-tree").each(function(i,v){
                    // var type = '1,2';
                    var zNodes = data_cache;
                    if( $(".nav-tabs li").eq(i).hasClass("pps") ){
                        zNodes = data_pps;

                    }else if($(".nav-tabs li").eq(i).hasClass("cachepps")){
                        zNodes = data_cachepps;
                    }else if( $(".nav-tabs li").eq(i).hasClass("ppc") ) {
                        zNodes = data_ppc;
                    }




                    //根据对应li上是否有  multiselect-tree  生成复选单选树结构

                    if( $(".nav-tabs li").eq(i).hasClass("multiselect-tree") ){
                        $.fn.zTree.init($(v).attr("id","monitor-tree"+i), multiselectSetting, zNodes);
                        var treeObj = $.fn.zTree.getZTreeObj($(this).attr("id"));
                        treeObj.checkAllNodes(true);
                        $("#"+"monitor-tree"+i).addClass("multiselect-show")
                    }else{

                        $.fn.zTree.init($(v).attr("id","monitor-tree"+i), setting, zNodes);
                    }
                });
			}


			this.getHostId = function(id){
				var tree = $.fn.zTree.getZTreeObj(id);
				if( $("#"+id ).hasClass("multiselect-show") ){
					//复选
					var nodes = tree.getCheckedNodes(true);
				}else{
					//单选
					var nodes = tree.getSelectedNodes(true);
				}
				var value = [];
				for(var i=0;i<nodes.length;i++){
					value.push(nodes[i].id);
				}
				return value.join(',');
			}
			this.init = function(){
				var _this = this;
				$(".monitor-cont").append( _this.htmlTab );
				$(".monitor-cont .tab-pane").eq(0).addClass("active");
				$(".dl").on("click",function(){
					var pane = $(this).parents(".tab-pane");
					var url = pane.attr("id");
					var ids = _this.getHostId(pane.find(".render-tree").attr("id"));
					//if(ids == ""){$.alert("请选择要显示的设备");return false;}
					var _t = this;
					$.ajax({
						type:'post',
						dataType:'json',
						url: require('global').base + '/' + $(this).attr("data-href")+'?'+ $(this).parent().serialize()+"&HostId="+ids,
						success:function(result){
							if(result.status=="success"){
								window.location.href = window.location.origin+result.info;
							}else if(result.status=="fail"){
								$.alert(result.message);
							}
						},
						error:function(data){
						   console.log(data)
						}
					});
				})

				$(".show-btn").on("click",function(){
					var pane = $(this).parents(".tab-pane");
					var url = pane.attr("id");
					var option = {
						StartTime : $(this).parent().find(".start-date").val(),
						EndTime : $(this).parent().find(".end-date").val(),
						HostId : _this.getHostId(pane.find(".render-tree").attr("id")),
                        protocol_type: $(this).parent().find("#protocol_type").val(),
                        graph_type:$(this).parent().find("#graph_type").val()

					}
					//if(option.HostId == ""){$.alert("请选择要显示的设备");return false;}
					_this.getMonitoPic( option,url,function(data){
                        $(".info-rate").remove();
                        $(".info_rate_fen").remove();
                        $('.show-img p').remove()
                        $("#"+url+" .show-img img").attr( "src" , data.info );
						if(data.info_rate){
							$(".info-rate").remove();
							$("#"+url+" .show-img img").after( '<img src='+data.info_rate+' style="margin-top:10px;" class="info-rate">' );
						}

						if(data.info_rate_fen){
							$(".info-rate_fen").remove();
							$.each(data.info_rate_fen , function(i,value){
								if(i==0){
									$("#"+url+" .show-img img:last").after('<p style="margin-top:10px;">'+data.info_rate_fen[i]['HostName']+'</p>'+'<img src='+data.info_rate_fen[i]['graph']+' style="margin-top:-10px;" class="info-rate">' );
								}else{
									$("#"+url+" .show-img img:last").last().after( '<p style="margin-top:10px;">'+data.info_rate_fen[i]['HostName']+'</p>'+'<img src='+data.info_rate_fen[i]['graph']+' style="margin-top:-10px;" class="info_rate_fen">' );
								}
							});

						}
					});
					$(this).parents(".tab-pane").find(".show-par").show();
				});
				$(".show-btn1").on("click",function(){
					var pane = $(this).parents(".tab-pane");
					var url = pane.attr("id");
					var option = {
						StartTime : $(this).parent().find(".start-date").val(),
						EndTime : $(this).parent().find(".end-date").val(),
						HostId : _this.getHostId(pane.find(".render-tree").attr("id")),
						protocol_id:$(this).parent().find("#protocol_id").val()
					}
					//if(option.HostId == ""){$.alert("请选择要显示的设备");return false;}
					_this.getMonitoPic( option,url,function(data){
						if(data.info){
							$("#"+url+" .show-img img").not(":first").remove();
							$.each(data.info , function(i,value){
								if(i == 0)
								{
									$("#"+url+" .show-img img").attr( "src" , data.info[i]);
								}else{
									$("#"+url+" .show-img img").last().after( '<img src='+data.info[i]+' style="margin-top:10px;" class="info">' );
								}
							});
						}



					});
					$(this).parents(".tab-pane").find(".show-par").show();
				});
				$(".show-btn2").on("click",function(){
					var pane = $(this).parents(".tab-pane");
					var url = pane.attr("id");
					var option = {
						StartTime : $(this).parent().find(".start-date").val(),
						EndTime : $(this).parent().find(".end-date").val(),
						//HostId : _this.getHostId(pane.find(".render-tree").attr("id")),
						select_pps:$(this).parent().find("#select_pps").val(),
						select_pps_port:$(this).parent().find("#select_pps_port").val()

					}
					_this.getMonitoPic( option,url,function(data){
						$("#"+url+" .show-img img").attr( "src" , data.info);
					});
					$(this).parents(".tab-pane").find(".show-par").show();
				})
				$(".select_pps").change(function(){
					var SelectPps = $('[name=select_pps]');
					var SelectPpsPort = $('[name=select_pps_port]');
					var id = this.value;
					var Selectpps =SelectPps.val();
					SelectPpsPort.html( '<option value="">全部</option>' + global.global_show.call('select', '', '/ApiDomainGroup/getEquipmentLink?select_pps=' + Selectpps, 'if_desc', 'id') );

				});

                $("#protocol_type").change(function(){
                    var pro =$("#protocol_type").val();
                    if(pro){
                        var data_ppc;
                        $.ajax({
                            type: "post",
                            url: require('global').base + '/ApiDepartment/displayTree?host_type=1,2,5,9,10,11,12,13,14,15,16,17,18&protocol_type='+pro,//url: "/index.php/ApiDepartment/displayTree",
                            async: false,
                            dataType: "json",
                            success: function(data){
                                data_ppc =  data.rows;
                            }
                        });
                        //单选树结构配置参数
                        var setting = {
                            data: {
                                simpleData: {
                                    enable: true
                                }
                            }
                        };

                        //复选树结构配置参数
                        var multiselectSetting = {
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

                        $(".render-tree").each(function(i,v){
                            // var type = '1,2';
                            var zNodes = data_ppc;
                            //根据对应li上是否有  multiselect-tree  生成复选单选树结构

                            if( $(".nav-tabs li").eq(i).hasClass("multiselect-tree") ){
                                $.fn.zTree.init($(v).attr("id","monitor-tree"+i), multiselectSetting, zNodes);
                                var treeObj = $.fn.zTree.getZTreeObj($(this).attr("id"));
                                treeObj.checkAllNodes(true);
                                $("#"+"monitor-tree"+i).addClass("multiselect-show")
                            }else{

                                $.fn.zTree.init($(v).attr("id","monitor-tree"+i), setting, zNodes);
                            }
                        });
                    }
                });
				_this.setDefaultTime();
				_this.getTree();

				$(".show-btn").eq(0).click();
				$(".show-btn1").eq(0).click();
				$(".show-btn2").eq(0).click();

			}
		}
		var m = new monitor();
		m.init();

    };
});

//告警
define("monitor/alert", function(require, exports, module){
    exports.page = "pages/monitor/alert.html";

    Handlebars.registerHelper("WarnLevelColor",function(WarnLevel){
    	if(WarnLevel == "紧急"){
    		return "warnStyle warnTop";
    	}else if(WarnLevel == "重要"){
    		return "warnStyle warnCenter";
    	}else if(WarnLevel == "提示"){
    		return "warnStyle warnBottom";
    	}else {
    		return "warnStyle determine";
    	}
    });


	Handlebars.registerHelper("judgeStatus",function(Status){
    	 if(Status!=="0"){
		 	return "background-color:#A3A4A5;color:#FFF;";
		 }
    });


	Handlebars.registerHelper("doStatus",function(Status){
    	 if(Status==="0"){
			return "确认";
		 }else{
		 	return "已确认";
		 }
    });
	exports.execute = function(toModule){
		var confirm = function(url,data,callback){
			$.ajax({
				type:'POST',
				dataType:'json',
				url: require('global').base + '/'+url,//url:"/index.php/"+url,
				data:data,
				success:function(result){
					if(result.code==1){
						//alert(result.message);
						callback(result);
					}else{
						alert(result.message);
					}
				},
				error:function(){
					$.alert('操作失败');
				}
			});
		}

		$(".m-alert").on("click",".alert-confirm",function(){	 //确认
		   var $this = $(this);
		   if ($this.find("span").html() === "已确认"){
			   return false;
		   }else{
			var data = 	{
				Idx:$this.attr("data-idx")
			}
			confirm( "ApiMonitor/doConfirm",data,function(data){
				$this.find("span").html("已确认");
			});
		   }
		});

		$(".m-alert").on("click",".alert-search",function(){
			var $this = $(this);
			var data = 	{Idx:$this.attr("data-idx")}  ;
			confirm( "ApiMonitor/getExpertBase",data,function(data){
			//var template = Handlebars.compile('<form>'+$('#search-form-template').html()+'</form>');
			//var form=$(template(data.info));
			/*
			if(data.info == "" || data.info.length == 0){
				$.alert(data.message);
				return ;
			}
			*/
			var str = '<div style="margin-bottom:20px;" class="clearfix">'+
						'<span style="float:left;display:block;width:130px;text-align:right;">告警类型</span>'+
						'<input type="text" value="'+data.info[0].WarnMold+'" style="float:left;margin-left:10px;width:300px;">'+
					  '</div>'+
					  '<div class="">'+

					  	'<span style="float:left;display:block;width:130px;text-align:right;">专家意见</span>'+
						'<textarea style="float:left;margin-left:10px;display:block;width:300px;margin-bottom:20px;">'+data.info[0].ExpertText+'</textarea>'+
					  '</div>';
			$.alert(str)
			})
		});

		$(".m-alert").on("click",".alert-edit",function(){
			var $this = $(this);
			var data = 	{Idx:$this.attr("data-idx")}  ;

			confirm( "ApiMonitor/getExpertBase",data,function(data){
				var str = '<div style="margin-bottom:20px;" class="clearfix" id="getExpertBase">'+
							'<span style="float:left;display:block;width:130px;text-align:right;">告警类型</span>'+
							'<input type="text" value="'+data.info[0].WarnMold+'" style="float:left;margin-left:10px;width:300px;">'+
						  '</div>'+
						  '<div class="">'+
							'<span style="float:left;display:block;width:130px;text-align:right;">专家意见</span>'+
							'<textarea style="float:left;margin-left:10px;display:block;width:300px;margin-bottom:20px;id="editAdvice" class="editAdvice">'+data.info[0].ExpertText+'</textarea>'+
						  '</div>';
				$.confirm(str).yes(function(str){
					var obj = {
						Idx: $this.attr("data-idx"),
						EditText: $(".editAdvice").val()
					}
					confirm( "ApiMonitor/editExpertBase",obj,function(data){
						alert(data.message);
					})
				});
			})
		})
		$(".batch-confirm").on("click",function(){		   //批量确认
			var str="Idx=" , idxArr = [];
			$(".alert-table-tr input:checkbox:checked").each(function(i,v){
				str+=$(v).attr("data-id")+",";
				idxArr.push( $(v).attr("data-id") );
			})
			confirm("ApiMonitor/doConfirm",str.substring(0,str.length-1),function(){
				$(idxArr).each(function(i,v){
					$(".alert-table tr[data-id="+v+"]").find(".alert-confirm span").html("已确认");
				})
			})
		});
		$(".batch-del").on("click",function(){			   //批量删除
			var str="Ids=" , idxArr = [];
			$(".alert-table-tr input:checkbox:checked").each(function(i,v){
				str+=$(v).attr("data-id")+",";
				idxArr.push( $(v).attr("data-id") );
			})
			confirm("ApiMonitor/deleteMonitor",str.substring(0,str.length-1),function(data){
				$(idxArr).each(function(i,v){
					$(".alert-table tr[data-id="+v+"]").remove();
				});
				$.alert(data.message)
				$("body").find(".btn-submit").click();
			})
		})
	}
});
//命中率报表
define("monitor/report", function(require, exports, module){
    var global = require('global');

    exports.page = "pages/monitor/report.html";
    exports.execute = function(){
       //exports.initCascadeSelect();
        //添加导出链接
        $(".trend-export").on("click",function(){
            //$(".trend-export").attr("href", require('global').base + $(this).attr("data-href")+"?"+ $(".form-style").serialize());
            $(".trend-export").attr("href", require('global').base + '/ApiStatusExport/listBytesHitExport?'+ $(".form-style").serialize());
        });
        // 图表处理
        Handlebars.registerHelper('_fileTypePie', function( data , index ) {
			var array_x = new Array();
            data = $.map(data,function(r){
				array_x.push(r.yuming);
                return {
                    name: r.yuming,
                    y: parseInt(r.avg),
                    show: r.avg
                }
            });
            $( index ).highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Top10域名字节命中率(%)'
                },
				xAxis: [{
                categories: array_x,
				labels:{
					rotation:-45
				}
				}],
                legend: {
                    align: 'right',
                    layout: 'vertical',
                    verticalAlign: 'top',
                    x: -20,
					enabled: false
                },
                tooltip: {
                    title: " ",
                    pointFormat: '{point.show} %'
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



        });
    };


});
