module.exports = {
    StartSending:"start", // 开始发送命令
    EndSending:"endset", //结束发送命令
    sendtimes: [
        {
            hour: 22,
            minute: 50
        }, {
            hour: 21,
            minute: 57
        }
    ], //指定发送时间 sendtype为1时生效
    interval: '*/5 * * * * *', //间隔5秒发送一次  可自行调整  sendtype为2时生效 第三方库固定格式 不可更改
    sendtype: 2, //发送类型  1、指定时间发送一次  2、间隔n秒发送一次
    Chatid: "",//发送目标
    content: "", //消息内容
    type: 1, //广告类型 1图片 2文本
    mediaUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRY24IR8MKyO5H9MHVRX4zi6c_fa3umNmJMobEd7--oA&s',//支持服务器文件ID和在线资源 （图片）
    button: [
        [
            {
                text: '分享', //按键文字
                url: 'https://t.me/HeartTetrisbot' //跳转地址
            }
        ],
       
    ],//配置广告按钮
    Permiss:['用户chatid'] //开启群发用户权限
}