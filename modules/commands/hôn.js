const request = require("request");
const fs = require("fs")
const axios = require("axios")
module.exports.config = {
  name: "hôn",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Lê Định Mod",
  description: "hôn người Bạn Muốn",
  commandCategory: "Game",
  usages: "@tag",
  cooldowns: 5,
  dependencies: {"request": "","fs": "","axios": ""}
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
        const request = require('request')
                const fs = require('fs')
                  var mention = Object.keys(event.mentions)[0];
let tag = event.mentions[mention].replace("@", "");
        var link = [
          "https://i.pinimg.com/originals/78/09/5c/78095c007974aceb72b91aeb7ee54a71.gif",
             ];
   var callback = () => api.sendMessage({body: `${tag} 💋, hun cái nè 😘` , mentions: [{
          tag: tag,
          id: Object.keys(event.mentions)[0]
        }],
  attachment: fs.createReadStream(__dirname + "/cache/hon.gif")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/hon.gif"));
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/hon.gif")).on("close",() => callback());
   };