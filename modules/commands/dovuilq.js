let timeout = 120;
let moneydown = 1000;
let axios = require('axios');
module.exports.config = {
  name: "dovuilq",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "D-Jukie",
  description: "Đố vui về liên quân",   
  commandCategory: "Game",
  usages: "",
  cooldowns: 5,
  dependencies: {
    "axios": ""
  }
}

module.exports.handleReply = async function ({ event, Users, api, handleReply, Currencies }) {
  let { dataGame, dapan, nameUser } = handleReply;
  let { threadID, messageID, senderID, body } = event;
  if (handleReply.author != senderID) return api.sendMessage(`⚠️ Bạn không có quyền trả lời`, event.threadID); 
  switch (handleReply.type) {
    case "reply": {
      let aw = body
      let dapanUser = dataGame
      let checkTrue = dapan
      if (aw.toLowerCase() == 'a' && dataGame.a == checkTrue) {
        await Currencies.increaseMoney(senderID, mon);
        api.unsendMessage(handleReply.messageID)
          return api.sendMessage({body: `✅ ${nameUser} đã trả lời chính xác\nĐáp án: ${checkTrue}`}, threadID, messageID)   
      } else if (aw.toLowerCase() == 'b' && dataGame.b == checkTrue) { 
                api.unsendMessage(handleReply.messageID)
         return api.sendMessage({body: `✅ ${nameUser} đã trả lời chính xác\nĐáp án: ${checkTrue}`}, threadID, messageID)
      } else if (aw.toLowerCase() == 'c' && dataGame.c == checkTrue) {
                api.unsendMessage(handleReply.messageID)
         return api.sendMessage({body: `✅ ${nameUser} đã trả lời chính xác\nĐáp án: ${checkTrue}`}, threadID, messageID)
      } else if (aw.toLowerCase() == 'd' && dataGame.d == checkTrue) {
                api.unsendMessage(handleReply.messageID)
         return api.sendMessage({body: `✅ ${nameUser} đã trả lời chính xác\nĐáp án: ${checkTrue}`}, threadID, messageID)
      } else {
            api.unsendMessage(handleReply.messageID)
              api.sendMessage(`❎ ${nameUser} trả lời sai rồi\nĐáp án chính xác là: ${dapan}`, threadID);
      }
    }
  }
}

module.exports.handleReaction = async function ({ Users, api, event, handleReaction, Currencies }) {
  let { threadID, senderID, reaction, userID } = event;
  let { dataGame, dapan, author, nameUser } = handleReaction;
  if (userID != author) return api.sendMessage(`⚠️ Bạn không có quyền trả lời`, threadID);
  let mon = parseInt(moneydown) + 500;
  if (reaction != "😆" && reaction != "😮"&& reaction != "😢"&& reaction != "😠") return;
    let response = "";
    if (reaction == "😆") response = dataGame.a
    else if (reaction == "😮") response = dataGame.b
    else if (reaction == "😢") response = dataGame.c
    else if (reaction == "😠") response = dataGame.d

    if (response == handleReaction.dapan) { 
        api.unsendMessage(handleReaction.messageID)
        api.sendMessage(`✅ ${nameUser} trả lời chính xác\nĐáp án: ${dapan}`, threadID) 
    } else {
    api.unsendMessage(handleReaction.messageID)
    api.sendMessage(`❎ ${nameUser} trả lời sai rồi\nĐáp án chính xác là: ${dapan}`, threadID);
    }
}

module.exports.run = async function ({ api, event, Users, Currencies }) {
  let { threadID, messageID, senderID } = event;
  let res = await axios.get(`https://apilienquan.miraiofficials123.repl.co/`);
  let dataGame = res.data
  let url = res.data.images;
  let cc = (await axios.get(url, {
    responseType: "stream"
  })).data
  let namePlayer_react = await Users.getData(senderID)
    return api.sendMessage({body: `Câu hỏi dành cho bạn: ${dataGame.questions}\n\nA. 😆 ${dataGame.a}\nB. 😮 ${dataGame.b}\nC. 😢 ${dataGame.c}\nD. 😠 ${dataGame.d}\n\n-> Reply tin nhắn hoặc thả cảm xúc để trả lời`, attachment: cc}, threadID, (error, info) => {
        global.client.handleReaction.push({
          type: "reply",
          name: this.config.name,
          author: senderID,
          messageID: info.messageID,
          dataGame: res.data,
          dapan: dataGame.dapan,
          nameUser: namePlayer_react.name
        })
        global.client.handleReply.push({
          type: "reply",
          name: this.config.name,
          author: senderID,
          messageID: info.messageID,
          dataGame: res.data,
          dapan: dataGame.dapan,
          nameUser: namePlayer_react.name
        })
setTimeout(function(){ 
        api.unsendMessage(info.messageID)
}, timeout * 1000);
    }) 
}
