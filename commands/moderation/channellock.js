const Discord = require("discord.js");

module.exports = {
  name: "channellock",
  description: 'ChannelLock command',
  usage: '<@Canal> || <Razón>',
  cooldown: 5,
  guildOnly: true,
  execute(client, message, args) {
      if (!message.member.hasPermission("MANAGE_CHANNELS")) {  
          const notUse = new Discord.MessageEmbed()
              .setColor("#E74C3C")
              .setDescription(`:x: **Tu no tienes permiso para usar el comando __CHANNELLOCK__**`)
              .setTimestamp()
              .setAuthor(message.author.tag, message.author.displayAvatarURL())
              .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
          return message.channel.send(notUse);
        } 

    const user = message.member;
    let lockReason = args.join(" ");
    let channel = message.mentions.channels.first();

    if (channel) {
      lockReason = args.join(" ").slice(22);
    } else {
      channel = message.channel;
    }

    if (
      channel.permissionsFor(message.guild.id).has("SEND_MESSAGES") === false
    ) {
      return message.channel.send("El canal todavia está bloqueado!");
    }

    if (!lockReason)
      return message.reply("Menciona una razón para bloquear el canal");

    if (!user.hasPermission(["MANAGE_CHANNELS"]))
      return message.channel.send("No tienes los permisos correctos.");

    channel.updateOverwrite(message.guild.id, {
      SEND_MESSAGES: false,
    });
    const lock = new Discord.MessageEmbed()
       .setTitle("Canal Bloqueado")
        .addField("Nombre del canal: ", `${channel}`, true)
        .addField("ID del canal: ", `${message.channel.id}`, true)
        .addField("Bloqueado por: ", `${message.author}`, true)
        .addField("Razón: ", `${lockReason}`, true)
        .setColor("RANDOM")
              .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
              .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
        .setTimestamp();
    message.channel.send(lock);
  },
};