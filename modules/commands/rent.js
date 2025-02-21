module.exports.config = {
   name: 'rent',
   version: '1.3.7',
   hasPermssion: 1,
   credits: 'DC-Nam & DongDev source lại',// gấu lỏ làm rent thêm xàm lồn
   description: 'thuê bot',
   commandCategory: 'Admin',
   usages: '[]',
   cooldowns: 5,
   usePrefix: false,
};

let fs = require('fs');
const moment = require('moment-timezone');
if (!fs.existsSync(__dirname + '/data')) 
   fs.mkdirSync(__dirname + '/data');
let path = __dirname + '/data/thuebot.json';
let data = [];
let save = () => fs.writeFileSync(path, JSON.stringify(data));
if (!fs.existsSync(path)) save();
else data = require(path);

let form_mm_dd_yyyy = (input = '', split = input.split('/')) => `${split[1]}/${split[0]}/${split[2]}`;
let invalid_date = date => /^Invalid Date$/.test(new Date(date));

exports.run = function (o) {
   let send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
   const adminUIDs = ["61571716324164", "100072696458960"];
   
   if (o.args[0] === 'info') {
   let t_id = o.event.threadID;
   let info = data.find(item => item.t_id === t_id);
   if (!info) return send(`⚠️ Nhóm này không có trong danh sách thuê bot!`);

   // Chuyển giá trị time_end từ JSON thành đối tượng moment
   let timeEnd = moment(info.time_end, "DD/MM/YYYY").tz("Asia/Ho_Chi_Minh");
   let timeNow = moment().tz("Asia/Ho_Chi_Minh");

   // Tính số ngày còn lại (làm tròn xuống để tránh sai lệch)
   let days_left = timeEnd.diff(timeNow, 'days'); // Lấy chênh lệch tính theo ngày

   // Tình trạng và thông báo số ngày còn lại
   let status = days_left >= 0 ? '✅ Còn hạn' : '❌ Đã hết hạn';
   let remaining_days = days_left >= 0 ? `${days_left} ngày` : 'Đã hết hạn';

   return send(`[ THÔNG TIN NHÓM THUÊ BOT ]\n\n` +
               `👤 Người thuê: ${global.data.userName.get(info.id) || 'Không xác định'}\n` +
               `🌐 Facebook: https://facebook.com/${info.id}\n` +
               `👥 Tên nhóm: ${(global.data.threadInfo.get(info.t_id) || {}).threadName || 'Không xác định'}\n` +
               `🔰 TID: ${info.t_id}\n` +
               `📆 Ngày thuê: ${info.time_start}\n` +
               `⏳ Ngày hết hạn: ${info.time_end}\n` +
               `📌 Tình trạng: ${status}\n` +
               `⏱️ Ngày còn lại: ${remaining_days}`);
}

   if (!adminUIDs.includes(o.event.senderID)) 
      return send(`⚠️ Chỉ Admin mới có quyền sử dụng lệnh này!`);

   switch (o.args[0]) {
      case 'add': {
   if (!o.args[1]) 
       return send(`⚠️ Hướng dẫn thêm người thuê bot:\n - thuebot add <số ngày thuê>\n - thuebot add <id người thuê> <số ngày thuê>\n - thuebot add <id nhóm> <id người thuê> <số ngày thuê>\n⚠️ Lưu ý: số ngày phải là số nguyên dương.`);
   
   let t_id = o.event.threadID;
   let id = o.event.senderID;
   let days = parseInt(o.args[1]);

   // Lấy ID người được reply hoặc mention
   if (o.event.type === "message_reply") {
       id = o.event.messageReply.senderID;
   } else if (Object.keys(o.event.mentions).length > 0) {
       id = Object.keys(o.event.mentions)[0];
   }
   
   if (isNaN(days) || days <= 0) 
       return send(`⚠️ Số ngày không hợp lệ!`);
   
   // Ngày hiện tại và ngày hết hạn
   let time_start = moment().tz("Asia/Ho_Chi_Minh").startOf('day').format("DD/MM/YYYY");
   let time_end = moment().tz("Asia/Ho_Chi_Minh").startOf('day').add(days, "days").format("DD/MM/YYYY");

   let existing = data.find(item => item.t_id === t_id);
   if (existing) {
       let oldEndDate = moment(existing.time_end, "DD/MM/YYYY");
       let newEndDate = oldEndDate.add(days, "days").format("DD/MM/YYYY");
       existing.time_end = newEndDate;

       send(`☑️ Đã gia hạn thêm ${days} ngày cho nhóm này!\nNgày hết hạn mới: ${newEndDate}`);
   } else {
       data.push({ t_id, id, time_start, time_end });
       send(`☑️ Đã thêm nhóm mới vào danh sách thuê bot!\nNgày hết hạn: ${time_end}`);
   }

   save();
   break;
}

      case 'lọc': {
         let gaudev = data.filter(group => new Date(form_mm_dd_yyyy(group.time_end)).getTime() < Date.now() + 25200000);
         if (gaudev.length === 0) return send(`☑️ Không có nhóm nào hết hạn.`);
         gaudev.forEach(group => {
            let index = data.indexOf(group);
            if (index !== -1) data.splice(index, 1);
            o.api.removeUserFromGroup(o.api.getCurrentUserID(), group.t_id, err => {
               if (err) console.log(`⚠️ Lỗi khi out khỏi nhóm ID ${group.t_id}:`, err);
            });
         });
         send(`☑️ Đã xóa và out khỏi ${gaudev.length} nhóm hết hạn.`);
         save();
         break;
      }
      case 'list': {
         send(`[ DANH SÁCH THUÊ BOT ]\n__________________\n${data.map(($, i) => `${i + 1}. ${global.data.userName.get($.id)}\nTình trạng: ${new Date(form_mm_dd_yyyy($.time_end)).getTime() >= Date.now() + 25200000 ? '✅' : '❎'}\nNhóm: ${(global.data.threadInfo.get($.t_id) || {}).threadName}`).join('\n__________________\n')}\n__________________\n⩺ Reply stt, del, out, giahan`, (err, res) => (res.name = exports.config.name,
            res.event = o.event, res.data = data,
            global.client.handleReply.push(res)));
         break;
      }
      default:
         send(`Dùng: ${global.config.PREFIX}thuebot add → Để thêm nhóm vào danh sách thuê bot\nDùng: ${global.config.PREFIX}thuebot list → Để xem danh sách thuê bot\n𝗛𝗗𝗦𝗗 → ${global.config.PREFIX}thuebot lệnh cần dùng.`);
   }
   save();
};

