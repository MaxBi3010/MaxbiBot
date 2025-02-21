const axios = require('axios');
const fs = require('fs');

let path = __dirname + '/data/bot.json';
let data = {};
let save = () => fs.writeFileSync(path, JSON.stringify(data, null, 2));

if (!fs.existsSync(path)) save();
data = JSON.parse(fs.readFileSync(path));

module.exports = {
  config: {
    name: "sim",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "L.V. Bằng",
    description: "Auto trả lời người dùng",
    commandCategory: "Tiện ích",
    usages: "",
    cooldowns: 1,
  },

  run: ({ event, api }) => {
    let t = event.threadID;
    data[t] = data[t] === undefined ? false : !data[t]; // Toggle trạng thái sim
    save();
    api.sendMessage(`✅ ` + (data[t] ? 'Bật' : 'Tắt') + ` sim thành công`, t);
  },

  sim: async function (text) {
    const url = 'http://gau-api.click/gau';
    try {
      const response = await axios.get(url, { params: { type: 'ask', ask: text } });
      if (response.data && response.data.answer) {
        return response.data.answer;
      } else {
        return 'cái gì cơ? ';
      }
    } catch (err) {
      console.error(err.message || err.response?.data || err);
      return 'Lỗi không xác định khi kết nối API Gau Sim.';
    }
  },

  handleEvent: async function ({ event, api }) {
    if (event.senderID == api.getCurrentUserID()) return; // Tránh trả lời tin nhắn của chính bot
    if (data[event.threadID] === undefined) {
      data[event.threadID] = false;
      save();
    }
    if (data[event.threadID] === false) return; // Nếu sim tắt, không trả lời

    // Chỉ trả lời khi tin nhắn chứa từ "bot"
    if (event.body && event.body.toLowerCase().includes('bot') && !event.messageReply) {
      const answer = await this.sim(event.body);
      api.sendMessage(
        {
          body: answer,
        },
        event.threadID,
        (err, info) => {
          if (err) console.error(err);
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
          });
        },
        event.messageID
      );
    }
  },

  handleReply: async function ({ event, api }) {
    if (event.senderID == api.getCurrentUserID()) return; // Tránh trả lời tin nhắn của chính bot
    if (data[event.threadID] === undefined) {
      data[event.threadID] = false;
      save();
    }
    if (data[event.threadID] === false) return; // Nếu sim tắt, không trả lời

    // Trả lời tin nhắn trả lời, không yêu cầu từ "bot"
    if (event.messageReply) {
      const answer = await this.sim(event.body);
      api.sendMessage(
        {
          body: answer,
        },
        event.threadID,
        (err, info) => {
          if (err) console.error(err);
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
          });
        },
        event.messageID
      );
    }
  },
};
