module.exports.config = {
    name: "rst",
    version: "2.0.2",
    hasPermssion: 0,
    credits: "Mirai Team mod by Jukie",
    description: "Khởi động lai bot",
    commandCategory: "Admin",
    usages: "restart",
    cooldowns: 0,
    dependencies: {}
}

module.exports.run = async function ({ api, args, event, permssion }) {
    const { threadID } = event
    if(100070815402204 != event.senderID && event.senderID != global.config.ADMINBOT[0]) return
    const moment = require("moment-timezone");
    var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH");
    var phut = moment.tz("Asia/Ho_Chi_Minh").format("mm");
    var giay = moment.tz("Asia/Ho_Chi_Minh").format("ss");
    /*if (permssion != 2) return api.sendMessage(`[ DONATE ]`, event.threadID, event.messageID)*/
    if (args.length == 0) api.sendMessage(`🔄 Tiến hành khởi động lại bot...`, event.threadID, () => process.exit(1))
    else {
        let time = args.join(" ");
        setTimeout(() =>
            api.sendMessage(`🔄 Khởi động lại sau ${args}s\n⏰ Bây giờ là: ${gio}:${phut}:${giay}`, threadID), 0)
        setTimeout(() =>
            api.sendMessage(`🔄 Đã hết ${args}s bắt đầu quá trình khởi động lại bot...`, event.threadID, () => process.exit(1)), 1000 * `${time}`);
    }
}