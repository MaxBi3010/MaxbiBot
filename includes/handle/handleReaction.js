module.exports = function ({ api, models, Users, Threads, Currencies }) {
    return function ({ event }) {
        const { handleReaction, commands } = global.client;
        const { messageID, threadID } = event;

        if (handleReaction.length === 0) return;

        const indexOfHandle = handleReaction.findIndex(e => e.messageID === messageID);
        if (indexOfHandle < 0) return;

        const indexOfMessage = handleReaction[indexOfHandle];
        const handleNeedExec = commands.get(indexOfMessage.name);

        if (!handleNeedExec) {
            api.sendMessage('Không tìm thấy giá trị xử lý phản ứng', threadID, messageID);
            return;
        }

        try {
            let getText2;
            if (handleNeedExec.languages && typeof handleNeedExec.languages === 'object') {
                getText2 = (...value) => {
                    const react = handleNeedExec.languages || {};
                    if (!react.hasOwnProperty(global.config.language)) {
                        api.sendMessage(`Ngôn ngữ không được tìm thấy cho lệnh ${handleNeedExec.config.name}`, threadID, messageID);
                        return;
                    }
                    let lang = handleNeedExec.languages[global.config.language][value[0]] || '';
                    for (let i = value.length; i > 0; i--) {
                        const expReg = RegExp('%' + i, 'g');
                        lang = lang.replace(expReg, value[i]);
                    }
                    return lang;
                };
            } else {
                getText2 = () => {};
            }

            const Obj = {
                api,
                event,
                models,
                Users,
                Threads,
                Currencies,
                handleReaction: indexOfMessage,
                getText: getText2
            };

            handleNeedExec.handleReaction(Obj);
        } catch (error) {
            api.sendMessage(`Lỗi khi thực thi xử lý phản ứng: ${error}`, threadID, messageID);
        }
    };
};