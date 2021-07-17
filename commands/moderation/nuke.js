const { errorEmbed } = require("../../util/functions");
const Discord = require('discord.js');

module.exports = {
  name: "nuke",
  description: 'Nuke command',
  usage: '',
  cooldown: 5,
  guildOnly: true,
  async execute(client, message) {
  if (!message.member.hasPermission("MANAGE_CHANNELS")) {  
          const notUse = new Discord.MessageEmbed()
              .setColor("#E74C3C")
              .setDescription(`:x: **Tu no tienes permiso para usar el comando __NUKE__**`)
              .setTimestamp()
              .setAuthor(message.author.tag, message.author.displayAvatarURL())
              .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
          return message.channel.send(notUse);
        } 

    const user = message.member;
    if (!user.hasPermission("MANAGE_CHANNELS")) {
          const notUse = new Discord.MessageEmbed()
              .setColor("#E74C3C")
              .setDescription(`:x: **Tu no tienes permiso para usar el comando __NUKE__**`)
              .setTimestamp()
              .setAuthor(message.author.tag, message.author.displayAvatarURL())
              .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
          return message.channel.send(notUse);
        } 

    let channel = client.channels.cache.get(message.channel.id);
    const position = channel.position;

    const channel2 = await channel.clone();

    channel2.setPosition(position);
    channel.delete();
    const suce = new Discord.MessageEmbed() 
              .setColor("GREEN")
              .setTitle("Canal Restaurado!")
              .setDescription(`:white_check_mark: El canal fue restaurado correctamente.\n**Borrado por: ${message.author}**`)
              .setTimestamp()
              .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
          return channel2.send(suce);
  },
};