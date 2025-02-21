const axios = require('axios');
const fs = require('fs-extra');
const moment = require('moment-timezone');

module.exports.config = {
  name: 'spt',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'gấu lỏ',
  description: 'Tìm kiếm và tải nhạc từ Spotify',
  commandCategory: 'Tiện ích',
  usages: '[]',
  cooldowns: 5,
  images: [],
};

const { searching, getInfo } = require('../../data_api/spt'); // Import từ module Spotify đã viết

module.exports.run = async function ({ api, event, args }) {
  const query = args.join(" ").trim();
  const { threadID, messageID } = event;

  if (!query) {
    return api.sendMessage("⚠️ Vui lòng nhập từ khóa tìm kiếm!", threadID, messageID);
  }

  try {
    const results = await searching(query);
    if (!results.status || results.data.length === 0) {
      return api.sendMessage(`❎ Không tìm thấy kết quả cho từ khóa: "${query}"`, threadID, messageID);
    }

    const messages = results.data.map((item, index) => 
      `${index + 1}. ${item.title}\n⏳ Thời lượng: ${item.duration}\n📶 Độ phổ biến: ${item.popularity}\n`
    );

    const listMessage = `📝 Kết quả tìm kiếm: "${query}"\n${messages.join("\n")}\n\n📌 Reply với số thứ tự để tải nhạc.`;

    api.sendMessage(listMessage, threadID, (err, info) => {
      global.client.handleReply.push({
        type: 'choose',
        name: this.config.name,
        author: event.senderID,
        messageID: info.messageID,
        data: results.data,
      });
    });
  } catch (error) {
    console.error("❎ Lỗi trong quá trình tìm kiếm:", error);
    api.sendMessage("❎ Đã xảy ra lỗi trong quá trình tìm kiếm.", threadID, messageID);
  }
};
module.exports.handleReply = async function ({ event, api, handleReply }) {
  const { body, threadID, messageID } = event;
  const choice = parseInt(body);

  if (isNaN(choice) || choice < 1 || choice > handleReply.data.length) {
    return api.sendMessage("❌ Lựa chọn không hợp lệ!", threadID, messageID);
  }

  const selected = handleReply.data[choice - 1];

  // Gửi thông tin bài hát hoặc tiến hành tải xuống
  api.sendMessage(`🎵 Bạn đã chọn: ${selected.title}\n⏳ Thời lượng: ${selected.duration}\n📶 Độ phổ biến: ${selected.popularity}`, threadID);
};
