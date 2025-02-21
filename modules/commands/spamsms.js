module.exports.config = {
  name: "spamsms",
  version: "1.0.5",
  hasPermssion: 1,
  credits: "Dũngkon",
  description: "Spam sms hoặc call",
  commandCategory: "Tiện ích",
  usages: "spam sđt | số lần | time delay",
  cooldowns: 5,
};
module.exports.run = async function ({ api, event, args, Currencies, Users }) {
  if (this.config.credits !== "Dũngkon")
    return api.sendMessage(
      "Đã bảo đừng thay credits rồi mà không nghe, thay lại credits ngay không là đéo dùng được đâu nha",
      event.threadID,
      event.messageID
    );
  var data = await Currencies.getData(event.senderID);
  const axios = require("axios");
  var list_id = [];
  const sdt = args
    .join(" ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(\s+\|)/g, "|")
    .replace(/\|\s+/g, "|")
    .split("|")[0];
  const solan = args
    .join(" ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(\s+\|)/g, "|")
    .replace(/\|\s+/g, "|")
    .split("|")[1];
  const delay = args
    .join(" ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(\s+\|)/g, "|")
    .replace(/\|\s+/g, "|")
    .split("|")[2];
  if (!sdt)
    return api.sendMessage(
      `⚠️ Thiếu số điện thoại\n📝 Vui lòn nhập theo định dạng\n${global.config.PREFIX}spamsms số điện thoại | số lần | delay`,
      event.threadID,
      event.messageID
    );
  if (!solan)
    return api.sendMessage(
      `⚠️ Thiếu số lần\n📝 Vui lòn nhập theo định dạng\n${global.config.PREFIX}spamsms số điện thoại | số lần | delay`,
      event.threadID,
      event.messageID
    );
  if (!delay)
    return api.sendMessage(
      `⚠️ Thiếu time delay\n📝 Vui lòn nhập theo định dạng\n${global.config.PREFIX}spamsms số điện thoại | số lần | delay`,
      event.threadID,
      event.messageID
    );
  if (solan > 100 || solan == 101)
    return api.sendMessage("⚠️ Số lần không được quá 100 lần", event.threadID);
  if (sdt == 0368269220)
    return api.sendMessage(
      "⚠️ Không thể spam số này vì đây là số của admin",
      event.threadID
    );
  api.sendMessage(
    `🔄 Đang tiến hành spam\n📱Số điện thoại: ${sdt}\n🔢 Số lần: ${solan}\n⏰ Time delay: ${delay}\n👤 Người thực thi lệnh: ${
      (await Users.getData(event.senderID)).name
    }`,
    event.threadID
  );
  var data = await global.utils.getContent(
    `https://spam.dungkon.me/spam?sdt=${sdt}&luot=${solan}&delay=${delay}&apikey=niiozic`
  );
  console.log(data);
  if (data == null) return;
  let noti = data.data.message;
  let tong = data.data.totalCallApi;
  let thanhcong = data.data.success;
  let thatbai = data.data.fail;
  let soluot = data.data.soluot;
  return api.sendMessage(
    `📝 Trạng thái: ${noti}\n✏️ Tổng: ${tong}\n✅ Thành công: ${thanhcong}\n❎ Thất bại: ${thatbai}\n🔢 Số lượt: ${soluot}\nTime delay: ${delay}`,
    event.threadID
  );
};
