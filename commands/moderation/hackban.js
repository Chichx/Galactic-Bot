const Discord = require('discord.js')
const { getAuditChannel } = require("../../util/functions");

module.exports= {
    name: 'hackban',
    description: 'Hackban command',
    usage: '<ID> || <Razón>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
    if (!message.member.hasPermission("BAN_MEMBERS")) {

        return message.channel.send(":x: No tienes permisos para usar este comando.");

    }



    let userID = args[0];

    let reason = args.slice(1).join(" ");



    if (!userID) return message.channel.send("Menciona una ID de un usuario valida.");

    if (isNaN(userID)) return message.channel.send("La ID tiene que ser en numeros.");

    if (userID === message.author.id) return message.channel.send("No te puedes banear a ti mismo");

    if (userID === client.user.id) return message.channel.send("No me puedes banear.");



    if (!reason) reason = "No hay Razón";



    client.users.fetch(userID).then(async user => {

                    const auditChannel = await getAuditChannel(message.channel.guild.id);

                    // not enabled
                    if (auditChannel === null || !auditChannel) return;
            
                    // channel not found/deleted
                    if (
                      !message.channel.guild.channels.cache.some((ch) => ch.name === auditChannel.name)
                    )
                      return;
            
                      const embed = new Discord.MessageEmbed()
                      .setTitle("HackBan Logs!")
                      .setDescription(`Usuario: ${user.tag}\nBaneado por: ${message.author}\nRazón: \`${reason}\``)
                      .setColor("GREEN")
.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                      .setTimestamp();
                
                    client.channels.cache.get(auditChannel.id).send({ embed });     

        await message.guild.members.ban(user.id, {reason: reason});
                    const successEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Usuario correctamente baneado')
                        .setDescription(`${user.tag} **fue baneado correctamente.**\n**Baneado por:** ${message.author}\n**Razón:** \`${reason}\``)
                        .setTimestamp()
                        .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
                        .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
                  return message.channel.send(successEmbed)

    }).catch(error => {

        // If the user is unavailable, return some errors. (Recommended)

        return message.channel.send(`Ocurrio un error: **${error}**`);

    })

}};