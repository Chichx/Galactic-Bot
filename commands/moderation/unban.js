const Discord = require('discord.js');

module.exports = {
    name: 'unban',
    description: 'Unban command',
    usage: '<ID>',
    cooldown: 5,
    guildOnly: true,
    execute(client, message, args) {
	if (message.deletable) message.delete();
	// Check if user has permission to ban user
      if (!message.member.hasPermission("BAN_MEMBERS")) {  
          const notUse = new Discord.MessageEmbed()
              .setColor("#E74C3C")
              .setDescription(`:x: **Tu no tienes permiso para usar el comando __UNBAN__**`)
              .setTimestamp()
              .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
                .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
          return message.channel.send(notUse);
        } 
	// Check if bot has permission to unban user
	if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
		message.channel.send({ embed:{ color:15158332, description:`I am missing the permission: \`BAN_MEMBERS\`.` } }).then(m => m.delete({ timeout: 10000 }));
		client.logger.error(`Missing permission: \`BAN_MEMBERS\` in [${message.guild.id}]`);
		return;
	}
	// Unban user
	const user = args[0];
        if (args.length === 0) {
            message.reply('Por favor especifica el ID de un usuario.\nFormato: `=unban {user-id}`')
            return
        }
	try {
		message.guild.fetchBans().then(bans => {
			if (bans.size == 0) return;
			const bUser = bans.find(ban => ban.user.id == user);
			if (!bUser) return;
			message.guild.members.unban(bUser.user);
			console.log(bUser);
          const Use = new Discord.MessageEmbed()
              .setColor("GREEN")
              .setTitle('Usuario Unbaneado Correctamente!')
              .setDescription(`:white_check_mark: **${bUser.user.username}#${bUser.user.discriminator} fue unbaneado correctamente**\n**Unbaneado por:** ${message.author}.`)
              .setTimestamp()
              .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
	       message.channel.send(Use).then(m => m.delete({ timeout: 10000 }));
		});
	} catch (error) {
		client.logger.error(`${error.message ? error.message : error}`);
	}
}};