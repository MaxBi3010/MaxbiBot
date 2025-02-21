module.exports.config = {
    name: "timejoin",
    eventType: ["log:subscribe", "log:unsubscribe"],
    version: "1.0.0",
    credits: "Niio-team (Vtuan)",
    description: "Lưu lại thời gian vào nhóm"
};

const fs = require('fs-extra');
const path = "./modules/commands/cache/timeJoin/";
const file = "./modules/commands/cache/checktts/";

if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
}

module.exports.run = async function ({ event, api, Threads, Users }) {
    const filePath = `${path}${event.threadID}.json`;
    const filePATH = `${file}${event.threadID}.json`;
    let data = [];
    let datas = { day: [], week: [], total: [] };

    try {
        if (fs.existsSync(filePath)) {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            data = JSON.parse(fileContent);
        }
        if (fs.existsSync(filePATH)) {
            const files = await fs.readFile(filePATH, 'utf-8');
            datas = JSON.parse(files);
        }

        let { day: dataDay, week: dataWeek, total: dataTotal } = datas;
        if (event.logMessageType === 'log:subscribe') {
            const botID = api.getCurrentUserID();
            const joinTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

            if (event.logMessageData.addedParticipants.some(participant => participant.userFbId === botID)) {
                event.participantIDs.forEach(id => {
                    data.push({ id, time: joinTime });
                });
            } else {
                const newEntry = {
                    id: event.logMessageData.addedParticipants[0].userFbId,
                    time: joinTime
                };
                data.push(newEntry);
            }
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            await fs.writeFile(filePATH, JSON.stringify(datas, null, 2));
        } else if (event.logMessageType === 'log:unsubscribe') {
            const userID = event.logMessageData.leftParticipantFbId;
            const botID = api.getCurrentUserID();

            if (userID === botID) {
                await fs.unlink(filePath);
                await fs.unlink(filePATH);
            } else {
                data = data.filter(entry => entry.id !== userID);
                dataDay = dataDay.filter(entry => entry.id !== userID);
                dataWeek = dataWeek.filter(entry => entry.id !== userID);
                dataTotal = dataTotal.filter(entry => entry.id !== userID);

                datas.day = dataDay;
                datas.week = dataWeek;
                datas.total = dataTotal;

                await fs.writeFile(filePath, JSON.stringify(data, null, 2));
                await fs.writeFile(filePATH, JSON.stringify(datas, null, 2));
            }
        }
    } catch (error) {
        console.error("Error handling:", error);
    }
};
