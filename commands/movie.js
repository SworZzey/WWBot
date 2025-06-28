const {loadFilms} = require('../parseKino')
const fs = require('fs');
const path = require('path');
const moviesPath = 'movies.json'

// module.exports = function(bot) {
//     return async function(msg) {
//         const chatId = msg.chat.id;
//         loadFilms()
//
//
//
//     }
// }
const listFilms = fs.readFileSync(moviesPath)
console.log(listFilms)