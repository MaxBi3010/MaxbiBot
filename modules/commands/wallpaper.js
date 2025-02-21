module.exports.config = {
  name: "wallpaper",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "DongDev",
  description: "Tìm kiếm ảnh trên wallpaper",
  commandCategory: "Tiện ích",
  usages: "[]",
  cooldowns: 5,
  images: [],
};

const axios = require('axios');
const cheerio = require('cheerio');

async function wallpaper(title) {
    const random = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let randomgambar = random[Math.floor(Math.random() * random.length)];

    try {
        const { data } = await axios.get(`https://www.besthdwallpaper.com/search?CurrentPage=${randomgambar}&q=${title}`);
        let $ = cheerio.load(data);
        let images = [];

        $('div.grid-item').each(function (a, b) {
            let image = $(b).find('picture > source:nth-child(2)').attr('srcset');
            if (image) {
                images.push(image);
            }
        });
        images.sort(() => Math.random() - 0.5);
        return images.slice(0, 6);
    } catch (error) {
        throw error;
    }
}

module.exports.run = async({ api, event, args }) => {
    try {
        if (args.length === 0) {
            return api.sendMessage("❎ Vui lòng nhập từ khóa để tìm kiếm ảnh!", event.threadID, event.messageID);
        }

        let keyword = args.join(" ");
        const data = await wallpaper(keyword);
        
        if (data.length === 0) {
            api.sendMessage("❎ Không tìm thấy hình ảnh phù hợp", event.threadID, event.messageID);
            return;
        }
        
        let images = [];
        for (let i = 0; i < data.length; i++) {
            const stream = (await axios.get(data[i], { responseType: "stream" })).data;
            images.push(stream);
        }
        
        api.sendMessage({ body: ``, attachment: images }, event.threadID, event.messageID);
    } catch (error) {
        console.error("Error:", error);
    }
};