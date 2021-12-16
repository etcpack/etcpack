const fs = require('fs');
const getFilePath = require('./getFilePath');

module.exports = function (filepath, config) {

    let content = null;
    filepath = getFilePath(filepath, config.suffix);

    for (let item of config.loader) {
        if (item.test.test(filepath)) {

            let handlers = item.handler;
            content = fs.readFileSync(filepath, 'utf-8');

            for (let index = handlers.length; index > 0; index--) {
                content = handlers[index - 1].call({

                    // 文件路径
                    filepath

                }, content);
            }
            break;
        }
    }

    return content;
};
