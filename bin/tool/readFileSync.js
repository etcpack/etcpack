const fs = require('fs');
const getFilePath = require('./getFilePath');

module.exports = function (filePath, suffixArray) {
    let _filePath = getFilePath(filePath, suffixArray);

    // 如果文件存在，返回内容
    if (_filePath !== null) return fs.readFileSync(_filePath, 'utf-8');

    // 否则
    return null;
};
