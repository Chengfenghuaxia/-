const Redis = require('ioredis');
const redis = new Redis();
const State = require('./State');
let data = {
    id: "sadasdasdas",
    title: "测试",
    file_id: "AgACAgIAAxkBAAINZWXiCapIjCtiOfpHvAWpNXO8EHyRAAKH2DEbsUsRSxkVToaDzHULAQADAgADcwADNAQ",
    button: [[{ "text": "点击", "callback_data": "123" }]]
}

//  查询逻辑  用户->属性->数据


// redis.hset('afeng', 'field1',JSON.stringify(data), (err, res) => {
//     console.log(err, res);
// });
// redis.hset('afeng', 'field2', 'value2', (err, res) => {
//     console.log(err, res);
// });
// redis.hset('aye', 'field1', 'value2', (err, res) => {
//     console.log(err, res);
// });

//hmset使用方法
redis.hmset(State.DBname, "id", 1,'name','王哈哈')
    
redis.hmset(State.DBname, "id", 1,'name',data)
   
redis.hget(State.DBname, "id").then(res=>{
    console.log(res);
});
// redis.hgetall(State.DBname, (err, res) => {
//     console.log(res, "获取值");
// })