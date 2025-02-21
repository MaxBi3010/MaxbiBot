exports.config = {
 name: 'eval',
 version: '111.1.1',
 hasPermssion: 2,
 credits: 'DC-Nam',
 description: 'Chạy code.',
 commandCategory: 'Admin',
 usages: '[]',
 cooldowns: 3
};
exports.run = function(o) {
 let send = (msg, callback)=>o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
 try {
 eval(o.args.join(' '));
 } catch (e) {
 send(e.toString())}
};