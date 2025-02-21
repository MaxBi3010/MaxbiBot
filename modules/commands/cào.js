const axios = require('axios');

module.exports.config = {
  name: "cào",
  version: "1.0.1",
  hasPermission: 3,
  credits: "L.V. Bằng",
  description: "Cào API cho vui :)",
  commandCategory: "Admin",
  usages: "<url> <số lượng> <type>",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const urlApi = args[0];
  const number = parseInt(args[1]);
  const type = args[2];
  if (!urlApi || !number || !type) {
    api.sendMessage('Vui lòng nhập đúng định dạng: <url> <số lượt> <type(là cái trỏ tới url data cần lấy)>', threadID, messageID);
    return;
  }

  api.sendMessage(`Đang bắt đầu crawl api: ${urlApi}\nSố lượng: ${number}\nLoading....`, threadID, messageID);

  let isAvailable = false;
  let dataUrls = [];

  while (!isAvailable) {
    try {
      const response = await axios.get(urlApi);
      if (response.status === 200) {
        if (!response.data[type]) {
          api.sendMessage('Bị chặn request, vui lòng chờ 2p....', threadID, messageID);//sợ spam thì comment lại
          await new Promise(resolve => setTimeout(resolve, 120000));//120000ms = 2p
          continue;
        } else {
          isAvailable = true;
        }
      } else {
        api.sendMessage(`Trạng thái: ${response.status}`, threadID, messageID);
        return;
      }
    } catch (error) {
      api.sendMessage(`Lỗi: ${error.message}. Đang thử lại sau 10 phút...`, threadID, messageID);
      await new Promise(resolve => setTimeout(resolve, 600000));
    }
  }

  for (let i = 0; i < number; i++) {
    try {
      const response = await axios.get(urlApi);
      if (!response.data[type]) {
        api.sendMessage('Bị chặn request, vui lòng chờ 2p....', threadID, messageID);//không muốn gửi nhiều thì comment lại trước api.send...
        await new Promise(resolve => setTimeout(resolve, 120000));
        continue;
      }
      if (response.status === 404) {
        api.sendMessage('Api die ( mã lỗi 404 )', threadID, messageID);
        return;
      }
      if (response.status === 200) {
        const dataUrl = response.data[type];
        if (dataUrl && !dataUrls.includes(dataUrl)) {
          dataUrls.push(dataUrl);
        }
      } else {
        api.sendMessage(`Trạng thái: ${response.status}`, threadID, messageID);
      }
    } catch (error) {
      api.sendMessage(`Lỗi số ${i}: ${error.message}`, threadID, messageID);
    }
  }

  try {
    const result = await axios.post("https://api.mocky.io/api/mock", {
      "status": 200,
      "content": `${JSON.stringify(dataUrls, null, 2)}`,
      "content_type": "application/json",
      "charset": "UTF-8",
      "secret": "AkihikoBot",
      "expiration": "never"
    });

    api.sendMessage(`Tổng: ${dataUrls.length}/${number}\nKết quả: ${result.data.link}`, threadID, messageID);
  } catch (error) {
    api.sendMessage(`Lỗi: ${error.message}`, threadID, messageID);
    console.error(`Đã xảy ra lỗi: ${error}`);
  }
}

/*
 mod gì cũng được nhưng giữ lại credit
 @credit: L.V. Bằng
 cảm ơn 
*/