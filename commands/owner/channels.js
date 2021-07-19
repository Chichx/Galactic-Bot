const config = require("../../config.json");
module.exports = {
    name: 'channels',
    description: 'Channels command',
    usage: '',
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args) {
        if(message.author.id !== config.ownerID) {
            return message.channel.send("No eres el creador del Bot.");
          }

        message.channel.send(`${client.user.username} esta conectado en **${client.voice.connections.size}** canales!`);
    },
};