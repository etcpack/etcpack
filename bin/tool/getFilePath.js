const fs = require('fs');

module.exports = function (filePath, suffixArray) {

    for (let suffix of ['', ...suffixArray]) {
        let _filePath = filePath + suffix;

        if (fs.existsSync(_filePath) && !fs.lstatSync(_filePath).isDirectory()) {
            return _filePath;

        }
    }

    return null;
};
