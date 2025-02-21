module.exports.config = {
    name: "edit",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "DongDev",
    description: "Edit tin nhắn bot vip pro",
    commandCategory: "Admin",
    usages: "[]",
    cooldowns: 5,
    images: [],
};

module.exports.run = async function({ args, api, event }) {
    let input = args.join(" ");
    if (!input) return api.sendMessage("❎ Bạn phải cung cấp nội dung để sửa", event.threadID, event.messageID);
    api.editMessage(input, event.messageReply.messageID);
}