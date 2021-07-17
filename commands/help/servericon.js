const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "servericon",
  description: 'Server icon command',
  usage: '',
  cooldown: 5,
  guildOnly: true,
  execute(client, message) {
    const icon = message.guild.iconURL({ dynamic: true });

    const embed = new MessageEmbed()
      .setTitle(`${message.guild.name}'s icono`)
      .setTimestamp()
      .setDescription(`Haz Click __[Aquí](${icon})__ para descargarlo.`)
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setThumbnail(icon)
      .setColor("BLUE");

    message.channel.send(embed);
  },
};