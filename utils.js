const fs = require('fs')
//检验链接合法性
function isUrl(url) {
    return /^https?:\/\/([a-zA-Z0-9]+\.)+[a-zA-Z0-9]+/.test(url)
}
// 生成发送命令
function generateForwardMessageId(username, messageId) {
    return `@${username} ${messageId}`;
}
//生成12消息位随机代码
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
//获取我的广告
async function getMyAdvertise(redis, chatId) {
    let alldata = await redis.hgetall(chatId)
    return alldata
}
//获取公共库广告
async function getAllvertise(redis, State) {
    let res = await redis.hgetall(State.DBname)
    return res
}
// 非空校验
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
// 添加广告名
async function setAsdtitle(bot, State, messageText, redis, chatId) {
    State.messageIdToReply = messageText
    State.waitingForReply = false
    let text = await redis.get("Text")
    let msgs = {
        file_id: State.photoID,
        id: State.VerificationCode,
        text: text ? text.substr(1) : "",
        button: State.replyButton,
        title: State.messageIdToReply
    }
    redis.hset(chatId, State.VerificationCode, JSON.stringify(msgs), function (err, reply) {
        if (err != null) {
            console.log(err);
            return
        }
        console.log(msgs, "收藏的广告");
        bot.sendMessage(chatId, "收藏成功")
    });
}
//读取广告信息
function getfileTxt(chatId,config) {
    if(config.GroupList[chatId]){
        let path = `./config/advertise/${config.GroupList[chatId]}.txt`
        return fs.readFileSync(path, 'utf8');
    }else{
        return "找不到内容"
    }
   }

function readConfig() {
    return JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
}
module.exports = {
    isUrl,
    generateForwardMessageId,
    generateRandomString,
    filterJSONObject,
    getMyAdvertise,
    isEmpty,
    getAllvertise,
    setAsdtitle,
    getfileTxt,
    readConfig
}