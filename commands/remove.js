const { canModifyQueue } = require("../util/GastonbotUtil");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "remove",
  description: 'Remove command',
  usage: '<Numero de la queue>',
  cooldown: 5,
  guildOnly: true,
  execute(client, message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("No hay queue.").catch(console.error);
    if (!canModifyQueue(message.member)) return;
    
    if (!args.length) return message.reply(`Uso: ${message.client.prefix}remove <Numero de la queue>`);
    if (isNaN(args[0])) return message.reply(`Uso: ${message.client.prefix}remove <Numero de la queue>`);

    const song = queue.songs.splice(args[0] - 1, 1);
        let removeEmbed = new MessageEmbed()
      .setTitle(`Musica Removida!`)
      .setDescription(`${message.author} ❌ removió **${song[0].title}** de la queue.`)
      .setColor("RED")
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')  
      .setTimestamp()      
    queue.textChannel.send(removeEmbed);
  }
};
