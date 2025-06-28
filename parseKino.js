const API_KEY = 'f0d7a51f-44a8-4dee-a04e-2695287f9e81';
const fs = require('fs');

const loadFilms = async () => {
    try {
        const response = await fetch('https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_250_MOVIES&page=1', {
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const extractedData = data.items.map(item => ({
            nameRu: item.nameRu,
            ratingKinopoisk: item.ratingKinopoisk,
            ratingImdb: item.ratingImdb,
            year: item.year,
            posterUrl: item.posterUrl,
            description: item.description
        }))

        fs.writeFileSync('movies.json', JSON.stringify(extractedData, null, 2));

    } catch (e) {
        console.error('Ошибка при загрузке:', e);
        return null;
    }
};

module.exports = loadFilms;