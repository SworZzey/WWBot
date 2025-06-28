const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs')
const muvies = 'movies.txt'
const token = '8012062999:AAH-Dvc0R59fZkaTcvBLlVCp9tJHy48ovjA'
const bot = new TelegramBot(token, {polling: true});
const setupSpamCommand = require('./commands/spam');
const spamCommand = setupSpamCommand(bot);

const setupStatsCommand = require('./commands/stats');
const setupStatsUpdater = require('./commands/statsUpdater');
const statsCommand = setupStatsCommand(bot);
const updateStats = setupStatsUpdater(bot);

const setupGameCommand = require('./commands/game')
const gameCommand = setupGameCommand(bot);

const setupRollCommand = require('./commands/roll')
const rollCommand = setupRollCommand(bot);

const setupModerCommand = require('./commands/moderating')
const moderCommand = setupModerCommand(bot);



// const movies = fs.readFileSync(muvies, 'utf8')
//     .split('\n')
//     .map(word => word.trim().toLowerCase())
//     .filter(word => word.length > 0);
//
// const randomMovies = () => {
//     const randNum = getRandomInt(0, 50);
//     return movies[randNum]
// }


const start = () => {

    // Команды бота
    bot.setMyCommands([
        {command: '/spam', description: 'Заспамить в чат'},
        {command: '/stats', description: 'Статистика по сообщениям'},
        {command: '/game', description: 'Рулетка со случайной игрой'},
        {command: '/movie', description: 'Рандомный фильм из топ 50 лучших'},
        {command: '/roll', description: 'Рандомное число. Пример /roll 50 - 100'}
    ])

    bot.on('message', async (msg, next) => {
        await moderCommand(msg, next);
    });


    // Реакция бота на команды
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id


        if (text === '/spam') {
            await spamCommand(msg);
        }


        if (text === '/stats') {
            await statsCommand(msg)
        }

        if (text === '/game') {
            await gameCommand(msg)
        }

        // if (text === '/movie') {
        //     await bot.deleteMessage(chatId, msg.message_id);
        //     await bot.sendMessage(chatId, String(randomMovies()))
        // }

        if (text && text.includes('/roll')) {
            await rollCommand(msg);
        }

    })

    bot.on('message', updateStats)
}

start();

module.exports = {
    bot,
    TelegramBot,
    token
}