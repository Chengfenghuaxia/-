const fmtButton = require('./messageTask/format_button')
module.exports = async function (bot, msg, redis, utils, State, SendReg) {
    const button = [['我的广告', '创建广告']]; //初试内联按钮
    text = ""
    const chatId = msg.chat.id;

    //开启定时发送任务
    SendReg.SendRegularly(bot, msg)

    const messageText = msg.text;
    console.log(messageText);
    if (msg.text == "/start") {
        bot.sendMessage(chatId, "你好，我是您的机器人小助手", {
            reply_markup: {
                keyboard: button, // 自定义按钮文本
                resize_keyboard: true, // 调整键盘大小以适应内容
                one_time_keyboard: false // 不关闭键盘后再次打开时保持上次状态
            }
        })
    }

    if (msg.photo && msg.photo[0].file_id.length > 0) {
        State.photoID = msg.photo[0].file_id
        text = "按以下格式发送链接：\n格式+按钮文字+合法链接\n\n例子：\n格式+客服+https://t.me/TransioBot\n\n要将多个按钮添加到一行，请从新行写入新链接。\n格式：\n[第一个文字+第一个链接]\n[第二条文字+第二条链接]"
        bot.sendMessage(chatId, text)
    }

    if (msg.text.includes('：')) {
        redis.set('Text', msg.text);
    }

    if (msg.text.slice(0, 2) == "格式") {
        //单按钮&多按钮处理逻辑
        fmtButton(bot, msg, redis, utils, State)
    }
    if (utils.iswenben && msg.text.includes('：')) {
        text = "按以下格式发送链接：\n格式+按钮文字+合法链接\n\n例子：\n 格式+客服+https://t.me/HeartTetrisbot\n\n要将多个按钮添加到一行，请从新行写入新链接。\n格式：\n[第一个文字+第一个链接]\n[第二条文字+第二条链接]"
        bot.sendMessage(chatId, text)
    }
    if (utils.waitingForReply) {
        utils.messageIdToReply = messageText
        utils.waitingForReply = false
        let text = await redis.get("Text")
        let msgs = {
            file_id: State.photoID,
            id: utils.VerificationCode,
            text: text ? text.substr(1) : "",
            button: utils.replyButton,
            title: utils.messageIdToReply
        }
        redis.set(utils.VerificationCode, JSON.stringify(msgs), function (err, reply) {
            if (err != null) {
                console.log(err);
                return
            }
            bot.sendMessage(chatId, "收藏成功")
        });
    }

    bot.getUpdates().then(res => {
        res.map(async val => {
            switch (val.message.text) {
                case "给我一张图片":
                    let text = await redis.get("text")
                    let url = await redis.get("url")
                    let ok = utils.isUrl(url)
                    if (!ok) {
                        bot.sendMessage(chatId, "请输入正确的链接")

                    } else {
                        bot.sendPhoto(chatId, State.photoID, {
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        { text, url },
                                    ]
                                ],
                            }
                        });
                    }
                    break;
                case "创建广告":
                    bot.sendMessage(chatId, "请选择广告类型", {
                        reply_markup: {
                            keyboard: [['Text', 'Photo'], ['返回']], // 自定义按钮文本
                            resize_keyboard: true, // 调整键盘大小以适应内容
                            one_time_keyboard: false, // 不关闭键盘后再次打开时保持上次状态
                        }
                    });
                    break;
                case "Photo":
                    bot.sendMessage(chatId, "请发送图片")
                    break
                case "Text":
                    bot.sendMessage(chatId, "请输入文本(文本以中文：开头)")
                    utils.iswenben = true
                    break
                case "准备就绪":
                    utils.VerificationCode = utils.generateRandomString(12, utils.type);
                    const forwardMessageId = utils.generateForwardMessageId("HeartTetrisbot", utils.VerificationCode);
                    bot.sendMessage(chatId, `${forwardMessageId}`, {
                        reply_markup: {
                            resize_keyboard: true,
                            one_time_keyboard: true,
                            inline_keyboard: [
                                [
                                    {
                                        text: '分享',
                                        switch_inline_query: utils.VerificationCode
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
                    break
                case "我的广告":
                    MyAdvertise = await utils.getMyAdvertise(redis) //获取数据库广告
                    if (MyAdvertise.length == 0) {
                        return bot.sendMessage(chatId, "你还没有发布广告")
                    }
                    let sendmsg = ""
                    console.log(MyAdvertise, "查看广告是否完整");
                    MyAdvertise.map((item, index) => {
                        sendmsg += `\n${index + 1}.${item.title}\n
                       \n@HeartTetrisbot ${item.id}\n
                       \n🗑/delete_${item.id.substring(item.id.length - 6)}`
                    })
                    bot.sendMessage(chatId, sendmsg)
                    break

                case "/reset":
                    //删除所有键
                    redis.flushall((err, result) => {
                        if (err) {
                            console.error('Error flushing all databases:', err);
                        } else {
                            console.log('Flushed all databases:', result);
                            bot.sendMessage(chatId, "我的广告已删除")
                        }
                    });
                    break

                case "返回":
                    bot.sendMessage(chatId, "请重新开始", {
                        reply_markup: {
                            keyboard: button, // 自定义按钮文本
                            resize_keyboard: true, // 调整键盘大小以适应内容
                            one_time_keyboard: false, // 不关闭键盘后再次打开时保持上次状态

                        }
                    })
                    break

                default:
                    console.log("未知消息");
                    break;
            }
        })
    })
}