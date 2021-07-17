const Discord = require('discord.js')
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../../config.json");
const { getAuditChannel } = require("../../util/functions");

module.exports= {
    name: 'kick',
    description: 'Kick command',
    usage: '<@Usuario> || <Razón>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {

        // Find user who ran the command
        const execUser = message.guild.members.cache.find(m => m.id === message.author.id)

        // Make sure the user has the perms to kick members
        const hasPerms = execUser.hasPermission('KICK_MEMBERS')

        // Return error message if the user doesn't have the perms
        if (!hasPerms) {
            message.channel.send('Tu no tienes permisos para usar este comando.')
            return
        }

        // Return merror message if command is empty
        if(args.length === 0){
            message.channel.send(`Por favor especifica a un usuario.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}kick {user} [razón]\``)
            return
        }

        const guild = message.guild.name

        const user = message.mentions.users.first()

        let reason = args.slice(1, args.length).toString().replace(/,/g, ' ')

        // Set default reason
        if(!reason){
            reason = 'Kicked by a server staff'
        }

        if (user) {
            // Make sure kicked user is in server
            const member = message.guild.member(user)
            if (member){

                // Make sure that the user is kickable
                const kickable = member.kickable

                // Returns error is user is not kickable
                if (!kickable){
                    message.channel.send('No tienes permiso para kickear a este usuario.')
                    return
                }

                // Returns error if execUser has a lower rank than kicked user
                if (execUser.roles.highest.comparePositionTo(member.roles.highest) < 1){
                    message.channel.send('No tienes permiso para kickear a este usuario.')
                    return
                }

                    const auditChannel = await getAuditChannel(message.channel.guild.id);

                    // not enabled
                    if (auditChannel === null || !auditChannel) return;
            
                    // channel not found/deleted
                    if (
                      !message.channel.guild.channels.cache.some((ch) => ch.name === auditChannel.name)
                    )
                      return;
            
                      const embed = new Discord.MessageEmbed()
                      .setTitle("Kick Logs!")
                      .setDescription(`Usuario: ${member.user}\nKickeado por: ${execUser.user}\nRazón: \`${reason}\``)
                      .setColor("GREEN")
.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                      .setTimestamp();
                
                    client.channels.cache.get(auditChannel.id).send({ embed });     


                // Creates and define kick function
                const kick = async () => {
                    // Send DM to kicked member
            const kickembed5 = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${member.user.username} Tu informacion del kickeo`)
                .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
                .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                .addFields(
                    { name: `Server:`, value: `${guild}` },
                    { name: `Kickeado por:`, value: `${execUser.user}` },
                    { name: `Razón:`, value: `${reason}` },
                )
                .setFooter(`Bot Created by Gaston#1668`, 'https://i.imgur.com/rVaN5PZ.png')
                .setTimestamp();
                  await member.send(kickembed5);
                    // Kick member from server
                    await member.kick(reason)

                    // Create success embed
                    const successEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Usuario correctamente kickeado')
                        .setDescription(`${member.user} fue kickeado correctamente.\nKickado por: ${execUser.user}\nRazón: \`${reason}\``)
                        .setTimestamp()
                        .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
                        .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                    // Send success embed
                    message.channel.send(successEmbed)
                }

            // Execute the kick function
            kick()
                        
            } else {
                message.channel.send('El usuario no se encuentra en el servidor.')
            }
        } else {
            message.channel.send(`Por favor especifica a un usuario.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}kick {user} [razón]\``)
            return
        }
    }
}