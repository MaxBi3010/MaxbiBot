const axios = require("axios"),
    fs = require("fs-extra"),
    path = require("path"),
    autodownConfig = {
        name: "autodown",
        version: "1.0.2",
        hasPermssion: 0,
        credits: "gaudev",
        description: "Bật/tắt tự động tải video/ảnh từ nhiều nền tảng",
        commandCategory: "Tiện ích",
        usages: "[link] hoặc bật/tắt autodown",
        cooldowns: 5,
        dependencies: { axios: "", "fs-extra": "" }
    },
    cacheDirectory = (() => {
        const dir = path.join(__dirname, "cache");
        fs.existsSync(dir) || fs.mkdirSync(dir);
        return dir;
    })(),
    stateFile = path.join(cacheDirectory, "autodown_state.json"),
    persistState = obj => fs.writeFileSync(stateFile, JSON.stringify(obj, null, 4)),
    retrieveState = () => (fs.existsSync(stateFile) || persistState({}), JSON.parse(fs.readFileSync(stateFile)));

module.exports.config = autodownConfig;

module.exports.run = async function ({ api, event }) {
    const { threadID } = event, currentState = retrieveState();
    (!currentState[threadID]) && (currentState[threadID] = { enabled: true });
    currentState[threadID].enabled = !currentState[threadID].enabled;
    persistState(currentState);
    return api.sendMessage(`Đã ${(currentState[threadID].enabled ? "Bật" : "Tắt")} tự động tải link ✅`, threadID);
};

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, body } = event;
    const currentState = retrieveState();
    currentState[threadID] = currentState[threadID] || { enabled: true };
    if (!currentState[threadID].enabled || !body) return;

    const urlPattern = /(https?:\/\/[^\s]+)/g, detectedURLs = body.match(urlPattern);

    if (!detectedURLs) return;

    const firstURL = detectedURLs[0].replace(/[^a-zA-Z0-9:\\/\\.\\-_?&=]/g, ""),
        supportedDomains = ["youtube.com", "facebook.com", "instagram.com", "threads.net", "v.douyin.com", "vt.tiktok.com", "capcut.com"];
    if (!supportedDomains.some(domain => firstURL.includes(domain))) return;

    const fetchMedia = async (url, mediaType, fileExtension) => {
        const filePath = path.join(cacheDirectory, `${mediaType}_${Date.now()}.${fileExtension}`);
        const fileData = await axios.get(url, { responseType: "arraybuffer" });
        return fs.writeFileSync(filePath, Buffer.from(fileData.data, "binary")), fs.createReadStream(filePath);
    };

    try {
        const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Accept-Language': 'vi-VN, en-US' },
            isThreadPlatform = firstURL.includes("threads.net"),
            apiURL = `http://gau-api.click/download?url=${encodeURIComponent(firstURL)}`;
        const { data: { data } } = isThreadPlatform ? await axios.get(apiURL, { headers }) : await axios.get(apiURL);

        if (!data || !data.media_urls?.length && !data.medias?.length) return;

        const mediaList = data.media_urls || data.medias, imageAttachments = [], videoAttachments = [];
        let videoCount = 0;  // Thêm biến đếm video

        for (const media of mediaList) {
            const { type, url } = media;
            if (type === "image") {
                imageAttachments.push(await fetchMedia(url, "image", "jpg"));
            } else if (type === "video" && videoCount < 1) {  // Chỉ tải 1 video
                videoAttachments.push(await fetchMedia(url, "video", "mp4"));
                videoCount++;
            }
        }

        if (imageAttachments.length) {
            const imageMessage = `[${(data.source || "Threads").toUpperCase()}] - Tự Động Tải Ảnh\n\n👤 Tác giả: ${data.author || "Không rõ"}\n💬 Tiêu đề: ${data.title || "Không có tiêu đề"}`;
            await api.sendMessage({ body: imageMessage, attachment: imageAttachments }, threadID, messageID); // Thêm messageID
        }

        if (videoAttachments.length) {
            const videoMessage = `[${(data.source || "Threads").toUpperCase()}] - Tự Động Tải Video\n\n👤 Tác giả: ${data.author || "Không rõ"}\n💬 Tiêu đề: ${data.title || "Không có tiêu đề"}`;
            await api.sendMessage({ body: videoMessage, attachment: videoAttachments[0] }, threadID, messageID); // Thêm messageID
        }
    } catch (err) {
        console.error("", err);
    }
};
