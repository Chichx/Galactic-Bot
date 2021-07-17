const { canModifyQueue } = require("../util/GastonbotUtil");
const { MessageEmbed } = require("discord.js");


module.exports = {
  name: "skip",
  description: 'Skip command',
  usage: '',
  cooldown: 5,
  guildOnly: true,
  execute(client, message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.reply("No hay ninguna cancion reproduciendo.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.connection.dispatcher.end();
    let skipEmbed = new MessageEmbed()
      .setTitle(`Musica Omitida!`)
      .setDescription(`${message.author} ⏭ omitió la canción`)
      .setColor("GREEN")
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')  
      .setTimestamp()         
    queue.textChannel.send(skipEmbed).catch(console.error);
  }
};