const analyseImport = require('./analyseImport');
const analyseExport = require('./analyseExport');
const readFileSync = require('../tool/readFileSync');
const nodejs = require('@hai2007/nodejs');
const toInnerImport = require('./toInnerImport');
const useLoader = require('../tool/useLoader');
const urlToIndex = require('./urlToIndex');
const getFilePath = require('../tool/getFilePath');

let lazyBundleIndex = 0;

module.exports = function analyseBundle(filepath, config) {

    let urls = filepath.split('?');
    let _filepath = urls.shift();

    let bundleCode = "";
    let lazyBundle = [];

    // 如果已经解析
    if (global.__etcpack__rootBundle__.indexOf(filepath) > -1 || global.__etcpack__currentBundle__.indexOf(filepath) > -1) {
        return {
            code: bundleCode,
            lazy: lazyBundle
        };
    }

    // 否则就记录下来
    else {

        // 记录在全局
        if (global.__etcpack__isRootBundle__) {
            global.__etcpack__rootBundle__.push(filepath);
        }

        // 记录在当前
        else {
            global.__etcpack__currentBundle__.push(filepath);
        }
    }

    nodejs.print("    * [" + urlToIndex(filepath) + "] " + filepath);

    // 获取当前路径上下文
    let filecontext = nodejs.fullPath('../', _filepath);

    // 读取具体代码
    let source = (useLoader(_filepath, config, urls) || readFileSync(_filepath, config.suffix)) + "\n  ";

    //【警告】
    // 对class转义后的代码进行特殊兼容
    source = source.replace(/export { _class as default };/, '__etcpack__scope_bundle__.default=_class;');

    //【1】导入
    let importStatement = null;
    while (importStatement = /(?:^|\n) *import[^'"]*(['|"]).+\1;*/.exec(source)) {
        importStatement = importStatement[0].replace(/^\n/, '').trim();

        // 获取导入语句的信息
        let importResult = analyseImport(importStatement.replace(/;$/, ''), filecontext, config);

        // 解析依赖的bundle
        let bundle = analyseBundle(importResult.url, config);
        bundleCode += bundle.code;
        for (let lazyBundleFile of bundle.lazy) { lazyBundle.push(lazyBundleFile); }

        // 原生的导入语句改成内部可以支持的写法
        source = source.replace(importStatement, toInnerImport(importResult));
    }

    //【2】导出
    let exportStatement = null;
    while (exportStatement = /(?:^|\n) *export [^\n]+\n/.exec(source)) {
        exportStatement = exportStatement[0].replace(/\n$/, '').replace(/^\n/, '').trim();

        // 获取导出语句的信息
        let exportResult = analyseExport(exportStatement);

        // 原生的导入语句改成内部可以支持的写法
        source = source.replace(exportStatement, exportResult);
    }

    // 【3】懒加载
    let lazyStatement = null;
    while (lazyStatement = /import\((['"])([^'"]+)\1\)/.exec(source)) {
        lazyBundleIndex += 1;

        // 懒加载文件地址
        let lazyFilepath = getFilePath(nodejs.fullPath(lazyStatement[2], filecontext), config.suffix);

        // 懒加载导出地址
        let lazyOutput = config.output.file.replace(/\.js$/, '-bundle' + lazyBundleIndex + '.js')

        if (global.__etcpack__lazyBundle__.indexOf(lazyFilepath) < 0) {

            // 登记
            lazyBundle.push({
                source: lazyFilepath,
                target: lazyOutput,
                isRoot: false
            });
        }

        let lazyfilename = lazyOutput.replace(config.context, '.').replace(/\\/g, '/');

        // 原生的导入语句改成内部可以支持的写法
        source = source.replace(lazyStatement[0], `window.__etcpack__getLazyBundle('${lazyfilename}','${urlToIndex(lazyFilepath)}')`);
    }

    return {
        code: `
/*************************** [bundle] ****************************/
// Original file:${filepath.replace(config.context, '.').replace(/\\/g, '/')}
/*****************************************************************/
window.__etcpack__bundleSrc__['${urlToIndex(filepath)}']=function(){
    var __etcpack__scope_bundle__={};
    var __etcpack__scope_args__;
    ${source}
    return __etcpack__scope_bundle__;
}
${bundleCode}`,
        lazy: lazyBundle
    };

};
