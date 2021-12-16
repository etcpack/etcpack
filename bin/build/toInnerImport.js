const urlToIndex = require('./urlToIndex');

module.exports = function (importResult) {

    let argsCode = "";

    // 需要解析参数结构
    for (let arg of importResult.args) {
        if (arg == 'default') {
            argsCode += "var " + importResult.def + "=__etcpack__scope_args__." + arg + ";\n";
        } else {
            argsCode += "var " + arg + "=__etcpack__scope_args__." + arg + ";\n";
        }
    }

    return `__etcpack__scope_args__=window.__etcpack__getBundle('${urlToIndex(importResult.url)}');\n${argsCode}`;

};
