const fs = require('fs');
const path = require('path');
const axios = require('axios');

const albumFilePath = path.join(__dirname, '/Game/album.json');
const cacheDir = path.join(__dirname, 'cache');
const gameDir = path.join(__dirname, 'Game');

// Tạo thư mục và tệp cần thiết nếu không tồn tại
if (!fs.existsSync(gameDir)) {
    fs.mkdirSync(gameDir);
}

if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
}

if (!fs.existsSync(albumFilePath)) {
    fs.writeFileSync(albumFilePath, JSON.stringify([]), 'utf-8');
}

module.exports.config = {
    name: "album",
    version: "1.0.5",
    hasPermssion: 0,
    credits: "Dũngkon",
    description: "Quản lý album ảnh và video cá nhân trên server của bot",
    commandCategory: "Nhóm",
    usages: "album [add img/add video/check img/check video]",
    cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
    let dt = fs.existsSync(albumFilePath) ? JSON.parse(fs.readFileSync(albumFilePath, 'utf-8')) : [];

    if (args[0] === "add" && args[1] === "img") {
        const msg = "📸 Vui lòng reply tin nhắn này và gửi ảnh mà bạn muốn thêm vào album. Bạn có thể gửi nhiều ảnh cùng một lúc.";
        return api.sendMessage(msg, event.threadID, (err, info) => {
            if (err) console.error(err);
            if (info) {
                global.client.handleReply.push({
                    step: 1,
                    type: 'img',
                    name: module.exports.config.name,
                    author: event.senderID,
                    messageID: info.messageID,
                    threadID: event.threadID,
                    data: { senderID: event.senderID, urls: [] }
                });
            }
        });
    } else if (args[0] === "add" && args[1] === "video") {
        const msg = "🎥 Vui lòng reply tin nhắn này và gửi video mà bạn muốn thêm vào album. Bạn có thể gửi nhiều video cùng một lúc.";
        return api.sendMessage(msg, event.threadID, (err, info) => {
            if (err) console.error(err);
            if (info) {
                global.client.handleReply.push({
                    step: 1,
                    type: 'video',
                    name: module.exports.config.name,
                    author: event.senderID,
                    messageID: info.messageID,
                    threadID: event.threadID,
                    data: { senderID: event.senderID, urls: [] }
                });
            }
        });
    } else if (args[0] === "check" && args[1] === "img") {
        const userAlbum = dt.find(entry => entry.senderID === event.senderID);

        if (!userAlbum || !userAlbum.imgUrls || userAlbum.imgUrls.length === 0) {
            return api.sendMessage("📁 Album ảnh của bạn hiện chưa có ảnh nào\nsử dụng album add img để thêm ảnh vào album", event.threadID);
        }

        const attachments = [];
        let msg = "📸 Album ảnh của bạn:\n";
        for (let i = 0; i < userAlbum.imgUrls.length; i++) {
            msg += `${i + 1}. ${userAlbum.imgUrls[i].name}\n`;
        }

        for (const { url } of userAlbum.imgUrls) {
            try {
                const response = await axios({
                    url,
                    method: 'GET',
                    responseType: 'stream'
                });

                const attachmentPath = path.join(cacheDir, `photo_${event.senderID}_${Date.now()}.jpg`);
                const writer = fs.createWriteStream(attachmentPath);
                response.data.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on('finish', () => {
                        attachments.push(fs.createReadStream(attachmentPath));
                        resolve();
                    });
                    writer.on('error', (err) => {
                        console.error(err);
                        reject(err);
                    });
                });
            } catch (error) {
                console.error(error);
                return api.sendMessage("❌ Không thể tải ảnh từ album.", event.threadID);
            }
        }

        if (attachments.length > 0) {
            api.sendMessage({
                body: msg + "\n📌 Reply số thứ tự của ảnh bạn muốn xóa, cách nhau bởi dấu phẩy.",
                attachment: attachments
            }, event.threadID, (err, info) => {
                if (err) console.error(err);
                if (info) {
                    global.client.handleReply.push({
                        step: 2,
                        type: 'img',
                        name: module.exports.config.name,
                        author: event.senderID,
                        messageID: info.messageID,
                        threadID: event.threadID,
                        data: { senderID: event.senderID }
                    });
                }
            });
        }
    } else if (args[0] === "check" && args[1] === "video") {
        const userAlbum = dt.find(entry => entry.senderID === event.senderID);

        if (!userAlbum || !userAlbum.videoUrls || userAlbum.videoUrls.length === 0) {
            return api.sendMessage("📁 Album video của bạn hiện chưa có video nào\nsử dụng album add video để thêm video vào album", event.threadID);
        }

        const attachments = [];
        let msg = "🎥 Album video của bạn:\n";
        for (let i = 0; i < userAlbum.videoUrls.length; i++) {
            msg += `${i + 1}. ${userAlbum.videoUrls[i].name}\n`;
        }

        for (const { url } of userAlbum.videoUrls) {
            try {
                const response = await axios({
                    url,
                    method: 'GET',
                    responseType: 'stream'
                });

                const attachmentPath = path.join(cacheDir, `video_${event.senderID}_${Date.now()}.mp4`);
                const writer = fs.createWriteStream(attachmentPath);
                response.data.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on('finish', () => {
                        attachments.push(fs.createReadStream(attachmentPath));
                        resolve();
                    });
                    writer.on('error', (err) => {
                        console.error(err);
                        reject(err);
                    });
                });
            } catch (error) {
                console.error(error);
                return api.sendMessage("❌ Không thể tải video từ album.", event.threadID);
            }
        }

        if (attachments.length > 0) {
            api.sendMessage({
                body: msg + "\n📌 Reply số thứ tự của video bạn muốn xóa, cách nhau bởi dấu phẩy.",
                attachment: attachments
            }, event.threadID, (err, info) => {
                if (err) console.error(err);
                if (info) {
                    global.client.handleReply.push({
                        step: 2,
                        type: 'video',
                        name: module.exports.config.name,
                        author: event.senderID,
                        messageID: info.messageID,
                        threadID: event.threadID,
                        data: { senderID: event.senderID }
                    });
                }
            });
        }
    } else {
        return api.sendMessage("===== Cách dùng =====\nalbum add img (để thêm ảnh vào album của bạn)\nalbum add video (để thêm video vào album của bạn)\nalbum check img (xem album ảnh của bạn)\nalbum check video (xem album video của bạn)", event.threadID);
    }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
    if (event.senderID !== handleReply.author) return;

    if (handleReply.step === 1) {
        const urls = event.attachments
            .filter(attachment => (handleReply.type === 'img' && attachment.type === 'photo') || (handleReply.type === 'video' && attachment.type === 'video'))
            .map(attachment => attachment.url);

        if (urls.length > 0) {
            handleReply.data.urls = urls;
            const msg = "📌 Vui lòng reply tin nhắn này và gửi tên cho từng tệp theo thứ tự (cách nhau bằng dấu phẩy ',').";
            return api.sendMessage(msg, event.threadID, (err, info) => {
                if (err) console.error(err);
                if (info) {
                    global.client.handleReply.push({
                        step: 1.5,
                        type: handleReply.type,
                        name: module.exports.config.name,
                        author: event.senderID,
                        messageID: info.messageID,
                        threadID: event.threadID,
                        data: handleReply.data
                    });
                }
            });
        } else {
            return api.sendMessage("❌ Vui lòng gửi đúng định dạng tệp để thêm vào album.", event.threadID);
        }
    } else if (handleReply.step === 1.5) {
        const names = event.body.split(',').map(name => name.trim());

        if (names.length !== handleReply.data.urls.length) {
            return api.sendMessage("❌ Số lượng tên không khớp với số lượng tệp. Vui lòng thử lại.", event.threadID);
        }

        const data = handleReply.data;
        let dt = fs.existsSync(albumFilePath) ? JSON.parse(fs.readFileSync(albumFilePath, 'utf-8')) : [];
        let userAlbum = dt.find(entry => entry.senderID === data.senderID);

        if (!userAlbum) {
            userAlbum = { senderID: data.senderID, imgUrls: [], videoUrls: [] };
            dt.push(userAlbum);
        }

        if (handleReply.type === 'img') {
            for (let i = 0; i < data.urls.length; i++) {
                userAlbum.imgUrls.push({ url: data.urls[i], name: names[i] });
            }
        } else if (handleReply.type === 'video') {
            for (let i = 0; i < data.urls.length; i++) {
                userAlbum.videoUrls.push({ url: data.urls[i], name: names[i] });
            }
        }

        fs.writeFileSync(albumFilePath, JSON.stringify(dt), 'utf-8');
        return api.sendMessage("✅ Đã thêm tệp vào album của bạn.", event.threadID);
    } else if (handleReply.step === 2) {
        const indices = event.body.split(',').map(num => parseInt(num.trim()) - 1).filter(num => !isNaN(num));
        if (indices.length === 0) return;

        let dt = fs.existsSync(albumFilePath) ? JSON.parse(fs.readFileSync(albumFilePath, 'utf-8')) : [];
        let userAlbum = dt.find(entry => entry.senderID === handleReply.data.senderID);

        if (!userAlbum) return;

        if (handleReply.type === 'img') {
            userAlbum.imgUrls = userAlbum.imgUrls.filter((_, i) => !indices.includes(i));
        } else if (handleReply.type === 'video') {
            userAlbum.videoUrls = userAlbum.videoUrls.filter((_, i) => !indices.includes(i));
        }

        fs.writeFileSync(albumFilePath, JSON.stringify(dt), 'utf-8');
        return api.sendMessage("✅ Đã xóa các tệp khỏi album của bạn.", event.threadID);
    }
};
