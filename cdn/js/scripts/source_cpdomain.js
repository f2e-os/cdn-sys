define('source_cpdomain_config',function(require, exports, module){
	var global=require('global');
	//左侧菜单
	var config={};

	config.cpdomain={
		page:'pages/source/cpdomain/cpdomain.html',
		pageAdd:'pages/source/cpdomain/cpdomainAdd.html',
		pageEdit:'pages/source/cpdomain/cpdomainEdit.html',
		add:global.base+'/ApiDomain/addDomain',
		update:global.base+'/ApiDomain/updateDomain',
		del:global.base+'/ApiDomain/deleteDomain',
		send:global.base+'/ApiDomain/sendDomainAuth',
		get:global.base+'/ApiDomain/getDomain',
		list:global.base+'/ApiDomain/listCPDomain',
		search:global.base+'/ApiDomain/listCPDomain',
		type:global.base+'/ApiDomain/listDomainType',
		name:'CP域名',
		module:'source_cpdomain'
	};
	exports.config=config;
});

define('source_cpdomain',function(require, exports, module){
	var lang=require('fan_lang');
	var config=require('source_cpdomain_config').config;
	exports.page = config.cpdomain.page;
	// 工作模式
	Handlebars.registerHelper('source_cpdomain_DomainSign', function(value) {
		return (value && (['非签约','签约'])[value])||'-';
	});
	// 鉴权方式
	Handlebars.registerHelper('source_cpdomain_DomainAuth', function(value) {
		return (value && (['不鉴权','本地鉴权','二次鉴权'])[value])||'-';
	});
	// 状态
	Handlebars.registerHelper('source_cpdomain_Status', function(value) {
		return (value && (['去激活','激活'])[value])||'-';
	});
	exports.execute = function(toModule, param){
		var global = require("global");

		lang.setSubTabDetail();
		lang.updateSourceCpDomainCache();
		//删除
		lang.setDelOne(config.cpdomain,toModule);
		//删除多条
		lang.setDelMulti(config.cpdomain,toModule);
	};
});
define('source_cpdomain_add',function(require, exports, module){
	var lang=require('fan_lang');
	var config=require('source_cpdomain_config').config;
	exports.page = config.cpdomain.pageAdd;
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
define('source_cpdomain_edit',function(require, exports, module){
	var lang=require('fan_lang');
	var config=require('source_cpdomain_config').config;
	exports.page = config.cpdomain.pageEdit;
	// 根据鉴权方式判断加密/url是否显示
	Handlebars.registerHelper('source_cpdomain_DomainAuthDisplay', function(type,value) {
		if( value=='0' || (type=='pwd'&& value=='2') || (type=='url'&& value=='1'))
		{
			return ' style="display:none"';
		}
	});
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
