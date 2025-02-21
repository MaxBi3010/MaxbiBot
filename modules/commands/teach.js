module.exports.config = {
  name: "teach",
  version: "2.9.7",
  hasPermssion: 1,
  credits: "DongDev",
  description: "Dạy bot (dùng cho lệnh sim)",
  commandCategory: "Tiện ích",
  usages: "câu hỏi => câu trả lời 1, câu trả lời 2, ...",
  cooldowns: 5,
  images: [],
  dependencies: {
    axios: ""
  }
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");
  const input = args.join(" ").split(' => ');

  // Kiểm tra nếu thông tin không đầy đủ
  if (input.length < 2 || !input[0] || !input[1]) {
    return api.sendMessage(
      "Vui lòng nhập thông tin đầy đủ (ví dụ: Teach bot => câu hỏi,câu trả lời 1,câu trả lời 2, ...)",
      event.threadID,
      event.messageID
    );
  }

  // Phân tách câu hỏi và danh sách câu trả lời
  const ask = input[0].trim(); // Câu hỏi
  const answers = input[1].split(',').map(ans => ans.trim()); // Danh sách câu trả lời

  // Kiểm tra nếu danh sách câu trả lời rỗng
  if (answers.length === 0 || answers.some(ans => ans === "")) {
    return api.sendMessage(
      "Danh sách câu trả lời không hợp lệ. Hãy nhập ít nhất một câu trả lời!",
      event.threadID,
      event.messageID
    );
  }

  let successList = [];
  let failedList = [];

  // Gửi từng câu trả lời lên API và xử lý phản hồi
  for (const ans of answers) {
    try {
      const response = await axios.get("http://gau-api.click/sim", {
        params: {
          type: 'teach',
          ask: ask,
          ans: ans
        }
      });

      if (response.data.error) {
        // Nếu API trả về lỗi, lưu thông tin vào danh sách lỗi
        failedList.push(ans);
      } else {
        // Nếu thành công, lưu vào danh sách thành công
        successList.push(ans);
      }
    } catch (error) {
      // Nếu lỗi từ hệ thống hoặc kết nối
      failedList.push(ans);
    }
  }

  // Tổng hợp kết quả gửi trả lại người dùng
  const summary = `
🔰 Kết quả dạy bot:
✅ Thành công: ${successList.length}
❌ Thất bại: ${failedList.length}

${successList.length > 0 ? `✅ Dạy thành công các câu trả lời: "${successList.join(', ')}"` : ""}
${failedList.length > 0 ? `❌ Thất bại với các câu trả lời: "${failedList.join(', ')}"` : ""}
`;

  return api.sendMessage(summary.trim(), event.threadID, event.messageID);
};
