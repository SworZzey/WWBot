const fs = require('fs');
const path = require('path');

const statsFilePath = path.join(__dirname, '../stats.json');

function saveStats(stats) {
    fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2));
}

module.exports = function(bot) {
    return function updateStats(msg) {
        try {
            let stats = {};
            try {
                stats = JSON.parse(fs.readFileSync(statsFilePath, 'utf8'));
            } catch (e) {
                stats = {};
            }

            const userId = msg.from.id.toString();
            const username = msg.from.username ||
                `${msg.from.first_name} ${msg.from.last_name || ''}`.trim();

            if (!stats[userId]) {
                stats[userId] = {
                    username: username,
                    messages: 0
                };
            }

            stats[userId].messages++;
            saveStats(stats);

        } catch (error) {
            console.error('Update stats error:', error);
        }
    };
};