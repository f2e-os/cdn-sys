define('fan_lang',function(require, exports, module){
	var global = require('global');
	exports.updateSourceCpDomainCache=function(){
		global.updateCache('DomainSign',{
			rows:[
				{id:'1',type:'签约合作加速模式'},
				{id:'0',type:'非签约强制加速模式'}
			]
		});
		global.updateCache('DomainAuth',{
			rows:[
				{id:'1',type:'本地鉴权'},
				{id:'2',type:'二次鉴权'},
				{id:'0',type:'不鉴权'}
			]
		});
		global.updateCache('GuardChain',{
			rows:[
				{id:'1',type:'是'},
				{id:'0',type:'否'}
			]
		});
		global.updateCache('Status',{
			rows:[
				{id:'1',type:'激活'},
				{id:'0',type:'去激活'}
			]
		});
		global.updateCache('/ApiDomain/listDomainStrategy?is_trace=0');
		global.updateCache('/ApiDomain/listDomainStrategy?is_trace=1');
		global.updateCache('/ApiDomain/listDomain');
	};
	exports.updateSourceCpDomaingroupCache=function(){
		global.updateCache('SourceStrategy',{
			rows:[
				{id:'0',type:'回源路由'},
				{id:'1',type:'默认路由'}
			]
		});
		global.updateCache('/ApiDomainChannel/listDomainChannel');
	};
	exports.updateHostHttpcacheFileCache=function(){
		global.updateCache('Proxy',{
			rows:[
				{id:'0',type:'热点模式'},
				{id:'1',type:'代理模式'}
			]
		});
		global.updateCache('CheckPolicy',{
			rows:[
				{id:'1',type:'白名单'},
				{id:'2',type:'黑名单'}
			]
		});
		global.updateCache('CheckRefer',{
			rows:[
				{id:'0',type:'不验证'},
				{id:'1',type:'验证'}
			]
		});
	};
	exports.updateHostHttpcacheConfCache=function(){
		global.updateCache('Reg',{
			rows:[
				{id:'0',type:'服务'},
				{id:'1',type:'放行'}
			]
		});
	};
	exports.updateHostTraceCache=function(){
		global.updateCache('ProbeType',{
			rows:[
				{id:'0',type:'默认'},
				{id:'1',type:'打文件'},
				{id:'2',type:'https'},
				{id:'3',type:'不探测'}
			]
		});
		global.updateCache('StrategyType',{
			rows:[
				{id:'0',type:'不采用策略'},
				{id:'1',type:'主备'},
				{id:'2',type:'轮询'}
			]
		});
	};
	// 去掉请求的Base地址
	exports.getNoBaseUrl=function(url){
		return url.substring(global.base.length);
	};
	// 渲染模板
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
	// 更新缓存
	exports.updateCache=function(url){
		global.updateCache(exports.getNoBaseUrl(url));
	};
	///获取global by wf
	exports.global = global;
	//end
	// 显示域名选择弹框
	exports.showDomainSelect=function(config){
		$('.source-cp form').on('click','input[name=ParentDomain]',function(){
			var t = $(this);
			var ids = t.parent().find('input[name=ParentDomainId]');
			var url = config.list+'?Pagesize=0&CPId='+$('.source-cp form select[name=CPId]').val();
			var template = '<input type="checkbox" class="ZUI-checkbox" id="checkbox-select-all" onclick="$(\'.checkbox-select-box :checkbox\').prop({checked:this.checked});"><label for="checkbox-select-all" class="checkbox-all"><span class="ZUI-checkbox-btn"></span><span class="ZUI-checkbox-txt">全部</span></label><span class="checkbox-select-box checkbox-list">'+(global.global_show.call( 'checkbox', '', exports.getNoBaseUrl(url), 'DomainName', 'Id', ids.val(), 'rows' ) || '暂无'+config.name)+'</span>';
			exports.updateCache(url);
			var dialog = $.dialog( template, {title:'选择'+config.name} )
			.yes(function(){
				var value = [];
				var text = [];
				dialog.find('.checkbox-select-box :checked').each(function(){
					var el=$(this);
					value.push(el.val());
					text.push(el.parent().find('[for='+el.attr('id')+'] .ZUI-checkbox-txt').text());
				});
				t.val( text.join(",") ).attr('title',text.join(","));
				ids.val( value.join(",") );
			});
		});
	};
	// 删除单条记录
	exports.setDelOne=function(config,toModule,key,callback){
		key=key||'Id';
		callback=callback||function(){};
		$('.table-holder').on('click','.list-del',function(){
			var parent=$(this).parents('tr');
			var id=parent.attr('data-ID');
			if(!id) return false;
			$.dialog('是否要删除？', {title:'删除'+config.name}).yes(function(){
				$.ajax({
					type:'POST',
					dataType:'json',
					url:config.del,
					data:key+'='+id,
					success:function(result){
						if(result.code==1)
						{
							$.alert('删除成功').yes(function(){callback();toModule(config.module);});
						}
						else
						{
							alert(result.message);
						}
					},
					error:function(){alert('删除失败');}
				});
				return false;
			});
		});
	};
	// 删除多条记录
	exports.setDelMulti=function(config,toModule,key,callback){
		key=key||'Id';
		callback=callback||function(){};
		$('.panel .btn-del').on('click',function(){
			var checkbox=$('.table-holder input.host-distribute:checkbox:checked');
			var id='';
			checkbox.each(function(){
				id+=','+this.value;
			});
			id=id.substring(1);
			if(!id) 
			{
				$.alert('请选择要删除的记录');
				return false;
			}
			$.dialog('是否要删除？', {title:'删除'+config.name}).yes(function(){
				$.ajax({
					type:'POST',
					dataType:'json',
					url:config.del,
					data:key+'='+id,
					success:function(result){
						if(result.code==1)
						{
							$.alert('删除成功').yes(function(){callback();toModule(config.module);});
						}
						else
						{
							alert(result.message);
						}
					},
					error:function(){alert('删除失败');}
				});
				return false;
			});
		});
	};
	// 下发
	exports.setSend=function(config,toModule,item,key,data,selector,callback){
		toModule=toModule||function(){};
		item=$.extend({type:'checkbox',text:'HostName',id:'Id',value:'',rows:'rows',name:'下发设备',beforeTip:''},item);
		if(!item.url)
		{
			return false;
		}
		key=key||'Id';
		data=$.extend({getData:function(){return {};}},data);
		selector=$.extend({body:'.FUI',btn:'.btn-send'},selector);
		callback=callback||function(){};
		$(selector.body).on('click',selector.btn,function(){
			var template = item.beforeTip+'<input type="checkbox" class="ZUI-checkbox" id="checkbox-select-all" onclick="$(\'.checkbox-select-box :checkbox\').prop({checked:this.checked});"><label for="checkbox-select-all" class="checkbox-all"><span class="ZUI-checkbox-btn"></span><span class="ZUI-checkbox-txt">全部</span></label><span class="checkbox-select-box checkbox-list">'+(global.global_show.call( item.type, '', exports.getNoBaseUrl(item.url), item.text, item.id, item.value, item.rows ) || '暂无'+item.name)+'</span>';
			var dialog = $.dialog( template, {title:'请选择'+item.name} ).yes(function(){
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
					url:config.send,
					data:data,
					success:function(result){
						if(result.code==1)
						{
							$.alert('下发成功').yes(function(){callback();toModule(config.module);});
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
		selector=$.extend({body:'.FUI',btn:'.btn-rollback'},selector);
		callback=callback||function(){};
		$(selector.body).on('click',selector.btn,function(){
			$.dialog('是否要回滚？', {title:'回滚'}).yes(function(){
				$.ajax({
					type:'POST',
					dataType:'json',
					url:config.rollback,
					success:function(result){
						if(result.code==1)
						{
							$.alert('回滚成功').yes(function(){callback();toModule(config.module);});
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
/*
	exports.cache={};
	exports.loadCache=function(name,url){
		$.ajax({
			type:'POST',
			dataType:'json',
			async:false,
			url:url,
			success:function(result){
				if(result.code==1)
				{
					exports.cache[name]=result.rows;
				}
				else
				{
					alert(result.message);
				}
			},
			error:function(){alert('加载数据失败');}
		});
	};
	exports.loadInfo=function(record,url,data,info,type){
		data=data||null;
		type=type||'POST';
		info=info||'info';
		$.ajax({
			type:type,
			dataType:'json',
			async:false,
			url:url,
			data:data,
			success:function(result){
				if(result.code==1)
				{
					$.extend(record, result[info]);
				}
				else
				{
					alert(result.message);
				}
			},
			error:function(){alert('加载数据失败');}
		});
	};

	exports.renderOption=function(data,key,text,value){
		var html='';
		for (var i = 0; i < data.length; i++) {
			html+='<option value="'+data[i][key]+'"'+(data[i][key]==value?' selected="selected"':'')+'>'+data[i][text]+'</option>';
		};
		return html;
	};
*/
});
define('host_httpcache_config',function(require, exports, module){
	var global=require('global');
	//左侧菜单
	var config={};
	config.menu = [
	];
	config.group={
		page:'pages/host/httpcache/index.html',
		pageAdd:'pages/host/httpcache/groupAdd.html',
		pageEdit:'pages/host/httpcache/groupEdit.html',
		add:global.base+'/ApiHttpCache/addHostGroup',
		update:global.base+'/ApiHttpCache/updateHostGroup',
		del:global.base+'/ApiHttpCache/deleteHostGroup',
		get:global.base+'/ApiHttpCache/getHostGroup',
		list:global.base+'/ApiHttpCache/listHostGroup',
		search:global.base+'/ApiHttpCache/listHostGroup',
		host:global.base+'/ApiHttpCache/listHost',
		name:'PPC分组',
		module:'host_httpcache'
	};
	config.conf={
		page:'pages/host/httpcache/conf.html',
		set:global.base+'/ApiHttpCachePpc/setPpcConfig',
		send:global.base+'/ApiHttpCachePpc/sendPpcConfig',
		rollback:global.base+'/ApiHttpCachePpc/rollbackPpcConfig',
		get:global.base+'/ApiHttpCachePpc/getPpcConfig',
		autoCalc:global.base+'/ApiHttpCachePpc/autoCalc',
		type:global.base+'/ApiCommon/getHostByType?type=2,5',
		name:'PPC配置',
		module:'host_httpcache_conf'
	};
	config.file={
		page:'pages/host/httpcache/file.html',
		pageAdd:'pages/host/httpcache/fileAdd.html',
		pageEdit:'pages/host/httpcache/fileEdit.html',
		add:global.base+'/ApiHttpCache/addFileExt',
		update:global.base+'/ApiHttpCache/updateFileExt',
		del:global.base+'/ApiHttpCache/deleteFileExt',
		send:global.base+'/ApiHttpCache/sendFileExt',
		rollback:global.base+'/ApiHttpCache/rollbackFileExt',
		get:global.base+'/ApiHttpCache/getFileExt',
		list:global.base+'/ApiHttpCache/listFileExt',
		search:global.base+'/ApiHttpCache/listFileExt',
		group:global.base+'/ApiHttpCache/listHostGroup',
		type:global.base+'/ApiCommon/getHostByType?type=5',
		name:'文件配置',
		module:'host_httpcache_file'
	};
	config.domain={
		page:'pages/host/httpcache/domain.html',
		add:global.base+'/ApiHttpCache/addDomainPass',
		update:global.base+'/ApiHttpCache/updateDomainPass',
		del:global.base+'/ApiHttpCache/deleteDomainPass',
		send:global.base+'/ApiHttpCache/sendDomainPass',
		rollback:global.base+'/ApiHttpCache/rollbackDomainPass',
		get:global.base+'/ApiHttpCache/getDomainPass',
		list:global.base+'/ApiHttpCache/listDomainPass',
		search:global.base+'/ApiHttpCache/listDomainPass',
		type:global.base+'/ApiCommon/getHostByType?type=5',
		name:'基于域名放行',
		module:'host_httpcache_domain'
	};
	config.cache={
		page:'pages/host/httpcache/cache.html',
		set:global.base+'/ApiHttpCache/setFileLimit',
		send:global.base+'/ApiHttpCache/sendFileLimit',
		rollback:global.base+'/ApiHttpCache/rollbackFileLimit',
		get:global.base+'/ApiHttpCache/getFileLimit',
		type:global.base+'/ApiCommon/getHostByType?type=2,5',
		name:'HTTP缓存文件大小',
		module:'host_httpcache_cache'
	};
	exports.config=config;
});

define('host_httpcache',function(require, exports, module){
	var lang=require('fan_lang');
	var config=require('host_httpcache_config').config;
	exports.menu = config.menu;
	exports.page = config.group.page;
	exports.execute = function(toModule, param){
		lang.global.updateCache('/ApiHttpCache/listHost');
		lang.setSubTabDetail();
		//删除
		lang.setDelOne(config.group,toModule,'group_id');
		//删除多条
		lang.setDelMulti(config.group,toModule,'group_id');
	};
});
define('host_httpcache_add',function(require, exports, module){
	var lang=require('fan_lang');
	var config=require('host_httpcache_config').config;
	exports.menu = config.menu;
	exports.page = config.group.pageAdd;
	exports.execute = function(toModule, param){
		lang.setSubTabDetail();
	};
});
define('host_httpcache_edit',function(require, exports, module){
	var lang=require('fan_lang');
	var config=require('host_httpcache_config').config;
	exports.menu = config.menu;
	exports.page = config.group.pageEdit;
	exports.execute = function(toModule, param){
		param.group_id||toModule(config.group.module);
		lang.setSubTabDetail();
	};
});
//host_httpcache_conf
define('host_httpcache_conf',function(require, exports, module){
	var lang=require('fan_lang');
	lang.updateHostHttpcacheConfCache();
	var config=require('host_httpcache_config').config;
	exports.menu = config.menu;
	exports.page = config.conf.page;
	// 用户网段规则
	Handlebars.registerHelper('host_httpcache_Conf_Reg', function(value) {
		return (value && (['服务','放行'])[value])||'-';
	});
	// 设备组
	Handlebars.registerHelper('host_httpcache_Conf_ppcList', function(value) {
		return lang.renderTemplate('#ppclist-template',value);
	});
	// 限速配置
	Handlebars.registerHelper('host_httpcache_Conf_limitList', function(value) {
		return lang.renderTemplate('#limitlist-template',value);
	});
	// 用户网段
	Handlebars.registerHelper('host_httpcache_Conf_clientpoolOption', function(value) {
		return lang.renderTemplate('#clientpooloption-template',value);
	});
	exports.execute = function(toModule, param){
		var confData={ppc:null,limit:null,client_pool:null};
		lang.setSubTabDetail();
		var Fui=$('.FUI');

		//清除设备组缓存 
		lang.global.updateCache("/ApiHttpCache/listHostGroup");
		//控制设备组的勾选状态
		Fui.on('change','.ppc-group input:checkbox',function(){
			var checkbox=$(this);
			$('.ppc-block tr[data-group='+checkbox.val()+'] input:checkbox').prop('checked',checkbox.prop('checked'));
		});
		//设备组自动计算
		Fui.on('click','.btn-autoCalc',function(){
			var el=$('.ppc-block input:checkbox:checked:not([data-check-all])');
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
						url:config.conf.autoCalc,
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
		//添加限速配置
		Fui.on('click','.btn-add-limit',function(){
			var tbody=$('.limit-block tbody');
			var index=window.parseInt((tbody.children('tr:last').attr('data-ID'))||0,10)+1;
			$('.limit-block tbody').append(lang.renderTemplate('#limittr-template',{index:index}));
		});
		//删除限速配置
		Fui.on('click','.btn-del-limit',function(){
			var el=$('.limit-block input:checkbox:checked:not([data-check-all])');
			if(el.length>0)
			{
				$.dialog('是否要删除？', {title:'删除'}).yes(function(){
					el.parents('tr').remove();
				});
			}
			else
			{
				$.alert('请选择要删除的记录');
				return false;
			}
		});
		//添加用户网段
		Fui.on('click','.btn-add-clientpool',function(){
			var	data={
				start_ip:$('.clientpool-start').val(),
				end_ip:$('.clientpool-end').val(),
				reg:$('.clientpool-reg').val()
			};
			$('.clientpool-list').append(lang.renderTemplate('#clientpooloption-template',[data]));
		});
		//删除用户网段
		Fui.on('click','.btn-del-clientpool',function(){
			var el=$('.clientpool-list option:selected');
			if(el.length>0)
			{
				$.dialog('是否要删除？', {title:'删除'}).yes(function(){
					el.remove();
				});
			}
			else
			{
				$.alert('请选择要删除的记录');
				return false;
			}
		});
		function getConfData(){
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
			$('.limit-block tr[data-id]').each(function(){
				//if($(this).find('input:checkbox').prop('checked'))
				//{	
					array.push($(this).find('.limit-start').val()+endash+$(this).find('.limit-end').val()+endash+$(this).find('.limit-task').val()+endash+$(this).find('.limit-tasktotal').val()+endash+$(this).find('.limit-user').val()+endash+$(this).find('.limit-usertotal').val());
				//}
			});
			confData.limit=array.join('|');
			array=[];
			$('.clientpool-list option').each(function(){
				array.push($(this).val());
			});
			confData.client_pool=array.join('|');
			array=[];
			return confData;
		}
		// 保存
		Fui.on('click','.btn-set',function(){
			$.ajax({
				type:'POST',
				dataType:'json',
				url:config.conf.set,
				data:getConfData(),
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
		//下发
		lang.setSend(config.conf,toModule,{url:config.conf.type,rows:'info'},'device_ids',{getData:function(){return getConfData();}});
		//回滚
		lang.setRollback(config.conf,toModule);
	};
});

define('host_httpcache_file',function(require, exports, module){
	var lang=require('fan_lang');
	var config=require('host_httpcache_config').config;
	exports.menu = config.menu;
	exports.page = config.file.page;
	// 工作方式
	Handlebars.registerHelper('host_httpcache_file_Proxy', function(value) {
		return (value && (['热点模式','代理模式'])[value])||'-';
	});
	// 缺省动作
	Handlebars.registerHelper('host_httpcache_file_CheckPolicy', function(value) {
		return (value && (['','白名单','黑名单'])[value])||'-';
	});
	// 验证refer
	Handlebars.registerHelper('host_httpcache_file_CheckRefer', function(value) {
		return (value && (['不验证','验证'])[value])||'-';
	});
	exports.execute = function(toModule, param){
		lang.setSubTabDetail();
		//删除
		lang.setDelOne(config.file,toModule,'file_ext_id');
		//删除多条
		lang.setDelMulti(config.file,toModule,'file_ext_id');
		//下发
		lang.setSend(config.file,toModule,{url:config.file.type,rows:'info'},'device_ids');
		//回滚
		lang.setRollback(config.file,toModule);
	};
});
define('host_httpcache_file_add',function(require, exports, module){
	var lang=require('fan_lang');
	lang.updateHostHttpcacheFileCache();
	var config=require('host_httpcache_config').config;
	exports.menu = config.menu;
	exports.page = config.file.pageAdd;
	exports.execute = function(toModule, param){
		lang.global.updateCache("/ApiHttpCache/listHostGroup");
		lang.setSubTabDetail();
	};
});
define('host_httpcache_file_edit',function(require, exports, module){
	var lang=require('fan_lang');
	lang.updateHostHttpcacheFileCache();
	var config=require('host_httpcache_config').config;
	exports.menu = config.menu;
	exports.page = config.file.pageEdit;
	exports.execute = function(toModule, param){
		lang.global.updateCache("/ApiHttpCache/listHostGroup");
		param.file_ext_id||toModule(config.file.module);
		lang.setSubTabDetail();
	};
});
define('host_httpcache_domain',function(require, exports, module){
	var lang=require('fan_lang');
	var config=require('host_httpcache_config').config;
	exports.menu = config.menu;
	exports.page = config.domain.page;
	exports.execute = function(toModule, param){
		lang.setSubTabDetail();
		//添加
		$('.btn-add').on('click',function(){
			var template = Handlebars.compile('<form>'+$('#form-template').html()+'</form>');
			var form=$(template({}));
			$.dialog(form, {title:'添加'+config.domain.name}).yes(function(){
				$.ajax({
					type:'POST',
					dataType:'json',
					url:config.domain.add,
					data:form.serialize(),
					success:function(result){
						if(result.code==1)
						{
							$.alert('添加成功').yes(function(){toModule(config.domain.module);});
						}
						else
						{
							alert(result.message);
						}
					},
					error:function(){alert('添加失败');}
				});
				return false;
			});
		});
		//更新
		$('.table-holder').on('click','.list-update',function(){
			var parent=$(this).parents('tr');
			var id=parent.attr('data-ID');
			if(!id) return false;
			$.ajax({
				type:'GET',
				dataType:'json',
				url:config.domain.get,
				data:'host_id='+id,
				success:function(data){
					if(data.code==1)
					{
						var template = Handlebars.compile('<form>'+$('#form-template').html()+'</form>');
						var form=$(template(data.rows[0]));
						$.dialog(form, {title:'修改'+config.domain.name}).yes(function(){
							$.ajax({
								type:'POST',
								dataType:'json',
								url:config.domain.update,
								data:form.serialize(),
								success:function(result){
									if(result.code==1)
									{
										$.alert('修改成功').yes(function(){toModule(config.domain.module);});
									}
									else
									{
										alert(result.message);
									}
								},
								error:function(){alert('修改失败');}
							});
							return false;
						});
					}
					else
					{
						alert(data.message);
					}
				},
				error:function(){alert('获取信息失败');}
			});

		});
		//删除
		lang.setDelOne(config.domain,toModule,'host_id');
		//删除多条
		lang.setDelMulti(config.domain,toModule,'host_id');
		//下发
		lang.setSend(config.domain,toModule,{url:config.domain.type,rows:'info',beforeTip:'<div class="dialog-beforeTip">当设备故障时，选择框不可选中</div>'},'device_ids');
		//回滚
		lang.setRollback(config.domain,toModule);
	};
});
define('host_httpcache_cache',function(require, exports, module){
	var lang=require('fan_lang');
	var config=require('host_httpcache_config').config;
	exports.menu = config.menu;
	exports.page = config.cache.page;
	exports.execute = function(toModule, param){
		lang.setSubTabDetail();
		//下发
		lang.setSend(config.cache,toModule,{url:config.cache.type,rows:'info'},'device_ids',{getData:function(){return {file_min:$('input[name=file_min]').val(),file_max:$('input[name=file_max]').val()};}});
		//回滚
		lang.setRollback(config.cache,toModule);
	};
});