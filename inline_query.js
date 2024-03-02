module.exports = async function (bot, msg, redis, utils, State, MyAdvertise) {
    console.log(msg);
    const queryId = msg.id;
    const queryText = msg.query;
    const chatId = msg.from.id;
    let results = []
    let MyAdvertises = await MyAdvertise

    //首次变量保存
    if (State.VerificationCode == queryText) {
        let iswb = queryText.slice(0, 2); //是否文本
        if (iswb == "WB") {
            console.log(State.replyButton,"查看按钮数据1");
            let text = await redis.get('Text');
            console.log(text,"查看文本");
            results = [
                {
                    type: 'article',
                    id: '1',
                    title: '点击发送',
                    input_message_content: {
                        message_text: text.slice(1)
                    },
                    reply_markup: {
                        inline_keyboard: State.replyButton
                    }
                }
            ]
        } else {
            results = [
                {
                    type: 'photo',
                    id: '1',
                    photo_file_id: State.photoID,
                    title: 'Photo with Button',
                    reply_markup: {
                        inline_keyboard: State.replyButton
                    }
                },

                // 添加更多内联查询结果...
            ];
        }

    } else
    // else if (true) {
    //     //    暂存区
    //     let res = JSON.parse(await redis.hget(chatId, queryText))
    //     let iswb = res.id.slice(0, 2); //是否文本
    //     if (iswb == "WB") {
    //         results = [
    //             {
    //                 type: 'article',
    //                 id: '1',
    //                 title: '点击发送',
    //                 input_message_content: {
    //                     message_text: res.text
    //                 },
    //                 reply_markup: {
    //                     inline_keyboard: res.button
    //                 }
    //             }
    //         ]
    //     } else {
    //         results = [
    //             {
    //                 type: 'photo',
    //                 id: '1',
    //                 photo_file_id: res.file_id,
    //                 title: 'Photo with Button',
    //                 reply_markup: {
    //                     inline_keyboard: res.button
    //                 }
    //             },

    //             // 添加更多内联查询结果...
    //         ];
    //     }
    // }
    
    {
        //永久储存
        let res = JSON.parse(await redis.hget(chatId, queryText))
        let iswb = res.id.slice(0, 2); //是否文本
        if (iswb == "WB") {
            results = [
                {
                    type: 'article',
                    id: '1',
                    title: '点击发送',
                    input_message_content: {
                        message_text: res.text
                    },
                    reply_markup: {
                        inline_keyboard: res.button
                    }
                }
            ]
        } else {
            results = [
                {
                    type: 'photo',
                    id: '1',
                    photo_file_id: res.file_id,
                    title: 'Photo with Button',
                    reply_markup: {
                        inline_keyboard: res.button
                    }
                },

                // 添加更多内联查询结果...
            ];
        }
    }

    // 回复内联查询
    bot.answerInlineQuery(queryId, results).then(res => {
        console.log("消息发送完了");
    });

}