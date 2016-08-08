define('source_cp_config',function(require, exports, module){
	var global=require('global');
	//左侧菜单
	var config={};
	config.menu = [];
	config.cp={
		page:'pages/source/cp/index.html',
		add:global.base+'/ApiDomainGroup/addDomainGroup',
		update:global.base+'/ApiDomainGroup/updateDomainGroup',
		del:global.base+'/ApiDomainGroup/deleteDomainGroup',
		get:global.base+'/ApiDomainGroup/getDomainGroup',
		list:global.base+'/ApiDomainGroup/listDomainGroup',
		search:global.base+'/ApiDomainGroup/listDomainGroup',
		name:'CP',
		module:'source_cp'
	};
	config.domain={
		page:'pages/source/cp/domain.html',
		pageAdd:'pages/source/cp/domainAdd.html',
		pageEdit:'pages/source/cp/domainEdit.html',
		//pageForm:'pages/source/cp/domainForm.html',
		add:global.base+'/ApiDomain/addDomain',
		update:global.base+'/ApiDomain/updateDomain',
		del:global.base+'/ApiDomain/deleteDomain',
		send:global.base+'/ApiDomain/sendDomainAuth',
		get:global.base+'/ApiDomain/getDomain',
		list:global.base+'/ApiDomain/listDomain',
		search:global.base+'/ApiDomain/listDomain',
		type:global.base+'/ApiDomain/listDomainType',
		name:'域名',
		module:'source_cp_domain'
	};
	config.domaingroup={
		page:'pages/source/cp/domaingroup.html',
		pageAdd:'pages/source/cp/domaingroupAdd.html',
		pageEdit:'pages/source/cp/domaingroupEdit.html',
		add:global.base+'/ApiDomainChannel/addDomainChannel',
		update:global.base+'/ApiDomainChannel/updateDomainChannel',
		del:global.base+'/ApiDomainChannel/deleteDomainChannel',
		get:global.base+'/ApiDomainChannel/getDomainChannel',
		list:global.base+'/ApiDomainChannel/listDomainChannel',
		search:global.base+'/ApiDomainChannel/listDomainChannel',
		cache:global.base+'/ApiDomainChannel/listCachePriority',
		service:global.base+'/ApiDomainChannel/listServicePriority',
		name:'域名组',
		module:'source_cp_domaingroup'
	};
	exports.config=config;
});
define('source_cp',function(require, exports, module){
	var lang=require('fan_lang');
	var config=require('source_cp_config').config;
	exports.menu = config.menu;
	exports.page = config.cp.page;
	exports.execute = function(toModule, param){
		lang.setSubTabDetail();
		//添加
		$('.btn-add').on('click',function(){
			var template = Handlebars.compile('<form>'+$('#form-template').html()+'</form>');
			var form=$(template({}));
			$.dialog(form, {title:'添加'+config.cp.name}).yes(function(){
				$.ajax({
					type:'POST',
					dataType:'json',
					url:config.cp.add,
					data:form.serialize(),
					success:function(result){
						if(result.code==1)
						{
							$.alert('添加成功').yes(function(){lang.updateCache(config.cp.list);toModule(config.cp.module);});
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
				url:config.cp.get,
				data:'Id='+id,
				success:function(data){
					if(data.code==1)
					{
						var template = Handlebars.compile('<form>'+$('#form-template').html()+'</form>');
						var form=$(template(data.info));
						$.dialog(form, {title:'修改'+config.cp.name}).yes(function(){
							$.ajax({
								type:'POST',
								dataType:'json',
								url:config.cp.update,
								data:form.serialize(),
								success:function(result){
									if(result.code==1)
									{
										$.alert('修改成功').yes(function(){lang.updateCache(config.cp.list);toModule(config.cp.module);});
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
		lang.setDelOne(config.cp,toModule,undefined,function(){lang.updateCache(config.cp.list)});
		//删除多条
		lang.setDelMulti(config.cp,toModule,undefined,function(){lang.updateCache(config.cp.list)});
	};
});
define('source_cp_domain',function(require, exports, module){
	var lang=require('fan_lang');
	var config=require('source_cp_config').config;
	exports.menu = config.menu;
	exports.page = config.domain.page;
	// 工作模式
	Handlebars.registerHelper('source_cp_domain_DomainSign', function(value) {
		return (value && (['非签约','签约'])[value])||'-';
	});
	// 鉴权方式
	Handlebars.registerHelper('source_cp_domain_DomainAuth', function(value) {
		return (value && (['不鉴权','本地鉴权','二次鉴权'])[value])||'-';
	});
	// 状态
	Handlebars.registerHelper('source_cp_domain_Status', function(value) {
		return (value && (['去激活','激活'])[value])||'-';
	});
	exports.execute = function(toModule, param){
		var global = require("global");

		lang.setSubTabDetail();
		lang.updateSourceCpDomainCache();
		//删除
		lang.setDelOne(config.domain,toModule);
		//删除多条
		lang.setDelMulti(config.domain,toModule);

		// 鉴权下发
		$('.btn-send').on('click', function(e){
			var checked = $('.host-distribute:checked');
			if( checked.length ){
	            global.NodeSelector('<i></i>', function(node_ids, node_names){
	            	var ids = [];
	                checked.each(function(i,c){ ids.push( c.value ) });
	                var data = {
	                	domain_ids: ids.join(','),
	                	node_ids: node_ids.join(',')
	            	};
	            	$.ajax({
	            		url: global.base + '/ApiDomain/sendDomainAuth',
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
	        }else{
	           $.alert("请选择要下发的域名", {
	           	title: '需要选择',
	           	width: 450
	           });
	        }
		});
		
		// 关闭鉴权
		$('.btn-sendClose').on('click', function(e){
			var checked = $('.host-distribute:checked');
			
	            global.NodeSelector('<i></i>', function(node_ids, node_names){
	            	var ids = [];
	                checked.each(function(i,c){ ids.push( c.value ) });
	                var data = {
	                	domain_ids: ids.join(','),
	                	node_ids: node_ids.join(',')
	            	};
	            	$.ajax({
	            		url: global.base + '/ApiDomain/sendDomainAuthClose',
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
	};
});
define('source_cp_domain_add',function(require, exports, module){
	var lang=require('fan_lang');
	var config=require('source_cp_config').config;
	exports.menu = config.menu;
	exports.page = config.domain.pageAdd;
	exports.execute = function(toModule, param){
		lang.setSubTabDetail();
		lang.updateSourceCpDomainCache();
		$('input[name=DomainAuth]').on('change',function(){
			switch(this.value)
			{
				case '1':
					$('#DomainAuthInput').show();
					$('#DomainAuthInputName1').show();
					$('#DomainAuthInputName2').hide();
					break;
				case '2':
					$('#DomainAuthInput').show();
					$('#DomainAuthInputName1').hide();
					$('#DomainAuthInputName2').show();
					break;
				default:
					$('#DomainAuthInput').hide();
					$('input[name=AuthPwd]').val('');
			};
		}).change();
	};
});
define('source_cp_domain_edit',function(require, exports, module){
	var lang=require('fan_lang');
	var config=require('source_cp_config').config;
	exports.menu = config.menu;
	exports.page = config.domain.pageEdit;
	// 根据鉴权方式判断加密/url是否显示
	Handlebars.registerHelper('source_cp_domain_DomainAuthDisplay', function(type,value) {
		if( value=='0' || (type=='pwd'&& value=='2') || (type=='url'&& value=='1'))
		{
			return ' style="display:none"';
		}
	});
	// 设置选中状态
	// Handlebars.registerHelper('source_cp_checked', function(value,checkedValue) {
	// 	checkedValue=checkedValue||1;
	// 	if( value==checkedValue)
	// 	{
	// 		return ' checked="checked"';
	// 	}
	// });
	exports.execute = function(toModule, param){
		param.Id||toModule(config.domain.module);
		lang.setSubTabDetail();
		lang.updateSourceCpDomainCache();
		$('.panel form').on('click','#DomainAuth .radioBox label',function(){
			switch($('#'+$(this).attr('for')).val())
			{
				case '1':
					$('#DomainAuthInput').show();
					$('#DomainAuthInputName1').show();
					$('#DomainAuthInputName2').hide();
					break;
				case '2':
					$('#DomainAuthInput').show();
					$('#DomainAuthInputName1').hide();
					$('#DomainAuthInputName2').show();
					break;
				default:
					$('#DomainAuthInput').hide();
					$('input[name=AuthPwd]').val('');
			};
		});
	};
});
/*
define('source_cp_domain_form',function(require, exports, module){
	var lang=require('fan_lang');
	var config=require('source_cp_config').config;
	exports.menu = config.menu;
	exports.page = config.domain.pageForm;
	exports.execute = function(toModule, param){
		var record={};
		param.id||toModule(config.domain.module);
		if(param.type=='update' && param.id>0)
		{
			param.typeText='修改';
			lang.loadInfo(record,config.domain.get,'Id='+param.id);
		}
		else
		{
			param.typeText='添加';
		}

		$('input[name=DomainAuth]').on('change',function(){
			switch(this.value)
			{
				case '1':
					$('#DomainAuthInput').show();
					$('#DomainAuthInputName1').show();
					$('#DomainAuthInputName2').hide();
					break;
				case '2':
					$('#DomainAuthInput').show();
					$('#DomainAuthInputName1').hide();
					$('#DomainAuthInputName2').show();
					break;
				default:
					$('#DomainAuthInput').hide();
			}
		}).change();
		//提交
		$('#form-submit').on('click',function(){
			$.ajax({
				type:'POST',
				dataType:'json',
				url:config.domain.add,
				data:$(this).parents('form').serialize(),
				success:function(result){
					if(result.code==1)
					{
						$.alert(param.typeText+'成功').yes(function(){toModule(config.domain.module);});
					}
					else
					{
						alert(result.message);
					}
				},
				error:function(){alert(param.typeText+'失败');}
			});
		});
		console.log(param);
	};
});
*/
define('source_cp_domaingroup',function(require, exports, module){
	var lang=require('fan_lang');
	var config=require('source_cp_config').config;
	exports.menu = config.menu;
	exports.page = config.domaingroup.page;
	// 回源策略
	Handlebars.registerHelper('source_cp_domaingroup_SourceStrategy', function(value) {
		return (value && (['回源路由','默认路由'])[value])||'-';
	});
	exports.execute = function(toModule, param){
		lang.setSubTabDetail();
		lang.updateSourceCpDomaingroupCache();

		//删除
		lang.setDelOne(config.domaingroup,toModule);
		//删除多条
		lang.setDelMulti(config.domaingroup,toModule);
	};
});
define('source_cp_domaingroup_add',function(require, exports, module){
	var lang=require('fan_lang');
	var config=require('source_cp_config').config;
	exports.menu = config.menu;
	exports.page = config.domaingroup.pageAdd;
	exports.execute = function(toModule, param){
		lang.setSubTabDetail();
		lang.updateSourceCpDomaingroupCache();
		lang.showDomainSelect(config.domain);
	};
});
define('source_cp_domaingroup_edit',function(require, exports, module){
	var lang=require('fan_lang');
	var config=require('source_cp_config').config;
	exports.menu = config.menu;
	exports.page = config.domaingroup.pageEdit;
	exports.execute = function(toModule, param){
		param.Id||toModule(config.domaingroup.module);
		lang.setSubTabDetail();
		lang.updateSourceCpDomaingroupCache();
		lang.showDomainSelect(config.domain);
	};
});