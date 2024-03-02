//点击内联按钮的回调
module.exports = function (bot, callbackQuery, State){
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    console.log(callbackQuery);
    switch (data) {
        case "收藏":
            bot.sendMessage(chatId, "请输入标题:")
            State.waitingForReply = true

            break
        default:
            console.log("未知");
            break
    }
}