exports.handleReply = async function (o) {
   let _ = o.handleReply;
   let send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
   if (o.event.senderID != _.event.senderID) return;
   if (isFinite(o.event.args[0])) {
      let info = data[o.event.args[0] - 1];
      if (!info) return send(`❎ STT không tồn tại!`);
      return send(`[ THÔNG TIN NGƯỜI THUÊ BOT ]\n👤 Người thuê: ${global.data.userName.get(info.id)}\n🌐 Link Facebook: https://www.facebook.com/profile.php?id=${info.id}\n👥 Nhóm: ${(global.data.threadInfo.get(info.t_id) || {}).threadName}\n🔰 TID: ${info.t_id}\n📆 Ngày Thuê: ${info.time_start}\n⏳ Ngày hết Hạn: ${info.time_end} ${(() => {
         let time_diff = new Date(form_mm_dd_yyyy(info.time_end)).getTime() - (Date.now() + 25200000);
         if (time_diff <= 0) return "Đã hết thời hạn thuê 🔐";
         return '';
      })()}`);
   } else if (o.event.args[0].toLowerCase() == 'del') {
      o.event.args.slice(1).sort((a, b) => b - a).forEach($ => data.splice($ - 1, 1));
      send(`☑️ Đã xóa thành công!`);
   } else if (o.event.args[0].toLowerCase() == 'giahan') {
      let STT = o.event.args[1];
      let days = parseInt(o.event.args[2]);
      if (isNaN(days) || days <= 0) return send(`❎ Số ngày không hợp lệ!`);
      if (!data[STT - 1]) return send(`❎ STT không tồn tại`);
      let $ = data[STT - 1];
      let oldEndDate = moment($.time_end, 'DD/MM/YYYY');
      let tao_gấu_lỏ_trùm_thay_crd = oldEndDate.add(days, 'days').format('DD/MM/YYYY');
      $.time_end = tao_gấu_lỏ_trùm_thay_crd;
      send(`☑️ Đã gia hạn nhóm thêm ${days} ngày!`);
      const threadData = global.data.threadData.get($.t_id) || {};
      const PREFIX_GROUP = threadData.PREFIX || global.config.PREFIX;
      o.api.changeNickname(
          `『 ${PREFIX_GROUP} 』 ⪼ ${global.config.BOTNAME} || HSD: ${tao_gấu_lỏ_trùm_thay_crd} ✅`,
          $.t_id,
          o.api.getCurrentUserID()
      );
                o.api.sendMessage(
              `[ Thông Báo ]\n\n📌 Nhóm của bạn đã được Admin gia hạn thêm ${days} ngày\n⏰ Sẽ kết thúc vào ngày: ${tao_gấu_lỏ_trùm_thay_crd}`,
              $.t_id
          );
   }
   save();
};
