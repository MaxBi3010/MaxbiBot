module.exports.config = {
    name: "kick",
    version: "1.0.1",
    hasPermssion: 1,
    credits: "Mirai - Edited",
    description: "Xoá người bạn cần xoá khỏi nhóm bằng cách tag hoặc reply",
    commandCategory: "Nhóm",
    usages: "[tag/reply/all]",
    cooldowns: 0
};

module.exports.run = async function({ args, api, event, Threads }) {
    const { participantIDs } = (await Threads.getData(event.threadID)).threadInfo;
    const botID = api.getCurrentUserID();
    let usersToKick = [];
    let kickSuccess = [];
    let kickFailed = false;

    try {
        if (args.join().indexOf('@') !== -1) {
            usersToKick = Object.keys(event.mentions);
        } else if (event.type === "message_reply") {
            usersToKick.push(event.messageReply.senderID);
        } else if (args[0] === "all") {
            usersToKick = participantIDs.filter(
                ID => ID !== botID && ID !== event.senderID
            );
        } else {
            return api.sendMessage(`❎ Vui lòng tag, reply hoặc sử dụng "all" để kick`, event.threadID, event.messageID);
        }

        usersToKick = usersToKick.filter(userID => userID !== botID);

        for (const userID of usersToKick) {
            try {
                await new Promise((resolve, reject) => {
                    api.removeUserFromGroup(userID, event.threadID, (err) => {
                        if (err) return reject(err);
                        kickSuccess.push(userID);
                        resolve();
                    });
                });
            } catch (error) {
                kickFailed = true;
            }
        }

        if (kickSuccess.length > 0) {
            api.sendMessage(
                `✅ Đã kick thành công ${kickSuccess.length} thành viên.`,
                event.threadID,
                event.messageID
            );
        }

        if (kickFailed) {
            api.sendMessage(
                `❎ Bot cần quyền quản trị viên để thực hiện thao tác này.`,
                event.threadID,
                event.messageID
            );
        }
    } catch (error) {
        return api.sendMessage('❌ Đã xảy ra lỗi, vui lòng thử lại sau.', event.threadID, event.messageID);
    }
};
