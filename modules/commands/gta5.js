this.config = {
  name: "gta5",
  version: "1.2.9",
  hasPermssion: 0,
  credits: "DongDev",
  description: "Chuyển ảnh thường thành ảnh game GTA 5",
  commandCategory: "Ảnh", 
  usages: "[]",
  cooldowns: 5,
};

this.run = async o => {
  const axios = require('axios');
  const fs = require('fs');
  const path = require('path');
  const FormData = require('form-data');

  const randomUserAgent = () => {
    const versions = ["4.0.3", "4.1.1", "4.2.2", "4.3", "4.4", "5.0.2", "5.1", "6.0", "7.0", "8.0", "9.0", "10.0", "11.0"];
    const devices = ["M2004J19C", "S2020X3", "Xiaomi4S", "RedmiNote9", "SamsungS21", "GooglePixel5"];
    const builds = ["RP1A.200720.011", "RP1A.210505.003", "RP1A.210812.016", "QKQ1.200114.002", "RQ2A.210505.003"];
    const chromeVersion = `Chrome/${Math.floor(Math.random() * 80) + 1}.${Math.floor(Math.random() * 999) + 1}.${Math.floor(Math.random() * 9999) + 1}`;
    return `Mozilla/5.0 (Linux; Android ${versions[Math.floor(Math.random() * versions.length)]}; ${devices[Math.floor(Math.random() * devices.length)]} Build/${builds[Math.floor(Math.random() * builds.length)]}) AppleWebKit/537.36 (KHTML, like Gecko) ${chromeVersion} Mobile Safari/537.36 WhatsApp/1.${Math.floor(Math.random() * 9) + 1}.${Math.floor(Math.random() * 9) + 1}`;
  };

  const randomIP = () => `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;

  const generateHeaders = () => ({
    "User-Agent": randomUserAgent(),
    "X-Forwarded-For": randomIP(),
  });

  const generateCookies = () => {
    const getRandomValue = () => Math.random().toString(36).substring(2);
    return `_ga=GA1.1.${getRandomValue()}.${getRandomValue()}; ` +
      `__eoi=ID=${getRandomValue()}:T=${getRandomValue()}:RT=${getRandomValue()}:S=${getRandomValue()}; ` +
      `_ga_WBHK34L0J9=GS1.1.${getRandomValue()}.1.0.${getRandomValue()}.0.0.0; ` +
      `FCNEC=%5B%5B%22AKsRol${getRandomValue()}${getRandomValue()}${getRandomValue()}%3D%3D%22%5D%5D`;
  };

  const downloadImage = async (imageUrl, outputPath) => {
    const response = await axios({ url: imageUrl, method: 'GET', responseType: 'stream' });
    return new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(outputPath)).on('finish', resolve).on('error', reject);
    });
  };

  const getId = async (url) => {
    const imagePath = path.join(__dirname, `cache/${Date.now()}.jpg`);
    await downloadImage(url, imagePath);

    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));

    const headers = {
      ...form.getHeaders(),
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'vi,en;q=0.9',
      'Cookie': generateCookies(),
      'Origin': 'https://taoanhdep.com',
      'Priority': 'u=1, i',
      'Sec-Ch-Ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      ...generateHeaders(),
      'X-Requested-With': 'XMLHttpRequest',
    };

    try {
      const response = await axios.post('https://taoanhdep.com/public/anime-gtav.php', form, { headers });
      return response.data.requestId;
    } catch (error) {
      console.error(error);
      throw new Error("Error getting ID");
    }
  };

  const gtav = async (url) => {
    const id = await getId(url);
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const headers = {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'vi,en;q=0.9',
      'Cookie': generateCookies(),
      'Priority': 'u=1, i',
      'Sec-Ch-Ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      ...generateHeaders(),
      'X-Requested-With': 'XMLHttpRequest'
    };

    let status = 'InProgress';
    let responseData;

    while (status === 'InProgress') {
      try {
        const response = await axios.get(`https://taoanhdep.com/public/check-gtav.php?id=${id}`, { headers });
        responseData = response.data;
        status = responseData.status;
        if (status === 'InProgress') await delay(10000);
      } catch (error) {
        console.error('Error checking image status:', error);
        throw new Error("Error checking image status");
      }
    }

    return responseData.result_url;
  };

  const streamURL = async (url, ext = 'jpg') => {
    try {
      const res = await axios.get(url, { responseType: 'stream' });
      res.data.path = `tmp.${ext}`;
      return res.data;
    } catch (error) {
      console.error('Error streaming URL:', error);
      throw new Error("Error streaming URL");
    }
  };

  try {
    const link = o.event.messageReply.attachments[0].url;
    const data = await gtav(link);
    const img = await streamURL(data, 'jpg');
    o.api.sendMessage({ body: '✅', attachment: img }, o.event.threadID, o.event.messageID);
  } catch (error) {
    console.error('Error processing image:', error);
    o.api.sendMessage({ body: '❌ Error processing image' }, o.event.threadID, o.event.messageID);
  }
};