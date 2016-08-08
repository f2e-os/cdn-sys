<!--
     /**
      *  Mr Du  2016.3.28
      *  控制组件
      */
 -->

  define("host/pplivecache/conf", function(require, exports, module){
    var global = require("global");
    var lang   = require('fan_lang3');
    //lang.updateHostBtConfCache();
    lang.updateHostppliveConfCache();

    exports.page = "pages/host/pplivecache/conf.html";



//设备列表
Handlebars.registerHelper('host_pplivecache_Conf_ppcList', function(value) {
    return lang.renderTemplate('#ppclist-template',value);
  });




  exports.execute = function(toModule, param){
    var confData={ppc:null,limit:null,client_pool:null};
    lang.setSubTabDetail();
    var Fuiing=$('.FUI');

    //清除设备组缓存/PPC ApiPpLiveCacheBaseConfig
    lang.global.updateCache("/ApiPpLiveCacheBaseConfig/listHostGroup");





<!--
     /**
      *  Mr Du  2016.3.18
      *  控制设备组的勾选状态/pplive
      */
 -->
  


    Fuiing.on('change','.ppc-group input:checkbox',function(){
      var checkbox=$(this);
      $('.ppc-block tr[data-group='+checkbox.val()+'] input:checkbox').prop('checked',checkbox.prop('checked'));
    });



<!--
     /**
      *  Mr Du  2016.3.18
      *  设备组自动计算
      */
 -->

    Fuiing.on('click','.btn-autoCalc',function(){
      var el=$('.ppc-block input:checkbox:checked:not([data-check-all])');
         var global=require('global'); 
      if(el.length>0)
      {
        var id=[];
        el.each(function(){
          id.push($(this).parents('tr').attr('data-id'));
        });
        $.dialog('是否要自动计算？', {title:'自动计算'}).yes(function(){
          $.ajax({
            type:'POST',
            dataType:'json',
           // url:config.autoCalc,
            url:global.base+'/ApiPpLiveCacheBaseConfig/autoCalc',
            data:'ids='+id.join(','),
            success:function(result){
              if(result.code==1)
              {
                $('.ppc-block tr[data-id]').remove();
                $('.ppc-block tbody').append(lang.renderTemplate('#ppclist-template',result.info));
              }
              else
              {
                alert(result.message);
              }
            },
            error:function(){alert('计算失败');}
          });
        });
      }
      else
      {
        $.alert('请选择要自动计算的记录');
        return false;
      }
    });








  function getppliveConfDataing(){
      var endash='--';
      var array=[];
      $('.ppc-block tr[data-id][data-group]').each(function(){
        if($(this).find('input:checkbox').prop('checked'))
        { 
          array.push($(this).attr('data-id')+endash+$(this).find('.ppc-start').val()+endash+$(this).find('.ppc-end').val()+endash+$(this).attr('data-group'));
        }
      });
      confData.ppc=array.join('|');
      array=[];
     
     /*
      $('.limit-block tr[data-id]').each(function(){
          array.push($(this).find('.limit-start').val()+endash+$(this).find('.limit-end').val()+endash+$(this).find('.limit-task').val()+endash+$(this).find('.limit-tasktotal').val()+endash+$(this).find('.limit-user').val()+endash+$(this).find('.limit-usertotal').val());
      
      });
      confData.limit=array.join('|');
      array=[];
      */
     
     /*
      $('.clientpool-list option').each(function(){
        array.push($(this).val());
      });
      confData.client_pool=array.join('|');
      */
      array=[];
      return confData;
    }








<!--
     /**
      *  Mr Du  2016.3.18
      *  保存   引入文件
      *  
      */
 -->

    Fuiing.on('click','.btn-set',function(){
      var global=require('global'); 
      $.ajax({
        type:'POST',
        dataType:'json',
        url:global.base+'/ApiPpLiveCacheBaseConfig/setPpcConfig',
        data:getppliveConfDataing(),
        success:function(result){
          if(result.code==1)
          {
            $.alert('保存成功');
          }
          else
          {
            alert(result.message);
          }
        },
        error:function(){alert('保存失败');}
      });
    });




<!--
     /**
      *  Mr Du  2016.3.21
      *  文件大小限制保存
      */
 -->
        $('.auto-submit').on('click', function(e){
            
            $.ajax({
                type:'POST',
                dataType:'json',
                url:global.base + '/ApiPpLiveCacheBaseConfig/setFileLimit',
                data:{'min_size':$("#min_size").val(),'max_size':$("#max_size").val()},
    
                success:function(data){
                    if(data.code==1)
                    {
                        
                    /*  //注释了
                        var html = Handlebars.compile('<form>'+$('#pplivecache-file').html()+'</form>');
                        var form=$(html(data.info));                
                        var dialog = $.dialog(form,{title:"Hi.确定更改限制大小嘛？"}).yes(function(){                   
                            $.ajax({
                                url:require('global').base + '/ApiBtCacheBaseConfig/setFileLimit',
                                data:form.serialize(),
                                type:"POST",
                                dataType:"json",
                                success: function(res){
                                    if(res.status == "success"){
                                        alert('成功');
                                        //toModule('host/btcache/conf');

                                    }

                                }
                            });
                        });*/
                    }
                    
                }
        
            }); 
        }); 




<!--
     /**
      *  Mr Du  2016.3.18
      *  进行下发此   使用setSending
      */
 -->

     lang.setSending(global.base,toModule,{url:global.base+'/ApiPpLiveCacheBaseConfig/getHostByType/type?type=2,5',rows:'info'},'device_ids',{getData:function(){return getppliveConfDataing();}});
     
    //回滚
     lang.setRollback(global.base,toModule);
  };
});






