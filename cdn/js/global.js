define("global/base", function(require, exports, module){
    return "/index.php";
});
define("global/cache",function(require, exports, module){

    return {
        Priority: { //分发优先级
            rows:[
                {id:1,type:1},
                {id:2,type:2},
                {id:3,type:3},
                {id:4,type:4},
                {id:5,type:5}
            ]
        },
        Yes_No:{
            rows: [
                {id:"1",type:"是"},
                {id:"0",type:"否"}
            ]
        }
    };

});

define("global/effect",function(require, exports, module){
    var base = require("global/base");
    var i = 0;
    var liveList = $('[data-live]');
    var liveData = function(){
        i = (i + 1) % 10;
            liveList = $('[data-live]').filter(function(){
                var t = $(this);
                t.attr("title") || t.attr({title: t.text()});

                if( t.text().match(new RegExp(t.data("live"))) ){
                    !i ? $.ajax({
                        url: base + t.data("url"),
                        dataType: "json",
                        success: function(res){
                            t.text(res.info);
                            t.attr({title: res.info});
                        }
                    })
                    :
                    t.text(t.attr("title") + '....'.substring(0, i % 5));

                    return true;
                }else{
                    return false;
                }
            });
        setTimeout(liveData, 500);
    };
    liveData();

});

define("global",function(require, exports, module){
    var base = require("global/base"),
        cache = require("global/cache"),
        DateUtil = require("date-util"),
        NumberUtil = require("number-util"),
        show_index = 0;
    require("global/effect");

    var ajax_data = function(url){
        var data;
        $.ajax({
            async: false,
            url: base + url,
            data: {Pagesize:0,__t:+new Date},
            dataType: "json",
            success: function(json){
                if(json.code != 1){
                    $.alert(json.message);
                }else{
                    data = json;
                }
            },
            error: function(){
                alert( "服务端接口错误： " + url );
            }
        });
        return data;
    };

    var global_show = function(
        name,   /*标签name*/
        url,    /*数据来源url*/
        _type,  /*option的innerHTML, 默认为 "type" */ 
        _value, /*option的value, 默认为 "id" */
        value,  /*下拉框value*/
        _rows  /*option循环列表, 默认为 "rows" */
    ) {

        var data, rows, options = [];

        if(typeof url === 'object'){
            data = url;
        }
        else if( data = cache[url] ){
        }else{
            data = cache[url] = ajax_data(url);

        }

        _value = _value && _value.length ? _value : "id"; 
        _type  = _type && _type.length ? _type : "type"; 
        _rows  = _rows && _rows.length ? _rows : "rows";
        value = value && value.length ? value : "";
    
        if( data && (rows = data[_rows]) ){
            for (var i = 0; i < rows.length; i++) {
                var v = rows[i][_value],
                    t = rows[i][_type],
                    s = this.toString();
                switch( s ){
                    case "select": 
                        options.push( '<option value="'+v+'"'+(v==value?' selected="selected"':'')+'>'+t+'</option>' );
                        break;
                    case "radio": 
                        options.push( '<input type="radio" class="ZUI-radio" name="'+name+'" value="'+v+'"'+(v==value?' checked="checked"':'')+' id="global_show_'+show_index+'"><label for="global_show_'+show_index+'"><span class="ZUI-radio-btn"></span><span class="ZUI-radio-txt">'+t+'</span></label>' );
                        break;
                    case "checkbox": 
                       var check =  rows[i]['checked'];
                
                       options.push( '<input type="checkbox" class="ZUI-checkbox" name="'+name+'" value="'+v+'"'+(value.match(new RegExp("\\b"+v+"\\b"))?' checked="checked"':''|check == true?checked="checked":"")+' id="global_show_'+show_index+'"><label for="global_show_'+show_index+'" title="'+t+'"><span class="ZUI-checkbox-btn"></span><span class="ZUI-checkbox-txt">'+t+'</span></label>' );
                        //options.push( '<input type="checkbox" class="ZUI-checkbox" name="'+name+'" value="'+v+'"'+(value.match(new RegExp("\\b"+v+"\\b"))?' checked="checked"':'')+' id="global_show_'+show_index+'"><label for="global_show_'+show_index+'" title="'+t+'"><span class="ZUI-checkbox-btn"></span><span class="ZUI-checkbox-txt">'+t+'</span></label>' );
                        break;
                    case "":
                        options[0] = value = value.replace( new RegExp("(^|,)"+v+"(,|$)","g"), '$1'+t+'$2' );
                        break;
                }
                show_index++; // 为 radio/checkbox 添加id索引
            };
        }

        return options.join("");
    };



    Handlebars.registerHelper('_', function(i){return i+1;});
    Handlebars.registerHelper('concat', function(a,b){return a+""+b;});
    Handlebars.registerHelper('global_show_select', function(){ return global_show.apply("select", arguments) });
    Handlebars.registerHelper('global_show_radio', function(){ return global_show.apply("radio", arguments) });
    Handlebars.registerHelper('global_show_checkbox', function(){ return global_show.apply("checkbox", arguments) });
    Handlebars.registerHelper('global_show', function(){ return global_show.apply("", arguments) });
    Handlebars.registerHelper('ellipsis_number', function(i){ return parseFloat(i).toFixed(2) });   //保留两位小数
	Handlebars.registerHelper('storage_number', function(i){ return NumberUtil.toStorage(i);});	//保留两位小数
	Handlebars.registerHelper('ellipsis_word', function(w,i){if(w && w.toString().length>i){return w.substr(0,i)+"..."}else{return w} });	//截断字符串换“...”
    Handlebars.registerHelper('global_show_date', function(d, fmt){
        var date = new Date();
        date.setDate( date.getDate() + (d | 0) );
        return DateUtil.format(date, fmt||'yy-MM-dd');
    });

    var NodeSelector = function(el, callback, next){
        var t = $(el);
        var show = t.data("show") || "checkbox";
        var title = t.data("title") || "选择节点";
        var formUrl = t.data("formurl");
        var url = t.data("url") || "/ApiDepartment/listDepartment";
        next = next || t.next();

        var html = '<input type="checkbox" class="ZUI-checkbox" id="Node-listDepartment" data-check-all=".node-list-department :checkbox">\
                    <label for="Node-listDepartment" class="checkbox-all">\
                        <span class="ZUI-checkbox-btn"></span>\
                        <span class="ZUI-checkbox-txt">全部</span>\
                    </label>' + '<span class="node-list-department checkbox-list">'+global_show.call( show, "", url, "DepartName", "Id", next.val(), "rows" )+'</span>';
        var dialog = $.dialog(html, {
                title: title
            })
            .yes(function(){
                var arr = [];
                var arr1 = [];
                dialog.find('.node-list-department').find(":checked").each(function(){
                    arr.push(this.value);
                    arr1.push($(this).next().text());
                });
                
                if(typeof callback === "function"){
                    callback(arr, arr1);
                } 
                if(formUrl){
                    if(arr.length){
                        var dataArr = $(t.data("form") || "form").serializeArray();
                        dataArr.push({
                            name: t.data("name") || 'node_ids',
                            value: arr.join(",")
                        });
                        $.ajax({
                            url: base + formUrl,
                            dataType: "json",
                            data: dataArr,
                            success: function(data) {
                                alert( data.message );
                            },
                            error: function(){
                                alert("服务端错误！:" + url);
                            }
                        });
                    }else{
                        alert("请选择节点！");
                        return false;
                    }    
                }else{
                    next.val( arr.join(",") );
                    t.text( arr1.join(",") );
                }
            });
    };
    $(document).on("click", ".Node-selector", function(e){
        NodeSelector(this);
    });
	
	var HostSelector = function(el, callback, next){
        var t = $(el);
        var show = t.data("show") || "checkbox";
        var title = t.data("title") || "选择节点";
        var formUrl = t.data("formurl");
        var url = t.data("url") || "/ApiDepartment/listDepartment";
        next = next || t.next();

        var html = '<input type="checkbox" class="ZUI-checkbox" id="Node-listDepartment" data-check-all=".node-list-department :checkbox">\
                    <label for="Node-listDepartment" class="checkbox-all">\
                        <span class="ZUI-checkbox-btn"></span>\
                        <span class="ZUI-checkbox-txt">全部</span>\
                    </label>' + '<span class="node-list-department checkbox-list">'+global_show.call( show, "", url, "HostName", "Id", next.val(), "info" )+'</span>';
        var dialog = $.dialog(html, {
                title: title
            })
            .yes(function(){
                var arr = [];
                var arr1 = [];
                dialog.find('.node-list-department').find(":checked").each(function(){
                    arr.push(this.value);
                    arr1.push($(this).next().text());
                });
                
                if(typeof callback === "function"){
                    callback(arr, arr1);
                } 
                if(formUrl){
                    if(arr.length){
                        var dataArr = $(t.data("form") || "form").serializeArray();
                        dataArr.push({
                            name: t.data("name") || 'node_ids',
                            value: arr.join(",")
                        });
                        $.ajax({
                            url: base + formUrl,
                            dataType: "json",
                            data: dataArr,
                            success: function(data) {
                                alert( data.message );
                            },
                            error: function(){
                                alert("服务端错误！:" + url);
                            }
                        });
                    }else{
                        alert("请选择节点！");
                        return false;
                    }    
                }else{
                    next.val( arr.join(",") );
                    t.text( arr1.join(",") );
                }
            });
    };
	$(document).on("click", ".Host-selector", function(e){
        HostSelector(this);
    });
    
    var DeviceTemplate = Handlebars.compile('<input type="checkbox" class="ZUI-checkbox" id="Device-listDepartment" data-check-all=".device-list-department :checkbox">\
                    <label for="Device-listDepartment" class="checkbox-all">\
                        <span class="ZUI-checkbox-btn"></span>\
                        <span class="ZUI-checkbox-txt">全部</span>\
                    </label>\
                    {{#each this}}\
                    <div class="device-list-department row">\
                        <div class="col-sm-3">\
                            <input type="checkbox" class="ZUI-checkbox" id="Device-listDepartment-{{id}}" data-check-all=".device-list-department-{{id}} :checkbox">\
                            <label for="Device-listDepartment-{{id}}">\
                                <span class="ZUI-checkbox-btn"></span>\
                                <span class="ZUI-checkbox-txt">{{{global_show "Type" "/ApiHost/listHostType" "Name" "Id" id "info"}}}:</span>\
                            </label>\
                        </div>\
                        <div class="col-sm-9 checkbox-list device-list-department-{{id}}">\
                            {{{global_show_checkbox "" url "HostName" "Id" "" "info"}}}\
                        </div>\
                    </div>\
                    {{/each}}');
    // 设备分组选择
    $(document).on("click", ".Device-selector", function(e){
        var t = $(this);
        var title = t.data("title") || "选择设备";
        var url = t.data("url");
        var type = (t.data("type") ? t.data("type").toString() : "1,2,3,4,5,6,7,8").split(",");
        $.confirm(DeviceTemplate(type.map(function(item){
            return {
                id: item,
                url: "/ApiCommon/getHostByType?type=" + item
            }
        })),{
            title: title
        }).yes(function(){
            var ids = [];
            $(".device-list-department .checkbox-list :checked").each(function(){ids.push(this.value)});
            if(ids.length){
                var dataArr = $(t.data("form") || "form").serializeArray();
                dataArr.push({
                    name: t.data("name") || 'Host_Id',
                    value: ids.join(",")
                });
                $.ajax({
                    url: base + url,
                    dataType: "json",
                    data: dataArr,
                    success: function(data) {
                        alert( data.message );
                    },
                    error: function(){
                        alert("服务端错误！:" + url);
                    }
                });
            }else{
                alert("请选择设备！");
                return false;
            }

        });
    });
    
    return {
        base: base,
        getCache: function(url){
            return cache[url] ? cache[url] : (cache[url] = ajax_data(url));
        },
        updateCache: function(url, data){
            if (data) {
                cache[url] = data;
            }else {
                for(var k in cache){
                    if(k.indexOf(url) === 0){
                        delete cache[k];
                    }
                }
            }
        },
        NodeSelector: NodeSelector,
        global_show: global_show
    };








});


