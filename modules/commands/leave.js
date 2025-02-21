module.exports.config = {
 name: "leave",
 version: "1.0.0",
 hasPermssion: 1,
 credits: "ManhG",
 description: "Bật tắt thông báo rời nhóm cho nhóm hiện tại",
 commandCategory: "Tiện ích",
 usages: "[on/off]",
 cooldowns: 2
};

module.exports.languages = {
 "vi": { 
 "on": "✅ Bật", 
 "off": "❌ Tắt",
 "successText": "gửi tin nhắn thông báo khi có thành viên rời nhóm chat", 
 },
 "en": { "on": "on", "off": "off", "successText": "send a notification message when a member leaves your chat group", }
}

const fs = require('fs');
const path = __dirname + '/data/dataEvent.json';

exports.onLoad = o => {
 if (!fs.existsSync(path)) fs.writeFileSync(path, '{}', 'utf8');
}

module.exports.run = async function ({ api, event, Threads, getText, args }) {
 if (!args[0] || (args[0] !== 'on' && args[0] !== 'off')) {
 return api.sendMessage('⚠️ Vui lòng chọn "on" hoặc "off"', event.threadID, event.messageID);
 }

 let data = JSON.parse(fs.readFileSync(path, 'utf8'));
 const { threadID, messageID } = event;
 if (!data.leave) data.leave = [];
 let find = data.leave.find(i => i.threadID == threadID);

 if (find) {
 find.status = args[0] === 'on';
 } else {
 find = data.leave.push({
 threadID,
 status: args[0] === 'on'
 });
 }

 fs.writeFileSync(path, JSON.stringify(data, null, 4), 'utf8');
 return api.sendMessage(`${args[0] === 'on' ? getText("on") : getText("off")} ${getText("successText")}`, threadID, messageID);
};