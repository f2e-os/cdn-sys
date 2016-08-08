// 告警配置
define("host/warning", function(require, exports, module){
	exports.page = "pages/host/warning.html";
	exports.execute = function(toModule){
	
	
	$(".system-alert").on("click",".btn-submit-alert",function(){
		var Idx="",WarnLevelId="",MaxValue="",WarnTypeId="";
		$(".system-alert table .tr").each(function(i,v){
			Idx += $(v).attr("id")+",";
			WarnLevelId += $(v).find(".WarnLevelId").val()+",";
			MaxValue += $(v).find(".maxvalue").val()+",";
			WarnTypeId += $(v).find(".WarnTypeId").val()+",";
		})
		/*
		var data={};
		data.Idx = 	Idx.substring(0,Idx.length-1);
		data.WarnLevelId = WarnLevelId.substring(0,WarnLevelId.length-1);
		data.MaxValue = MaxValue.substring(0,MaxValue.length-1);
		data.WarnTypeId = WarnTypeId.substring(0,WarnTypeId.length-1);
		*/

		var str = "Idx="+Idx.substring(0,Idx.length-1)+"&WarnLevelId="+WarnLevelId.substring(0,WarnLevelId.length-1)+"&MaxValue="+MaxValue.substring(0,MaxValue.length-1)+"&WarnTypeId="+WarnTypeId.substring(0,WarnTypeId.length-1);

		$.ajax({
			type: "get",
			url: "/index.php/ApiMonitor/setMonitorConfigure",
			async: false,
			data: str,
			dataType: "json",
			success: function(data){
				$.alert(data.message)
			}
		});
	});
	$(".system-alert").on("click","#btn-submit-cancle",function(){
		toModule("host/warning");
	})





	}
});


