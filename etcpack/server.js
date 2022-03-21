const getFilePath = require('./tool/getFilePath');
const WS = require('@etcpack/ws');
const nodejs = require('@hai2007/nodejs');
const readFileSync = require('./tool/readFileSync');
const useLoader = require('./tool/useLoader');
const getMainUrl = require('./tool/getMainUrl');
const fs = require('fs');

module.exports = function(_config) {

    // 首先，获取配置文件
    let config = require('./config')(_config);

    config.plug.run('before', config);

    WS({

        // 端口号
        port: config.devServer.port,

        // 服务器根路径
        contentBase: config.devServer.contentBase,

        // 设置缺省后缀
        suffix: config.suffix,

        // 拦截处理
        handler: function(request, response) {

            let urls = request.url.split('?');
            request.url = urls.shift();

            let filepath, isEntry, content;

            if (/\/@client/.test(request.url)) {

                let clinetFilePath = request.url.replace(/\/@/, './');
                content = fs.readFileSync(nodejs.fullPath(clinetFilePath, __dirname), 'utf-8');

                if (/static\.js/.test(clinetFilePath)) {
                    content = content.replace('__port__', config.devServer.port + 1);
                }

            } else {

                // 如果是导入node_modules的
                if (/\/@module/.test(request.url)) {

                    // 如果是需要重定向的
                    if (request.url in config.redirect) {
                        filepath = nodejs.fullPath(config.redirect[request.url], process.cwd());
                    }

                    // 否则，直接去node_modules中寻找
                    else {
                        filepath = nodejs.fullPath(request.url.replace(/\/@modules/, './node_modules'), process.cwd());
                    }

                    // 如果文件不存在，就应该使用main等关键字修改路径
                    if (getFilePath(filepath, config.suffix) === null) {
                        filepath = getMainUrl(filepath);
                    }
                }

                // 否则
                else {
                    filepath = nodejs.fullPath("./" + request.url, config.devServer.contentBase);
                    isEntry = filepath == config.output.file

                    // 如果请求的文件和打包出口文件一致，地址改为打包入口地址即可
                    if (isEntry) {
                        filepath = config.entry.file;
                    }

                    // 否则需要修改成源码下的
                    else {
                        filepath = filepath.replace(config.output.context, config.entry.context);
                    }

                }

                content = useLoader(filepath, config, urls);

                if (isEntry) {
                    content = "import '/@client/static.js';\n\n" + content;
                }

                // 如果是来自node_modules的普通文件
                if (/\/@modules/.test(request.url) && content === null) {
                    content = readFileSync(filepath, config.suffix);
                }

            }

            // 如果是被处理的文件
            if (content !== null) {
                // 写回数据
                response.writeHead(200, {
                    'content-type': "application/javascript;charset=utf-8",
                    'handler': "EtcPack"
                });
                response.write(content.replace(/(?:^|\n) *(import [^'"]*)(['|"])([^./].+)\2/g, '$1$2/@modules/$3$2'));
                response.end();

            }

            return content !== null;
        }

    });

};