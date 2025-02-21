this.config = {
    name: "vd",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Gaudev",
    description: "Xem video trai, gái, Anime",
    commandCategory: "Ảnh",
    usages: "[trai | gái | anime]",
    cooldowns: 0
};

this.run = async function ({ api, event, args }) {
    const send = msg => new Promise(r => api.sendMessage(msg, event.threadID, (err, res) => r(res || err), event.messageID));
    const cái_lồn = args[0]?.toLowerCase();
    const con_cặc = { trai: global.trai, gái: global.vdsp, gai: global.vdsp, anime: global.anime };

    if (!con_cặc[cái_lồn]) return send("Vui lòng chọn một danh mục: 'trai', 'gái', hoặc 'anime'.");
    const gaudev = con_cặc[cái_lồn];

    if (!gaudev.length) return send(`Vd '${cái_lồn}' chưa upload, vui lòng đợi.`);
    
    send({
        body: `Video: ${cái_lồn}`,
        attachment: gaudev.splice(0, 1)
    });
};
