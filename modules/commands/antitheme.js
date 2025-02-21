const fs = require('fs');
const path = require('path');
exports.config = {
  name: "antitheme",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "DongDev",
  description: "Chống đổi chủ đề của nhóm",
  commandCategory: "Tiện ích",
  usages: "[]",
  cooldowns: 5,
  images: [],
};
exports.onLoad = function() {
  const filepath = path.join(process.cwd(), 'systemdata',  'data', 'antitheme.json');
  if (!fs.existsSync(filepath)) {
    const defaultData = {};
    fs.writeFileSync(filepath, JSON.stringify(defaultData, null, 2), 'utf8');
  }
};
exports.run = async function({ api, event, Threads }) {
  const { threadID, messageID } = event;
  const filepath = path.join(process.cwd(), 'systemdata', 'data', 'antitheme.json');
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
  const statusMessage = data[threadID].themeEnabled ? "bật" : "tắt";
  api.sendMessage(`✅ Đã ${statusMessage} anti theme cho nhóm!`, threadID, messageID);
};