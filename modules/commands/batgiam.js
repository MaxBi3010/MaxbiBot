const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "batgiam",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "ProCoderMew & DongDev fix",
    description: "Bắt giam người bạn tag",
    commandCategory: "Game",
    usages: "[tag]",
    images: [],
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    const dirMaterial = path.resolve(__dirname, "cache", "canvas");
    const pathImg = path.resolve(dirMaterial, "batgiam.png");
    
    if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(pathImg)) {
        const { data: batgiamImg } = await axios.get("https://i.imgur.com/ep1gG3r.png", { responseType: "arraybuffer" });
        fs.writeFileSync(pathImg, Buffer.from(batgiamImg, "utf-8"));
    }
}

async function makeImage({ one, two }) {
    const __root = path.resolve(__dirname, "cache", "canvas");
    const batgiamImg = await jimp.read(path.resolve(__root, "batgiam.png"));
    const avatarOne = path.resolve(__root, `avt_${one}.png`);
    const avatarTwo = path.resolve(__root, `avt_${two}.png`);

    const getAvatar = async (userId, avatarPath) => {
        const { data: avatar } = await axios.get(`https://graph.facebook.com/${userId}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" });
        fs.writeFileSync(avatarPath, Buffer.from(avatar, "utf-8"));
    };

    await Promise.all([getAvatar(one, avatarOne), getAvatar(two, avatarTwo)]);

    const circleImage = async (imagePath) => {
        const image = await jimp.read(imagePath);
        image.circle();
        return image; // Return the jimp object instead of buffer
    };

    const [circleOne, circleTwo] = await Promise.all([circleImage(avatarOne), circleImage(avatarTwo)]);

    batgiamImg.resize(500, 500).composite(circleOne.resize(100, 100), 375, 9).composite(circleTwo.resize(100, 100), 160, 92);

    const pathImg = path.resolve(__root, `batgiam_${one}_${two}.png`);
    const raw = await batgiamImg.getBufferAsync(jimp.MIME_PNG);

    fs.writeFileSync(pathImg, raw);
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);

    return pathImg;
}

module.exports.run = async function ({ event, api }) {
    const { threadID, messageID, senderID, mentions } = event;
    const mention = Object.keys(mentions)[0];
    const tag = mentions[mention]?.replace("@", "");

    if (!mention) return api.sendMessage("Vui lòng tag 1 người", threadID, messageID);

    const one = senderID, two = mention;
    
    try {
        const path = await makeImage({ one, two });
        api.sendMessage({
            body: `🎉 Xin chúc mừng em đã vào biên chế nhà nước nha ${tag}\nChúc em vui vẻ 😆`,
            mentions: [{ tag, id: mention }],
            attachment: fs.createReadStream(path)
        }, threadID, () => fs.unlinkSync(path), messageID);
    } catch (error) {
        console.error("Error making image:", error);
        api.sendMessage("❎ Đã xảy ra lỗi khi tạo ảnh", threadID, messageID);
    }
}