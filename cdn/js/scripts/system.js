define("sys-config",function(require,exports,module){
    var global = require("global"),
    urlBasePath = global.base,
    config = {};

    config.menu = [];

    config.router = {
        index: "system",
        add: "system_user_add",
        edit: "system_user_edit",
        group: "system_user_group"
    };

    config.urls = {
        getUser: urlBasePath+"/ApiSystem/getUser",
        getUsers: urlBasePath+"/ApiSystem/listUser",
        deleteUser: urlBasePath+"/ApiSystem/deleteUser",
        addUser: urlBasePath+"/ApiSystem/addUser",
        updateUser: urlBasePath+"/ApiSystem/updateUser",
        getGroupList: urlBasePath+"/ApiSystem/listUserGroup",
        addGroup: urlBasePath+"/ApiSystem/addUserGroup",
        editGroup: urlBasePath+"/ApiSystem/updateUserGroup",
        deleteGroup: urlBasePath+"/ApiSystem/deleteUserGroup",
        getAuth: urlBasePath+"/ApiSystem/getAuthority",
        updateAuth: urlBasePath+"/ApiSystem/setAuthority",
        resetPassword: urlBasePath+"/ApiSystem/changeOtherPwd"
    }; 
    config.global = global;
    exports.config = config;
    // 用户状态
    Handlebars.registerHelper('system_user_status', function(status) {
        return ["停用","启用"][status];
    });
    // 用户状态
    Handlebars.registerHelper('yes_no', function(yes) {
        return ["否","是"][yes];
    });
    // 解决radio中 该值是否选中
    Handlebars.registerHelper("sys_isCheck",function(dataValue,value){
        var status = (dataValue == value) ? 0 :  1;
        return ['checked="checked"',''][status];
    });
    //权限是否选中
    Handlebars.registerHelper("hasAuth", function(value){
        return ['','checked="checked"'][value];
    });
    Handlebars.registerHelper("CPActToCN",function(value){
        return ["不激活","激活"][value];
    });
});

define("system",function(require, exports, module){
    var config = require("sys-config").config;
	exports.menu = config.menu;

	exports.page = "pages/system/index.html";
    exports.execute = function(toModule){ 

        var $sys = $("#system");
        //查看详情
        $sys.on("click","a.sys-details",function(){
            var $this = $(this),
            $parent = $this.parent(),
            id = $parent.attr("data-id"),
            tpl = $("#sys-userInfo").html();

            $.ajax({
                url:config.urls.getUser,
                data:{Id:id},
                type:"get",
                dataType:"json",
                success: function(r){
                    if(r.code == 1){
                        var html = Handlebars.compile(tpl)(r.info[0]); 
                        $.alert(html,{width:800});
                    }else{
                        $.alert(r.message);
                    }
                    
                }

            });
        });

        //删除用户

        $sys.on("click","a.sys-delete",function(){
            var $this = $(this),
            $parent = $this.parent(),
            id = $parent.attr("data-id"),
            $tr = $this.parents("tr"),
            $totalBox = $("#systemUser-total");

            $.confirm('确定要删除吗?').yes(function(){
                $.ajax({
                    url: config.urls.deleteUser,
                    data:{Id:id},
                    type:"get",
                    dataType:"json",
                    success: function(r){
                        if(r.code == 1){
                            $tr.remove();
                            var total = parseInt($totalBox.text());
                            $totalBox.text(total-1);
                            $.alert("删除成功");
                        }else{
                            $.alert("删除失败");
                        }
                    }
                });
                return false;
            });
        });

        $sys.on("click","a.system-del",function(){
            var $checked = $sys.find(".delCheck:checkbox:checked"),
            ids = [];

            $checked.each(function(){
                var $this = $(this),
                id = $this.attr("data-id");
                ids.push(id);
            });

            $.confirm('确定要删除吗?').yes(function(){
                $.ajax({
                    url: config.urls.deleteUser,
                    data:{Id:ids.join(",")},
                    type:"post",
                    dataType:"json",
                    success: function(r){
                        if(r.code == 1){
                            $.alert("删除成功");
                            toModule(config.router.index);
                        }else{
                            $.alert("删除失败");
                        }
                    }
                });
                return false;
            });
        });

        //重置密码
        $sys.on("click","a.sys-reset",function(){
            var $this = $(this),
            id = $this.attr("data-id");

            $.ajax({
                url: config.urls.resetPassword,
                data:{Id:id},
                type:"get",
                dataType:"json",
                success: function(r){
                    $.alert(r.message);
                }
            });
        });
    };
});

