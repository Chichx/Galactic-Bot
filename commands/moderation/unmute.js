const Discord = require('discord.js')
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../../config.json");
const { getAuditChannel } = require("../../util/functions");

module.exports= {
    name: 'unmute',
    description: 'Unmute command',
    usage: '<@Usuario>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args){

        // Find the muted role in the server
        const mutedRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted member');

        const roles = message.guild.roles
        
        // Find the user who executed the command
        const execUser = message.guild.members.cache.find(m => m.id === message.author.id)

        // make sure the user has the perms to manage messages
        const hasPerms = execUser.hasPermission('MANAGE_MESSAGES')

        // Send error if user doesn't have ther perms
        if (!hasPerms) {
            message.channel.send('Tu no tienes permisos para usar este comando.')
            return
        }

        // Sedn error if command is empty
        if(args.length === 0){
            message.channel.send(`Por favor especifica a un usuario.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}unmute {user}\``)
            return
        }

        const guild = message.guild.name

        const user = message.mentions.users.first()
        
        if (user) {
            // Make sure user is in server
            const member = message.guild.member(user)
            if (member){

                // Create and declrare unmute function
                const unmute = async () => {

                    // See if user is muted
                    let muted

                    member.roles.cache.forEach(role => {
                        // compares every role to the muted role
                        if(role.id === mutedRole.id) {
                            muted = true
                        }
                    })

                    // If the user is not muted, send error
                    if(muted === false){
                        message.channel.send('El usuario no está muteado.')
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
                      .setTitle("Unmute Logs!")
                      .setDescription(`Usuario: ${member.user}\nUnmuteado por: ${execUser.user}`)
                      .setColor("GREEN")
.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                      .setTimestamp();
                
                    client.channels.cache.get(auditChannel.id).send({ embed });     

                    // Notify unmuted user in DMs
            const unmuteembed5 = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${member.user.username} Tu informacion de tu unmuteo`)
                .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
                .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                .addFields(
                    { name: `Server:`, value: `${guild}` },
                    { name: `Unmuteado por:`, value: `${execUser.user}` },
                )
                .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                .setTimestamp();
        member.send(unmuteembed5);

                    // Make success embed
                    const successEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Usuario unmuteado correctamente')
                        .setDescription(`${member.user} fue unmuteado correctamente.\nUnmuteado por: ${execUser.user}`)
                        .setTimestamp()
                        .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
                        .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                    // Remove muted role from muted user
                    member.roles.remove(mutedRole)
                        // Send success embed
                        .then(message.channel.send(successEmbed))
                        .catch(e => console.log(e))
                }

            unmute()
                        
            } else {
                message.channel.send('El usuario no se encuentra en el servidor.')
            }
        } else {
            message.channel.send(`Por favor especifica a un usuario.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}unmute {user}\``)
            return
        }
    }
}