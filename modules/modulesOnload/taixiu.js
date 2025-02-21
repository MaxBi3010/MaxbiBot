module.exports = async function ({ api }) {
    const fs = require("fs-extra");
    class Command {
        constructor(config) {
            this.config = config;
            this.count_req = 0;
        }

        run({ messageID, text, api, threadID }) {
            mqttClient.publish('/ls_req', JSON.stringify({
                "app_id": "2220391788200892",
                "payload": JSON.stringify({
                    tasks: [{
                        label: '742',
                        payload: JSON.stringify({
                            message_id: messageID,
                            text: text,
                        }),
                        queue_name: 'edit_message',
                        task_id: Math.floor(Math.random() * 1001),
                        failure_count: null,
                    }],
                    epoch_id: this.generateOfflineThreadingID(),
                    version_id: '6903494529735864',
                }),
                "request_id": ++this.count_req,
                "type": 3
            }));
        }

        generateOfflineThreadingID() {
            let ret = Date.now();
            let value = Math.floor(Math.random() * 4294967295);
            let str = ("0000000000000000000000" + value.toString(2)).slice(-22);
            return this.binaryToDecimal(ret.toString(2) + str);
        }

        binaryToDecimal(data) {
            let ret = "";
            while (data !== "0") {
                let end = 0, fullName = "", i = 0;
                for (; i < data.length; i++) {
                    end = 2 * end + parseInt(data[i], 10);
                    fullName += end >= 10 ? "1" : "0";
                    if (end >= 10) end -= 10;
                }
                ret = end.toString() + ret;
                data = fullName.slice(fullName.indexOf("1"));
            }
            return ret;
        }
    }

    function cai_lon(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function gets() {
        const methods = [
            () => Math.floor(Math.random() * 6) + 1,
            () => cai_lon(1, 6),
            () => Math.ceil(Math.random() * 6),
            () => Math.trunc(Math.random() * 6) + 1
        ];
        const cc = methods[Math.floor(Math.random() * methods.length)];
        return cc();
    }

    function playGame() {
        const jackpotChance = Math.random();
        let dice1, dice2, dice3;
        if (jackpotChance < 0.03) {
            const jackpotValue = Math.random() < 0.5 ? 1 : 6;
            dice1 = dice2 = dice3 = jackpotValue;
        } else {
            dice1 = gets();
            dice2 = gets();
            dice3 = gets();
        }

        const total = dice1 + dice2 + dice3;
        const result = (total >= 3 && total <= 10) ? 'xỉu' : 'tài';

        return { total, result, dice1, dice2, dice3, jackpot: jackpotChance < 0.1 };
    }


    function sendMessage(api, content, threadID) {
        return new Promise((resolve, reject) => {
            api.sendMessage(content, threadID, (e, i) => {
                if (e) return reject(e);
                resolve(i);
            });
        });
    }

    const filePath = "./modules/commands/FolderGame/taixiu/";
    const dataPath = filePath + 'data/';
    const betHistoryPath = dataPath + 'betHistory/';
    const moneyFile = filePath + 'money.json';
    const phiênFile = filePath + 'phiên.json';
    const fileCheck = filePath + 'file_check.json';

    global.txTime = 0;
    let so_lan = 0;
    let results = null;

    setInterval(async () => {
        const checkData = JSON.parse(fs.readFileSync(fileCheck, "utf-8"));
        if (checkData.length == 0) return;
        const phiênData = JSON.parse(fs.readFileSync(phiênFile, "utf-8"));
        let phiên = phiênData.length ? phiênData[phiênData.length - 1].phien : 1;

        txTime += 1;
        const betTime = 50;

        if (txTime === 1) {
            results = playGame();
            // console.log(results); // muốn đọc cầu thì hủy comman cái này, check console = kết quả
            // api.sendMessage(`${results.dice1} | ${results.dice2} | ${results.dice3} : ${results.total}-${results.result}`, id nhóm nào đó hoặc id admin (tạo nhóm rồi vứt id vào nhé))
            for (let threadID of checkData) {
                api.sendMessage(`🔄 Bắt đầu phiên ${phiên}!\n⏳ Bạn có ${betTime} giây để đặt cược.`, threadID, (e,i)=> {
                    if (e) process.exit(0)
                });
            }
        } else if (txTime === 45) {
            for (let threadID of checkData) {
                let abc = await sendMessage(api, `⚠️Hết thời gian đặt cược!!\nChuẩn bị lắc...\nCòn 5 giây`, threadID);
                let countdown = 4;
                let intervalID = setInterval(async () => {
                    if (countdown > 0) {
                        await new Command().run({
                            messageID: abc.messageID,
                            text: `⚠️Hết thời gian đặt cược!!\nChuẩn bị lắc...\nCòn ${countdown} giây`,
                            api,
                            threadID
                        });
                        countdown--;
                    } else {
                        clearInterval(intervalID);
                        await api.unsendMessage(abc.messageID);
                    }
                }, 1000);
            }
        } else if (txTime === 50) {
            const checkmn = JSON.parse(fs.readFileSync(moneyFile, "utf-8"));
            let winList = [], loseList = [];

            for (let user of checkmn) {
                const userBetFile = betHistoryPath + `${user.senderID}.json`;
                if (!fs.existsSync(userBetFile)) continue;
                const userBetData = JSON.parse(fs.readFileSync(userBetFile, "utf-8"));

                userBetData.forEach(entry => {
                    if (entry.phien === phiên) {
                        if (entry.choice === results.result) {
                            entry.winAmount = ((results.dice1 === 6 && results.dice2 === 6 && results.dice3 === 6) || (results.dice1 === 1 && results.dice2 === 1 && results.dice3 === 1)) ? entry.betAmount * 20 : entry.betAmount * 2;
                            user.input += entry.winAmount;
                            entry.ket_qua = 'thắng';
                            winList.push(user.senderID);
                        } else {
                            entry.ket_qua = 'thua';
                            loseList.push(user.senderID);
                        }
                    }
                });

                fs.writeFileSync(userBetFile, JSON.stringify(userBetData, null, 4), 'utf-8');
            }

            fs.writeFileSync(moneyFile, JSON.stringify(checkmn, null, 4), 'utf-8');

            let last10Phien = phiênData.length > 10 ? phiênData.slice(-10) : phiênData;
            const messagesMapping = { 'tài': '⚫️', 'xỉu': '⚪️' };
            let msgs = last10Phien.map(p => messagesMapping[p.result] || '').join('');
            let dcm = results.result === 'tài' ? '⚫️' : '⚪️';

            for (let threadID of checkData) {
                let msgd = (results.dice1 === 6 && results.dice2 === 6 && results.dice3 === 6) ||
                    (results.dice1 === 1 && results.dice2 === 1 && results.dice3 === 1) ?
                    `🎉 Nổ hũ: Tiền cược nhân 20\n` : '';

                let message = `📊 Kết quả phiên ${phiên}: [ ${results.dice1} | ${results.dice2} | ${results.dice3} ]\n` +
                    `Kết quả: ${results.result.toUpperCase()} - ${results.total}\n${msgd}` +
                    `Thắng: ${winList.length} người\nThua: ${loseList.length} người\nPhiên gần đây:\n${msgs}${dcm}`;

                api.sendMessage(message, threadID);

                so_lan = (winList.length === 0 && loseList.length === 0) ? so_lan + 1 : 0;

                if (so_lan === 2) {
                    checkData.splice(checkData.indexOf(threadID), 1);
                    fs.writeFileSync(fileCheck, JSON.stringify(checkData, null, 4), 'utf-8');
                    so_lan = 0;
                    api.sendMessage(`Tự động tắt trò chơi khi không có người chơi!!`, threadID);
                }
            }

            phiênData.push({
                phien: phiên + 1,
                result: results.result,
                dice1: results.dice1,
                dice2: results.dice2,
                dice3: results.dice3,
            });
            fs.writeFileSync(phiênFile, JSON.stringify(phiênData, null, 4), 'utf-8');
        } else if (txTime === 60) {
            txTime = 0;
        }
    }, 1000);
}