define("system_user_group", function(require, exports, module){

    var config = require("sys-config").config;

    exports.page = "pages/system/user/group.html";

    exports.execute = function(toModule){
        var tpl = $("#groupTpl").html(),
        $group = $("#sys-group");

        //添加用户组
        $group.on("click","a.system-add",function(){
            var $this = $(this),
            html = Handlebars.compile(tpl)({});


            $.dialog(html,{title:"用户组添加"}).yes(function(){
                $("#idInput").remove();
                $.ajax({
                    url: config.urls.addGroup,
                    data: $("#group-form").serialize(),
                    type: "post",
                    dataType: "json",
                    success: function(r){
                        if(r.code == 1){
                            config.global.updateCache("/ApiSystem/listUserGroup");//清除缓存
                            $.alert(r.message).yes(function(){
                                toModule(config.router.group);
                                
                            });
                        }else{
                            alert(r.message);
                        }
                    }
                });
                return false;
            });
        });


        //修改用户组
        $group.on("click","a.sys-edit",function(){
            var $this = $(this),
            $parent = $this.parent(),
            id = $parent.attr("data-id"),
            name = $parent.attr("data-name"),
            des = $parent.attr("data-desc"),
            data = {};
            
            data.Id = id;
            data.LevelName = name;
            data.LevelDesc = des;

            var html = Handlebars.compile(tpl)(data);
            $.dialog(html,{title:"修改用户组"}).yes(function(){
                $.ajax({
                    url:config.urls.editGroup,
                    data: $("#group-form").serialize(),
                    type: "post",
                    dataType: "json",
                    success: function(r){
                        if(r.code == 1){
                            config.global.updateCache("/ApiSystem/listUserGroup");//清除缓存
                            $.alert(r.message).yes(function(){
                                toModule(config.router.group);
                                
                            });
                        }else{
                            alert(r.message);
                        }
                    }
                })
                return false;
            });
        });

        //删除用户组
        $group.on("click","a.sys-delete",function(){
            var $this = $(this),
            $parent = $this.parent(),
            id = $parent.attr("data-id"),
            $tr = $this.parents("tr"),
            $totalBox = $("#systemUser-total");

            $.confirm("确定要删除吗？").yes(function(){
                $.ajax({
                    url: config.urls.deleteGroup,
                    data: {Id:id},
                    type: "get",
                    dataType: "json",
                    success: function(r){
                        if(r.code == 1){
                            config.global.updateCache("/ApiSystem/listUserGroup");//清除缓存
                            $tr.remove();
                            var total = parseInt($totalBox.text());
                            $totalBox.text(total-1);
                        }
                        $.alert(r.message);
                    }
                });
                return false;
            });
        });

        $group.on("click","a.system-del",function(){
            var $checked = $group.find(".delCheck:checkbox:checked"),
            ids = [];

            $checked.each(function(){
                var $this = $(this),
                id = $this.attr("data-id");
                ids.push(id);
            });

            $.confirm('确定要删除吗?').yes(function(){
                $.ajax({
                    url: config.urls.deleteGroup,
                    data:{Id:ids.join(",")},
                    type:"post",
                    dataType:"json",
                    success: function(r){
                        if(r.code == 1){
                            config.global.updateCache("/ApiSystem/listUserGroup");//清除缓存
                            $.alert("删除成功");
                            toModule(config.router.group);
                        }else{
                            $.alert("删除失败");
                        }
                    }
                });
                return false;
            });
        });

    };

});

define("system_user_add", function(require, exports, module){
    var config = require("sys-config").config;

    
    exports.menu = config.menu;

    exports.page = "pages/system/user/addUser.html";

    exports.execute = function(){
        var html = $("#sys-addHtmlTpl").html(),
        $sys_addHtml = $(".sys-addHtml");
        $(".iscp").on("click",function(){
            var $this = $(this),
            value = $this.val();


            if(value == 1){ //是cp
                $sys_addHtml.append(Handlebars.compile(html)({}));
            }else{
                $sys_addHtml.html("");
            }
        });
    }

});


define("system_user_edit", function(require, exports, module){
    var config = require("sys-config").config;
    Handlebars.registerHelper("isCp",function(value,options){
        if(value == 1){
            return options.fn(this);
        }
    });
    exports.menu = config.menu;
    exports.page = "pages/system/user/editUser.html";
    exports.execute = function(){
        var html = $("#sys-addHtmlTpl").html();
        $("#sys-editUserBox").on("click",".iscp",function(){
            var $this = $(this),
            value = $this.val(),
            $sys_addHtml = $(".sys-addHtml");


            if(value == 1){ //是cp
                $sys_addHtml.append(Handlebars.compile(html)({}));
            }else{
                $sys_addHtml.html("");
            }
        });
    }
    
});

define("system_user_userAuth", function(require, exports, module){
    var config = require("sys-config").config,
    actions = require("system/user/auth/action").actions;

    exports.page = "pages/system/user/userAuth.html";

    exports.execute = function(toModule){
        //生成用户下拉框
        var tpl = $("#userSelect").html(),
        authTpl = $("#authBoxTpl").html();
        actions.renderSelect({
            select: "#userSearch",
            authBox: "#userAuthBox",
            tpl: tpl,
            authTpl: authTpl,
            getSelectUrl: config.urls.getUsers,
            updateUrl: config.urls.updateAuth,
            getAuthUrl: config.urls.getAuth,
            type: 2,
            callback: function(){
                toModule("system_user_userAuth");
            }
        });
        
    };
});

