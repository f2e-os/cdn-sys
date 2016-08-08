/*
 * 动态策略管理
 */
define("host/Dynamic", function(require,exports,module){
  // url或ip
    Handlebars.registerHelper('url_ip', function(IsIp) {
        return ["url","ip"][IsIp];
    });

  // 重定向或阻断
    Handlebars.registerHelper('RedirStop', function(RedirStop) {
        return ["阻断","重定向"][RedirStop];
    });

    exports.page = "pages/host/Dynamic/access_static.html";

    exports.execute = function(toModule){

          //下发
        $("#host").delegate("a.host-accessStatic-Issued","click",function(){
            var _this = $(this),
              r={},
              _tpl=$('#accessStatic-Issued').html();
             var html = Handlebars.compile(_tpl)(r); 
             html=$(html);
             //弹出框里面全选事件
             var _checkall=html.find('#host-Issued-check-all:input'),
              _allcheckbox=html.find('input:checkbox');
             _checkall.on('click',function(){
              var _this=$(this);
              _this.prop("checked")?_allcheckbox.prop('checked',true):_allcheckbox.prop('checked',false);
             })
            $.dialog(html,{title:"下发的设备"}).yes(function(){
            var $checked =$('#accessStatic-Issued-form').find("input:checkbox:checked"),
                tempData={},
                ids = [];

                $checked.each(function(){
                    var $this = $(this),
                    id = $this.val();
                    ids.push(id);
                });
                tempData.Host_Id=ids.join(",");
                tempData.Type=$('#accessStatic-Issued-form').find("input[name='Type']:checked").val();
                 $.ajax({
                    url:require('global').base + "/ApiDynamicPolicyManage/setDynamic",
                    data:tempData,
                    type:"get",
                    dataType:"json",
                    success: function(data){
                        if(data.status == "success"){
                          alert(data.message);
                           toModule("host/Dynamic");
                        }else{
                          alert(data.message);
                        }
                        
                    }
                })
            }).no(function(str){
              
            });
         });
        //开关
        $("#host").delegate("a.host-accessStatic-Issued2","click",function(){
            var _this = $(this),
                r={},
                _tpl=$('#accessStatic-Issued2').html();
            var html = Handlebars.compile(_tpl)(r);
            html=$(html);
            //弹出框里面全选事件
            var _checkall=html.find('#host-Issued-check-all2:input'),
                _allcheckbox=html.find('input:checkbox');
            _checkall.on('click',function(){
                var _this=$(this);
                _this.prop("checked")?_allcheckbox.prop('checked',true):_allcheckbox.prop('checked',false);
            })
            $.dialog(html,{title:"下发的设备"}).yes(function(){
                var $checked =$('#accessStatic-Issued-form2').find("input:checkbox:checked"),
                    tempData={},
                    ids = [];

                $checked.each(function(){
                    var $this = $(this),
                        id = $this.val();
                    ids.push(id);
                });
                tempData.Host_Id=ids.join(",");
                tempData.Type=$('#accessStatic-Issued-form2').find("input[name='Type']:checked").val();
                $.ajax({
                    url:require('global').base + "/ApiDynamicPolicyManage/SendDynamicClose",
                    data:tempData,
                    type:"get",
                    dataType:"json",
                    success: function(data){
                        if(data.status == "success"){
                            alert(data.message);
                            toModule("host/Dynamic");
                        }else{
                            alert(data.message);
                        }

                    }
                })
            }).no(function(str){

            });
        });

        //删除列表
        $("#host").delegate("a.accessStatic-delete","click",function(){
            var _this = $(this),
            _parentTr = _this.parent().parent(),
            id = _parentTr.attr("data-id"),
            tempData={};
      tempData.Id=id;
          $.confirm('确定删除么').yes(function(){
              $.ajax({
                  url:require('global').base + "/ApiDynamicPolicyManage/deleteDynamic",
                  data:tempData,
                  type:"get",
                  dataType:"json",
                  success: function(data){
                      if(data.status == "success"){
                        alert('删除成功');
                        //清缓存
                      var global = require("global");
                global.updateCache("/ApiAccessControl/listAccessControl");
                          toModule("host/Dynamic");
                      }
                      
                  }
  
              })
            }).no(function(){
              
            });
         });
          //批量删除列表
        $("#host").delegate("a.host-accessStatic-delM","click",function(){
            var $checked = $(".host-accessStatic:checkbox:checked"),
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
                    url:require('global').base + "/ApiDynamicPolicyManage/deleteDynamic",
                    data:tempData,
                    type:"get",
                    dataType:"json",
                    success: function(data){
                        if(data.status == "success"){
                          alert('删除成功');
                          //清缓存
                      var global = require("global");
                global.updateCache("/ApiAccessControl/listAccessControl");
                            toModule("host/Dynamic");
                        }
                        
                    }
    
                })
              }).no(function(){
                
              });
            }
         });

    }
});
/*
 *访问控制策略管理添加页面
 */
define("host/Dynamic/host_accessStatic-add",function(require,exports,module){
     // 用户状态
    Handlebars.registerHelper('system_user_status', function(status) {
        return ["禁用","启用"][status];
    });

    // 用户状态
    Handlebars.registerHelper('yes_no', function(yes) {
        return ["否","是"][yes];
    });

    exports.page = "pages/host/Dynamic/add.html";

    exports.execute = function(toModule){
        // $('#myTab a:first').tab('show');//初始化显示哪个tab 
        //       
        // $('#myTab a').click(function (e) { 
            // e.preventDefault();//阻止a链接的跳转行为 
            // $(this).tab('show');//显示当前选中的链接及关联的content 
            // $('.detail').text( $(this).text());
        // });


        $('.ZUI-radio').click(function (e) {
            //$("input[name='RedirStop']").val()=='0'? $('#RedirUrl').attr('disabled','disabled'):$('#RedirUrl').attr('disabled',false);
            //alert($("#global_show_3").attr("checked"));
         var RedirStop=   $('input:radio[name="RedirStop"]:checked').val();
        if(RedirStop==0){
           $('input[name="RedirUrl"]').attr('disabled','disabled');

        }else {
            $("input[name='RedirUrl']").removeAttr('disabled', 'disabled');
        }

             });

    }
});
/*
 *访问控制策略管理修改页面
 */
define("host/Dynamic/host_accessStatic-edit",function(require,exports,module){
	
   var global = require("global");

	global.updateCache("IsIP",{
		rows:[
            {id:"0",type:"URL"},
            {id:"1",type:"IP"}
        ]
	});
	
	global.updateCache("RedirStop",{
		rows:[
            {id:"1",type:"重定向"},
            {id:"0",type:"阻断"}
        ]
	});

    exports.page = "pages/host/Dynamic/edit.html";

    exports.execute = function(toModule){

    }
});
 