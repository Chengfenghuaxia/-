const updateBack = require('./messageTask/updates')
const fmtButton = require('./messageTask/format_button')
module.exports = async function (bot, msg, redis, utils, State, SendReg, config) {
    const button = [['我的广告', '创建广告']]; //初试内联按钮
    text = ""
    const chatId = msg.chat.id;
    State.chatId = chatId
    const messageText = msg.text;

    if (msg.photo && msg.photo[0].file_id.length > 0) {
        console.log("发图");
        State.photoID = msg.photo[0].file_id
        text = "按以下格式发送链接：\n格式+按钮文字+合法链接\n\n例子：\n格式+客服+https://t.me/TransioBot\n\n要将多个按钮添加到一行，请从新行写入新链接。\n格式：\n[第一个文字+第一个链接]\n[第二条文字+第二条链接]"
        bot.sendMessage(chatId, text)
    } else {
        console.log("发文本");
        if (msg.text && msg.text.includes('：')) {
            redis.set('Text', msg.text);
        }
    }

    if (msg.text && msg.text.slice(0, 2) == "格式") {
        //单按钮&多按钮处理逻辑
        fmtButton(bot, msg, redis, utils, State)
    }
    if (State.iswenben && msg.text.includes('：')) {
        text = "按以下格式发送链接：\n格式+按钮文字+合法链接\n\n例子：\n 格式+客服+https://t.me/HeartTetrisbot\n\n要将多个按钮添加到一行，请从新行写入新链接。\n格式：\n[第一个文字+第一个链接]\n[第二条文字+第二条链接]"
        bot.sendMessage(chatId, text)
    }
    //请输入广告名称
    if (State.waitingForReply) {
        utils.setAsdtitle(bot, State, messageText, redis, chatId)
    }
    let isPermiss = config.Permiss.some(item => {
        return item == msg.from.id  //指向用户
    })
    bot.getUpdates().then(res => {
        res.map(async val => {
            switch (val.message.text) {
                case '/start':     //启动机器人命令
                    bot.sendMessage(chatId, `你好，我是您的机器人小助手,您的ChatId为:${chatId}`, {
                        reply_markup: {
                            keyboard: button, // 自定义按钮文本
                            resize_keyboard: true, // 调整键盘大小以适应内容
                            one_time_keyboard: false // 不关闭键盘后再次打开时保持上次状态
                        }
                    })
                    break
                case config.startSending: //开启定时任务 发送广告
                    if (isPermiss) {
                        State.Intverval = SendReg.SendRegularly(bot, msg, config)
                    } else {
                        bot.sendMessage(chatId, "您没有权限开启定时任务")
                    }
                    break
                case config.endSending: //结束定时任务
                    if (isPermiss) {
                        let res = await State.Intverval
                        res ? res.cancel() : ''
                    } else {
                        bot.sendMessage(chatId, "您没有权限结束定时任务")
                    }
                    break
                case "创建广告":
                    updateBack.CreateAse(bot, chatId)
                    break;
                case "Photo":
                    bot.sendMessage(chatId, "请发送图片")
                    break
                case "Text":
                    bot.sendMessage(chatId, "请输入文本(文本以中文：开头)")
                    State.iswenben = true
                    break
                case "准备就绪":
                    updateBack.Ready(bot, chatId, State, utils)
                    break
                case "我的广告":
                    updateBack.Myad(bot, chatId, utils, redis)
                    break

                case "/reset":
                    updateBack.resetAse(bot, chatId, redis)
                    break

                case "/admin_reset": //管理员删除所有用户广告数据
                    updateBack.adminReset(bot, chatId, redis)
                    break
                case "我的id":
                    bot.sendMessage(chatId, `您的ID是:${chatId}`)
                    break
                case "返回":
                    updateBack.callbackhom(bot, chatId)
                    break

                default:
                    console.log("未知消息");
                    break;
            }
        })
    })
}