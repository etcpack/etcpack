const nodejs = require('@hai2007/nodejs');
const path = require('path');
const tool = require('@hai2007/tool');
const getMainUrl = require('./tool/getMainUrl');
const fs = require('fs');

module.exports = function (_process) {

    // 获取命令行参数
    const parsed = nodejs.option({}, _process.argv);

    // 首先，获取配置文件
    let config = require(nodejs.fullPath(parsed.config[0], process.cwd()));

    config.context = process.cwd();

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
            if (!tool.isFunction(handler)) {

                let localFilePath = nodejs.fullPath(handler, process.cwd());

                // 如果不是配置的本地文件
                if (!fs.existsSync(localFilePath) || fs.lstatSync(localFilePath).isDirectory()) {

                    localFilePath = nodejs.fullPath('./node_modules/' + handler, process.cwd());

                    // 如果也不是node_modules中的路径
                    if (!fs.existsSync(localFilePath) || fs.lstatSync(localFilePath).isDirectory()) {

                        // 最终，采用main默认包
                        localFilePath = getMainUrl(localFilePath);

                    }

                }

                config.loader[i].handler[j] = require(localFilePath);

            }

        }
    }

    // js
    config.loader.push({
        test: /\.js$/,
        handler: [function (source) {
            return source;
        }]
    });

    return config;
};
