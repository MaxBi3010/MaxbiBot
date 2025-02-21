module.exports = function ({ Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js");
    return async function ({ event }) {
        const { allUserID, allCurrenciesID, allThreadID, userName, threadInfo } = global.data;
        const { autoCreateDB } = global.config;

        if (autoCreateDB !== true) return;

        let { senderID, threadID } = event;
        senderID = String(senderID);
        threadID = String(threadID);

        try {
            if (!allThreadID.includes(threadID) && event.isGroup === true) {
                const threadIn4 = await Threads.getInfo(threadID);
                const setting = {
                    threadName: threadIn4.threadName,
                    adminIDs: threadIn4.adminIDs,
                    nicknames: threadIn4.nicknames
                };
                const dataThread = setting;
                allThreadID.push(threadID);
                threadInfo.set(threadID, dataThread);
                const setting2 = {
                    threadInfo: dataThread,
                    data: {}
                };
                await Threads.setData(threadID, setting2);
                for (const singleData of threadIn4.userInfo) {
                    const id = String(singleData.id);
                    userName.set(id, singleData.name);
                    try {
                        if (global.data.allUserID.includes(id)) {
                            await Users.setData(id, { name: singleData.name });
                        } else {
                            await Users.createData(id, {
                                name: singleData.name,
                                data: {}
                            });
                            global.data.allUserID.push(id);
                            logger(`Người dùng mới đã được tạo: ${id}`, '[ DATABASE ]');
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
                logger(`Nhóm mới đã được tạo: ${threadID}`, '[ DATABASE ]');
            }
            if (!allUserID.includes(senderID) || !userName.has(senderID)) {
                const infoUsers = await Users.getInfo(senderID);
                const setting3 = { name: infoUsers.name };
                await Users.createData(senderID, setting3);
                allUserID.push(senderID);
                userName.set(senderID, infoUsers.name);
                logger(`Người dùng mới đã được tạo: ${senderID}`, '[ DATABASE ]');
            }
            if (!allCurrenciesID.includes(senderID)) {
                const setting4 = { data: {} };
                await Currencies.createData(senderID, setting4);
                allCurrenciesID.push(senderID);
            }
        } catch (err) {
            console.log(err);
        }
    };
};
