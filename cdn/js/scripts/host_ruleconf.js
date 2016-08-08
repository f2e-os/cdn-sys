//缓存规则库配置

define("host/ruleconf/list", function(require, exports, module){
    var global = require("global");

    exports.page = "pages/host/ruleconf/list.html";
    
    
    exports.execute = function(toModule, param){
    // 下发
        $('.btn-send').on('click', function(e){
            
                var checked = $('.host-distribute:checked');
            
                global.NodeSelector('<i></i>', function(node_ids, node_names){
                    var ids = [];
                    checked.each(function(i,c){ ids.push( c.value ) });
                    var data = {
                        
                        Host_Id: host_ids.join(',')
                    };
                    $.ajax({
                        url: global.base + '/ApiRegLib/SynRegLib',
                        data: data,
                        dataType: 'json',
                        success: function(res){
                            alert(res.message);
                        },
                        error: function(){
                            alert("服务端错误");
                        }
                    });
                });
          
        });
        
        //下载大文件
        $('.cacheRuleM-big-download').on('click', function(e){
            
            $.ajax({
                type:'GET',
                dataType:'json',
                url:require('global').base + '/ApiRegLib/getRegVersion',
                data:'type=2',
                success:function(data){
                    if(data.code==1)
                    {
                        $('#cacheRuleVersion').val(data.info['cacheRuleVersion']);
                        $('#curVersion').val(data.info['curVersion']);
                        var html = Handlebars.compile('<form>'+$('#cacheRuleM-download').html()+'</form>');
                        var form=$(html(data.info));
                        var dialog = $.dialog(form,{title:"下载缓存规则库"}).yes(function(){                   
                            $.ajax({
                                url:require('global').base + '/ApiRegLib/downloadRegFile',
                                data:form.serialize(),
                                type:"get",
                                dataType:"json",
                                success: function(res){
                                    if(res.status == "success"){
                                        alert('成功');
                                        toModule('host/ruleconf/list');

                                    }

                                }
                            });
                        });
                    }
                    
                }
        
            }); 
        }); 
        
        //下载小文件
        $('.cacheRuleM-small-download').on('click', function(e){
            
            $.ajax({
                type:'GET',
                dataType:'json',
                url:require('global').base + '/ApiRegLib/getRegVersion',
                data:'type=1',
                success:function(data){
                    if(data.code==1)
                    {
                        $('#cacheRuleVersion').val(data.info['cacheRuleVersion']);
                        $('#curVersion').val(data.info['curVersion']);
                        
                        var html = Handlebars.compile('<form>'+$('#cacheRuleM-download').html()+'</form>');
                        var form=$(html(data.info));
                        var dialog = $.dialog(form,{title:"下载缓存规则库"}).yes(function(){                   
                            $.ajax({
                                url:require('global').base + '/ApiRegLib/downloadRegFile',
                                data:form.serialize(),
                                type:"get",
                                dataType:"json",
                                success: function(res){
                                    if(res.status == "success"){
                                        alert('成功');
                                        toModule('host/ruleconf/list');

                                    }

                                }
                            });
                        });
                    }
                    
                }
        
            }); 
        }); 
        
    };
});