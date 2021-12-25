function PlugDemo() { }

PlugDemo.prototype.before = function (config, info) {
    // console.log(config)
    // config._flag = '修改了';
};

PlugDemo.prototype.afterLoader = function (config, info) {
    // console.log(info);
    return info;
};

module.exports = PlugDemo;


