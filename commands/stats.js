const fs = require('fs');
const path = require('path');

module.exports = function(bot) {
    return async function statsCommand(msg) {
        const chatId = msg.chat.id;
        const statsFilePath = path.join(__dirname, '../stats.json');

        try {
            const statsData = fs.readFileSync(statsFilePath, 'utf8');
            const stats = JSON.parse(statsData);

            await bot.deleteMessage(chatId, msg.message_id);

            const sortedUsers = Object.entries(stats)
                .sort((a, b) => b[1].messages - a[1].messages)
                .slice(0, 10);

            if (sortedUsers.length === 0) {
                await bot.sendMessage(chatId, 'Статистика пуста');
                return;
            }

            let reply = '🏆 Топ пользователей:\n\n';
            sortedUsers.forEach(([userId, data], index) => {
                reply += `${index+1}. ${data.username}: ${data.messages} сообщ.\n`;
            });

            await bot.sendMessage(chatId, reply);

        } catch (error) {
            console.error('Stats error:', error);
            await bot.sendMessage(chatId, 'Ошибка загрузки статистики');
        }
    };
};