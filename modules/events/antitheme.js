class anti {
    constructor(a) {
        this.config = a
    }
    async run({ api: { getCurrentUserID, sendMessage, changeThreadColor }, event: { threadID, author }, Threads: { getInfo } }) {
        if (getCurrentUserID() == author) return
        let send = a => sendMessage(a, threadID),
            path = 'modules/commands/data/antitheme.json',
            data = JSON.parse(require('fs').readFileSync(path, 'utf8')),
            qtv = await getInfo(threadID).then(a => a.adminIDs.map(b => b.id))
        if (qtv.includes(author)) data[threadID].themeEnabled = !1, require('fs').writeFileSync(path, JSON.stringify(data, null, 2)), send('⚠️ Anti Theme đã Tắt do qtv thay đổi chủ đề nhóm')
        if (data[threadID].themeEnabled) changeThreadColor(data[threadID].themeid, threadID), send('⚠️ Bạn không có quyền thay đổi chủ đề nhóm')
    }
}
module.exports = new anti({
    name: "antitheme",
    eventType: ["log:thread-color"],
    version: "1.0.1",
    credits: "Quất",
    description: "Chống đổi chủ đề nhóm"
})
