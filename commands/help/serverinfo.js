const Discord = require('discord.js');
const moment = require('moment');
module.exports = {  
	name: 'server-info',
	description: 'Server info command',
	usage: '',
	cooldown: 5,
	guildOnly: true,
	execute(client, message, args) {
		const filterLevels = {
			DISABLED: 'Off',
			MEMBERS_WITHOUT_ROLES: 'No Role',
			ALL_MEMBERS: 'Everyone'
		};

		const verificationLevels = {
			NONE: 'Ninguna',
			LOW: 'Baja',
			MEDIUM: 'Media',
			HIGH: '(╯°□°）╯︵ ┻━┻',
			VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
		};

		const regions = {
			brazil: 'Brazil',
			europe: 'Europe',
			hongkong: 'Hong Kong',
			india: 'India',
			japan: 'Japan',
			russia: 'Russia',
			singapore: 'Singapore',
			southafrica: 'South Africa',
			sydeny: 'Sydeny',
			'us-central': 'US Central',
			'us-east': 'US East',
			'us-west': 'US West',
			'us-south': 'US South'
		};
		//get admins
		const adminMembers = message.guild.members.cache.filter(e => e.permissions.has("ADMINISTRATOR"));
		const admin = adminMembers.map(e => e.user.username);//.array();
		const str = admin.join(", ");

		const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
		const members = message.guild.members.cache;
		const channels = message.guild.channels.cache;
		const emojis = message.guild.emojis.cache;

		function checkDays(date) {
			let now = new Date();
			let diff = now.getTime() - date.getTime();
			let days = Math.floor(diff / 86400000);
			return days + (days == 1 ? " día" : " días");
		};

		function trimArray(arr, maxLen = 10) {
			if (arr.length > maxLen) {
				const len = arr.length - maxLen;
				arr = arr.slice(0, maxLen);
				arr.push(`${len} mas...`);
			}
			return arr;
		}

		let embed = new Discord.MessageEmbed()
		.setTitle('Información del servidor')
      .setFooter(`Bot Created by Gaston#0001`, 'https://i.imgur.com/rVaN5PZ.png')
		.addField('__General__', [
			`**» Nombre:** ${message.guild.name} (${message.guild.id})`,
			`**» Owner:** ${message.guild.owner.user.tag} (${message.guild.ownerID})`,
			`**» Region:** ${regions[message.guild.region]}`,
			`**» Nivel de Boost:** ${message.guild.premiumTier ? `Nivel ${message.guild.premiumTier}` : 'Ninguno'}`,
			`**» Contenido filtrado:** ${filterLevels[message.guild.explicitContentFilter]}`,
			`**» Nivel de verificación:** ${verificationLevels[message.guild.verificationLevel]}`,
			`**» Fecha de Creación** ${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`,
			'\u200b'
		])

		.addField('__Estadisticas__', [
			`**» Roles:** ${roles.length}`,
			`**» Emojis:** ${emojis.size}`,
			`**» Emojis normales:** ${emojis.filter(emoji => !emoji.animated).size}`,
			`**» Emojis animados:** ${emojis.filter(emoji => emoji.animated).size}`,
			`**» Miembros:** ${message.guild.memberCount}`,
			`**» Humanos:** ${members.filter(member => !member.user.bot).size}`,
			`**» Bots:** ${members.filter(member => member.user.bot).size}`,
			`**» Canales de texto:** ${channels.filter(channel => channel.type === 'text').size}`,
			`**» Canales de voz:** ${channels.filter(channel => channel.type === 'voice').size}`,
			`**» Boost:** ${message.guild.premiumSubscriptionCount || '0'}`,
			'\u200b'
		])
		.addField(`__Roles__ [${roles.length - 1}]`, roles.length < 10 ? roles.join(', ') : roles.length > 10 ? trimArray(roles) : 'Ninguno')
		.addField(`__Admin Privs__ [${admin.length}]`, `${str}`)
		.setThumbnail(message.guild.iconURL())
		.setColor('RANDOM')
		.setTimestamp()
		
		message.channel.send(embed);
	},
};