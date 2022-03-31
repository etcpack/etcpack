const common = require('./etcpack.common.js');
const { merge } = require('../../index');

module.exports = merge(common, {
    mode: "production"
});
