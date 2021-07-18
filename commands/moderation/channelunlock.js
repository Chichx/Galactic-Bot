const Discord = require("discord.js");

module.exports = {
  name: "channelunlock",
  description: 'Channelunlock command',
  usage: '<@Canal> || <Razón>',
  cooldown: 5,
  guildOnly: true,
  execute(client, message, args) {
      if (!message.member.hasPermission("MANAGE_CHANNELS")) {  
          const notUse = new Discord.MessageEmbed()
              .setColor("#E74C3C")
              .setDescription(`:x: **Tu no tienes permiso para usar el comando __CHANNELUNLOCK__**`)
              .setTimestamp()
              .setAuthor(message.author.tag, message.author.displayAvatarURL())
              .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
          return message.channel.send(notUse);
        } 

    const user = message.member;
    let unlockReason = args.join(" ");
    let channel = message.mentions.channels.first();

    if (channel) {
      unlockReason = args.join(" ").slice(22);
    } else {
      channel = message.channel;
    }

    if (
      channel.permissionsFor(message.guild.id).has("SEND_MESSAGES") === true
    ) {
      return message.channel.send("El canal no está bloqueado!");
    }


    if (!unlockReason)
      return message.reply("Menciona una razón para unbloquear el canal");

    if (!user.hasPermission(["MANAGE_CHANNELS"]))
      return message.channel.send("No tienes los permisos correctos.");

    channel.updateOverwrite(message.guild.id, {
      SEND_MESSAGES: true,
    });
    const lock = new Discord.MessageEmbed()
       .setTitle("Canal Unbloqueado")
        .addField("Nombre del canal: ", `${channel}`, true)
        .addField("ID del canal: ", `${message.channel.id}`, true)
        .addField("Unbloqueado por: ", `${message.author}`, true)
        .addField("Razón: ", `${unlockReason}`, true)
        .setColor("RANDOM")
              .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
        .setTimestamp();
    message.channel.send(lock);
  },
};