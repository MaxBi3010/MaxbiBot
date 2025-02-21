const { allFakers } = require('@faker-js/faker');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: 'setname',
    version: '4.2.0',
    hasPermssion: 0,
    credits: 'Vtuan | Cthinh | Updated by Gaudev',
    description: 'Đổi biệt danh trong nhóm của bạn hoặc của người bạn tag',
    commandCategory: 'Tiện ích',
    usages: '[trống/reply/tag] + [name]',
    cooldowns: 0
};

module.exports.run = async ({ api, event, args, Users }) => {
    const filePath = path.join(__dirname, './data/setname.json');
    const { threadID, messageReply, senderID, mentions } = event;
    const mention = Object.keys(event.mentions)[0];
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    if (!fs.existsSync(filePath)) {
        fs.writeJsonSync(filePath, []);
        api.sendMessage('Đã tạo dữ liệu. vui lòng sử dụng lại lệnh!', threadID);
        return;
    }

    const jsonData = fs.readJsonSync(filePath);
    const existingData = jsonData.find(data => data.id_Nhóm === threadID);


    if (args.length > 0 && args[0].toLowerCase() === 'kytu') {
        let ktToCheck;
        if (args.length > 1) {
            ktToCheck = args.slice(1).join(' ');
        } else if (existingData && existingData.kí_tự) {
            ktToCheck = existingData.kí_tự;
        } else {
            api.sendMessage('⚠️ Vui lòng nhập kí tự để kiểm tra hoặc thêm kí tự mặc định trước.', threadID);
            return;
        }

        try {
            let threadInfo = await api.getThreadInfo(threadID);
            let u = threadInfo.nicknames || {};
            let participantIDs = threadInfo.participantIDs;
            const botID = api.getCurrentUserID();

            let listNotMatching = participantIDs.filter(userID => {
                let nickname = u[userID] || "";
                return !nickname.startsWith(ktToCheck) && userID !== botID;
            });

            if (listNotMatching.length === 0) {
                api.sendMessage(`✅ Tất cả thành viên đã set biệt danh với ký tự "${ktToCheck}".`, threadID);
                return;
            }

            let listNames = [], dd = []
            for (let [index, userID] of listNotMatching.entries()) {
                try {
                    let userInfo = await Users.getInfo(userID);
                    let name = userInfo.name || "Người dùng không có tên";
                    let nickname = u[userID] || "(chưa có biệt danh)";
                    listNames.push(`${index + 1}. ${name} || ${nickname}`);
                    dd.push(userID)
                } catch (error) {
                    console.error(`Lỗi khi lấy thông tin người dùng có ID: ${userID}`);
                }
            }

            let message = `- Danh sách người chưa set đúng ký tự "${ktToCheck}":\n${listNames.join("\n")}`;
            api.sendMessage(message, threadID, (a, b) => global.client.handleReply.push({ name: 'setname', messageID: b.messageID, userID }));
        } catch (error) {
            console.error(error);
            api.sendMessage('❌ Đã xảy ra lỗi khi kiểm tra ký tự biệt danh.', threadID);
        }
        return;
    }

    if (args.length > 0 && args[0].toLowerCase() === 'auto') {
        try {
            if (!existingData || !existingData.kí_tự) {
                api.sendMessage('⚠️ Vui lòng cài đặt kí tự prefix trước bằng lệnh: setname add [kí tự]', threadID);
                return;
            }

            const threadInfo = await api.getThreadInfo(threadID);
            const botID = api.getCurrentUserID();
            let updated = 0;
            let skipped = 0;

            for (let member of threadInfo.participantIDs) {
                if (member === botID) {
                    skipped++;
                    continue;
                }

                const currentNickname = threadInfo.nicknames[member] || "";
                if (!currentNickname.startsWith(existingData.kí_tự)) {
                    try {
                        const newNickname = currentNickname
                            ? `${existingData.kí_tự} ${currentNickname}`
                            : `${existingData.kí_tự} ${await Users.getNameUser(member)}`;

                        await api.changeNickname(newNickname, threadID, member);
                        updated++;
                        await delay(1000);
                    } catch (e) {
                        console.error(`Lỗi khi đổi biệt danh cho ${member}:`, e);
                        skipped++;
                    }
                } else {
                    skipped++;
                }
            }

            api.sendMessage(
                `✅ Đã xử lý xong:\n` +
                `- Số người được cập nhật: ${updated}\n` +
                `- Số người được bỏ qua: ${skipped}\n` +
                `- Kí tự setname: ${existingData.kí_tự}`,
                threadID
            );
            return;
        } catch (error) {
            console.error(error);
            api.sendMessage('❌ Đã xảy ra lỗi khi tự động cập nhật biệt danh.', threadID);
            return;
        }
    }


    if (args.length > 0 && args[0].toLowerCase() === 'add') {
        if (args.length < 2) {
            api.sendMessage('Vui lòng nhập kí tự.', threadID);
            return;
        }
        const newData = { id_Nhóm: threadID, kí_tự: args.slice(1).join(' ') || '' };
        if (existingData) {
            existingData.kí_tự = newData.kí_tự;
        } else {
            jsonData.push(newData);
        }
        fs.writeJsonSync(filePath, jsonData);
        api.sendMessage('Đã cập nhật kí tự setname.', threadID);
        return;
    }


    if (args.length > 0 && args[0].toLowerCase() === 'check') {
        try {
            let threadInfo = await api.getThreadInfo(threadID);
            let u = threadInfo.nicknames || {};
            let participantIDs = threadInfo.participantIDs;
            const botID = api.getCurrentUserID();
            let listbd = participantIDs.filter(userID => !u[userID] && userID !== botID);

            if (listbd.length === 0) {
                api.sendMessage(`✅Tất cả thành viên đã có biệt danh.`, threadID);
                return;
            }

            let listNames = [];
            for (let [index, userID] of listbd.entries()) {
                try {
                    let userInfo = await Users.getInfo(userID);
                    let name = userInfo.name || "Người dùng không có tên";
                    listNames.push(`${index + 1}. ${name}`);
                } catch (error) {
                    console.error(`Lỗi khi lấy thông tin người dùng có ID: ${userID}`);
                }
            }

            let message = `- Danh sách người chưa có biệt danh:\n${listNames.join("\n")}`;
            api.sendMessage(message, threadID);
        } catch (error) {
            console.error(error);
            api.sendMessage('❌Đã xảy ra lỗi khi thực hiện chức năng kiểm tra biệt danh.', threadID);
        }
        return;
    }


    if (args.length > 0 && args[0].toLowerCase() === 'call') {
        try {
            let threadInfo = await api.getThreadInfo(threadID);
            let u = threadInfo.nicknames || {};
            let participantIDs = threadInfo.participantIDs;
            const botID = api.getCurrentUserID();
            let listbd = participantIDs.filter(userID => !u[userID] && userID !== botID);

            if (listbd.length === 0) {
                api.sendMessage(`✅Tất cả thành viên đã có biệt danh.`, threadID);
                return;
            }

            let listMentions = [];
            for (let userID of listbd) {
                try {
                    let userInfo = await Users.getInfo(userID);
                    let name = userInfo.name || "Người dùng không có tên";
                    listMentions.push({
                        tag: `@${name}`,
                        id: userID
                    });
                } catch (error) {
                    console.error(`Lỗi khi lấy thông tin người dùng có ID: ${userID}`);
                }
            }

            api.sendMessage({
                body: `dậy đặt biệt danh đi :<`,
                mentions: listMentions
            }, threadID);
        } catch (error) {
            console.error(error);
            api.sendMessage('❌Đã xảy ra lỗi khi thực hiện chức năng tag.', threadID);
        }
        return;
    }


    if (args.length > 0 && args[0].toLowerCase() === 'del') {
        try {
            let threadInfo = await api.getThreadInfo(threadID);
            let isAdmin = threadInfo.adminIDs.some(item => item.id == senderID);

            if (!isAdmin) {
                api.sendMessage('Bạn không có quyền xóa người khác ra khỏi nhóm.', threadID);
                return;
            }

            let u = threadInfo.nicknames || {};
            let participantIDs = threadInfo.participantIDs;
            const botID = api.getCurrentUserID();
            let listbd = participantIDs.filter(userID => !u[userID] && userID !== botID);

            if (listbd.length === 0) {
                api.sendMessage(`✅Tất cả thành viên đã có biệt danh.`, threadID);
                return;
            }

            for (let userID of listbd) {
                await api.removeUserFromGroup(userID, threadID);
            }

            api.sendMessage('Đã xóa những người chưa có biệt danh ra khỏi nhóm.', threadID);
        } catch (error) {
            console.error(error);
            api.sendMessage('❌Đã xảy ra lỗi khi thực hiện chức năng xóa thành viên.', threadID);
        }
        return;
    }


    if (args.length > 0 && args[0].toLowerCase() === 'all') {
        const threadInfo = await api.getThreadInfo(threadID);
        const idtv = threadInfo.participantIDs;
        const nameToChange = args.slice(1).join(" ");

        for (let setname of idtv) {
            let newName = nameToChange;

            if (existingData) {
                const senderName = await Users.getNameUser(event.senderID);
                const kt = existingData.kí_tự;
                newName = kt + ' ' + senderName;
            }

            await delay(100);
            await api.changeNickname(newName, threadID, setname);
        }

        api.sendMessage('✅Đã thay đổi biệt danh cho tất cả thành viên trong nhóm.', threadID);
        return;
    }

    if (args.length > 0 && args[0].toLowerCase() === 'help') {
        const helpMessage = `
 HƯỚNG DẪN SỬ

1. setname [trống/reply/tag] + [biệt danh]**: Đổi biệt danh cho chính bạn hoặc người bạn tag/reply.
   - Ví dụ: "setname Gấu" hoặc reply tin nhắn của người nào đó và sử dụng "setname Tuan Nguyen".
   
2. setname add : Cài đặt ký tự prefix cho biệt danh.
   - Ví dụ: "setname add 🐱".

3. setname auto: Tự động thêm ký tự prefix vào biệt danh của tất cả thành viên trong nhóm.

4. setname kytu : Kiểm tra xem tất cả thành viên đã được set biệt danh với ký tự prefix hay chưa.
   - Ví dụ: "setname kytu 🐱".

5. setname check: Kiểm tra xem có thành viên nào chưa được set biệt danh hay không.

6. setname call: Tag tất cả các thành viên chưa có biệt danh để nhắc nhở.

7. setname del: Xóa những thành viên chưa có biệt danh ra khỏi nhóm.

8. setname all: Đổi biệt danh cho tất cả thành viên trong nhóm.

    `;
        api.sendMessage(helpMessage, threadID);
        return;
    }



        if (existingData) {
        const kt = existingData.kí_tự;
        let name = await Users.getNameUser(event.senderID);
        const names = args.length > 0 ? args.join(' ') : `${name}`;
        if (names.indexOf('@') !== -1) {
            api.changeNickname(`${kt} ${names.replace(mentions[mention], "")}`, threadID, mention, e => {
                if (e) {
                    api.sendMessage(`[ ! ] - Hiện tại nhóm đang bật liên kết tham gia nên bot không thể set được biệt danh cho người dùng, hãy tắt liên kết mời để có thể sử dụng tính năng này!`, threadID);
                }
            });
        } else {
            api.changeNickname(`${kt} ${names}`, threadID, event.type == 'message_reply' ? messageReply.senderID : senderID, e => {
                if (e) {
                    api.sendMessage(`[ ! ] - Hiện tại nhóm đang bật liên kết tham gia nên bot không thể set được biệt danh cho người dùng, hãy tắt liên kết mời để có thể sử dụng tính năng này!`, threadID);
                }
            });
        }
    } else {
        if (args.join().indexOf('@') !== -1) {
            const name = args.join(' ');
            api.changeNickname(`${name.replace(mentions[mention], "")}`, threadID, mention, e => {
                if (e) {
                    api.sendMessage(`[ ! ] - Hiện tại nhóm đang bật liên kết tham gia nên bot không thể set được biệt danh cho người dùng, hãy tắt liên kết mời để có thể sử dụng tính năng này!`, threadID);
                }
            });
        } else {
            api.changeNickname(args.join(' '), threadID, event.type == 'message_reply' ? messageReply.senderID : senderID, e => {
                if (e) {
                    api.sendMessage(`[ ! ] - Hiện tại nhóm đang bật liên kết tham gia nên bot không thể set được biệt danh cho người dùng, hãy tắt liên kết mời để có thể sử dụng tính năng này!`, threadID);
                }
            });
        }
    }

};

module.exports.handleReply = ({ api: { removeUserFromGroup }, handleReply: { dd }, event: { args } }) => {
dd.filter((a, c) => args.map(b => ~~b - 1).includes(c)).map(a => removeUserFromGroup(a))
}