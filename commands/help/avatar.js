const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "avatar",
    description: 'Avatar command',
    usage: '<@Usuario>',
    cooldown: 5,
    guildOnly: true,
    execute(client, message) {
        const user = message.mentions.users.first() || message.author;
        const avatar = user.displayAvatarURL({ dynamic: true });
        const embed = new MessageEmbed()
            .setTitle(`${user.username}'s Avatar`)
      .setThumbnail(avatar)
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
            .setDescription(`Haz Click __[Aquí](${avatar})__ para descargarlo.`)
            .setColor("BLUE")
            .setTimestamp();

        message.channel.send(embed);
    }
};