module.exports.config = {
  name: "ghep",
  version: "1.0.0", 
  hasPermssion: 0,
  credits: "M-Drasew, HungCho", // Mod xíu by Trankhuong 
  description: "Tìm người hẹn hò!",
  commandCategory: "Game", 
  usages: "", 
  cooldowns: 10
};
module.exports.run = async ({ api, event, handleReply, Users,Threads, Currencies }) => {
const { threadID, messageID, senderID } = event;
var data = await Currencies.getData(event.senderID);
var money = data.money
if (money = 0) api.sendMessage(`💵 Bạn cần có 5000$ để ghép đôi!`,threadID,messageID);
  else {
  Currencies.setData(event.senderID, options = {money: money - 0})
	return api.sendMessage(`Phản hồi tin nhắn để chọn giới tính.\n\n[ Nam hoặc Nữ ]`, event.threadID, (error, info) => {
        global.client.handleReply.push({
            type: "ghep",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID
        })  
     })
   }
}
module.exports.handleReply = async ({ api, event, handleReply, Users,Threads, Currencies }) => {
var token = `6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
const axios = global.nodemodule["axios"];
const fs = global.nodemodule["fs-extra"];
const tile = Math.floor(Math.random() * 101);
const random = ["Cầm vàng đừng để vàng rơi. Anh ơi anh rớt người yêu rồi này.","Cần gì quà cáp cao siêu. Đóa hồng, tấm thiệp là yêu rồi mà.","Bao nhiêu cân thính cho vừa. Bao nhiêu cân bả mới lừa được anh.","Bầu trời xanh, làn mây trắng. Anh yêu nắng hay yêu em?","Nhờ có nắng mới thấy cầu vồng. Nhờ có anh mới thấy màu hạnh phúc.","Anh yêu ơi ới ời. Anh đang ở đâu?","Soái ca là của ngôn tình. Còn anh thì chỉ của mình em thôi.","Giữa cuộc đời hàng ngàn cám dỗ.Em chỉ cần bến đỗ anh thôi.","Bồ công anh bay khi có gió. Em chỉ cười vì ở đó có anh.","Ba mươi chưa phải là Tết. Không làm bạn đâu phải là hết, còn có thể làm người yêu mà.","Ai nào cho mượn avatar để em đỡ cô đơn đi.","Nắng đã có mũ, mưa đã có ô, còn em sẽ có ai?", 'Cuộc sống có khó khăn vất vả thì vẫn cứ hạnh phúc thật nhiều nhé. Chúc hai bạn cùng nắm tay nhau đi suốt cuộc đời, mãi hạnh phúc nhé.','Chúc mừng cặp vợ chồng mãi yêu thương gắn bó với nhau. Chúc hai bạn đã tìm được bến đỗ cuộc đời, phải thật hạnh phúc đấy.','Chúc cô dâu chú rể hạnh phúc tràn đầy, mừng gia đình sớm con đàn cháu đống. Cung hỷ, cung hỷ.','Mừng hai bạn đã về một nhà. Chúc gia đình nhỏ trăm niềm hạnh phúc, chúc gia đình lớn luôn gắn kết yêu thương.','Chúc cuộc sống của đôi vợ chồng trẻ thuận buồm xuôi gió, làm đến đâu, giàu đến đó.','Chúc cho cô dâu chú rể luôn gắn kết như keo với sơn, như cá với nước, như trước với sau và luôn thương yêu nhau.','Dẫu đường đời có nhiều gạch đá, may mà cô dâu “vấp” được chú rể hiền, ngày dài tháng rộng triền miên, mong niềm hạnh phúc an nhiên cho đôi vợ chồng trẻ nhé.','Chúc các bạn luôn yêu nhau mãnh liệt, mọi khó khăn chỉ là thử thách nên hai bạn hãy vui sống lạc quan với nhau suốt một đời và hạnh phúc nhé.'];
    switch(handleReply.type) {
        case "ghep": {
          switch(event.body) {
					case "Nam": {
						api.unsendMessage(handleReply.messageID);
						api.sendMessage(`📌 Đang tìm đối tượng hợp với bạn...`,event.threadID);
            var ThreadInfo = (await Threads.getData(event.threadID)).threadInfo;
            var all = ThreadInfo.userInfo
            let data = [];
            for (let male of all) {
                if (male.gender == "MALE") {
                 if ( male != event.senderID) data.push(male.id)   
                }
            }
          let member = data[Math.floor(Math.random() * data.length)]
          let n = (await Users.getData(member)).name
          const url = api.getCurrentUserID(member);
          let Avatar_boy = (await axios.get(`https://graph.facebook.com/${member}/picture?height=1500&width=1500&access_token=`+token, { responseType: "arraybuffer" } )).data; 
            fs.writeFileSync( __dirname + `/cache/avt1.png`, Buffer.from(Avatar_boy, "utf-8") );
          let name = await Users.getNameUser(handleReply.author);
          let Avatar_author = (await axios.get( `https://graph.facebook.com/${handleReply.author}/picture?width=512&height=512&access_token=`+token, { responseType: "arraybuffer" } )).data;
            fs.writeFileSync( __dirname + "/cache/avt2.png", Buffer.from(Avatar_author, "utf-8") );
            let gifLove = (await axios.get( `https://i.ibb.co/wC2JJBb/trai-tim-lap-lanh.gif`, { responseType: "arraybuffer" } )).data;
           fs.writeFileSync( __dirname + "/cache/giflove.png", Buffer.from(gifLove, "utf-8") );
           var arraytag = [];
                arraytag.push({id: handleReply.author, tag: name});
                arraytag.push({id: member, tag: n});
           var imglove = []; 
              imglove.push(fs.createReadStream(__dirname + "/cache/avt1.png"));
            imglove.push(fs.createReadStream(__dirname + "/cache/giflove.png"));
              imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));
           var msg = {body: `[ TINDER DATING LOVE ]\n\n🥰 Ghép đôi thành công!\n💌 Thính: ${random[Math.floor(Math.random() * random.length)]}\n💞 Tỉ lệ hợp nhau: ${tile}%\n❤️ Tên người ấy: `+n+" "+"\n🤍 Tên của bạn:"+" "+name, mentions: arraytag, attachment: imglove}
        return api.sendMessage(msg, event.threadID, event.messageID);
          } break;
          case "Nữ": {
						api.unsendMessage(handleReply.messageID);
						api.sendMessage(`📌 Đang tìm đối tượng hợp với bạn...`,event.threadID);
            var ThreadInfo = (await Threads.getData(event.threadID)).threadInfo;
            var all = ThreadInfo.userInfo
            let data = [];
            for (let female of all) {
                if (female.gender == "FEMALE") {
                 if ( female != event.senderID) data.push(female.id)   
                }
            }
          let member = data[Math.floor(Math.random() * data.length)]
          let n = (await Users.getData(member)).name
          let Avatar_girl = (await axios.get(`https://graph.facebook.com/${member}/picture?height=1500&width=1500&access_token=`+token, { responseType: "arraybuffer" } )).data; 
            fs.writeFileSync( __dirname + `/cache/avt1.png`, Buffer.from(Avatar_girl, "utf-8") );
          let name = await Users.getNameUser(handleReply.author);
          let Avatar_author = (await axios.get( `https://graph.facebook.com/${handleReply.author}/picture?width=512&height=512&access_token=`+token, { responseType: "arraybuffer" } )).data;
            fs.writeFileSync( __dirname + "/cache/avt2.png", Buffer.from(Avatar_author, "utf-8") );
            let gifLove = (await axios.get( `https://i.ibb.co/wC2JJBb/trai-tim-lap-lanh.gif`, { responseType: "arraybuffer" } )).data; 
            fs.writeFileSync( __dirname + "/cache/giflove.png", Buffer.from(gifLove, "utf-8") );
           var arraytag = [];
                arraytag.push({id: handleReply.author, tag: name});
                arraytag.push({id: member, tag: n});
           var imglove = []; 
              imglove.push(fs.createReadStream(__dirname + "/cache/avt1.png"));
            imglove.push(fs.createReadStream(__dirname + "/cache/giflove.png"));
          imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));
           var msg = {body:`[ TINDER DATING LOVE ]\n\n🥰 Ghép đôi thành công!\n💌 Thính: ${random[Math.floor(Math.random() * random.length)]}\n💞 Tỉ lệ hợp nhau: ${tile}%\n❤️ Tên người ấy: `+n+" "+"\n🤍 Tên của bạn:"+" "+name, mentions: arraytag, attachment: imglove}
        return api.sendMessage(msg, event.threadID, event.messageID);
          } break;
        }
      }
    }
}