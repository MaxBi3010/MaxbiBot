const os = require('os');
const moment = require('moment-timezone');
const { exec } = require('child_process');

module.exports = {
    config: {
        name: "upt",
        version: "2.1.4",
        hasPermission: 2,
        credits: "Vtuan rmk Niio-team",
        description: "Hiển thị thông tin hệ thống của bot!",
        commandCategory: "Admin",
        usages: "",
        cooldowns: 5,
        image: []
    },
    run: async ({ api, event, Users }) => {
        const startTime = Date.now();

        // Fake thông tin cấu hình
        const fakeCpuModel = "AMD Ryzen 9 7950X3D";
        const fakeCpuCores = 16;
        const fakeCpuSpeed = 4500; // MHz
        const fakeTotalRam = 64;  // Giả lập tổng RAM là 64GB

        // Hàm lấy thông tin RAM thực từ lệnh `free -m`
        function getRamInfo() {
            return new Promise((resolve, reject) => {
                exec('free -m', (error, stdout) => {
                    if (error) {
                        return reject('Không thể lấy thông tin RAM từ lệnh free -m');
                    }
                    const lines = stdout.split('\n');
                    const memInfo = lines[1].split(/\s+/);
                    const usedRamReal = (parseInt(memInfo[2]) / 1024).toFixed(2); // RAM đã dùng (GB)
                    resolve({ usedRamReal });
                });
            });
        }

        try {
            const { usedRamReal } = await getRamInfo();

            // Tính toán RAM còn lại dựa trên tổng RAM fake và RAM thật đã dùng
            const fakeFreeRam = (fakeTotalRam - usedRamReal).toFixed(2);

            // Thời gian hoạt động
            const uptime = process.uptime();
            const uptimeHours = Math.floor(uptime / 3600);
            const uptimeMinutes = Math.floor((uptime % 3600) / 60);
            const uptimeSeconds = Math.floor(uptime % 60);
            const uptimeString = `${String(uptimeHours).padStart(2, '0')}:${String(uptimeMinutes).padStart(2, '0')}:${String(uptimeSeconds).padStart(2, '0')}`;

            let name = await Users.getNameUser(event.senderID);

            // Tính ping
            const pingReal = Date.now() - startTime;
            const botStatus = (pingReal < 200) ? 'mượt' : (pingReal < 800) ? 'trung bình' : 'lag';

            // Chuẩn bị thông báo
            const replyMsg = `⏰ Bây giờ là: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss')} | ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
⏱️ Thời gian đã hoạt động: ${uptimeString}
📝 Dấu lệnh mặc định: /
🔣 Tình trạng bot: ${botStatus}
📋 Hệ điều hành: Linux 6.0.0-rt17-generic (x64)
💾 CPU: ${fakeCpuCores} core(s) - ${fakeCpuModel} @ ${fakeCpuSpeed}MHz
📊 RAM: ${usedRamReal}GB/${fakeTotalRam}GB (đã dùng)
🛢️ RAM trống: ${fakeFreeRam}GB
🛜 Ping: ${pingReal}ms
👤 Yêu cầu bởi: ${name}
`.trim();

            // Gửi tin nhắn
            api.sendMessage({
                body: replyMsg,
                attachment: vdsp.splice(0, 1), 
            }, event.threadID, event.messageID);

        } catch (error) {
            console.error('Lỗi khi lấy thông tin RAM:', error);
            api.sendMessage("❎ Có lỗi xảy ra khi lấy thông tin hệ thống.", event.threadID, event.messageID);
        }
    }
};


