const Discord = require('discord.js')
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../../config.json");
const { getAuditChannel } = require("../../util/functions");

module.exports = {
    name: 'mute',
    description: 'Mute command',
    usage: '<@Usuario> || <Razón>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {

        // Find 'Muted' role to apply to muted members
        let mutedRole = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'muted member')

        const roles = message.guild.roles

        // Find the user who executed the command
        const execUser = message.guild.members.cache.find(m => m.id === message.author.id)

        // See if the user has the permission to manage messages
        const hasPerms = execUser.hasPermission('MANAGE_MESSAGES')

        // Return error if user doesn't have permissions
        if (!hasPerms) {
            message.channel.send('No tienes permisos para usar este comando.')
            return
        }

        // Return error if command is empty
        if (args.length === 0) {
            message.channel.send(`Por favor especifica a un usuario.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}mute {user} [razón]\``)
            return
        }

        const guild = message.guild.name

        // Find the tagged user in the command
        const user = message.mentions.users.first()

        let reason = args.slice(1, args.length).toString().replace(/,/g, ' ')

        // Set default mute reason
        if (!reason) {
            reason = 'No hay razon.'
        }

        if (user) {
            // Make sure the user is in the server
            const member = message.guild.member(user)
            if (member) {
                // Make sure the execUser has a higher rank than the user
                if (execUser.roles.highest.comparePositionTo(member.roles.highest) < 1) {
                    message.channel.send('No tienes permisos para mutear a este usuario.')
                    return
                }

                // Create and declare mute function
                const mute = async () => {
                    // See if there is a role fore muted users
                    if (!mutedRole) {
                        // If there isn't, create a new role
                        mutedRole = await roles.create({
                            data: {
                                name: 'Muted Member',
                                permission: []
                            }
                        })
                        // Make sure the muted user can't do all of those things
                        message.guild.channels.cache.forEach(channel => {
                            channel.updateOverwrite(mutedRole, {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false,
                                SEND_TTS_MESSAGES: false,
                                ATTACH_FILES: false,
                                SPEAK: false
                            })
                        })
                        const clientUser = message.guild.me
                        const maxRole = clientUser.roles.highest.rawPosition
                        // Set the muted role as high as possible to make sure that the role applies to all members
                        mutedRole.setPosition(maxRole - 1)
                    }

                    let muted

                    // Make sure the muted user doesn't already have the muted role
                    member.roles.cache.forEach(role => {
                        if (role.id === mutedRole.id) {
                            muted = true
                        }
                    })

                    // If the user already have the role
                    if (muted) {
                        // Throw an error
                        message.channel.send('El usuario esta muteado.')
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
                      .setTitle("Mute Logs!")
                      .setDescription(`Usuario: ${member.user}\nMuteado por: ${execUser.user}\nRazón: \`${reason}\``)
                      .setColor("GREEN")
.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                      .setTimestamp();
                
                    client.channels.cache.get(auditChannel.id).send({ embed });     


                    // Create a succes embed
                    const successEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Usuario muteado correctamente')
                        .setDescription(`${member.user} fue muteado correctamente.\nMuteado por: ${execUser.user}\nReason: \`${reason}\``)
                        .setTimestamp()
                        .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
                        .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                    // Apply the muted role to the user
                    member.roles.add(mutedRole.id)
                        // Send the success embed
                        .then(message.channel.send(successEmbed))
                        .catch(e => console.log(e))
                }

                // Execute the muted function
                mute()

            } else {
                message.channel.send('El usuario no se encuentra en el servidor.')
            }
        } else {
            message.channel.send(`Por favor especifica a un usuario.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}mute {user} [razón]\``)
            return
        }
    }
}