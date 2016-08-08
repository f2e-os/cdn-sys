
// 缓存基本配置
define("host/cache_config", function(require, exports, module){
	var global = require("global");

	global.updateCache("ClientPooltype",{
		rows:[
            {id:"1",type:"服务"},
            {id:"0",type:"放行"}
        ]
	});

    var ClientPool, ClientPoolList, length1; 
    var FreeAddr, FreeAddrList, length2;

    var ClientPoolCompile = Handlebars.compile( '{{#each this}}<option>{{ClientPoolStartAddr}}--{{ClientPoolEndAddr}}--{{{global_show "" "ClientPooltype" "" "" ClientPooltype}}}</option>{{/each}}' );
    var FreeAddrCompile = Handlebars.compile( '{{#each this}}<option>{{FreeAddrStartAddr}}{{#if FreeAddrPortStart}}:{{FreeAddrPortStart}}{{/if}}--{{FreeAddrEndAddr}}{{#if FreeAddrPortEnd}}:{{FreeAddrPortEnd}}{{/if}}</option>{{/each}}' );


    function renderList(){
        ClientPool = $('#ClientPool');
        FreeAddr = $('#FreeAddr');
        if( ClientPoolList && FreeAddrList && ClientPool.length && FreeAddr.length ){
            if( length1 !== ClientPoolList.length ){
                length1 = ClientPoolList.length;
                ClientPool.empty().append( $( ClientPoolCompile(ClientPoolList) ) );
                $('[name=ClientPool]').val( ClientPoolList.map(function(item){
                    return item.ClientPoolStartAddr + '--' + item.ClientPoolEndAddr + '--' + item.ClientPooltype;
                }).join(',') );
            }
            if( length2 !== FreeAddrList.length ){
                length2 = FreeAddrList.length;
                FreeAddr.empty().append( $( FreeAddrCompile(FreeAddrList) ) );
                $('[name=FreeAddr]').val( FreeAddrList.map(function(item){
                    return item.FreeAddrStartAddr + ( item.FreeAddrPortStart ? (':' + item.FreeAddrPortStart) : '' ) + '--' + item.FreeAddrEndAddr + ( item.FreeAddrPortEnd ? (':' + item.FreeAddrPortEnd) : '');
                }).join(',') );
            }
        }
        setTimeout( renderList, 200);
    };
    renderList();

	exports.page = "pages/host/cache_config.html";
    exports.execute = function(toModule){
        ClientPoolList = []; 
        FreeAddrList = [];
        length1 = length2 = 0;

        $.ajax({
            url:  global.base + '/ApiCacheBaseConfig/getCacheBaseConfig',
            dataType: "json",
            success: function(res){
                ClientPoolList = res.info.ClientPool;
                FreeAddrList = res.info.FreeAddr;
            }
        });

        // 增加
        $('.host').on('submit', '.form-ClientPool', function(e){
            e.preventDefault();
            ClientPoolList.push( $(this).serializeObject() );
            this.reset();
        });
        // 增加
        $('.host').on('submit', '.form-FreeAddr', function(e){
            e.preventDefault();
            FreeAddrList.push( $(this).serializeObject() );
            this.reset();
        });
        //删除
        $('.btn-delete-ClientPool').on('click', function(e){
            var arr = [];
            ClientPool.children(':selected').each(function(){
                arr.push( this.index );
            });
            for (var i = arr.length - 1; i >= 0; i--) {
                ClientPoolList.splice(arr[i],1);
            };
        });
        //删除
        $('.btn-delete-FreeAddr').on('click', function(e){
            var arr = [];
            FreeAddr.children(':selected').each(function(){
                arr.push( this.index );
            });
            for (var i = arr.length - 1; i >= 0; i--) {
                FreeAddrList.splice(arr[i],1);
            };
        });

        $(".host form").on("click", ".btn-rollback", function(e){
            $.confirm("确定要回滚缓存？").yes(function(){
                $.ajax({
                    url: global.base + '/ApiCacheBaseConfig/rollCacheBaseConfig',
                    dataType: "json",
                    success: function(json){
                        alert( json.message );
                    },
                    error: function(){
                        alert("服务端错误!");
                    }
                });
            });
        });
    };
});

