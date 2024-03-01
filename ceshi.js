const TelegramBot = require('node-telegram-bot-api');

const token = '6445269699:AAGHNcyWNl-wfDM0IdmWbaX7yVmiil4BWGs';
const bot = new TelegramBot(token, { polling: true });



// 保存机器人最后一条发送的消息的消息 ID
let lastMessageId = null;

// 监听用户发送的消息
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    // 检查是否是回复消息，并且是否是回复机器人最后一条消息
    if (msg.reply_to_message && msg.reply_to_message.message_id === lastMessageId) {
        // 执行相应操作，例如记录用户的回复
        console.log(`用户回复了机器人的消息：${msg.text}`);
    } else {
        // 不是回复消息，记录机器人发送的消息 ID，以便后续引用
        lastMessageId = messageId;
        // 例如，向用户发送一条消息，以便用户可以回复
        bot.sendMessage(chatId, '请回复此消息以执行特定操作。');
    }
});