define("system/user/auth/action", function(require, exports, module){

    exports.actions = {
        /**
        * @des 渲染下拉框
        * @pram opt: tpl:select下拉模板 , url : 获取下拉框请求 , select : select的选择器 , type : 1 用户组、2 用户
        **/
        renderSelect: function(opt){
            var _t = this;
            $.ajax({
                url: opt.getSelectUrl,
                data: {PageSize:0},
                type: "get",
                dataType: "json",
                success: function(r){
                    if(r.code == 1){
                        var html = Handlebars.compile(opt.tpl)(r),
                        $select = $(opt.select);
                        $select.append(html);
                        var id = $select.val(),
                        type = opt.type;
                        _t.renderAuthTable({type:type,id:id,authTpl:opt.authTpl,url:opt.getAuthUrl,authBox:opt.authBox});
                        _t.installUpdate({authBox:opt.authBox,url:opt.updateUrl,select:opt.select,type:type,authTpl:opt.authTpl,getAuth:opt.getAuthUrl,callback:opt.callback});
                    }else{
                        $.alert(r.message);
                    }
                }
            });
            
        },
        /**
        * @des 渲染权限列表
        * @pram opt : type :1 用户组、2 用户, id 用户或者用户组id , authTpl 权限列表模板 , authBox : 权限列表容器选择器 ,url: 获取权限接口  
        **/
        renderAuthTable: function(opt){
            $.ajax({
                url: opt.url,
                data: {Type:opt.type,LevelId:opt.id},
                type: "post",
                dataType: "json",
                success: function(r){
                    if(r.code == 1){
                        var html = Handlebars.compile(opt.authTpl)(r);
                        $(opt.authBox).html(html);
                    }else{
                        $.alert(r.message);
                    }
                }
            });
        },
        /**
        * @des 更新事件绑定
        * @pram opt : authBox : 权限列表容器选择器 ,url: 更新权限接口 , select : select选择器 , type
        **/
        installUpdate: function(opt){
            var _t = this;
            $(opt.authBox).on("click",".save-sysAuth",function(){
                var data = _t.allChecked(opt);

                $.ajax({
                    url: opt.url,
                    data:data,
                    type:"post",
                    dataType:"json",
                    success: function(r){
                        if(r.code == 1){
                            opt.callback&&opt.callback();
                        }else{
                            $.alert(r.message);
                        }
                    }
                });
            });
            $(opt.select).bind("change",function(){
                var id = $(this).val(),
                type = opt.type;
                _t.renderAuthTable({type:type,id:id,authTpl:opt.authTpl,url:opt.getAuth,authBox:opt.authBox});
            });
        },
        allChecked: function(opt){
            var $allTr = $(".auth-tr"),
                data = {},
                temp = {};
                temp.MenuIds = [];
                temp.Views = [];
                temp.Adds = [];
                temp.Updates = [];
                temp.Deletes = [];
                data.Type = opt.type;
                data.LevelId = $(opt.select).val();;

            $allTr.each(function(){
                var $this = $(this),
                menuId = $this.attr("data-id"),
                $authInputs = $this.find(".authInput");

                temp.MenuIds.push(menuId);
                $authInputs.each(function(){
                    var $input = $(this),
                    type = $input.attr("data-type"),
                    value = $input.is(':checked') ? 1 : 0;
                    temp[type].push(value);
                });
            });
            for(var key in temp){
                data[key] = temp[key].join(",");
            }
            return data;
        }
    };
});

define("system_user_groupAuth", function(require, exports, module){
    var config = require("sys-config").config,
    actions = require("system/user/auth/action").actions;

    exports.page = "pages/system/user/groupAuth.html";

    exports.execute = function(toModule){
        //生成用户下拉框
        var tpl = $("#groupSelect").html(),
        authTpl = $("#authBoxTpl").html();
        actions.renderSelect({
            select: "#groupSearch",
            authBox: "#groupAuthBox",
            tpl: tpl,
            authTpl: authTpl,
            getSelectUrl: config.urls.getGroupList,
            updateUrl: config.urls.updateAuth,
            getAuthUrl: config.urls.getAuth,
            type: 1,
            callback: function(){
                //location.href="index.html";
                toModule("system_user_groupAuth");
            }
        });
        
    };
});
define("system_user_alertAuth", function(require, exports, module){
    var global = require("global");

    global.updateCache("SwitchCompress",{
        rows:[
            {id:"1",type:"开"},
            {id:"0",type:"关"}
        ]
    });
    // var config = require("sys-config").config,
    // actions = require("system/user/auth/action").actions;

    exports.page = "pages/system/user/alertAuth.html";

    
});


