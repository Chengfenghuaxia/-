const fs = require('fs');
// const iniParser = require('ini-parser');


// // 读取 INI 文件
// const configData = fs.readFileSync('./config/config.ini', 'utf-8');

// const parsedData = iniParser.parse(configData);

// console.log(parsedData);

// // 处理模拟数组
// const arrayPrefix = 'fruit'; // 假设键名前缀为 'fruit'
// const fruitArray = [];
// let i = 0;
// while (parsedData[arrayPrefix + i]) {
//     fruitArray.push(parsedData[arrayPrefix + i]);
//     i++;
// }

// console.log(fruitArray); // 输出模拟的数组

const config = fs.readFileSync('./config/config.json');
console.log(JSON.parse(data)  );

