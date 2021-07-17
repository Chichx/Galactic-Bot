const Discord = require('discord.js');

module.exports = {
    name: "flip",
    description: 'Flip command',
    usage: '',
    cooldown: 5,
    guildOnly: true,
    execute(client, message) {
	// Pick Head or Tails
	const choices = ['Cara', 'Cruz'];
    let choices2 = choices[Math.floor(Math.random() * choices.length)];
    const embed = new Discord.MessageEmbed()
	.setTitle('Flip')
        .setColor("RANDOM")
        .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
        .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
	.setDescription(`**Resultado:** ${choices2}`);
		// Make sure bot has the right permissions
		message.channel.send(embed);
}};
