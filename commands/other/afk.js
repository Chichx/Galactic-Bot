const db = require('quick.db')
const { MessageEmbed } = require('discord.js')

module.exports = {
  description: 'AFK command',
  usage: '<Razón>',
  cooldown: 5,
  guildOnly: true,
    async execute(client, message, args) {
        const content = args.join(" ")
        if (!content) return message.reply('Necesitas poner una razón!');
        await db.set(`afk-${message.author.id}+${message.guild.id}`, content)
        const embed = new MessageEmbed()
        .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
        .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
        .setDescription(`Ahora estas AFK.\nRazón: ${content}`)
        .setColor("GREEN")
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic : true }))
        message.channel.send(embed)     

    if (message.member.nickname) {
      if (!message.member.nickname.includes("[AFK] ")) {
        message.member.setNickname(`[AFK] ${message.member.nickname}`);
      }
    } else {
      message.member.setNickname(`[AFK] ${message.author.username}`);
    }
           
    }
}