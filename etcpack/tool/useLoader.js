const tool = require('@hai2007/tool');
const fs = require('fs');
const getFilePath = require('./getFilePath');

module.exports = function (filepath, config, urls) {

    let content = null;
    filepath = getFilePath(filepath, config.suffix);

    let _filepath = filepath + (urls.length > 0 ? ("?" + urls.join('?')) : "");

    for (let item of config.loader) {
        if (item.test.test(_filepath)) {

            let handlers = item.handler;
            content = fs.readFileSync(filepath, 'utf-8');

            if ((!tool.isFunction(item.filter)) || item.filter(_filepath)) {

                for (let index = handlers.length; index > 0; index--) {

                    // 为了适配新的handler写法
                    // by 你好2007 2022年3月24日 南京
                    //  content = handlers[index - 1].call({
                    content = handlers[index - 1].use.call({

                        // 文件路径
                        filepath: _filepath,

                        // 配置
                        config: handlers[index - 1].config

                    }, content);
                }

            }
            break;
        }
    }

    return config.plug.run('afterLoader', config, {
        source: content,
        filepath,
        params: urls.join("?")
    }).source;
};
