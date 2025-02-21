module.exports.config = {
 	name: "autobanthread",
 	version: "1.0.0",
 	hasPermssion: 2,
 	credits: "XXX",
 	description: "tự động cấm nhóm dùng bot nếu spam bot 20 lần/1phút",
 	commandCategory: "Tiện ích",
 	usages: "",
 	cooldowns: 5
 };
 
 module.exports.run = ({api, event}) => {
   api.sendMessage("Tự động ban nhóm nếu spam bot 15 lần/1phút", event.threadID, event.messageID);
 };
 module.exports.handleEvent = async ({ Threads, api, event}) => {
   const moment = require("moment-timezone");
   let { senderID, messageID, threadID } = event;
   const so_lan_spam = 20;
   const thoi_gian_spam = 60000;
   const unbanAfter = 86400000;
   if (!global.client.autobanthread) global.client.autobanthread = {};
   if (!global.client.autobanthread[threadID]) {
     global.client.autobanthread[threadID] = {
       timeStart: Date.now(),
       number: 0
     }
   };
   const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
 	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
 	if (!event.body || event.body.indexOf(prefix) != 0) return;
 	
 	let dataThread = (await Threads.getData(threadID)) || {};
 	let data = dataThread.data;
 	
 	if ((global.client.autobanthread[threadID].timeStart + thoi_gian_spam) <= Date.now()) {
 	  global.client.autobanthread[threadID] = {
 	    timeStart: Date.now(),
 	    number: 0
 	  }
 	}
 	else {
 	  global.client.autobanthread[threadID].number++;
 	  if (global.client.autobanthread[threadID].number >= so_lan_spam) {
 	    const time = moment.tz("Asia/Ho_Chi_minh").format("DD/MM/YYYY HH:mm:ss");
 			if (data && data.banned == true) return;
 			data.banned = true;
 			data.reason = `spam bot`;
 			data.dateAdded = time;
 			await Threads.setData(threadID, { data });
 			global.data.threadBanned.set(threadID, { reason: data.reason, dateAdded: data.dateAdded });
 			global.client.autobanthread[threadID] = {
 	      timeStart: Date.now(),
 	      number: 0
 	    };
 			api.sendMessage({
 			  body: `🏘️ Nhóm: ${dataThread.threadInfo.threadName}\n📝 Nhóm đã bị cấm sử dụng bot\n✏️ lý do: spam bot ${so_lan_spam} lần trên ${thoi_gian_spam/60000} phút`,}, threadID, () => {
 			  setTimeout(async function() {
 			    delete data.autoban;
     	    data.banned = false;
     			data.reason = null;
     			data.dateAdded = null;
     			await Threads.setData(threadID, { data });
     			global.data.threadBanned.delete(threadID);
				api.sendMessage("✅ Thực thi unban nhóm", threadID);
 			  }, unbanAfter);
 			});
 			api.sendMessage(`📝 Đã autoban thread ${threadID} | ${dataThread.threadInfo.threadName}\n✏️ Lý do spam bot ${so_lan_spam} lần trên ${Math.floor(thoi_gian_spam/60000)} phút\n⏰ Thời gian: ${time}\nAutounban sau 24h`, global.config.BOXNOTI);
 	  }
 	}
 };