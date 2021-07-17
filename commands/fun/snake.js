const Discord = require('discord.js')
const SnakeGame = require('snakecord');

module.exports = {
    name: "snake",
    description: 'Snake command',
    usage: '',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
      const snakeGame = new SnakeGame({
        title: 'Snake',
        color: "GREEN",
        timestamp: false,
        gameOverTitle: "Perdiste"
    });
    return snakeGame.newGame(message);

}}