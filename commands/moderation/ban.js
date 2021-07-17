const Discord = require('discord.js');
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../../config.json");
const bns = new Keyv(process.env.bns);
const { getAuditChannel } = require("../../util/functions");

module.exports = {
    name: 'ban',
    description: 'Ban command',
    usage: '<@Usuario> || <Razón>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args, prefix) {
        let member = message.mentions.members.first();
        let user = message.mentions.users.first();
        let author = message.author.username;
      if (!message.member.hasPermission("BAN_MEMBERS")) {  
          const notUse = new Discord.MessageEmbed()
              .setColor("#E74C3C")
              .setDescription(`:x: **Tu no tienes permiso para usar el comando __BAN__**`)
              .setTimestamp()
              .setAuthor(message.author.tag, message.author.displayAvatarURL())
              .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
          return message.channel.send(notUse);
        } 
            if (!member || !args[1]) {
                message.channel.send(`Por favor especifica a un usuario.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}ban {user} [razón]\``)
                return;
            }
            if (!message.member.hasPermission('BAN_MEMBERS') || !message.guild.member(member).bannable) {
                message.channel.send(`No tienes permiso para banear a esta persona.`);
                return;
            }
            if (member.id == message.author.id) {
                message.channel.send(`No te puedes banear a ti mismo.`);
                return;
            }

            args.shift();
            let reason = '`' + args.join(' ') + '`';
            let bans = await bns.get(`bans_${member.id}_${message.guild.id}`);
            if (!bans)
                bans = 1;
            else
                bans = bans + 1;

                    const auditChannel = await getAuditChannel(message.channel.guild.id);

                    // not enabled
                    if (auditChannel === null || !auditChannel) return;
            
                    // channel not found/deleted
                    if (
                      !message.channel.guild.channels.cache.some((ch) => ch.name === auditChannel.name)
                    )
                      return;
            
                      const embed = new Discord.MessageEmbed()
                      .setTitle("Ban Logs!")
                      .setDescription(`Usuario: ${member}\nBaneado por: ${author}\nRazón: \`${reason}\``)
                      .setColor("GREEN")
.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                      .setTimestamp();
                
                    client.channels.cache.get(auditChannel.id).send({ embed });     


            const banembed1 = new Discord.MessageEmbed()
                .setColor('#00ffbb')
                .setTitle(`Informacion del ban de ${member.user.username}`)
              .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                .addFields(
                    { name: `Nombre:`, value: `${member}` },
                    { name: `Baneado por:`, value: `${author}` },
                    { name: `Razon:`, value: `${reason}` },
                )
                .setTimestamp();
            await message.channel.send(banembed1);
            const banembed5 = new Discord.MessageEmbed()
                .setColor('#00ffbb')
                .setTitle(`${member.user.username} Tu informacion del baneo`)
              .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
              .setFooter(`Bot Created by Gaston#1668`, 'https://i.imgur.com/rVaN5PZ.png')
                .addFields(
                    { name: `Server:`, value: `${message.guild.name}` },
                    { name: `Baneado por:`, value: `${author}` },
                    { name: `Razon:`, value: `${reason}` },
                )
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                .setTimestamp();
            await member.send(banembed5);
            await bns.set(`bans_${member.id}_${message.guild.id}`, bans);
            message.guild.member(member).ban();
        }

}