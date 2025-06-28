const fs = require('fs');
const path = require('path');

const badWordsFilePath = path.join(__dirname, '../badWords');

module.exports = function(bot) {
    // Возвращаем middleware-функцию для обработки сообщений
    return async function moderMiddleware(msg, next) {
        try {
            const bannedWords = fs.readFileSync(badWordsFilePath, 'utf8')
                .split('\n')
                .map(word => word.trim().toLowerCase())
                .filter(word => word);

            const targetName = ['данил', 'илья', 'рома', 'илюха'];
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
                    try {
                        await bot.deleteMessage(chatId, msg.message_id);
                    } catch (error) {
                        if (!error.message.includes('message to delete not found')) {
                            console.error('Ошибка при удалении сообщения:', error);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Ошибка в модуле модерации:', error);
        }
    };
};