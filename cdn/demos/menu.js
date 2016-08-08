// 所有菜单相关

mainMenu = [
    {
        name: '运行状态',
        module: 'dashboard',
        icon: 'icon01'
    },
    {
        name: '数据分析',
        module: 'data',
        icon: 'icon02',
        children: [
            {name:"热点内容统计", icon:"icon14", module: "data", active: "active"}, //active 表示默认二级菜单
            {name:"用户行为统计", icon:"icon15", module: "analysis/userBehavior"},
            {name:"数据流量统计", icon:"icon16", module: "analysis/dataTraffic"},
            {name:"趋势分析统计", icon:"icon17", module: "analysis/trend"},
            {name:"其他统计",     icon:"icon18", module: "analysis/other"},
            {name:"分级存储统计", icon:"icon19", module: "analysis/storage"}
        ]
    },
    {
        name: '设备配置',
        module: 'host',
        icon: 'icon03',
        children: [
            {name:"分发策略管理", icon:"icon24", module: "host", active: "active"},
            {name:"缓存策略管理", icon:"icon25", module: "host/manage/policy"},
            {name:"缓存规则策略管理", icon:"icon26", module: "host_cacheRuleM"},
            {name:"访问控制策略管理", icon:"icon27", module: "host_accessStatic"},
            {name:"调度策略管理", icon:"icon28", module: "host_dispatch"},
            {name:"回源策略管理", icon:"icon29", module: "host_trace"},
            {name:"重定向黑名单管理", icon:"icon31", module: "host_blacklist"},
            {name:"GSLB黑名单", icon:"icon32", module: "host/gslb"},
            {name:"内容复制配置", icon:"icon33", module: "host/content/conf"},
            {name:"webcache配置", icon:"icon30", module: "host/webcache/list"},
            {name:"用户访问日志配置", icon:"icon34", module: "host/record"},
            {name:"告警配置", icon:"icon06", module: "host/warning"},
            {name:"缓存基本配置", icon:"icon35", module: "host/cache_config"},
            {name:"HTTP缓存配置", icon:"icon36", module: "host_httpcache"},
            {name:"ruler配置",  icon:"icon37", module: "host/ruler/list"},
            {name:"pps白名单配置", icon:"icon38", module: "host_pps"},
            {name:"动态策略管理", icon:"icon37", module: "host/Dynamic/list"}
        ]
    },
    {
        name: '资源配置',
        module: 'source',
        icon: 'icon04',
        children: [
            {name:"节点管理",icon: "icon03", module: "source", active: "active"},
            {name:"CP管理",icon: "icon39", module: "source_cp"},
            {name:"内容管理", icon: "icon40", module:"source_subInto"},
            {name:"IP地址库管理",icon: "icon41", module:"source_ipmanage"}
        ]
    },
    {
        name: '监控告警',
        module: 'monitor',
        icon: 'icon05',
        children: [
            {name:"设备监控", icon:"icon05", module: "monitor", active: "active"},
            {name:"警告",   icon:"icon06", module: "monitor/alert"}
        ]
    },
    {
        name: '日志系统',
        module: 'record',
        icon: 'icon06',
        children: [
            {name:"操作日志", icon:"icon10", module: "record", active: "active"},
            {name:"系统日志", icon:"icon11", module: "record/system"},
            {name:"安全日志", icon:"icon12", module: "record/safety"},
            {name:"访问日志", icon:"icon13", module: "record/visit"}
        ]
    },
    {
        name: '溯源评估',
        module: 'trace',
        icon: 'icon07',
        children: [
            {name:"回复流量评估", icon:"icon19", module: "trace", active: "active"},
            {name:"回溯次数评估", icon:"icon20", module: "trace/frequency"},
            {name:"缓存内容重复利用率", icon:"icon21", module: "trace/cache"},
            {name:"回吐成功率评估", icon:"icon07", module: "trace/backspit"},
            {name:"回源占比分析", icon:"icon18", module: "trace/proportion"},
            {name:"各省缓存溯源白名单", icon:"icon22", module: "trace/whitelist"},
            {name:"pps重定向评估", icon:"icon23", module: "trace/redirect"}
        ]
    },
    {
        name: '分发评估',
        module: 'distribute',
        icon: 'icon08',
        children: [
            {name:"分发成功率评估", icon:"icon07", module: "distribute", active: "active"},
            {name:"分发内容流量统计", icon:"icon19", module: "distribute/conflow"},
            {name:"服务对象统计", icon:"icon09", module: "distribute/service_object"}
        ]
    },
    {
        name: '认证计费',
        module: 'account',
        icon: 'icon09',
        children: [
            {name:"按流量计费", icon:"icon00", module: "account", active: "active"},
            {name:"按时长计费", icon:"icon01", module: "account/timePrice"},
            {name:"按带宽计费", icon:"icon02", module: "account/widthPrice"},
            {name:"按节点计费", icon:"icon03", module: "account/nodePrice"},
            {name:"按吞吐率计费", icon:"icon04", module: "account/ratePrice"}
        ]
    },
    {
        name: '系统配置',
        module: 'system',
        icon: 'icon10',
        children: [
            {name:"用户管理", module: "system", active: "active" ,icon :"icon15"},
            {name:"用户权限管理", module: "system_user_userAuth",icon:"icon42"},
            {name:"用户组管理", module: "system_user_group",icon:"icon43"},
            {name:"用户组权限管理", module: "system_user_groupAuth",icon:"icon44"}
        ]
    }
];

