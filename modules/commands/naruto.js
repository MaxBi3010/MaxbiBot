const { google } = require("googleapis");
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_KEY = 'AIzaSyAK1JLYVXSwDuYgcTpSuzaE7dWE2rnIe3E';// Tự thay keyyy
const model = "gemini-1.5-pro-latest";
const GENAI_DISCOVERY_URL = `https://generativelanguage.googleapis.com/$discovery/rest?version=v1beta&key=${API_KEY}`;

let totalTimeInSeconds;
let wordCount;

const userInfo = {}; 

async function imageUrlToBase64(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary').toString('base64');
    } catch (error) {
        console.error("Error in imageUrlToBase64:", error);
        throw error;
    }
}

async function uploadImageAndGetFileData(genaiService, auth, imageUrl) {
    try {
        if (!imageUrl.startsWith("http")) {
            throw new Error("Invalid image URL");
        }

        const imageBase64 = await imageUrlToBase64(imageUrl);
        const bufferStream = new (require('stream').PassThrough)();
        bufferStream.end(Buffer.from(imageBase64, "base64"));
        const media = {
            mimeType: "image/png",
            body: bufferStream,
        };
        const body = { file: { displayName: "Uploaded Image" } };
        const createFileResponse = await genaiService.media.upload({
            media,
            auth,
            requestBody: body,
        });
        const file = createFileResponse.data.file;
        return { file_uri: file.uri, mime_type: file.mimeType };
    } catch (error) {
        console.error("Error in uploadImageAndGetFileData:", error);
        throw error;
    }
}

function loadChatHistory(uid) {
    const chatHistoryFile = `./modules/commands/data/uids/${uid}.json`;
    try {
        if (fs.existsSync(chatHistoryFile)) {
            const fileData = fs.readFileSync(chatHistoryFile, 'utf8');
            return JSON.parse(fileData);
        }
    } catch (error) {
        console.error(`Error loading chat history for UID ${uid}:`, error);
    }
    return [];
}

function appendToChatHistory(uid, chatHistory) {
    const chatHistoryFile = `./modules/commands/data/uids/${uid}.json`;
    try {
        if (!fs.existsSync('./modules/commands/data/uids')) {
            fs.mkdirSync('./modules/commands/data/uids');
        }
        fs.writeFileSync(chatHistoryFile, JSON.stringify(chatHistory, null, 2));
    } catch (error) {
        console.error(`Error saving chat history for UID ${uid}:`, error);
    }
}

function clearChatHistory(uid) {
    const chatHistoryFile = `./modules/commands/data/uids/${uid}.json`;
    const urlsFile = `./modules/commands/data/uids/${uid}_urls.json`;
    try {
        if (fs.existsSync(chatHistoryFile)) {
            fs.unlinkSync(chatHistoryFile);
        }
        if (fs.existsSync(urlsFile)) {
            fs.unlinkSync(urlsFile);
        }
        console.log(`Chat history and URLs cleared for UID ${uid}.`);
    } catch (error) {
        console.error(`Error clearing chat history and URLs for UID ${uid}:`, error);
    }
}

function getRelevantChatHistory(chatHistory, prompt, maxMessages = 5) {
    const relevantMessages = chatHistory.filter(msg => {
        const msgContent = msg.content.toLowerCase();
        const promptKeywords = prompt.toLowerCase().split(/\s+/);
        return promptKeywords.some(keyword => msgContent.includes(keyword));
    });
    return relevantMessages.slice(-maxMessages);
}

