// 不同情况下按钮处理
module.exports = function (bot, msg, redis, utils, State) {
    const chatId = msg.chat.id;
    if (msg.text.split('\n').length == 1) {   //如果是单个按钮
        let cq = msg.text.split('+')
        if (cq[0] == "格式" && cq.length == 3) {
            let button = [
                { text: cq[1], url: cq[2] },
            ]
            State.replyButton = [button]
            redis.get("Text").then(res => {
                if (State.iswenben) {   //如果是文本类型广告
                    State.type = "WB"
                    State.iswenben = false
                    bot.sendMessage(chatId, res.substr(1), {
                        reply_markup: {
                            inline_keyboard: [
                                button,
                            ],
                        }
                    }).then(res => {
                        let text = "帖子的大致视图已准备就绪。如果一切正确，请单击“准备就绪”按钮。"
                        bot.sendMessage(chatId, text, {
                            reply_markup: {
                                keyboard: [['准备就绪']], // 自定义按钮文本
                                resize_keyboard: true, // 调整键盘大小以适应内容
                                one_time_keyboard: false, // 不关闭键盘后再次打开时保持上次状态

                            }
                        })
                    })
                } else {  //图片类型
                    State.type = "TP"
                    let ok = utils.isUrl(cq[2])
                    if (!ok) {
                        bot.sendMessage(chatId, "请输入正确的链接")
                    } else {
                        bot.sendPhoto(chatId, State.photoID, {
                            reply_markup: {
                                inline_keyboard: [
                                    button
                                ],
                            }
                        }).then(res => {
                            let text = "帖子的大致视图已准备就绪。如果一切正确，请单击“准备就绪”按钮。"
                            bot.sendMessage(chatId, text, {
                                reply_markup: {
                                    keyboard: [['准备就绪']], // 自定义按钮文本
                                    resize_keyboard: true, // 调整键盘大小以适应内容
                                    one_time_keyboard: false, // 不关闭键盘后再次打开时保持上次状态

                                }
                            })
                        });

                    }
                }
            })

        }
    } else {  //多按钮广告
        let arrlist = msg.text.split('\n')
        let button = arrlist.map(item => {
            let cq = item.split('+')
            if (cq[0] == "格式" && cq.length == 3) {
                return [{ text: cq[1], url: cq[2] }]
            }
        })
        State.replyButton = button
        if (true) {
            redis.get("Text").then(res => {
                if (State.iswenben) {
                    State.type = "WB"
                    State.iswenben = false
                    bot.sendMessage(chatId, res.substr(1), {
                        reply_markup: {
                            inline_keyboard: button,
                        }
                    }).then(res => {
                        let text = "帖子的大致视图已准备就绪。如果一切正确，请单击“准备就绪”按钮。"
                        bot.sendMessage(chatId, text, {
                            reply_markup: {
                                keyboard: [['准备就绪']], // 自定义按钮文本
                                resize_keyboard: true, // 调整键盘大小以适应内容
                                one_time_keyboard: false, // 不关闭键盘后再次打开时保持上次状态

                            }
                        })
                    });
                } else {
                    console.log("是否走了这里");
                    State.type = "TP"
                    let ok = utils.isUrl(button[0][0].url)
                    if (!ok) {
                        bot.sendMessage(chatId, "请输入正确的链接")
                    } else {
                        bot.sendPhoto(chatId, State.photoID, {
                            reply_markup: {
                                inline_keyboard: button,
                            }
                        }).then(res => {
                            let text = "帖子的大致视图已准备就绪。如果一切正确，请单击“准备就绪”按钮。"
                            bot.sendMessage(chatId, text, {
                                reply_markup: {
                                    keyboard: [['准备就绪']], // 自定义按钮文本
                                    resize_keyboard: true, // 调整键盘大小以适应内容
                                    one_time_keyboard: false, // 不关闭键盘后再次打开时保持上次状态

                                }
                            })
                        });

                    }
                }
            })
        }
    }
}