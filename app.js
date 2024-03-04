const TelegramBot = require('node-telegram-bot-api');
const Redis = require('ioredis');
const utils = require('./utils');
const State = require('./State')
const messageModule = require('./message')
const inline_query = require('./inline_query')
const callback_query = require('./callback_query')
const SendReg = require('./SendRegularly')
const { getfileTxt } = require('./utils')
redis = new Redis();
const bot = new TelegramBot('6445269699:AAGHNcyWNl-wfDM0IdmWbaX7yVmiil4BWGs', { polling: true });
let MyAdvertise = utils.getMyAdvertise(redis,State.chatId) //我的广告  只要服务已开启输入ID就能转发广告
let configs = utils.readConfig()
let content =  getfileTxt()


// 定时读取配置文件
setInterval(async () => {
    content =  getfileTxt()
    configs = utils.readConfig()
}, 5000);

//监听用户消息回调
bot.on('message', async (msg) => {
    messageModule(bot, msg, redis, utils, State, SendReg,configs,content)
})

// 监听内联查询事件
bot.on('inline_query', async (msg) => {
    inline_query(bot, msg, redis, utils, State, MyAdvertise)
});

// 内联按钮回调监听
bot.on('callback_query', async (callbackQuery) => {
    callback_query(bot, callbackQuery, State)
});

