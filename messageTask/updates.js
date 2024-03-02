function CreateAse(bot, chatId) {
    bot.sendMessage(chatId, "请选择广告类型", {
        reply_markup: {
            keyboard: [['Text', 'Photo'], ['返回']], // 自定义按钮文本
            resize_keyboard: true, // 调整键盘大小以适应内容
            one_time_keyboard: false, // 不关闭键盘后再次打开时保持上次状态
        }
    });
}
async function Ready(bot, chatId, State, utils) {
    const button = [['我的广告', '创建广告']]; //初试内联按钮
    //生成12位消息代码
    State.VerificationCode = utils.generateRandomString(12, State.type);
    // 生成广告消息
    const forwardMessageId = utils.generateForwardMessageId("HeartTetrisbot", State.VerificationCode);
    //发送消息
    bot.sendMessage(chatId, forwardMessageId, {
        reply_markup: {
            resize_keyboard: true,
            one_time_keyboard: true,
            inline_keyboard: [
                [
                    {
                        text: '分享',
                        switch_inline_query: State.VerificationCode
                    }
                ],
                [
                    {
                        text: '收藏',
                        callback_data: "收藏"
                    }
                ],
            ],
        }
    }).then(res => {
        bot.sendMessage(chatId, "请复制以上代码进行群发", {
            reply_markup: {
                keyboard: button,
                resize_keyboard: true,
                one_time_keyboard: true,

            }
        })
    });

    //存公用广告
    let text1 = await redis.get("Text")
    let msg = {
        user_id: chatId,
        file_id: State.photoID,
        id: State.VerificationCode,
        text: text1 ? text1.substr(1) : "",
        button: State.replyButton,
        title: State.messageIdToReply
    }
    redis.hmset(State.DBname, State.VerificationCode, JSON.stringify(msg))
}
async function Myad(bot, chatId, utils, redis) {
    MyAdvertise = await utils.getMyAdvertise(redis, chatId) //获取数据库广告
    if (utils.isEmpty(MyAdvertise)) {
        return bot.sendMessage(chatId, "你还没有发布广告")
    }
    let sendmsg = ""
    let index = 1
    for (key in MyAdvertise) {
        console.log(JSON.parse(MyAdvertise[key]), "打印单条广告");
        let data = JSON.parse(MyAdvertise[key])
        sendmsg += `\n${index}.${data.title}\n
       \n@HeartTetrisbot ${data.id}\n
       \n🗑/delete_${data.id.substring(data.id.length - 6)}`
        index++
    }
    bot.sendMessage(chatId, sendmsg)
}
function resetAse(bot, chatId, redis) {
    redis.del(chatId, (err, result) => { //删除广告
        if (err) {
            console.error('Error flushing all databases:', err);
        } else {
            console.log('Flushed all databases:', result);
            bot.sendMessage(chatId, "我的广告已删除")
        }
    });
}
function adminReset() { //管理员删除
    redis.flushall((err, result) => {
        if (err) {
            console.error('Error flushing all databases:', err);
        } else {
            console.log('Flushed all databases:', result);
            bot.sendMessage(chatId, "我的广告已删除")
        }
    });
}
function callbackhom(bot, chatId) {
    const button = [['我的广告', '创建广告']]; //初试内联按钮
    bot.sendMessage(chatId, "请重新开始", {
        reply_markup: {
            keyboard: button, // 自定义按钮文本
            resize_keyboard: true, // 调整键盘大小以适应内容
            one_time_keyboard: false, // 不关闭键盘后再次打开时保持上次状态

        }
    })
}
module.exports = {
    CreateAse,
    Ready,
    Myad,
    resetAse,
    adminReset,
    callbackhom
}