const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs')
const statsFile = 'stats.json';
const muvies = 'movies.txt'
const token = '8012062999:AAH-Dvc0R59fZkaTcvBLlVCp9tJHy48ovjA'

const bot = new TelegramBot(token, {polling: true});

const bannedWords = fs.readFileSync('badWords', 'utf8')
    .split('\n')
    .map(word => word.trim().toLowerCase())
    .filter(word => word)


const targetName = ['данил', 'илья', 'рома', 'илюха']

const games = ['CS2', 'Dota 2', 'FarCry', 'The Dark Pictures', 'Иди уроки учи, дебил', 'PUBG', 'ETS2', 'Симулятор Шаурмичной', 'Что нибудь новенькое', 'Бильярд']


// Формирование статистики
let stats = {}
try {
    stats = JSON.parse(fs.readFileSync(statsFile))
} catch (e) {
    stats = {}
}

const movies = fs.readFileSync(muvies, 'utf8')
    .split('\n')
    .map(word => word.trim().toLowerCase())
    .filter(word => word.length > 0);

function saveStats() {
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2))
}

// Вывод рандомного числа в указанном диапазоне
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)+1) + min;
}

const randomGame = () => {
    const randNum = getRandomInt(0, games.length);
    return games[randNum]
}

const randomMovies = () => {
    const randNum = getRandomInt(0, 50);
    return movies[randNum]
}

const start = () => {

    // Команды бота
    bot.setMyCommands([
        {command: '/spam', description: 'Заспамить в чат'},
        {command: '/start', description: 'Старт'},
        {command: '/stats', description: 'Статистика по сообщениям'},
        {command: '/game', description: 'Рулетка со случайной игрой'},
        {command: '/movie', description: 'Рандомный фильм из топ 50 лучших'},
        {command: '/roll', description: 'Рандомное число. Пример /roll 50 - 100'}
    ])


    // Модерация банн слов
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



    // Реакция бота на команды
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
                try {
                    for (let i = 0; i < count; i++) {
                        await bot.sendMessage(chatId, '@DanilSavitskiy');
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                } catch (error) {
                    await bot.sendMessage(chatId, 'Дальше отправлять не могу, ТГ банит')
                }
            })
        }


        if (text === '/stats') {
            const sortedUsers = Object.entries(stats)
                .sort((a, b) => b[1].messages - a[1].messages)
                .slice(0, 10)

            if (sortedUsers.length === 0) {
                await bot.sendMessage(chatId, 'Статистика пуста');
                return;
            }

            let reply = '🏆 **Топ пользователей по сообщениям:**\n\n'
            sortedUsers.forEach(([userId, data], index) => {
                reply += `${index+1}. ${data.username}: ${data.messages} сообщений. \n`
            })

            await bot.sendMessage(chatId, reply);
        }

        if (text === '/game') {
            await bot.sendMessage(chatId, String(randomGame()))
        }

        if (text === '/movie') {
            await bot.sendMessage(chatId, String(randomMovies()))
        }

    })

    // обновление статистики
    bot.on('message', async (msg) => {
        const userId = msg.from.id;
        const username = msg.from.username || `${msg.from.first_name} ${msg.from.last_name || ''}`.trim()

        if (!stats[userId]) {
            stats[userId] = {
                username: username,
                messages: 0
            }
        }

        stats[userId].messages++;
        saveStats();
    })
}


start();