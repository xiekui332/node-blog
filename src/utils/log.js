const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV    // 环境参数

// 写日志
function writeLog (writeStream, log) {
    writeStream.write(log + '\n')   // 关键代码
}

// 生成 write Stream
function createWriteStream (filename) {
    const fullFileName = path.join(__dirname, '../', '../', 'logs', filename)
    const writeStream  = fs.createWriteStream(fullFileName, {
        flags:'a'
    })

    return writeStream
}


// 写访问日志
const accessWriteStream = createWriteStream('access.log')
function access (log) {
    if(env == 'dev') {
        console.log(log)
        return
    }
    writeLog(accessWriteStream, log)
}

module.exports = {
    access
}