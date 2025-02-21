module.exports = {
    run: async(o)=> {
let axios = require('axios');
let send = msg=>o.api.sendMessage(msg, o.event.threadID, o.event.messageID),
input = o.args.join(' ').split(/\u0020|\n/),
output = [];

 for (let $ of input)try {
 output.push((await axios.get(`https://api.imgbb.com/1/upload?key=588779c93c7187148b4fa9b7e9815da9&image=${$}`)).data.data.display_url);
 } catch {
 continue;
};

   send(JSON.stringify(output, 0, 4));
 },

config: {
 name: 'up',
 version: '1.1',
 hasPermssion: 0,
 credits: 'DC-Nam',
 description: 'up ảnh lên ibb.com',
 commandCategory: 'Tiện ích',
 usages: '[.]',
 cooldowns: 0,
 images: [],
 },
};