this.config = {
 name: "autocolor",
 eventType: ["log:thread-color"],
 version: "1.0.0",
 credits: "Quất",
 description: ""
};
this.run = async ({ event }) => {
 let dir = process.cwd() + '/new/src/data/color.json', { readFileSync, writeFileSync } = require('fs'),
color = JSON.parse(readFileSync(dir, 'utf8'))
 if (!color[event.logMessageData.theme_name_with_subtitle]) {
 color[event.logMessageData.theme_name_with_subtitle] = event.logMessageData.theme_id
 writeFileSync(dir, JSON.stringify(color, null, 1), 'utf8')
 }
}