module.exports.config = {
    name: "addbox?",
    version: "1.0.0",
    hasPermssion: 2, 
    credits: "D-Jukie và mod gaudev",
    description: "Thêm người dùng vào tất cả các nhóm mà bot đang quản lý",
    commandCategory: "Nhóm",
    usages: "[link hoặc uid]",
    images: [],
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Threads, Users }) {
    const { threadID, messageID } = event;
    const link = args.join(" ");
    const axios = require('axios');
    if (!args[0]) 
        return api.sendMessage('❎ Vui lòng nhập link hoặc id người dùng muốn thêm vào nhóm!', threadID, messageID);
    let uidUser;
    let userName = "người dùng";
    if (link.indexOf(".com/") !== -1) {
        try {
            uidUser = await api.getUID(args[0]);
            const userInfo = await api.getUserInfo(uidUser);
            userName = userInfo[uidUser]?.name || "người dùng";
        } catch (err) {
            return api.sendMessage('❎ Không thể lấy UID từ liên kết đã cung cấp!', threadID, messageID);
        }
    } else {
        uidUser = args[0];
        const userInfo = await api.getUserInfo(uidUser);
        userName = userInfo[uidUser]?.name || "người dùng";
    }
    const threadList = await api.getThreadList(100, null, ["INBOX"]);
    const threads = threadList.filter(item => item.isGroup);
    let successCount = 0;
    let errorCount = 0;
    for (const thread of threads) {
        const { threadID, participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(thread.threadID);
        if (participantIDs.includes(uidUser)) continue;

        try {
            await api.addUserToGroup(uidUser, threadID);
            if (approvalMode && !adminIDs.some(item => item.id == api.getCurrentUserID())) {
                api.sendMessage(
                    `📝 Admin cần thêm ${userName} vào box QTV vui lòng duyệt.`,
                    threadID
                );
            } else {
                successCount++;
            }
        } catch (err) {
            errorCount++;
        }
    }
    return api.sendMessage(
        `✅ Đã thêm thành công vào ${successCount} nhóm.\n❎ Không thể thêm vào ${errorCount} nhóm.`,
        threadID,
        messageID
    );
};
