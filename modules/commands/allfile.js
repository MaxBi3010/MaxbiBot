const fs = require('fs');

module.exports.config = {
    name: "allfile",
    version: "1.0.0",
    hasPermission: 0,
    credits: "DongDev",
    description: "Hiển thị danh sách tệp và thư mục trong thư mục hiện tại.",
    usage: "",
    commandCategory: "Admin",
    cooldowns: 5
};

module.exports.run = async function({ event, api, args }) {
    // Đường dẫn đến thư mục bạn muốn kiểm tra
    const directoryPath = './';

    // Hàm đọc nội dung của thư mục
    function readDirectory(path) {
        fs.readdir(path, (err, files) => {
            if (err) {
                console.log('Lỗi khi đọc thư mục:', err);
                return;
            }
            
            // Lọc ra các tệp và thư mục
            const folders = files.filter(file => fs.statSync(file).isDirectory());
            const filesOnly = files.filter(file => !fs.statSync(file).isDirectory());

            // Tạo danh sách thư mục và tệp với số thứ tự và emoji biểu tượng
            let message = "Danh sách thư mục và tệp:\n\n";
            folders.forEach((folder, index) => {
                message += `${index + 1}. 📁 ${folder}\n`;
            });
            filesOnly.forEach((file, index) => {
                message += `${folders.length + index + 1}. 📄 ${file}\n`;
            });

            // Gửi danh sách với số thứ tự và emoji biểu tượng
            api.sendMessage(message, event.threadID, (error, info) => {
                // Push dữ liệu vào reply
                const data = { folders, filesOnly, path };
                global.client.handleReply.push({
                    type: "open",
                    name: this.config.name,
                    author: event.senderID,
                    messageID: info.messageID,
                    data,
                });
            });
        });
    }

    // Gọi hàm đọc thư mục với đường dẫn mặc định
    readDirectory(directoryPath);
};

module.exports.handleReply = async function ({ event, api, handleReply, args }) {
    const { threadID: tid, messageID: mid } = event;

    if (!handleReply || !handleReply.data) {
        return; // Tránh xử lý khi handleReply hoặc data không tồn tại
    }

    switch (handleReply.type) {
        case 'open':
            const arg = args[1]; // Lấy giá trị args
            const choose = parseInt(arg); // Chuyển đổi thành số nguyên
            api.unsendMessage(handleReply.messageID);

            if (isNaN(choose)) {
                return api.sendMessage('⚠️ Vui lòng nhập 1 con số', tid, mid);
            }

            // Lấy dữ liệu từ reply
            const data = handleReply.data;
            if (choose <= data.folders.length) {
                const chosenFolder = data.folders[choose - 1];
                const folderPath = `${data.path}/${chosenFolder}`;
                // Mở thư mục và đọc nội dung mới
                readDirectory(folderPath);
            } else if (choose <= data.folders.length + data.filesOnly.length) {
                const chosenFile = data.filesOnly[choose - data.folders.length - 1];
                // Không cần gửi tin nhắn cho việc chọn tệp
                break;
            } else {
                api.sendMessage('❌ Lựa chọn không hợp lệ', tid, mid);
            }
            break;

        default:
            break;
    }
};
