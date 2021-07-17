const { canModifyQueue } = require("../util/GastonbotUtil");
const { MessageEmbed } = require("discord.js");


module.exports = {
  name: "skipto",
  description: 'Skitto command',
  usage: '<Numero de la queue>',
  cooldown: 5,
  guildOnly: true,
  execute(client, message, args) {
    if (!args.length)
      return message
        .reply(`UsO: ${message.client.prefix}${module.exports.name} <Numero de la queue>`)
        .catch(console.error);

    if (isNaN(args[0]))
      return message
        .reply(`Uso: ${message.client.prefix}${module.exports.name} <Numero de la queue>`)
        .catch(console.error);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("No hay queue.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (args[0] > queue.songs.length)
      return message.reply(`La queue tiene ${queue.songs.length} canciones de largo!`).catch(console.error);

    queue.playing = true;
    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
    queue.connection.dispatcher.end();
    let skiptoEmbed = new MessageEmbed()
      .setTitle(`Musica Omitida!`)
      .setDescription(`${message.author} ⏭ omitió ${args[0] - 1} canciones`)
      .setColor("GREEN")
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')  
      .setTimestamp()    
    queue.textChannel.send(skiptoEmbed).catch(console.error);
  }
};
