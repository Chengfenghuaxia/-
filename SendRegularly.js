const schedule = require('node-schedule');

function SendRegularly(bot, msg) {
    const chatId = msg.chat.id;
    let DQnow = getNowData()
    console.log(DQnow); //查看当前时间

    // 每天下午5:00发送消息
    schedule.scheduleJob({ hour: 22, minute: 27 }, function () {
        // 发送消息
        bot.sendMessage(-4126577286, "@HeartTetrisbot TP7QYVYo7CUpYb", {
            reply_markup: {
                resize_keyboard: true,
                one_time_keyboard: true,
                inline_keyboard: [
                    [
                        {
                            text: '分享',
                            url: 'https://t.me/HeartTetrisbot'
                        }
                    ],
                    [
                        {
                            text: '收藏',
                            callback_data: "收藏"
                        }
                    ],
                ]
            }
        })
    });
}

function getNowData() {

    // 创建一个新的Date对象，它将自动设置为当前时间
    const now = new Date();

    // 获取当前小时（0-23）
    const currentHour = now.getHours();

    // 获取当前分钟（0-59）
    const currentMinute = now.getMinutes();

    // 获取当前秒数（0-59）
    const currentSecond = now.getSeconds();
    return `当前时间：${currentHour}:${currentMinute}:${currentSecond}`

}
module.exports = {
    SendRegularly,
    getNowData
}