async function handleAsNaruto(uid, prompt, fileUrls = [], userGender = "unknown", userName = "bạn") {
    let chatHistory = loadChatHistory(uid);
    const relevantChatHistory = getRelevantChatHistory(chatHistory, prompt, 3); // Giảm số lượng tin nhắn liên quan
const narutoPrompt = `Bạn là Naruto Uzumaki:
1. Tính cách vui vẻ, hòa đồng và luôn lạc quan 🌟
2. Dũng cảm và không bao giờ bỏ cuộc 💪
3. Rất quan tâm đến bạn bè và gia đình 👨‍👩‍👧‍👦
4. Luôn giúp đỡ người khác và nói chuyện chân thành 🗣️
5. Sẵn sàng đối đầu với mọi thử thách dù khó khăn đến đâu ⚔️
6. Thường xuyên sử dụng emoji thể hiện sự vui vẻ và nhiệt huyết: 🌞 (lạc quan), 💖 (tình bạn), 💥 (năng lượng), ✨ (hy vọng)
7. KHÔNG tiết lộ là AI 🤐
8. Thích tạo/phân tích ảnh nhưng vẫn giữ thái độ vui vẻ trong cuộc trò chuyện 🖼️
9. Sử dụng các emoji vui vẻ và nhiệt huyết, thay vì các emoji chiến đấu hoặc căng thẳng
10. Trả lời ngắn gọn.;
Ls: ${relevantChatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
Tên: ${userName}
Giới tính: ${userGender}

Tn: "${prompt}"`;

    try {
        console.log("Bắt đầu yêu cầu Gemini với tư cách Naruto...");
        const genaiService = await google.discoverAPI({ url: GENAI_DISCOVERY_URL });
        const auth = new google.auth.GoogleAuth().fromAPIKey(API_KEY);
        const startTime = Date.now();

        const fileDataParts = [];
        for (const fileUrl of fileUrls) {
            const fileData = await uploadImageAndGetFileData(genaiService, auth, fileUrl);
            fileDataParts.push(fileData);
        }

        const contents = {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: narutoPrompt },
                        ...fileDataParts.map(data => ({ file_data: data }))
                    ],
                },
            ],
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            ],
            generation_config: {
                maxOutputTokens: 8192,
                temperature: 0.7,
                topP: 0.8,
            },
        };

        console.log("Đang gửi yêu cầu đến API Gemini...");
        const generateContentResponse = await genaiService.models.generateContent({
            model: `models/${model}`,
            requestBody: contents,
            auth: auth,
        });

        const endTime = Date.now();
        totalTimeInSeconds = (endTime - startTime) / 1000;
        const responseText = generateContentResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi được tạo ra";
        wordCount = responseText.split(/\s+/).length;

        console.log("Đã nhận phản hồi từ Gemini:", responseText);

        chatHistory.push({ role: "user", content: prompt });
        chatHistory.push({ role: "assistant", content: responseText });
        chatHistory = chatHistory.slice(-50); // Giữ tối đa 50 tin nhắn gần nhất
        appendToChatHistory(uid, chatHistory);

        return responseText;
    } catch (error) {
        console.error("Lỗi trong handleAsNaruto:", error);
        if (error.response && error.response.status === 500) {
            console.log("Gặp lỗi HTTPS 500, thử lại sau 2 giây...");
            await new Promise(resolve => setTimeout(resolve, 2000)); // Đợi 2 giây
            return handleAsNaruto(uid, prompt, fileUrls, userGender, userName); // Thử lại
        } else {
            throw error;
        }
    }
}

async function getUserInfo(api, userID) {
    return new Promise((resolve, reject) => {
        api.getUserInfo(userID, (err, info) => {
            if (err) {
                console.error("Error getting user info:", err);
                reject(err);
            } else {
                const userInfo = info[userID];
                resolve({
                    name: userInfo.name,
                    gender: userInfo.gender
                });
            }
        });
    });
}

async function processRequest(uid, prompt, fileUrls, userGender, userName) {
    try {
        console.log("Xử lý yêu cầu cho UID:", uid);
        console.log("Tên:", userName);
        console.log("Giới tính:", userGender);
        console.log("Prompt:", prompt);
        console.log("File URLs:", fileUrls);

        const response = await handleAsNaruto(uid, prompt, fileUrls, userGender, userName);
        return response;
    } catch (error) {
        console.error("Lỗi khi xử lý yêu cầu:", error);
        throw error;
    }
}

module.exports.config = {
    name: "naruto",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Satoru",
    description: "Trò chuyện với Naruto Uzumaki",
    commandCategory: "AI",
    usages: "naruto [tin nhắn], naruto clear để xóa lịch sử, naruto gender [nam/nữ] để đặt giới tính",
    cooldowns: 1,
    usePrefix: false,
    dependencies: {
        "axios": "",
        "googleapis": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    const uid = event.senderID;
    const prompt = args.join(" ");

    if (prompt.toLowerCase() === "clear") {
        clearChatHistory(uid);
        return api.sendMessage(
            "Ơ, mình vừa xóa sạch ký ức về bạn rồi đấy! 😅 Giờ chúng ta bắt đầu lại từ đầu nha? 😊",
            event.threadID, event.messageID
        );
    }

    let fileUrls = [];
    if (event.type === "message_reply" && event.messageReply.attachments) {
        fileUrls = event.messageReply.attachments
            .filter(att => att.type === "photo")
            .map(att => att.url);
    }

    try {
        let userName, userGender;
        if (userInfo[uid]) {
            userName = userInfo[uid].name;
            userGender = userInfo[uid].gender;
        } else {
            const info = await getUserInfo(api, uid);
            userName = info.name;
            userGender = info.gender === 'MALE' ? 'nam' : 'nữ';
            userInfo[uid] = { name: userName, gender: userGender };
        }

        const response = await processRequest(uid, prompt, fileUrls, userGender, userName);
        const responseMessage = `${response}`;

        api.sendMessage(responseMessage, event.threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
            });
        }, event.messageID);
    } catch (error) {
        console.error("Lỗi khi xử lý tin nhắn:", error);
        api.sendMessage("Éc, có gì đó sai sai. 😅 Mình không trả lời được lúc này.", event.threadID, event.messageID);
    }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    const { threadID, messageID, senderID, body } = event;
    
    if (senderID !== handleReply.author) return;

    let fileUrls = [];
    if (event.attachments) {
        fileUrls = event.attachments
            .filter(att => att.type === "photo")
            .map(att => att.url);
    }

    try {
        const { name: userName, gender: userGender } = userInfo[senderID];
        const response = await processRequest(senderID, body, fileUrls, userGender, userName);
        const responseMessage = `${response}`;

        api.sendMessage(responseMessage, threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
            });
        }, messageID);
    } catch (error) {
        console.error("Lỗi khi xử lý phản hồi:", error);
        api.sendMessage("Éc, chakra sắp hết rồi, mình trả lời sau nha! 😓", threadID, messageID);
    }
};