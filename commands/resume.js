const { canModifyQueue } = require("../util/GastonbotUtil");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "resume",
  description: 'Resume command',
  usage: '',
  cooldown: 5,
  guildOnly: true,
  execute(client, message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("No hay nada reproduciendo.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
    let renewEmbed = new MessageEmbed()
      .setTitle(`Musica Reanudada!`)
      .setDescription(`${message.author} ▶ reanudó la musica!`)
      .setColor("GREEN")
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')  
      .setTimestamp()      
      return queue.textChannel.send(renewEmbed).catch(console.error);
    }

    return message.reply("La queue no esta en pausa").catch(console.error);
  }
};
