module.exports = function (bot) {
    return async function roll(msg) {
        const chatId = msg.chat.id;
        const text = msg.text;

        const getRandomInt = (min, max) => {
            return Math.floor(Math.random() * (max - min)+1) + min;
        }

        const rolling = (mes) => {
            if (!mes) return NaN;  // Проверка на пустой ввод
            if (mes === '/roll') {
                return getRandomInt(0, 100);
            } else {
                // Удаляем "/roll" и лишние пробелы, затем разделяем числа
                const numbers = mes.replace("/roll", "").trim().split(/[\s-]+/);

                let start = 0;
                let end = 0;

                // Фильтруем только числа
                const validNumbers = numbers
                    .map(num => Number(num))
                    .filter(num => !isNaN(num));

                if (validNumbers.length >= 2) {
                    start = validNumbers[0];
                    end = validNumbers[1];
                } else if (validNumbers.length === 1) {
                    start = 1;  // Значение по умолчанию
                    end = validNumbers[0];
                }

                // Проверяем, что start < end
                if (start >= end) [start, end] = [end, start];
                if (start === 0 && end === 0) end = 100;  // Диапазон по умолчанию

                return getRandomInt(start, end);
            }
        };

        await bot.deleteMessage(chatId, msg.message_id);
        await bot.sendMessage(chatId, rolling(text))
    }
}