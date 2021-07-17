const Discord = require('discord.js')
const moment = require('moment')
module.exports = {  //export data in Node.js so that you can require() it in other files
	name: 'user-info',
    description: 'User info command',
    usage: '<@Usuario>',
    cooldown: 5,
    guildOnly: true,
	execute(client, message, args) {
        const flags = {
            DISCORD_EMPLOYEE: 'Discord Employee',
            DISCORD_PARTNER: 'Discord Partner',
            BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
            BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
            HYPESQUAD_EVENTS: 'HypeSquad Events',
            HOUSE_BRAVERY: 'House of Bravery',
            HOUSE_BRILLIANCE: 'House of Brilliance',
            HOUSE_BALANCE: 'House of Balance',
            EARLY_SUPPORTER: 'Early Supporter',
            TEAM_USER: 'Team User',
            SYSTEM: 'System',
            VERIFIED_BOT: 'Verified Bot',
            VERIFIED_DEVELOPER: 'Verified Bot Developer'
        };
       function trimArray(arr, maxLen = 10) {
			if (arr.length > maxLen) {
				const len = arr.length - maxLen;
				arr = arr.slice(0, maxLen);
				arr.push(`${len} more...`);
			}
			return arr;
        }
        
        const member = message.mentions.members.last() || message.guild.members.cache.get(args[0]) || message.member;
		const roles = member.roles.cache
			.sort((a, b) => b.position - a.position)
			.map(role => role.toString())
			.slice(0, -1);
		const userFlags = member.user.flags.toArray();
        const embed = new Discord.MessageEmbed()
            .setTitle('Información de un usuario.')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
			.addField('__Usuario__', [
                `**» Usuario:** ${member.user.tag}`,
				`**» ID:** ${member.id}`,
				`**» Badges:** ${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}`,
				`**» Avatar:** [Link del avatar](${member.user.displayAvatarURL({ dynamic: true })})`,
				`**» Creado el:** ${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} ${moment(member.user.createdTimestamp).fromNow()}`,
            ])
            .addField('__Miembro__', [
				`**» Rol mas alto:** ${member.roles.highest.id === message.guild.id ? 'None' : member.roles.highest.name}`,
				`**» Fecha de entrada:** ${moment(member.joinedAt).format('LL LTS')}`,
				`**» Hoist Role:** ${member.roles.hoist ? member.roles.hoist.name : 'None'}`,
				`**» Roles [${roles.length}]:** ${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? trimArray(roles) : 'None'}`,
				`\u200b`
            ])

            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor('RANDOM')
            .setTimestamp();
		    message.channel.send(embed);
    },
};