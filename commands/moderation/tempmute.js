const Discord = require('discord.js')
const schedule = require('node-schedule')
const ms = require('ms')
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../../config.json");
const { getAuditChannel } = require("../../util/functions");

module.exports = {
    name: 'tempmute',
    description: 'TempMute command',
    usage: '<@Usuario> <Tiempo> <Razón>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {

        // Find muted role
        let mutedRole = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'muted member')

        const roles = message.guild.roles

        // Find the user who executed the command
        const execUser = message.guild.members.cache.find(m => m.id === message.author.id)

        // Make sure the user has permissions to manage messages
        const hasPerms = execUser.hasPermission('MANAGE_MESSAGES')

        // Returns error if command is empty
        if (args.length === 0) {
            message.channel.send(`Por favor especifica a un usuario.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}tempmute {user} {duración} [razón]\``)
            return
        }

        const duration = args[1]

        // Make sure that the duration has been specified
        if (duration === undefined) {
            // Returns an error is durations is undefined
            message.channel.send(`Duración invalida.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}tempmute {user} {duración} [razón]\``)
            return
        }

        // Make sure the user has the perms to execute this command
        if (!hasPerms) {
            message.channel.send('No tienes permisos para usar este comando.')
            return
        }

        const guild = message.guild.name

        const user = message.mentions.users.first()

        let reason = args.slice(2, args.length).toString().replace(/,/g, ' ')

        let msDuration

        // Store the millisecond notation of the duration
        msDuration = ms(duration)

        // Make sure that the duration is valid
        if (msDuration < 10000 || msDuration === undefined) {
            message.channel.send('Duracion invalida. La duracion tiene que ser mas de 10 segundos')
            return
        }

        // Set a default reason
        if (!reason) {
            reason = 'No hay razon.'
        }

        if (user) {
            // Make sure that the user is in the server
            const member = message.guild.member(user)
            if (member) {
                // Make sure that the execUser has a higher rank than the muted user
                if (execUser.roles.highest.comparePositionTo(member.roles.highest) < 1) {
                    // Returns an error if not
                    message.channel.send('No tienes permisos para mutear a este usuario.')
                    return
                }

                // Create and Declare the tempmute function
                const tempmute = async () => {
                    if (!mutedRole) {
                        // Create a muted role if there isn't already one
                        mutedRole = await roles.create({
                            data: {
                                name: 'Muted Member',
                                permission: []
                            }
                        })
                        // Update the role permission on every channels to the ones below
                        message.guild.channels.cache.forEach(channel => {
                            channel.updateOverwrite(mutedRole, {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false,
                                SEND_TTS_MESSAGES: false,
                                ATTACH_FILES: false,
                                SPEAK: false
                            })
                        })
                        // Set the muted role so that all members can be muted
                        const clientUser = message.guild.me
                        const maxRole = clientUser.roles.highest.rawPosition
                        mutedRole.setPosition(maxRole - 1)
                    }

                    let muted

                    // See if muted member already has muted role
                    member.roles.cache.forEach(role => {
                        if (role.id === mutedRole.id) {
                            muted = true
                        }
                    })

                    // If they do, send error.
                    if (muted) {
                        message.channel.send('El usuario sigue muteado')
                        return
                    }

                    // Transform the milliseconds into long format date. ex: '2 days'
                    let longDuration = ms(msDuration, { long: true })

                    const auditChannel = await getAuditChannel(message.channel.guild.id);

                    // not enabled
                    if (auditChannel === null || !auditChannel) return;
            
                    // channel not found/deleted
                    if (
                      !message.channel.guild.channels.cache.some((ch) => ch.name === auditChannel.name)
                    )
                      return;
            
                      const embed = new Discord.MessageEmbed()
                      .setTitle("TempMute Logs!")
                      .setDescription(`Usuario: ${member.user}\nMuteado por: ${execUser.user}\nRazón: \`${reason}\`\nDuración: \`${longDuration}\``)
                      .setColor("GREEN")
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                      .setTimestamp();
                
                    client.channels.cache.get(auditChannel.id).send({ embed });     

                    // Creates new success embed
                    const successEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Usuario muteado correctamente.')
                        .setDescription(`${member.user} fue muteado correctamente.\nMuteado por: ${execUser.user}\nDuración: \`${longDuration}\`\nRazón: \`${reason}\``)
                        .setTimestamp()
                        .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
                        .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                    // Gives the muted role to the muted member
                    member.roles.add(mutedRole.id)
                        // Send the success embed if successful
                        .then(message.channel.send(successEmbed))
                        .catch(e => console.log(e))

                    // Set the unmute date
                    const unmuteDate = new Date(Date.now() + msDuration)

                    // Creates a new scheduled job
                    schedule.scheduleJob(unmuteDate, () => {

                        let isStillMuted = false

                        // Make sure the member is still muted
                        member.roles.cache.forEach(role => {
                            // If the member is unmuted isStillMuted will be false
                            if (role.id === mutedRole.id) {
                                isStillMuted = true
                            }
                        })

                        // If the member is already unmuted, it will stop the execution here
                        if (isStillMuted === false) {
                            return
                        }
                        // Remove the role from the muted member
                        member.roles.remove(mutedRole)
                            // DM the member to notify them about the unmute
                            .then(member.send(`Fuiste unmuteado de ${guild}`))
                    })
                }

                // Execute the unmute function
                tempmute()

            } else {
                message.channel.send('El usuario no se encuentra en el servidor.')
            }
        } else {
            message.channel.send(`Por favor especifica a un usuario.\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}tempmute {user} {duración} [razón]\``)
            return
        }
    }
}