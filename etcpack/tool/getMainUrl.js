const nodejs = require('@hai2007/nodejs');

module.exports = function (filepath) {

    let packageUrl = nodejs.fullPath('./package.json', filepath), packageContent;

    // 为了解决map等一些文件加载失败后服务器奔溃问题
    // by 你好2007 2022年3月23日 南京
    try {
        packageContent = require(packageUrl);
    } catch (e) {
        nodejs.error("Loading failed：" + filepath);
    }

    // 先取module,如果不存在取main
    // 后期扩展语法
    return packageContent ? nodejs.fullPath("module" in packageContent ? packageContent.module : packageContent.main, filepath) : filepath;
};
