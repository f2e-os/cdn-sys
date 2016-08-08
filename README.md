<meta charset="utf-8">
net-east-cdn
-------------

git: `https://git.coding.net/shy2850/net-east-cdn.git`

- f2e-server 配置
```
    exports["cdn.net-east-cdn.com"] = {
        root: "E:\\github\\net-east-cdn\\",
        agent: {
            get: function(){
                return {    // 直接代理远程接口进行调试
                    host: "103.250.226.130",
                    port: 9000
                }
            }
        }
    };
```

- 模块说明

采用seajs进行模块化管理,  标签中含有 `data-module` 或 `data-menu` 时，点击触发模块渲染

- data-module触发左侧菜单渲染, data-menu不触发
- 书写模块必须添加模块名 参考样例: [cdn/js/scripts/system.js](cdn/js/scripts/system.js)
- 加载页面url:

```
    exports.page = "pages/system/index.html";
```
- 加载完成执行方法:

```
    exports.execute = function(){ alert(123) };
```
- 表单`form.auto-submit`提交后执行方法:

```
    exports.afterAutoSubmit = function(res){ alert(res.message) };
```
- 菜单渲染规则: 

```
    exports.menu = [
        {name:"用户管理", module: "system", active: "active", icon: "system-conf"},
        {name:"用户权限管理"},
        {name:"用户组管理"},
        {name:"用户组权限管理"}
    ];
```
    - name: 显示名
    - module: data-menu
    - active: 聚焦当前菜单选项
    - icon: 附加在菜单选项上的className

- 资源构建说明
    - 前置引入jQuery、jQueryUI(core,datepicker)、Handlebars、Highcharts 以及 bootstrap.js
    - `cdn/js/scripts/` 下所有文件将合并在 `cdn/js/combine.js` 中使用

- 插件
    - 列表加载支持: [cdn/js/libs/template-init.js](cdn/js/libs/template-init.js) 
    - 自定义弹出框: [cdn/js/libs/alerts.js](cdn/js/libs/alerts.js)
    - 文件上传: [cdn/js/libs/frame-upload.js](cdn/js/libs/frame-upload.js)
    - 日期格式化： [cdn/js/libs/date-util.js](cdn/js/libs/date-util.js)


使用样例参见:
1. [cdn/pages/host/policy/distribute.html](cdn/pages/host/policy/distribute.html)
2. [cdn/pages/host/policy/add.html](cdn/pages/host/policy/add.html)
3. [cdn/pages/host/policy/edit.html](cdn/pages/host/policy/edit.html)
4. [cdn/js/scripts/host.js](cdn/js/scripts/host.js)