<!--
     /**
      *  Mr Du  2016.3.24 -----------
      *  以下是调用下发功能 和回滚功能 
      *  ----------------------------
      */
 -->


define('fan_lang3',function(require, exports, module){
  var global = require('global');


  //此处有用
  exports.updateHostppliveConfCache=function(){
    global.updateCache('Reg',{
      rows:[
        {id:'0',type:'服务'},
        {id:'1',type:'放行'}
      ]
    });
  };


  
  // 去掉请求的Base地址
  exports.getNoBaseUrlingp=function(url){
    return url.substring(global.base.length);
  };
  // 渲染模板  有用
  exports.renderTemplate=function(selector,value,key){
    var data={};
    key=key||'data';
    data[key]=value;
    var template = Handlebars.compile($(selector).html());
    return template(data);
  };
  // 设置面包屑导航
  exports.setSubTabDetail=function(){
    $('#subTabDetail').text($('li.active a').text());
  };

  exports.global = global;


<!--
     /**
      *  Mr Du  2016.3.24
      *  下发----------------------------
      */
 -->

  exports.setSending=function(config,toModule,item,key,data,selector,callback){
    toModule=toModule||function(){};
    item=$.extend({type:'checkbox',text:'HostName',id:'Id',value:'',rows:'rows',name:'下发设备',beforeTip:''},item);
    if(!item.url)
    {
      return false;
    }
    key=key||'Id';
    data=$.extend({getData:function(){return {};}},data);
    selector=$.extend({body:'.FUI',btn:'.btn-sending'},selector);
    callback=callback||function(){};
    $(selector.body).on('click',selector.btn,function(){
      var template = item.beforeTip+'<input type="checkbox" class="ZUI-checkbox" id="checkbox-select-all" onclick="$(\'.checkbox-select-box :checkbox\').prop({checked:this.checked});"><label for="checkbox-select-all" class="checkbox-all"><span class="ZUI-checkbox-btn"></span><span class="ZUI-checkbox-txt">全部</span></label><span class="checkbox-select-box checkbox-list">'+(global.global_show.call( item.type, '', exports.getNoBaseUrlingp(item.url), item.text, item.id, item.value, item.rows ) || '暂无'+item.name)+'</span>';
      var dialog = $.dialog(template, {title:'请选择'+item.name} ).yes(function(){
        var arr = [];
        dialog.find('.checkbox-select-box :checked').each(function(){arr.push(this.value)});
        $.extend(data,data.getData());
        data[key]=arr.join(',');
        if(!data[key])
        {
          alert('请选择'+item.name);
          return false;
        }

        $.ajax({
          type:'POST',
          dataType:'json',
          url:global.base+'/ApiPpLiveCacheBaseConfig/sendPpLiveConfig',
          data:data,
          success:function(result){
            if(result.code==1)
            {
              $.alert('下发成功').yes(function(){
                      callback();
                      toModule('host/pplivecache/conf');
                 
                  });
              
            }
            else
            {
              alert(result.message);
            }
          },
          error:function(){alert('下发失败');}
        });
        return false;
      });

    });

  };

  // 回滚
  exports.setRollback=function(config,toModule,selector,callback){
    toModule=toModule||function(){};
    selector=$.extend({body:'.FUI',btn:'.btn-rollbacking'},selector);
    callback=callback||function(){};
    $(selector.body).on('click',selector.btn,function(){
      $.dialog('是否要回滚？', {title:'回滚'}).yes(function(){
        $.ajax({
          type:'POST',
          dataType:'json',
          url:global.base+'/ApiPpLiveCacheBaseConfig/rollbackPpcConfig',
          success:function(result){
            if(result.code==1)
            {                                                         
              $.alert('回滚成功').yes(function(){

                callback();
               // toModule(config.module);
                toModule('host/pplivecache/conf');
                });  
            }
            else
            {
              alert(result.message);
            }
          },
          error:function(){alert('回滚失败');}
        });
        return false;
      });
    });
  };

});


