const Discord = require('discord.js'),
      db = require("quick.db");

module.exports = {
    name: "snipe",
    description: 'Snipe command',
    usage: '',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
  let data = db.get(`snipe.${message.guild.id}`);
  if (!data) return message.channel.send("No hay ningun mensaje eliminado.");
  
  let content = data.content,
      user = data.user,
      channel = data.channel;
  
  const embed = new Discord.MessageEmbed()
  .setColor("RANDOM")
  .setTimestamp()
  .setTitle("Mensaje Eliminado")
        .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
        .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
  .setDescription(`El mensaje eliminado por **<@!${data.user}>** \n> ${content}`)
  message.channel.send(embed);
}}