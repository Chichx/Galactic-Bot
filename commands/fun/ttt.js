//importing
const { tictactoe } = require('reconlx')
 
module.exports = {
    name: "Tictactoe",
    description: 'Tictactoe command',
    usage: '<@Usuario>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {


        if(!args[0]) return message.channel.send('Por favor menciona a una persona.');

    var game = new tictactoe({
      message: message,
      player_two : message.mentions.members.first()
    })

}}