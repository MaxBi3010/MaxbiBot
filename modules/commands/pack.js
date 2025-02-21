module.exports.config = {
 name: "pack",
 version: "1.0.1",
 hasPermssion: 0,
 credits: "DongDev",
 description: "check thông tin package",
 commandCategory: "Tiện ích",
 usages: "pack + tên package",
 images: [],
 cooldowns: 2,
};

module.exports.run = async ({ api, event, args }) => {
 const axios = require('axios');
 const moment = require('moment-timezone');
 const npmRegistryURL = 'https://registry.npmjs.org/';

 var packageName = args.join(" ");

 if (!packageName) {
 api.sendMessage(`⚠️Vui lòng nhập tên package cần xem info!`, event.threadID, event.messageID);
 return;
 }

 async function getPackageInfo(packageName) {
 try {
 const response = await axios.get(`${npmRegistryURL}${packageName}`);
 const packageData = response.data;

 if (packageData.error) {
 api.sendMessage(`❎ Package "${packageName}" không tồn tại trên npm.`);
 return;
 }

 const latestVersion = packageData['dist-tags'].latest;
 const versionData = packageData.versions[latestVersion];
 const publisher = versionData.maintainers[0];
 const filesize = versionData.dist.unpackedSize;
 const fileSizeInMB = (filesize / (1024 * 1024)).toFixed(2);
 const inputTimepub = packageData.time[packageData['dist-tags'].latest];
 const inputTimepubl = packageData.time[latestVersion];
 const outputTimeZone = 'Asia/Ho_Chi_Minh';
 const timepub = moment(inputTimepub).tz(outputTimeZone);
 const timepubl = moment(inputTimepubl).tz(outputTimeZone);
 
 api.sendMessage(`\n|› Package: ${packageName} ✅\n|› Tên Package: ${packageData.name}\n|› Phiên Bản: ${latestVersion}\n|› Thời Gian Publish Package: ${timepub.format('HH:mm:ss - DD/MM/YYYY')}\n|› Tên Người Publish Package: ${publisher.name}\n|› Email Người Publish: ${packageData.maintainers[0].email}\n────────────────────\n|› Link Source Package: ${packageData.bugs.url}\n|› Trang Chủ: ${packageData.homepage}\n|› Hỗ Trợ Các Dạng: ${packageData.keywords}\n────────────────────\n|› Dung Lượng Package: ${fileSizeInMB}MB\n|› Tổng File: ${versionData.dist.fileCount}\n|› Publish Package Lần Cuối: ${timepubl.format('HH:mm:ss - DD/MM/YYYY')}\n────────────────────\n|› DownLoad Source: ${packageData.repository.url}\n|› Install Package: npm i ${packageName}`, event.threadID, event.messageID);

 } catch (error) {
 api.sendMessage(`❎ Lỗi khi lấy thông tin về package ${packageName}.
 ------------------------------
 ${error.message}`);
 }
 }
 getPackageInfo(packageName);
};