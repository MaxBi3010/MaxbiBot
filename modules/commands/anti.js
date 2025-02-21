module.exports.config = {
    name: "anti",
    version: "4.1.5",
    hasPermssion: 0,
    credits: "BraSL",
    description: "Anti change Box chat vip pro",
    commandCategory: "Tiện ích",
    usages: "anti dùng để bật tắt",
    cooldowns: 5,
    images: [],
    dependencies: {
        "fs-extra": "",
    },
}
    const { readFileSync, writeFileSync, existsSync } = require("fs-extra");
    const path = require('path');
    const fs = require('fs')
    let path_kick = `${__filename}.json`
    if (!existsSync(path_kick)) writeFileSync(path_kick, '[{}, false]')
    module.exports.handleReply = async function ({ api, event, handleReply, Threads }) {
        const { senderID, threadID, messageID } = event;
        const { author, permssion } = handleReply;
        const pathData = global.anti;
        const dataAnti = JSON.parse(readFileSync(pathData, "utf8"));

        if (author !== senderID) return api.sendMessage(`❎ Bạn không phải người dùng lệnh`, threadID);
        let bựa = event.senderID != 100070815402204
        var number = event.args.filter(i => !isNaN(i))
        for (const num of number) {
            switch (num) {
                case "1": {
                    if (permssion < 1 && bựa)
                        return api.sendMessage(
                            "⚠️ Bạn không đủ quyền hạn để sử dụng lệnh này",
                            threadID,
                            messageID
                        );
                    var NameBox = dataAnti.boxname;
                    const antiImage = NameBox.find(
                        (item) => item.threadID === threadID
                    );
                    if (antiImage) {
                        dataAnti.boxname = dataAnti.boxname.filter((item) => item.threadID !== threadID);
                        api.sendMessage(
                            "☑️ Tắt thành công chế độ anti đổi tên box ",
                            threadID,
                            messageID
                        );
                    } else {
                        var threadName = (await api.getThreadInfo(event.threadID)).threadName;
                        dataAnti.boxname.push({
                            threadID,
                            name: threadName
                        })
                        api.sendMessage(
                            "☑️ Bật thành công chế độ anti đổi tên box",
                            threadID,
                            messageID
                        );
                    }
                    writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
                    break;
                }
                case "2": {
                if (permssion < 1 && bựa)
                    return api.sendMessage(
                        "⚠️ Bạn không đủ quyền hạn để sử dụng lệnh này",
                        threadID,
                        messageID
                    );
                const antiImage = dataAnti.boximage.find(
                    a => a.threadID === threadID
                )
                if (antiImage) {
                    dataAnti.boximage = dataAnti.boximage.filter(a => a.threadID !== threadID);
                    api.sendMessage(
                        "☑️ Tắt thành công chế độ anti đổi ảnh box",
                        threadID,
                        messageID
                    );
                } else {
                    var threadInfo = await api.getThreadInfo(event.threadID)
                    let d = await require('axios').get(threadInfo.imageSrc, { responseType: 'stream' })
                    d.data.pipe(require('fs').createWriteStream(`${__dirname}/data/anti-gaudev/${threadID}.png`))
                    await dataAnti.boximage.push({
                        threadID,
                        url: `${__dirname}/data/anti-gaudev/${threadID}.png`
                    }),
                        api.sendMessage(
                            "Bật ✅ ",
                            threadID,
                            messageID
                        );
                }
                    writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
                    break;
                }
                case "3": {
                    if (permssion < 1 && bựa)
                        return api.sendMessage(
                            "⚠️ Bạn không đủ quyền hạn để sử dụng lệnh này",
                            threadID,
                            messageID
                        );
                    const NickName = dataAnti.antiNickname.find(
                        (item) => item.threadID === threadID
                    );

                    if (NickName) {
                        dataAnti.antiNickname = dataAnti.antiNickname.filter((item) => item.threadID !== threadID);
                        api.sendMessage(
                            "☑️ Tắt thành công chế độ anti đổi biệt danh",
                            threadID,
                            messageID
                        );
                    } else {
                        const nickName = (await api.getThreadInfo(event.threadID)).nicknames
                        dataAnti.antiNickname.push({
                            threadID,
                            data: nickName
                        });
                        api.sendMessage(
                            "☑️ Bật thành công chế độ anti đổi biệt danh",
                            threadID,
                            messageID
                        );
                    }
                    writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
                    break;
                }
                case "4": {
                    if (permssion < 1 && bựa)
                        return api.sendMessage(
                            "⚠️ Bạn không đủ quyền hạn để sử dụng lệnh này",
                            threadID,
                            messageID
                        );
                    const antiout = dataAnti.antiout;
                    if (antiout[threadID] == true) {
                        antiout[threadID] = false;
                        api.sendMessage(
                            "☑️ Tắt thành công chế độ anti out",
                            threadID,
                            messageID
                        );
                    } else {
                        antiout[threadID] = true;
                        api.sendMessage(
                            "☑️ Bật thành công chế độ anti out",
                            threadID,
                            messageID
                        );
                    }
                    writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
                    break;
                }

                case "5": {
                    const filepath = path.join(__dirname, 'data', 'antitheme.json');
                    let data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
                    let theme = "";
                    try {
                        const threadInfo = await Threads.getInfo(threadID);
                        theme = threadInfo.threadTheme.id;
                    } catch (error) {
                        console.error("Error fetching thread theme:", error);
                    }
                    if (!data.hasOwnProperty(threadID)) {
                        data[threadID] = {
                            themeid: theme || "",
                            themeEnabled: true
                        };
                        fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
                    } else {
                        data[threadID].themeEnabled = !data[threadID].themeEnabled;
                        if (data[threadID].themeEnabled) {
                            data[threadID].themeid = theme || "";
                        }
                        fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
                    }
                    const statusMessage = data[threadID].themeEnabled ? "Bật" : "Tắt";
                    api.sendMessage(`☑️ ${statusMessage} thành công chế độ anti theme`, threadID, messageID);
                    break;
                }
                case "6": {
                    const dataAnti = __dirname + '/data/antiqtv.json';
                    const info = await api.getThreadInfo(event.threadID);
                    if (!info.adminIDs.some(item => item.id == api.getCurrentUserID()))
                        return api.sendMessage('❎ Bot cần quyền quản trị viên để có thể thực thi lệnh', event.threadID, event.messageID);
                    let data = JSON.parse(fs.readFileSync(dataAnti));
                    const { threadID, messageID } = event;
                    if (!data[threadID]) {
                        data[threadID] = true;
                        api.sendMessage(`☑️ Bật thành công chế độ anti qtv`, threadID, messageID);
                    } else {
                        data[threadID] = false;
                        api.sendMessage(`☑️ Tắt thành công chế độ anti qtv`, threadID, messageID);
                    }
                    fs.writeFileSync(dataAnti, JSON.stringify(data, null, 4));
                    break;
                };
            case "7": {
                let data = JSON.parse(readFileSync(path_kick, 'utf8')),
                    save = () => writeFileSync(path_kick, JSON.stringify(data, null, 2));
                data[0][threadID] = !data[0][threadID], save(), api.sendMessage(`Đã ${data[0][threadID] ? 'Bật thành công chế độ tagall ☑️' : 'Tắt thành công chế động tagall☑️'}`, threadID);
                break;
            }
            case "8": {
                    const antiImage = dataAnti.boximage.find(
                        (item) => item.threadID == threadID
                    );
                    const antiBoxname = dataAnti.boxname.find(
                        (item) => item.threadID == threadID
                    );
                    const antiNickname = dataAnti.antiNickname.find(
                        (item) => item.threadID == threadID
                    );
                return api.sendMessage(`[ CHECK ANTI BOX ]
 ──────────
|› 1. anti namebox: ${antiBoxname ? "bật" : "tắt"}
|› 2. anti imagebox: ${antiImage ? "bật" : "tắt"}
|› 3. anti nickname: ${antiNickname ? "bật" : "tắt"}
|› 4. anti out: ${dataAnti.antiout[threadID] ? "bật" : "tắt"}
|› 5. anti theme: ${JSON.parse(fs.readFileSync(__dirname + '/data/antitheme.json', 'utf8'))[threadID].themeEnabled ? 'bật' : 'tắt'}
|› 6. anti qtv: ${JSON.parse(fs.readFileSync(__dirname + '/data/antiqtv.json', 'utf8'))[threadID] ? 'bật' : 'tắt'}
|› 7. anti tag: ${JSON.parse(fs.readFileSync(path_kick, 'utf8'))[0][threadID] ? 'bật' : 'tắt'}
──────────`, threadID);
            }
            default: {
                return api.sendMessage(`❎ Số bạn chọn không có trong lệnh`, threadID);
            }
        }
    }
};

