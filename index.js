const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs')

const token = '8012062999:AAH-Dvc0R59fZkaTcvBLlVCp9tJHy48ovjA'

const bot = new TelegramBot(token, {polling: true});

const bannedWords = fs.readFileSync('badWords', 'utf8')
    .split('\n')
    .map(word => word.trim().toLowerCase())
    .filter(word => word)


const targetName = ['данил', 'илья', 'рома', 'илюха']

const start = () => {
    bot.setMyCommands([
        {command: '/spam', description: 'Заспамить в чат'},
        {command: '/start', description: 'Старт'}
    ])

    bot.on('text', async (msg) => {
        const text = msg.text ? msg.text.toLowerCase() : '';
        const chatId = msg.chat.id;


        if (text) {
            const hasTargetName = targetName.some(name =>
                text.includes(name.toLowerCase())
            );
            const hasBannedWord = bannedWords.some(word =>
                text.includes(word.toLowerCase())
            );

            if (hasTargetName && hasBannedWord) {
                await bot.deleteMessage(chatId, msg.message_id)
            }
        }
    })

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id

        if (text === '/start') {
            await bot.sendMessage(chatId, '@DanilSavitskiy');
        }

        if (text === '/spam') {
            await bot.sendMessage(chatId, 'Сколько отправлять сообщений');
            bot.once('text', async (ctx) => {
                const count = Number(ctx.text);

                if (isNaN(count)) {
                    await bot.sendMessage(chatId, 'Необходимо число');
                }

                for (let i = 0; i < count; i++) {
                    await bot.sendMessage(chatId, '@DanilSavitskiy');
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            })
        }
    })
}


start();