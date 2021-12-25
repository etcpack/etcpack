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

            for (let index = handlers.length; index > 0; index--) {
                content = handlers[index - 1].call({

                    // 文件路径
                    filepath: _filepath

                }, content);
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
