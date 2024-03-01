//检验链接合法性
function isUrl(url) {
    return /^https?:\/\/([a-zA-Z0-9]+\.)+[a-zA-Z0-9]+/.test(url)
}

function generateForwardMessageId(username, messageId) {
    return `@${username} ${messageId}`;
}

function generateRandomString(length, type) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return type + result;
}
//过滤非对象字符
function filterJSONObject(strings) {
    return strings.filter(str => {
        try {
            const parsed = JSON.parse(str);
            return typeof parsed === 'object' && parsed !== null;
        } catch (error) {
            return false;
        }
    });
}
async function getMyAdvertise(redis) {
    let alldata = await redis.keys('*')
    let allGG = alldata.map(async code => {
        return await redis.get(code)
    })
    let res = await Promise.all(allGG)
    const filteredStrings = filterJSONObject(res);
    return filteredStrings.map((item, index) => {
        return JSON.parse(item)
    })
}
module.exports = {
    isUrl,
    generateForwardMessageId,
    generateRandomString,
    filterJSONObject,
    getMyAdvertise
}