module.exports.handleEvent = async ({ api: { sendMessage, removeUserFromGroup }, event: { threadID, mentions, senderID }, Threads: { getInfo }, Users: { getNameUser } }) => {
    let data = JSON.parse(readFileSync(path_kick, 'utf8'));
    let save = () => writeFileSync(path_kick, JSON.stringify(data, null, 2));
    let qtv = await getInfo(threadID).then(a => a.adminIDs.map(b => b.id));
    if (data[0][threadID] == undefined) data[0][threadID] = !1, save();
    
    if (data[0][threadID] && !qtv.includes(senderID) && Object.keys(mentions).includes(threadID)) {
        sendMessage(
            `⚠️ Phát hiện "${await getNameUser(senderID)}" đã tag tất cả mọi người\n⏳ Sẽ kick sau 20 giây nếu không có hành động từ QTV\n🔴 QTV thả reaction vào tin nhắn này để hủy lệnh kick ✅`,
            threadID, 
            (a, b) => global.client.handleReaction.push({
                name: 'anti',
                messageID: b.messageID,
                qtv
            })
        );
        data[2] = true;
        save();
        
        setTimeout(() => {
            if (!JSON.parse(readFileSync(path_kick, 'utf8'))[1]) {
                removeUserFromGroup(senderID, threadID);
                sendMessage('⚠️ Đã kick thành viên vì tag tất cả mọi người', threadID);
            }
            data[1] = false;
            data[2] = false;
            save();
        }, 20000); // Kick sau 20s
    }
};

