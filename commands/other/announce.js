const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "announce",
    description: 'Announce command',
    usage: '<Texto>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {

        if (!args.join(' ')) return message.reply('Inserta un mensaje.');
    
        const embed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor(`Anuncio!`)
        .setDescription(args.join(' '))
        .setFooter(`Anuncio por ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()
    
        message.delete();
    
        message.channel.send(embed)
        }
    }