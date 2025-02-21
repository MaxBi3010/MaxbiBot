module.exports = function ({ api, models, Users, Threads, Currencies }) {
    return function ({ event }) {
        if (!event.messageReply) return;

        const { handleReply, commands } = global.client;
        const { messageID, threadID, messageReply } = event;

        if (handleReply.length === 0) return;

        const indexOfHandle = handleReply.findIndex(e => e.messageID === messageReply.messageID);
        if (indexOfHandle < 0) return;

        const indexOfMessage = handleReply[indexOfHandle];
        const handleNeedExec = commands.get(indexOfMessage.name);
        if (!handleNeedExec) {
            api.sendMessage('Thiếu giá trị', threadID, messageID);
            return;
        }

        try {
            const getText2 = handleNeedExec.languages && typeof handleNeedExec.languages === 'object'
                ? (...value) => {
                    const reply = handleNeedExec.languages || {};
                    if (!reply.hasOwnProperty(global.config.language)) {
                        api.sendMessage(`Không tìm thấy ngôn ngữ cho ${handleNeedExec.config.name}`, threadID, messageID);
                        return '';
                    }
                    let lang = handleNeedExec.languages[global.config.language][value[0]] || '';
                    for (let i = value.length - 1; i >= 0; i--) {
                        const expReg = RegExp('%' + i, 'g');
                        lang = lang.replace(expReg, value[i]);
                    }
                    return lang;
                }
                : () => {};

            const Obj = {
                api,
                event,
                models,
                Users,
                Threads,
                Currencies,
                handleReply: indexOfMessage,
                getText: getText2
            };
            handleNeedExec.handleReply(Obj);
        } catch (error) {
            api.sendMessage(`Lỗi khi thực thi: ${error}`, threadID, messageID); 
        }
    };
};
