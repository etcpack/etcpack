const { setValue } = require('@hai2007/algorithm');
const { isObject } = require('@hai2007/tool');

exports.merge = function(common, config) {

    (function copyConfig(express, target) {

        for (let key in target) {

            let newExpress = express + "['" + key + "']";

            if (isObject(target[key])) {
                copyConfig(newExpress, target[key]);
                continue;
            }

            setValue(common, newExpress, target[key]);
        }

    })('', config);

    return common;
};

exports.etcpack_pkg = function(config) {
    require('./etcpack/builder')(config);
};

exports.etcpack_dev = function(config) {
    require('./etcpack/server')(config);
};