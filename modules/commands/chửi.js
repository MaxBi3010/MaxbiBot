const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'chuiData.json');

module.exports = {
    config: {
        name: "chửi",
        version: "1.0.0",
        hasPermssion: 0,
        credits: "gaudev",
        description: "Chửi người dùng được tag với từ ngẫu nhiên",
        commandCategory: "Game",
        usages: "chui @name hoặc chui add <từ chửi>",
        cooldowns: 5
    },
    run: async ({ api, event, args }) => {
        if (args[0] === "add") {
            // Thêm từ mới vào danh sách chửi
            const newWord = args.slice(1).join(" ");
            if (!newWord) {
                return api.sendMessage("Bạn phải nhập từ cần thêm!", event.threadID, event.messageID);
            }

            fs.readFile(dataPath, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return api.sendMessage("Có lỗi xảy ra khi đọc dữ liệu!", event.threadID, event.messageID);
                }

                let chuiData = JSON.parse(data);
                chuiData.words.push(newWord);

                fs.writeFile(dataPath, JSON.stringify(chuiData, null, 4), (err) => {
                    if (err) {
                        console.error(err);
                        return api.sendMessage("Có lỗi xảy ra khi lưu dữ liệu!", event.threadID, event.messageID);
                    }

                    api.sendMessage(`Đã thêm từ "${newWord}" vào danh sách chửi!`, event.threadID, event.messageID);
                });
            });
        } else {
            // Chửi người dùng được tag
            fs.readFile(dataPath, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return api.sendMessage("Có lỗi xảy ra khi đọc dữ liệu!", event.threadID, event.messageID);
                }

                let chuiData = JSON.parse(data);
                const chuiList = chuiData.words;
                const randomChui = chuiList[Math.floor(Math.random() * chuiList.length)];
                
                const mentions = Object.keys(event.mentions);

                if (mentions.length === 0) {
                    return api.sendMessage("Hãy tag người bạn muốn chửi!", event.threadID, event.messageID);
                }

                const message = `${event.mentions[mentions[0]].replace("@", "")} ${randomChui}`;
                api.sendMessage({ body: message, mentions: [{ tag: event.mentions[mentions[0]], id: mentions[0] }] }, event.threadID, event.messageID);
            });
        }
    }
};
