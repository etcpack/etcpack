const nodejs = require('@hai2007/nodejs');
const path = require('path');
const tool = require('@hai2007/tool');
const getMainUrl = require('./tool/getMainUrl');
const fs = require('fs');

module.exports = function (config) {

    config.context = process.cwd();

    // 地址重定向
    config.redirect = config.redirect || {};

    // 插件
    config.plug = config.plug || [];
    let _plug = {
        before: [],
        afterLoader: []
    }
    for (let plug of config.plug) {
        for (let hookName in _plug) {
            if (tool.isFunction(plug[hookName])) {
                _plug[hookName].push(plug[hookName]);
            }
        }
    }
    config.plug.run = function (hookName, _config, _source) {
        let hookArr = _plug[hookName];
        for (let hookFun of hookArr) {
            _source = hookFun(_config, _source);
        }
        return _source;
    };

    // 缺省后缀
    config.suffix = config.suffix || ['.js', '.ts', '.json'];

    // 入口地址校对
    config.entry = {
        file: nodejs.fullPath(config.entry)
    };
    config.entry.context = path.dirname(config.entry.file);

    // 出口地址校对
    config.output = {
        file: nodejs.fullPath(config.output),
    };
    config.output.context = path.dirname(config.output.file);

    if (config.mode == 'development') {

        // 服务器校对
        config.devServer.contentBase = nodejs.fullPath(config.devServer.contentBase);

        // 校对重定向
        let redirect = {};
        for (let key in config.redirect) {
            redirect["\/@modules\/" + key] = config.redirect[key];
        }
        config.redirect = redirect;

    } else if (config.mode == 'production') {



    } else {
        nodejs.log(`config.mode is a required item, indicating the current packaging mode. It should be a string, and only two values can be selected:

* development: Corresponding command 'etcpack_dev'
* production: Corresponding command 'etcpack_build'
`);

        nodejs.error('Package failed!\n');
        process.exit();
    }

    config.loader = config.loader || [];
    for (let i = 0; i < config.loader.length; i++) {
        for (let j = 0; j < config.loader[i].handler.length; j++) {

            let handler = config.loader[i].handler[j];

            let conf = {}, use;
            if (tool.isFunction(handler) || tool.isString(handler)) {
                use = handler;
            } else {
                conf = handler.config;
                use = handler.use;
            }

            if (!tool.isFunction(use)) {

                let localFilePath = nodejs.fullPath(use, process.cwd());

                // 如果不是配置的本地文件
                if (!fs.existsSync(localFilePath) || fs.lstatSync(localFilePath).isDirectory()) {

                    // 为了解决全局安装问题
                    // by 你好2007 2022年3月23日 南京
                    // localFilePath = nodejs.fullPath('./node_modules/' + handler, process.cwd());
                    localFilePath = nodejs.fullPath('../../' + use, __dirname);

                    // 如果也不是node_modules中的路径
                    if (!fs.existsSync(localFilePath) || fs.lstatSync(localFilePath).isDirectory()) {

                        // 最终，采用main默认包
                        localFilePath = getMainUrl(localFilePath);

                    }

                }

                use = require(localFilePath);

            }

            config.loader[i].handler[j] = {
                use,
                config: conf
            };

        }

        if (!tool.isFunction(config.loader[i].filter)) {
            config.loader[i].filter = function () {
                return true;
            };
        }

    }

    // js
    config.loader.push({
        test: /\.js$/,
        filter() {
            return true;
        },
        handler: [{
            use: function (source) {
                return source;
            },
            config: {}
        }]
    });

    return config;
};