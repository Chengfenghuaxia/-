
module.exports = {
    chatId:"",//用户ID  用于区分回话用户
    text: "", //发送文本
    photoID: "", //fileID
    iswenben: false, //发送类型是否文本
    VerificationCode: "", //广告转发验证编码
    replyButton: [], //内联监听返回按钮
    type: "", //文本类型
    waitingForReply: false,//是否等待回复
    messageIdToReply: null, //回复标题
    button : [['我的广告', '创建广告']] //初试内联按钮
}