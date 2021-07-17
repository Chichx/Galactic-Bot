const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "iq",
    description: 'IQ Command',
    usage: '',
    cooldown: 5,
    guildOnly: true,
    execute(client, message) {
        const iq = Math.floor(Math.random() * 100) + 1;

        const embed = new MessageEmbed()
            .setTitle("IQ")
            .setTitle(`Tu IQ es: ${iq}`)
            .setColor("BLUE")
            .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
            .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp();

        message.channel.send(embed);
    }
};