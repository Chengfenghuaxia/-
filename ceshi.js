const Redis = require('ioredis');
const redis = new Redis();

let data = {
    id: "sadasdasdas",
    title: "测试",
    file_id: "AgACAgIAAxkBAAINZWXiCapIjCtiOfpHvAWpNXO8EHyRAAKH2DEbsUsRSxkVToaDzHULAQADAgADcwADNAQ",
    button: [[{ "text": "点击", "callback_data": "123" }]]
}

//  查询逻辑  用户->属性->数据


redis.hset('afeng', 'field1',JSON.stringify(data), (err, res) => {
    console.log(err, res);
});
redis.hset('afeng', 'field2', 'value2', (err, res) => {
    console.log(err, res);
});
redis.hset('aye', 'field1', 'value2', (err, res) => {
    console.log(err, res);
});


redis.hgetall('afeng', (err, res) => {
    console.log(err, res['field1']);
})