const nodejs = require('@hai2007/nodejs');

module.exports = function (filepath) {

    let packageUrl = nodejs.fullPath('./package.json', filepath);
    let packageContent = require(packageUrl);

    // 先直接取main，后期扩展语法
    return nodejs.fullPath(packageContent.main, filepath);
};
