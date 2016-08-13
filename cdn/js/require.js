var require;
var define;
(function(){
    var defineModules = {};
    var modules = {};

    require = function(moduleName){
        if( modules[moduleName] ){
            return modules[moduleName];
        }else if(defineModules[moduleName]){
            var module = {
                exports: {}
            };
            var res = defineModules[moduleName](require, module.exports, module);
            if( typeof res === "undefined" ){
                modules[moduleName] = module.exports;
            }else {
                modules[moduleName] = res;
            }
            return modules[moduleName];
        }else{
            throw new Error('module not fond: ' + moduleName);
        }
    };

    define = function(moduleName, fn){
        defineModules[moduleName] = fn;
    };

})();