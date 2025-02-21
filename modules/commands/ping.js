const request = require('request');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "ping",
    version: "1.0.1",
    hasPermssion: 1,
    credits: "Gaudev",
    description: "tag toàn bộ thành viên với tin nhắn và hình ảnh hoặc video reply",
    commandCategory: "Tiện ích",
    usages: "[Text]",
    cooldowns: 0
};

module.exports.run = async function({ api, event, args }) {
    try {
        const botID = api.getCurrentUserID();
        var listAFK, listUserID;
        global.moduleData["afk"] && global.moduleData["afk"].afkList ? listAFK = Object.keys(global.moduleData["afk"].afkList || []) : listAFK = []; 
        listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
        listUserID = listUserID.filter(item => !listAFK.includes(item));

        
        let message = event.messageReply ? event.messageReply.body : "@mọi người";
        let attachments = event.messageReply ? event.messageReply.attachments : [];
        var body = (args.length != 0) ? args.join(" ") : message;
        let mentions = [], index = 0;

        for (const idUser of listUserID) {
            body = "‎" + body;
            mentions.push({ id: idUser, tag: "‎", fromIndex: index - 1 });
            index -= 1;
        }

        let messageData = { body, mentions };
        let downloadedAttachments = [];

        if (attachments.length > 0) {
            for (const attachment of attachments) {
                if (attachment.type === "photo" || attachment.type === "video") {
                    const ext = attachment.type === "photo" ? "jpg" : "mp4";
                    const filePath = path.resolve(__dirname, `${attachment.type}_${Date.now()}.${ext}`);
                    await new Promise((resolve, reject) => {
                        request(attachment.url)
                            .pipe(fs.createWriteStream(filePath))
                            .on('close', () => {
                                downloadedAttachments.push(fs.createReadStream(filePath));
                                resolve();
                            })
                            .on('error', reject);
                    });
                }
            }
            messageData.attachment = downloadedAttachments;
        }

        api.sendMessage(messageData, event.threadID, (error, info) => {
            // Xóa file tạm sau khi gửi xong
            if (messageData.attachment) {
                messageData.attachment.forEach(file => fs.unlinkSync(file.path));
            }
        }, event.messageID);

    } catch (e) {
        console.log(e);
    }
}
