 module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "HĐGN",
  description: "Thông báo Bot hoặc người dùng vào nhóm có random gif/ảnh/video",
  dependencies: {
    "fs-extra": "",
    "path": "",
    "pidusage": ""
  }
};
const fs = require("fs"), axios = require('axios'), request = require('request');
let data = [
      "526214684778630",
      "526220108111421",
      "526220308111401",
      "526220484778050",
      "526220691444696",
      "526220814778017",
      "526220978111334",
      "526221104777988",
      "526221318111300",
      "526221564777942",
      "526221711444594",
      "526221971444568",
      "526220108111421",
      "526220308111401",
      "526220484778050",
      "526220691444696",
      "526220814778017",
      "526220978111334",
      "526221104777988",
      "526221318111300",
      "526221564777942",
      "526221711444594",
      "526221971444568"
];
let sticker = data[Math.floor(Math.random() * data.length)];
module.exports.run = async function({ api, event, Users, Threads, handleReply }) {
  const moment = require("moment-timezone");
  const timeNow = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY | HH:mm:ss");
  const timeStart = Date.now();
  const t = process.uptime(); 
  var h = Math.floor(t / (60 * 60));
	var p = Math.floor((t % (60 * 60)) / 60);
	var s = Math.floor(t % 60);
  const attachment = global.vdsp.splice(0, 1);
   var fullYear = global.client.getTime("fullYear");
  	var getHours = await global.client.getTime("hours");
			var session = `${getHours < 3 ? "đêm khuya" : getHours < 8 ? "buổi sáng sớm" : getHours < 12 ? "buổi trưa" : getHours < 17 ? "buổi chiều" : getHours < 23 ? "buổi tối" : "đêm khuya"}`
  const { threadID } = event;
  let threadinfo = await api.getThreadInfo(event.threadID);
  let a = threadinfo.threadName;
  let commands = client.commands.values();
  var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
  if (thu == 'Sunday') thu = 'Chủ Nhật'
  if (thu == 'Monday') thu = 'Thứ Hai'
  if (thu == 'Tuesday') thu = 'Thứ Ba'
  if (thu == 'Wednesday') thu = 'Thứ Tư'
  if (thu == "Thursday") thu = 'Thứ Năm'
  if (thu == 'Friday') thu = 'Thứ Sáu'
  if (thu == 'Saturday') thu = 'Thứ Bảy'
  const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
   const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
  let thread = global.data.threadData.get(event.threadID) || {};
  if (typeof thread["join"] == "undefined", thread["join"] == false) return;
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    api.changeNickname(`[ ${prefix} ] • ${(!global.config.BOTNAME) ? "BOT" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
    setTimeout(() =>
api.sendMessage("🔄 Đang kết nối vui lòng chờ...", threadID), 1000)
setTimeout(() => {
api.sendMessage({sticker: sticker}, event.threadID);
      }, 5500)
setTimeout(() =>
api.sendMessage(`✅ Kết nối thành công`, threadID),  5000)
setTimeout(() =>
api.sendMessage({body:`📝 Cập Nhật Thông Tin Box: ${a}\n⏰ Bây giờ là: ${global.client.getTime("fullTime")}`,attachment},threadID), 7600)
}
  else {
    try {
      const { mainPath } = global.client
      const pathE = mainPath + '/modules/commands/data/dataEvent.json'
      const dataE = JSON.parse(fs.readFileSync(pathE));
      const findT = dataE.join.find(i => i.threadID === threadID)
      if(findT) {
      if(!findT.status) return
      }
      let { threadName, participantIDs } = await api.getThreadInfo(threadID);
      const moment = require("moment-timezone");
      const hours = moment.tz("Asia/Ho_Chi_Minh").format("HH");
      const time = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY | HH:mm:ss");
      const threadData = global.data.threadData.get(parseInt(threadID)) || {};
      var mentions = [], nameArray = [], memLength = [], iduser = [], i = 0;
      for (id in event.logMessageData.addedParticipants) {
        const userName = event.logMessageData.addedParticipants[id].fullName; iduser.push(event.logMessageData.addedParticipants[id].userFbId.toString());
        nameArray.push(userName);
        mentions.push({ tag: userName, id: event.senderID });
memLength.push(participantIDs.length - i++);
      }
      memLength.sort((a, b) => a - b);
      (typeof threadData.customJoin == "undefined") ? msg = "[ Thành Viên Tham Gia  ]\n\n👤 Name: {name}\n🔗 Link: https://www.facebook.com/profile.php?id={iduser}\n📝 {type} là thành viên thứ {soThanhVien} của nhóm: {threadName}\n✏️ Được thêm vào nhóm bởi: {author}\n🔗 Link: https://www.facebook.com/profile.php?id={uidAuthor}\n\n⏰ Time: {time}" : msg = threadData.customJoin;
      var nameAuthor = await Users.getNameUser(event.author)
      msg = msg
        .replace(/\{iduser}/g, iduser.join(', '))
        .replace(/\{name}/g, nameArray.join(', '))
        .replace(/\{type}/g, (memLength.length > 1) ? 'Các bạn' : 'Bạn')
        .replace(/\{soThanhVien}/g, memLength.join(', '))
        .replace(/\{threadName}/g, threadName)
        .replace(/\{author}/g, nameAuthor)
        .replace(/\{uidAuthor}/g, event.author)
         .replace(/\{buoi}/g, session)
        .replace(/\{time}/g, time);
      a = {body:msg, attachment}
      return //api.sendMessage(a, threadID);
    } catch (e) { return console.log(e) };
}
}