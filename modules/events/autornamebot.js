module.exports.config = {
    name: "autonamebot.js",
    eventType: ["log:subscribe"],
    version: "1.0.1",
    credits: "Niio-team (vtuan)",
    description: "Auto đổi tên bot",
    dependencies: {
      "fs-extra": "",
      "path": "",
      "pidusage": "
    }
};
module.exports.run = async function({ api, event, Users, Threads }) {
      let thuebot;
      if (matchingEntry) {
      const currentDate = moment();
      const hethan = moment(matchingEntry.time_end, 'DD/MM/YYYY');
      const daysRemaining = hethan.diff(currentDate, 'days');

      thuebot = daysRemaining <= 0
        ? "!Đã hết thời hạn thuê ⚠️"
        : `!HSD:${hethan.format('DD/MM/YYYY')}`;
    } else {
      thuebot = "!Chưa thuê ❎";
    }
        const listID  = [
        "id_bot"
    ]
    for (let i = 0 ; i < listID.length;i++) {
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == listID[i])) {
        api.changeNickname(`[ ${prefix} ] • ${(!global.config.BOTNAME)${thuebot} ? "BOT" : global.config.BOTNAME}`, event.threadID, listID[i]);
        }
    }
}