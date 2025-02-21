this.config = {
    name: "updateQtv",
    eventType: ["log:thread-admins"],
    version: "1.0.1",
    credits: "DongDev",
    description: "Auto làm mới danh sách qtv nhóm",
};
this.run = async function({ event: { threadID, logMessageType}, api: { getThreadInfo, sendMessage: send } , Threads }) {
    switch (logMessageType) {
        case "log:thread-admins": {
            const threadInfo = await getThreadInfo(threadID);
            const qtvCount = threadInfo.adminIDs.length;
            await Threads.setData(threadID, { threadInfo });
            global.data.threadInfo.set(threadID, threadInfo);
            return send(`✅ Auto Update ${qtvCount} Quản trị viên cho nhóm!`, threadID);
        }
    }
};