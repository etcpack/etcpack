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

    loader: [{
        test: /\.myfile$/,
        handler: [function (source) {
            // console.log(this.filepath)
            return source;
        }]
    }, {
        test: /\.myfile\?xxxxxx$/,
        filter(filepath) {
            console.log(filepath);
            throw new Error('error~');
            return false;
        },
        handler: [{
            config: {
                key1: "value1"
            },
            use: function (source) {

                console.log(this);

                // console.log(this.filepath)
                return source + "/*---*/";
            }
        }]
    }],

    plug: [new PlugDemo()]
};