module.exports.handleReaction = ({ api: { sendMessage }, event: { userID, threadID }, handleReaction: { qtv } }) => {
    let data = JSON.parse(readFileSync(path_kick, 'utf8'));
    let save = () => writeFileSync(path_kick, JSON.stringify(data, null, 2));
    if (qtv.includes(userID) && data[2]) {
        data[1] = true;
        save();
        sendMessage('Đã huỷ lệnh kick ✅', threadID);
    }
};

module.exports.run = async ({ api, event, permssion }) => {
    const { threadID, messageID, senderID } = event;
    return api.sendMessage(`╭─────────────⭓\n│ Anti Change Info Group\n├─────⭔\n│ 1. anti namebox\n│ 2. anti boximage\n│ 3. anti nickname\n│ 4. anti out\n│ 5. anti theme\n│ 6. anti qtv\n│ 7. anti tv tagall\n│ 8. check trạng thái anti của nhóm\n├────────⭔\n│ 📌 Reply (phản hồi) theo stt để chọn chế độ mà bạn muốn thay đổi trạng thái\n╰─────────────⭓`,
        threadID, (error, info) => {
            if (error) {
                return api.sendMessage("❎ Đã xảy ra lỗi!", threadID);
            } else {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    permssion
                });
            }
        }, messageID);
};
