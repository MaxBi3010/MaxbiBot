module.exports.config = {
	name: "admin",
	version: "1.0.5",
	hasPermssion: 0,
	credits: "Mirai Team & mod by DongDev",
	description: "Bật tắt chế độ chỉ qtv dùng lệnh",
	commandCategory: "Nhóm",
	usages: "Bật tắt chế độ chỉ admin và qtv dùng lệnh",
    cooldowns: 0,
    images: [],
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.languages = {
      "vi": {
        "notHavePermssion": '⚠️ Bạn không đủ quyền hạn để có thể sử dụng chức năng "%1"',
        "addedNewAdmin": '📝 Thêm %1 người dùng trở thành admin bot\n%2\n⏰ Time: %3',
        "removedAdmin": '📝 Xoá %1 người dùng trở lại làm thành viên\n%2\n⏰ Time: %3'
    },
    "en": {
        "listAdmin": '[Admin] Admin list: \n\n%1',
        "notHavePermssion": '[Admin] You have no permission to use "%1"',
        "addedNewAdmin": '[Admin] Added %1 Admin :\n\n%2',
        "removedAdmin": '[Admin] Remove %1 Admin:\n\n%2'
    }
}
module.exports.onLoad = function() {
    const { writeFileSync, existsSync } = require('fs-extra');
    const { resolve } = require("path");
    const path = resolve(__dirname, 'data', 'dataAdbox.json');
    if (!existsSync(path)) {
        const obj = {
            adminbox: {}
        };
        writeFileSync(path, JSON.stringify(obj, null, 4));
    } else {
        const data = require(path);
        if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
        writeFileSync(path, JSON.stringify(data, null, 4));
     }
}
module.exports.run = async function ({ api, event, args, Users, permssion, getText, Currencies }) {
  const fs = require("fs-extra");
  const axios = require("axios");
  const moment = require("moment-timezone");
  const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm || DD/MM/YYYY");
  const nd = await Users.getNameUser(event.senderID);
  const { PREFIX } = global.config;
  const { threadID, messageID, mentions, senderID } = event;
  const { configPath } = global.client;
  const { throwError } = global.utils;

  async function streamURL(url, mime='jpg') {
    const dest = `${__dirname}/cache/${Date.now()}.${mime}`;
    const downloader = require('image-downloader');
    const fse = require('fs-extra');
    await downloader.image({
        url, dest
    });
    setTimeout(j => fse.unlinkSync(j), 60 * 1000, dest);
    return fse.createReadStream(dest);
  }

  const allowedUserIDs = global.config.NDH.map(id => id.toString());
  const senderIDStr = senderID.toString();
  const threadSetting = global.data.threadData.get(threadID) || {};
  const pref = threadSetting.PREFIX || PREFIX;
  const content = args.slice(1, args.length);
    if (args.length == 0) 
	return api.sendMessage(`[ ADMIN CONFIG SETTING ]\n──────────────────\n${pref}admin add: thêm người dùng làm admin\n${pref}admin remove: gỡ vai trò admin\n${pref}admin list: xem danh sách admin\n${pref}admin qtvonly: bật/tắt chế độ quản trị viên\n${pref}admin only: bật/tắt chế độ Admin\n${pref}admin ndh: bật/tắt chế độ NDH\n${pref}admin fast: xem tốc độ mạng của bot\n${pref}admin create [tên mdl]: tạo file mới trong commands\n${pref}admin del [tên mdl]: xoá file trong commands\n${pref}admin rename [tên mdl] => [tên muốn đổi]: đổi tên file trong commands\n${pref}admin ping: xem tốc độ phản hồi của bot\n${pref}admin resetmoney: reset toàn bộ tiền trên hệ thống bot\n${pref}admin ship [tên mdl]: gửi 1 mdl cho thành viên trong nhóm\n──────────────────\n📝 HDSD: ${pref}admin + [text] lệnh cần dùng`, event.threadID, event.messageID);    const { ADMINBOT } = global.config;
    const { NDH } = global.config;
    const { userName } = global.data;
    const { writeFileSync } = require("fs-extra");
    const mention = Object.keys(mentions);

    delete require.cache[require.resolve(configPath)];
    var config = require(configPath);
switch (args[0]) {
        case "list": {
    var i = 1;
    var msg = [];
    listAdmin = ADMINBOT || config.ADMINBOT || [];
    var msg = [];
    let count = 1;
    for (const idAdmin of listAdmin) {
        if (parseInt(idAdmin)) {
            const name = (await Users.getData(idAdmin)).name;
            msg.push(`⥤ ${count}. ${name}\n Msg: m.me/${idAdmin}`);
            count++;
        }
    }
    api.sendMessage(`===[ Người Điều Hành ]===\n⥤  Name: ${global.config.NAME_ADMIN}\n⥤  Facebook: ${global.config.FACEBOOK_ADMIN}\n⥤  Zalo: ${global.config.ZALO_ADMIN}\n\n===[ Admin Bot ]===\n${msg.join("\n")}\n\n⥤ Reply (phản hồi) del + STT để xóa admin tương ứng`, event.threadID, (error, info) => {
        if (!error) {
            global.client.handleReply.push({
                type: "deleteAdmin",
                name: module.exports.config.name,
                author: event.senderID,
                messageID: info.messageID,
                adminList: listAdmin,
            });
        }
    }, event.messageID);
    break;
}
            case "add": { 
    if (event.senderID != global.config.NDH) return api.sendMessage(`⚠️ Cần quyền NDH để thực hiện lệnh`, event.threadID, event.messageID);
    if (permssion != 3) return api.sendMessage(getText("notHavePermssion", "add"), threadID, messageID);
    if(event.type == "message_reply") { content[0] = event.messageReply.senderID }
    if (mention.length != 0 && isNaN(content[0])) {
        var listAdd = [];

        for (const id of mention) {
            ADMINBOT.push(id);
            config.ADMINBOT.push(id);
            listAdd.push(`👤 Name: ${event.mentions[id]}\n🔰 Uid: ${id}`);
        };
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage({body: getText("addedNewAdmin", mention.length, listAdd.join("\n").replace(/\@/g, ""), moment.tz("Asia/Ho_Chi_Minh").format("HH:mm || DD/MM/YYYY"))},event.threadID)
    }
    else if (content.length != 0 && !isNaN(content[0])) {
        ADMINBOT.push(content[0]);
        config.ADMINBOT.push(content[0]);
        const name = (await Users.getData(content[0])).name
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage({body: getText("addedNewAdmin", 1, `👤 Name: ${name}\n🔰 Uid: ${content[0]}`, moment.tz("Asia/Ho_Chi_Minh").format("HH:mm || DD/MM/YYYY"))},event.threadID)
    }
    else return throwError(this.config.name, threadID, messageID);
}

        case 'qtvonly': {
            const { resolve } = require("path");
            const pathData = resolve(__dirname, 'data', 'dataAdbox.json');
            const database = require(pathData);
            const { adminbox } = database;
            if (permssion < 1) return api.sendMessage("⚠️ Cần quyền Quản trị viên trở lên để thực hiện lệnh", threadID, messageID);
            if (adminbox[threadID] == true) {
                adminbox[threadID] = false;
                api.sendMessage("☑️ Tắt thành công chế độ quản trị viên, tất cả thành viên có thể sử dụng bot", threadID, messageID);
            } else {
                adminbox[threadID] = true;
                api.sendMessage("☑️ Kích hoạt chế độ quản trị viên, chỉ quản trị viên nhóm mới có thể sử dụng bot", threadID, messageID);
            }
            writeFileSync(pathData, JSON.stringify(database, null, 4));
            break;
        }
        case 'only':
        case '-o': {
            //---> CODE ADMIN ONLY<---//
            if (permssion != 3) return api.sendMessage("⚠️ Bạn không phải admin chính", threadID, messageID);
            if (config.adminOnly == false) {
                config.adminOnly = true;
                api.sendMessage(`☑️ Kích hoạt chế độ vô cực, chỉ Admin được sử dụng bot`, threadID, messageID);
            } else {
                config.adminOnly = false;
                api.sendMessage(`☑️ Tắt chế độ vô cực, tất cả thành viên có thể sử dụng bot`, threadID, messageID);
            }
            writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            break;
        }
        case 'ndh':
case '-n': {
    //---> CODE NDH ONLY<---//
    if (permssion != 3) return api.sendMessage("⚠️ Bạn không phải NDH chính", threadID, messageID);
    if (config.NDHOnly == false) {
        config.NDHOnly = true;
        api.sendMessage(`☑️ Kích hoạt chế độ NDH, chỉ NDH được sử dụng bot`, threadID, messageID);
    } else {
        config.NDHOnly = false;
        api.sendMessage(`☑️ Tắt chế độ NDH, tất cả thành viên có thể sử dụng bot`, threadID, messageID);
    }
    writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
    break;
}
  case 'echo': {
      const input = args.join(" ");
      const spaceIndex = input.indexOf(' ');

      if (spaceIndex !== -1) {
        const textAfterFirstWord = input.substring(spaceIndex + 1).trim();
        return api.sendMessage(textAfterFirstWord, event.threadID);
      }
      break;
    }
  case 'fast': {
      try {
        const fast = require("fast-speedtest-api");
        const speedTest = new fast({
          token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
          verbose: false,
          timeout: 10000,
          https: true,
          urlCount: 5,
          bufferSize: 8,
          unit: fast.UNITS.Mbps
        });
        const result = await speedTest.getSpeed();
        return api.sendMessage(`🚀 Speed Test: ${result} Mbps`, event.threadID, event.messageID);
      } catch (error) {
        return api.sendMessage("⚠️ Không thể đo tốc độ ngay lúc này, hãy thử lại sau!", event.threadID, event.messageID);
      }
      break;
    }
 case 'create': {
      if (!allowedUserIDs.includes(senderIDStr)) {
        return api.sendMessage(`⚠️ Cần quyền admin chính để thực hiện lệnh`, event.threadID, event.messageID);
      }

      if (args.slice(1).length === 0) return api.sendMessage("⚠️ Vui lòng đặt tên cho file của bạn", event.threadID);

      const commandName = args.slice(1).join(' ');
      const filePath = `${__dirname}/${commandName}.js`;

      if (fs.existsSync(filePath)) {
        return api.sendMessage(`⚠️ File ${commandName}.js đã tồn tại từ trước`, event.threadID, event.messageID);
      }

      fs.copySync(`${__dirname}/example.js`, filePath);
      return api.sendMessage(`☑️ Đã tạo thành công file "${commandName}.js"`, event.threadID, event.messageID);
      break;
    }
 case 'del': {
    if (!allowedUserIDs.includes(senderIDStr)) {
        return api.sendMessage(`⚠️ Cần quyền admin chính để thực hiện lệnh`, event.threadID, event.messageID);
      }
    const commandName = args.slice(1).join(' ');
    if (!commandName) return api.sendMessage(`⚠️ Vui lòng cung cấp tên lệnh cần xoá`, event.threadID, event.messageID);
    
    fs.unlink(`${__dirname}/${commandName}.js`, (err) => {
        if (err) return api.sendMessage(`❎ Xoá file ${commandName}.js thất bại: ${err.message}`, event.threadID, event.messageID);
        return api.sendMessage(`☑️ Đã xoá file ${commandName}.js thành công`, event.threadID, event.messageID);
    });
    break;
}
   case 'rename': {
    if (!allowedUserIDs.includes(senderIDStr)) {
        return api.sendMessage(`⚠️ Cần quyền admin chính để thực hiện lệnh`, event.threadID, event.messageID);
      }
    const renameArgs = args.slice(1).join(' ').split('=>');
    
    if (renameArgs.length !== 2) {
        return api.sendMessage(`⚠️ Vui lòng nhập đúng định dạng [tên mdl] => [tên muốn đổi]`, event.threadID, event.messageID);
    }

    const oldName = renameArgs[0].trim();
    const newName = renameArgs[1].trim();

    fs.rename(`${__dirname}/${oldName}.js`, `${__dirname}/${newName}.js`, function (err) {
        if (err) throw err;
        return api.sendMessage(
            `☑️ Đã đổi tên file ${oldName}.js thành ${newName}.js`,
            event.threadID,
            event.messageID
        );
    });
    break;
   }
 case 'ping': {
  const timeStart = Date.now();
  const pingrs = Date.now() - timeStart;
      api.sendMessage(`📶 Ping phản hồi: ${pingrs} ms`, event.threadID, event.messageID);
      break;
} 
 
  case "resetmoney": {
    if (!allowedUserIDs.includes(senderIDStr)) {
        return api.sendMessage(`⚠️ Cần quyền admin chính để thực hiện lệnh`, event.threadID, event.messageID);
      }

    const mentionID = Object.keys(event.mentions);
    const message = [];
    const error = [];

    const resetMoneyForUser = async (userID) => {
        try {
            await Currencies.setData(userID, { money: 0 });
            message.push(userID);
        } catch (e) {
            error.push(e);
        }
    };

    const allUserData = await Currencies.getAll(['userID']);

    for (const userData of allUserData) {
        await resetMoneyForUser(userData.userID);
    }

    api.sendMessage(`✅ Đã xóa toàn bộ dữ liệu tiền của ${message.length} người`, event.threadID, async () => {
        if (error.length !== 0) {
            await api.sendMessage(`❎ Không thể xóa dữ liệu tiền của ${error.length} người`, event.threadID);
        }
    }, event.messageID);

    for (const singleID of mentionID) {
        await resetMoneyForUser(singleID);
    }

    api.sendMessage(`✅ Đã xóa dữ liệu tiền của ${message.length} người`, event.threadID, async () => {
        if (error.length !== 0) {
            await api.sendMessage(`❎ Không thể xóa dữ liệu tiền của ${error.length} người`, event.threadID);
        }
    }, event.messageID);

    break;
}
  
case 'ship': {
  if (!allowedUserIDs.includes(senderIDStr)) {
    return api.sendMessage(`⚠️ Cần quyền admin chính để thực hiện lệnh`, event.threadID, event.messageID);
  }

  const { messageReply, type } = event;

  let name = args[1];
  const commandName = args.slice(1).join(' ');

  let text, uid;
  if (type === "message_reply") {
    text = messageReply.body;
    uid = messageReply.senderID;
  } else {
    uid = event.senderID;
  }

  if (!text && !name) {
    return api.sendMessage(`[⏰] → Bây giờ là: ${gio}\n[📝] → Hãy reply hoặc tag người muốn share`, event.threadID, event.messageID);
  }

  fs.readFile(`./modules/commands/${commandName}.js`, "utf-8", async (err, data) => {
    if (err) {
      return api.sendMessage(`[⏰] → Bây giờ là: ${gio}\n[🔎] → Rất tiếc mdl ${commandName} mà bạn cần hiện không có trên hệ thống của bot ${global.config.BOTNAME}`, event.threadID, event.messageID);
    }

    const response = await axios.post("https://api.mocky.io/api/mock", {
      "status": 200,
      "content": data,
      "content_type": "application/json",
      "charset": "UTF-8",
      "secret": "PhamMinhDong",
      "expiration": "never"
    });
    
    const link = response.data.link;
    const use = await Users.getNameUser(uid);
    api.sendMessage(`[📜] → Nhóm: ${global.data.threadInfo.get(event.threadID).threadName}\n[⏰] → Vào lúc: ${gio}\n[💼] → Tên lệnh: ${commandName}\n[👤] → Admin: ${nd}\n[📌] → Đã gửi module ☑️\n[📝] → ${use} vui lòng check tin nhắn chờ hoặc spam để nhận module`, event.threadID, event.messageID);
    api.sendMessage(`[⏰] → Vào lúc: ${gio}\n[🔗] → Link: ${link}\n[🔰] → Tên lệnh: ${commandName}\n[📜] → Nhóm: ${global.data.threadInfo.get(event.threadID).threadName}\n[🔎] → Bạn được admin share riêng một module`, uid);
  });

  break;
}
   default: {
  return throwError(this.config.name, threadID, messageID);
        }
    }
}

module.exports.handleReply = async function ({ event, api, handleReply }) {
    const { threadID: tid, messageID: mid, body } = event;
    const args = body.split(" ");

    if (handleReply.type === 'deleteAdmin') {
        const selectedIndex = parseInt(args[1]) - 1;

        if (args[0] === 'del' && !isNaN(selectedIndex)) {
            const adminList = handleReply.adminList;

            if (selectedIndex < 0 || selectedIndex >= adminList.length) {
                return api.sendMessage('❎ Lựa chọn không hợp lệ', tid, mid);
            }

            const selectedAdmin = adminList[selectedIndex];
            adminList.splice(selectedIndex, 1);

            // Lưu danh sách admin đã cập nhật vào cấu hình hoặc nơi lưu trữ thích hợp
            config.ADMINBOT = adminList;
            // Nếu bạn lưu trong file, hãy ghi lại vào file hoặc cơ sở dữ liệu tương ứng

            api.sendMessage(`✅ Đã xóa admin ${selectedAdmin} thành công!`, tid, mid);
        } else {
            api.sendMessage("❎ Lựa chọn không hợp lệ hoặc bạn không phải là người dùng lệnh", tid, mid);
        }
    }
};