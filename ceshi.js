const Redis = require('ioredis');
const redis = new Redis();

// 存储 Map
async function storeMap(key, map) {
    // 使用 HMSET 命令将 Map 存储为 Hash
    await redis.hmset(key, map);
}

// 获取 Map
async function getMap(key) {
    // 使用 HGETALL 命令获取 Hash 中的所有字段和值
    const map = await redis.hgetall(key);
    return map;
}

// 示例数据
const exampleMap = {
    field1: 'value1',
    field2: 'value2',
    field3: 'value3'
};
const exampleMap1 = {
    field1: 'value1',
    field2: 'value2',
    field3: 'value32020'
};
// 存储示例数据
storeMap('exampleKey', exampleMap)
    .then(() => {
        console.log('Map stored successfully.');
    })
    .catch(err => {
        console.error('Error storing map:', err);
    });

storeMap('exampleKey1', exampleMap1)
    .then(() => {
        console.log('Map stored successfully.');
    })
    .catch(err => {
        console.error('Error storing map:', err);
    });

// 获取示例数据
getMap('exampleKey1')
    .then(map => {
        console.log('Map retrieved:', map);
    })
    .catch(err => {
        console.error('Error retrieving map:', err);
    });
