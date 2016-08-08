
//OMS 缓存策略管理
define("host/omsManage/omslist", function(require, exports, module){
    var global = require("global");

    global.updateCache("SwitchCompress",{
        rows:[
            {id:"1",type:"开"},
            {id:"0",type:"关"}
        ]
    });
    exports.page = "pages/host/omsManage/omslist.html";
    // 下发
    exports.execute = function(toModule, param) {

        $('.btn-send').on('click', function (e) {
            var checked = $('.host-distribute:checked');

            global.NodeSelector('<i></i>', function (node_ids, node_names) {
                var ids = [];
                checked.each(function (i, c) {
                    ids.push(c.value)
                });
                var data = {
                    domain_ids: ids.join(','),
                    node_ids: node_ids.join(',')
                };
                $.ajax({
                    url: global.base + '/ApiCachePolicyXml/reqCachePolicy',
                    data: data,
                    dataType: 'json',
                    success: function (res) {
                        alert(res.message);
                    },
                    error: function () {
                        alert("服务端错误");
                    }
                });
            });

        });
    }
});