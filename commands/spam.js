const TelegramBot = require('node-telegram-bot-api');

module.exports = function(bot) {
    return async function spamCommand(msg) {
        const chatId = msg.chat.id;

        try {
            // Удаляем исходное сообщение
            await bot.deleteMessage(chatId, msg.message_id);

            // Запрашиваем количество сообщений
            await bot.sendMessage(chatId, 'Сколько сообщений отправить?');

            // Ожидаем ответа пользователя
            bot.once('message', async (responseMsg) => {
                if (responseMsg.chat.id !== chatId) return;

                const count = Number(responseMsg.text);

                if (isNaN(count) || count <= 0) {
                    await bot.sendMessage(chatId, 'Пожалуйста, введите корректное число больше 0');
                    return;
                }

                try {
                    // Отправляем сообщения с задержкой
                    for (let i = 0; i < Math.min(count, 50); i++) { // Ограничение 50 сообщений
                        await bot.sendMessage(chatId, '@pxmxn');
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка 1 сек
                    }
                } catch (error) {
                    console.error('Ошибка при отправке:', error);
                    await bot.sendMessage(chatId, 'Не могу отправить больше сообщений (возможно, ограничение Telegram)');
                }
            });

        } catch (error) {
            console.error('Ошибка в spamCommand:', error);
            await bot.sendMessage(chatId, 'Произошла ошибка при обработке команды');
        }
    };
};