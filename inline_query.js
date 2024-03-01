module.exports = async function (bot, msg, redis, utils,State,MyAdvertise) {

    const queryId = msg.id;
    const queryText = msg.query;
    let results = []
    let MyAdvertises = await MyAdvertise
    if (utils.VerificationCode == queryText) {
        let iswb = queryText.slice(0, 2); //是否文本
        if (iswb == "WB") {
            let text = await redis.get('Text');
            results = [
                {
                    type: 'article',
                    id: '1',
                    title: '点击发送',
                    input_message_content: {
                        message_text: text.slice(1)
                    },
                    reply_markup: {
                        inline_keyboard: utils.replyButton
                    }
                }
            ]
        } else {
            console.log('进入了下面');
            results = [
                {
                    type: 'photo',
                    id: '1',
                    photo_file_id: State.photoID,
                    title: 'Photo with Button',
                    reply_markup: {
                        inline_keyboard: utils.replyButton
                    }
                },

                // 添加更多内联查询结果...
            ];
        }

    } else {
        MyAdvertises.map(async item => {
            if (queryText == item.id) {
                console.log(item, "查看单个ID广告");
                let iswb = item.id.slice(0, 2); //是否文本
                if (iswb == "WB") {
                    results = [
                        {
                            type: 'article',
                            id: '1',
                            title: '点击发送',
                            input_message_content: {
                                message_text: item.text
                            },
                            reply_markup: {
                                inline_keyboard: item.button
                            }
                        }
                    ]
                } else {
                    results = [
                        {
                            type: 'photo',
                            id: '1',
                            photo_file_id: item.file_id,
                            title: 'Photo with Button',
                            reply_markup: {
                                inline_keyboard: item.button
                            }
                        },

                        // 添加更多内联查询结果...
                    ];
                }
            } else {
                console.log("一个都没对上");
            }
        })
    }

    // 回复内联查询
    bot.answerInlineQuery(queryId, results).then(res => {
        console.log("消息发送完了");
    });

}