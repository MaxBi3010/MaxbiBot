const chalk = require('chalk');

function randomHexColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

module.exports = (data, option) => {
    const color = randomHexColor();
    switch (option) {
        case "warn":
            console.log(chalk.bold.hex(color)('[ ❕ ] ➣ ') + data);
            break;
        case "error":
            console.log(chalk.bold.hex(color)('[ ❗ Lỗi ] ➣ ') + data);
            break;
        default:
            console.log(chalk.bold.hex(color)(`${option} ➣ `) + data);
            break;
    }
}

module.exports.loader = (data, option) => {
    const color = randomHexColor();
    switch (option) {
        case "warn":
            console.log(chalk.bold.hex(color)('[ BOT-LOGGER ] ➣ ') + data);
            break;
        case "error":
            console.log(chalk.bold.hex(color)('[ BOT-LOGGER ] ➣ ') + data);
            break;
        default:
            console.log(chalk.bold.hex(color)('[ BOT-LOGGER ] ➣ ') + data);
            break;
    }
}