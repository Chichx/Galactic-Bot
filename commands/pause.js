const { canModifyQueue } = require("../util/GastonbotUtil");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "pause",
  description: 'Pause command',
  usage: '',
  cooldown: 5,
  guildOnly: true,
  execute(client, message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("No hay nada reproduciendo.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
    let pauseEmbed = new MessageEmbed()
      .setTitle(`Musica Pausada!`)
      .setDescription(`${message.author} ⏸ pausó la musica`)
      .setColor("GREEN")
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')  
      .setTimestamp()      
      return queue.textChannel.send(pauseEmbed).catch(console.error);
    }
  }
};