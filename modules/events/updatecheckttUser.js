const fs = require('fs');
const path = require('path');
const logger = require("../../utils/log.js");
this.config = {
    name: "updateChecktt",
    eventType: ["log:unsubscribe"],
    version: "1.0.0",
    credits: "DongDev",
    description: "Xóa dữ liệu tương tác khi người dùng hoặc bot thoát khỏi nhóm"
};
this.run = async function ({ event, api }) {
    try {
        const { threadID, logMessageData } = event;
        const { leftParticipantFbId } = logMessageData;
        const botID = api.getCurrentUserID();     
        if (leftParticipantFbId === botID) {
            const checkttPath = path.join(__dirname, '../commands/checktt/');
            const filePath = path.join(checkttPath, `${threadID}.json`);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                logger(`Đã xóa dữ liệu tương tác của nhóm: ${threadID} do bot rời khỏi nhóm`, "[ UPDATE DATA ]");
            }
        } else {
            const checkttPath = path.join(__dirname, '../commands/checktt/');
            const filePath = path.join(checkttPath, `${threadID}.json`);
            if (fs.existsSync(filePath)) {
                let threadData = JSON.parse(fs.readFileSync(filePath));               
                const userData_week_index = threadData.week.findIndex(e => e.id === leftParticipantFbId);
                const userData_day_index = threadData.day.findIndex(e => e.id === leftParticipantFbId);
                const userData_total_index = threadData.total.findIndex(e => e.id === leftParticipantFbId);
                
                if (userData_total_index !== -1) {
                    threadData.total.splice(userData_total_index, 1);
                }
                if (userData_week_index !== -1) {
                    threadData.week.splice(userData_week_index, 1);
                }
                if (userData_day_index !== -1) {
                    threadData.day.splice(userData_day_index, 1);
                }                
                fs.writeFileSync(filePath, JSON.stringify(threadData, null, 4));
                logger(`Đã xóa dữ liệu tương tác của người dùng: ${leftParticipantFbId} | ${threadID}`, "[ UPDATE DATA ]");
           }
        }
    } catch (error) {
        console.error("Lỗi khi xóa dữ liệu tương tác:", error);
    }
};