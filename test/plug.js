function PlugDemo() { }

PlugDemo.prototype.before = function (config) {
    // console.log(config)
    // config._flag = '修改了';
};

module.exports = PlugDemo;


