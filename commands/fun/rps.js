const Discord = require('discord.js');
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../../config.json");

module.exports = {
    name: "rps",
    description: 'Rps command',
    usage: '<rock, paper, scissors>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
	if (!args[0]) {
		if (message.deletable) message.delete();
		message.channel.send(`Por favor eliga una opción.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}rps [rock, paper, scissors]\``).then(m => m.delete({ timeout: 3000 }));
		return;
	}
	if (args[0].includes('paper') || args[0].includes('rock') || args[0].includes('scissors')) {
		const choices = ['scissors', 'rock', 'paper'];
		const choice = choices[Math.floor(Math.random() * choices.length)];
		let winner;
		if (choice == args[0]) {
			winner = 'Empate';
		} else if ((choice == 'rock' && args[0] == 'scissors') || (choice == 'paper' && args[0] == 'rock') || (choice == 'scissors' && args[0] == 'paper')) {
			winner = `Gaston Bot`;
		} else {
			winner = `${message.author}`;
		}
		const embed = new Discord.MessageEmbed()
	  .setTitle('Piedra papel o tijera')
      .setColor("RANDOM")
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setDescription(`**Tu elección:** ${args[0]}\n**Su elección:** ${choice}\n\nGanador: ${winner}`);
		message.channel.send(embed);
	}}
};
