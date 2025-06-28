module.exports = function(bot) {
    return async function game(msg) {
        const chatId = msg.chat.id;

        const games = ['CS2', 'Dota 2', 'FarCry', 'The Dark Pictures', 'Иди уроки учи, дебил', 'PUBG', 'ETS2', 'Симулятор Шаурмичной', 'Что нибудь новенькое', 'Бильярд']

        const getRandomInt = (min, max) => {
            return Math.floor(Math.random() * (max - min)+1) + min;
        }

        const randomGame = () => {
            const randNum = getRandomInt(0, games.length);
            return games[randNum]
        }

        await bot.deleteMessage(chatId, msg.message_id);
        await bot.sendMessage(chatId, String(randomGame()))
    }
}