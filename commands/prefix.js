const Keyv = require("keyv");
const Discord = require('discord.js');
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../config.json");

module.exports = {
  name: "prefix",
  description: 'Prefix command',
  usage: '<Prefix>',
  cooldown: 5,
  guildOnly: true,
  async execute(client, message, args) {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
          const notUse = new Discord.MessageEmbed()
              .setColor("#E74C3C")
              .setDescription(`:x: **Tu no tienes permiso para usar el comando __PREFIX__**`)
              .setTimestamp()
              .setAuthor(message.author.tag, message.author.displayAvatarURL())
              .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
          return message.channel.send(notUse);
        } 
    if (args.length && args[0] !== 'reset') {
      if (args[0] == PREFIX) {
        await prefixes.delete(message.guild.id);
        const SUse = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle("Sistema de Prefix!")
        .setDescription(`El Prefix fue actulizado correctamente a \`${PREFIX}\``)
        .setTimestamp()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
        .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
    return message.channel.send(SUse);
      }
      await prefixes.set(message.guild.id, args[0]);
      const SsUse = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setTitle("Sistema de Prefix!")
      .setDescription(`El Prefix fue actulizado correctamente a \`${args[0]}\``)
      .setTimestamp()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
  return message.channel.send(SsUse);
    }else if (args.length && args[0] == 'reset') {
      
      await prefixes.delete(message.guild.id);
      const rUse = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setTitle("Sistema de Prefix!")
      .setDescription(`El Prefix fue restaurado correctamente a \`${PREFIX}\``)
      .setTimestamp()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
  return message.channel.send(rUse);
    }

    const aUse = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle("Sistema de Prefix!")
    .setDescription(`El Prefix actual es \`${(await prefixes.get(message.guild.id)) || PREFIX}\``)
    .setTimestamp()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
    .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
return message.channel.send(aUse);
  }
}