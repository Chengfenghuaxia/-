const schedule = require('node-schedule');
let Intverval = null
const { getfileTxt } = require('./utils')

//定时发送消息   群内用
async function SendRegularly(bot, msg, config) {
    const chatId = msg.chat.id;
    const content =  getfileTxt(chatId,config)
    let DQnow = getNowData()
    console.log(DQnow); //查看当前时间
    if(config.sendtype == 1&&content==="找不到内容"){
        bot.sendMessage(chatId, "找不到内容")
        return
    }
    if (config.sendtype == 1) {
        // 指定时间发送
        config.sendtimes.map(item => {
            Intverval = schedule.scheduleJob({ hour: item.hour, minute: item.minute }, function () {
                // 发送消息
                if (config.type == 1) {
                    bot.sendPhoto(chatId, config.mediaUrl[chatId], {
                        reply_markup: {
                            inline_keyboard: config.button
                        }
                    })
                } else {

                    bot.sendMessage(chatId, content, {
                        reply_markup: {
                            resize_keyboard: true,
                            one_time_keyboard: true,
                            inline_keyboard: config.button
                        }
                    })
                }

            });

        })
    } else {
        // 间隔N分钟发送一次
        Intverval = schedule.scheduleJob(config.interval, function () {
            // 发送消息
            if (config.type == 1) {
                bot.sendPhoto(chatId, config.mediaUrl[chatId], {
                    reply_markup: {
                        inline_keyboard: config.button
                    }
                })
            } else {
                bot.sendMessage(chatId, content, {
                    reply_markup: {
                        resize_keyboard: true,
                        one_time_keyboard: true,
                        inline_keyboard: config.button
                    }
                })
            }

        });
    }
    return Intverval
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
    getNowData,
    Intverval
}


// -4126577286 //测试群ID