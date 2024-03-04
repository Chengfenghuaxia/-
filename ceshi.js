const fs = require('fs');
const path = require('path');

// 要列出文件的目录路径
const directoryPath = '/path/to/directory';

// 使用 fs.readdir 方法读取目录中的文件列表
fs.readdir("./config/advertise", (err, files) => {
    if (err) {
        console.error('无法读取目录内容：', err);
        return;
    }

    // 输出文件列表
    console.log('目录中的文件列表：');
    files.forEach(file => {
        console.log(file);
    });
});


// 消息首行带上群号