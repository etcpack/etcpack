const nodejs = require('@hai2007/nodejs');
const getFilePath = require('../tool/getFilePath');
const getMainUrl = require('../tool/getMainUrl');

module.exports = function (statement, filecontext, config) {
    let statementArray = statement.replace(/^import +/, '').split('from');
    let url = statementArray.pop();
    let args = [], def = '';

    if (statementArray.length > 0) {
        if (statementArray[0].indexOf('{') > -1) {
            args = statementArray[0].replace('{', '').replace('}', '').split(',');

            for (let i = 0; i < args.length; i++) {
                args[i] = args[i].trim();
            }

        } else {
            def = statementArray[0];
            args = ['default'];
        }
    }

    // 去掉字符串两边的空白和多余符号
    url = url.trim().replace(/['"]/g, '');

    // 如果是需要重定向的
    if (url in config.redirect) {
        url = nodejs.fullPath(config.redirect[url], process.cwd());
    }

    // 路径变成全路径
    else {
        if (/^[.|\/]/.test(url)) {
            url = getFilePath(nodejs.fullPath(url, filecontext), config.suffix);
        } else {
            url = nodejs.fullPath("node_modules/" + url, config.context);
            url = getFilePath(url, config.suffix) || getMainUrl(url);
        }
    }

    return { url, args, def };
};
