define("source/node/structure", function(require, exports, module){
    var global = require('global');
    var formatTemplate = Handlebars.compile('{{PName}}{{#each info}}</br>{{name}}：{{sum}}{{/each}}');

    exports.page = "pages/source/node/structure.html";
    exports.execute = function(toModule){
        seajs.use(['highmaps.min.js', 'cn-with-city.js'], function(){
            global.updateCache('/ApiProvince/listProvince');
            var hostList = global.getCache('/ApiProvince/listProvince').rows.filter(function(item){
                return item.flag;
            });
            var mapArray = Highcharts.maps['cn-with-city'];

            $('#highmaps').highcharts('Map', {
                title: {
                    text: null
                },
                credits: {
                    enabled: false
                },
                tooltip:{
                    useHTML: true,
                    enabled: true,
                    formatter: function(){
                        return formatTemplate(this.point.info ? this.point : {
                            PName: this.point.PName,
                            info : [{
                                name: "内容中心",
                                sum: 0
                            },{
                                name: "节点设备",
                                sum: 0
                            }]
                        });
                    }
                },
                series: [{
                    data: hostList,
                    mapData: mapArray,
                    joinBy: ['name', 'PName'],
                    name: 'Province List',
                    showInLegend: false,
                    events: {
                        click: function(e){
                            toModule("source/node/structure/fork:Id=" + e.point.Id);
                        }
                    },
                    states: {
                        hover: {
                            color: '#BADA55'
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}',
                        style: {
                            fontSize: '8px'
                        }
                    }
                }, ]

            }, function(map) {

            });
        });
    };
});

define("source/node/structure/fork", function(require, exports, module){
    var global = require("global");
    var Fork = require("fork");
    var imgBase = 'images/';
    var renderImg = function(forks){
        for (var i = 0; $.isArray(forks) && i < forks.length; i++) {
            forks[i].node.name = '<img src="' + imgBase + forks[i].node.name + '" alt="' + forks[i].node.name + '" />'
            renderImg(forks[i].node.fork);
        }
    };
    exports.execute = function(toModule, param){
        var T = require("T");
        var id = param.Id;
        var holder = $("#structure-fork");
        var fork = new Fork("#structure-fork");
        $.ajax({
            url: global.base + '/ApiProvince/listProvinceData',
            data: {
                pid: id,
                __t: +new Date
            },
            dataType: "json",
            success: function(res){
                renderImg(res.rows.fork);
                fork.setData(res.rows);
            }
        });

        var list = $("#structure-device-list");

        holder.on("click", "dt", function(e){
            var data = {Pagesize: 10};
            var idMap = ["pid","did","sid"];
            var items = $(this).parents("dl");
            var len = items.length - 1;
            items.children("dt").each(function(i){
                data[idMap[len - i]] = $(this).data("id");
            });
            new T(list, {
                data: data
            });
        });
        new T(list, {
            data: {pid: id, Pagesize: 10}
        });
    };
    exports.page = "pages/source/node/structure_fork.html";
});
