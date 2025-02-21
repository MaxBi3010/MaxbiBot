module.exports.config = {
    name: "random",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "D-Jukie",
    description: "Chọn ngẫu nhiên thành viên trong box",
    commandCategory: "Game",
    cooldowns: 0
};

module.exports.run = async ({ api, event, args, Users, Currencies }) => {
    try {
        const { threadID, messageID, participantIDs, isGroup } = event;
        const num = parseInt(args[0]) || 1;
        if (isGroup == false) return api.sendMessage('❎ Vui lòng thực hiện lệnh này ở nhóm', threadID, messageID);

        const random = participantIDs.sort(() => 0.5 - Math.random());
        let data = (await Currencies.getData(event.senderID)).data || {};

        const members = [];
        const mentions = [];

        for (let i = 0; i < num; i++) {
            var userInfo = await Users.getData(random[i]);
            var name = userInfo.name;
            var id = userInfo.userID;
            members.push(name);
            mentions.push({ tag: name, id: id });
        }

        let message = '🎉 Người được chọn là: ' + mentions.map(user => `${user.tag}`).join(', ');
        return api.sendMessage({ body: message, mentions: mentions }, threadID, messageID);
    } catch (e) {
        console.log(e);
    }
};
