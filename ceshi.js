const fs = require('fs');
const iniParser = require('ini-parser');


// 读取 INI 文件
const configData = fs.readFileSync('./config/config.ini', 'utf-8');

const parsedData = iniParser.parse(configData);
// 解析 INI 格式的数据
console.log(parsedData);

