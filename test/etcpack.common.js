const pkg = JSON.parse(require('fs').readFileSync('./package.json'));
const PlugDemo = require('./plug');

module.exports = {

    // 打包入口
    entry: './src/main.js',

    // 打包出口
    output: 'build/main@v' + pkg.version + '.js',

    // 对导入路径重定向
    // redirect: {

    // },

    // suffix:['.ts','.js','.json']

    // loader: [{
    //     test: /\.(js|ts)$/,
    //     handler: [function (source) {
    //         return source;
    //     }]
    // }],

    plug: [new PlugDemo()]
};
