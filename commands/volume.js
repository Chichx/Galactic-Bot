const { canModifyQueue } = require("../util/GastonbotUtil");
const { MessageEmbed } = require("discord.js");


module.exports = {
  name: "volume",
  description: 'Volume command',
  usage: '<Numero>',
  cooldown: 5,
  guildOnly: true,
  execute(client, message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("No hay nada reproduciendo.").catch(console.error);
    if (!canModifyQueue(message.member))
      return message.reply("Primero tienes que entrar a un canal de voz!").catch(console.error);

    if (!args[0]) return message.reply(`🔊 El volumen actual es: **${queue.volume}%**`).catch(console.error);
    if (isNaN(args[0])) return message.reply("Elige un numero para el volumen").catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply("Elige un numero del 0 al 100.").catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    let volEmbed = new MessageEmbed()
      .setTitle(`Cambio de Volumen!`)
      .setDescription(`${message.author} Puso el volumen a: **${args[0]}%** 🔊`)
      .setColor("GREEN")
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')  
      .setTimestamp()     
    return queue.textChannel.send(volEmbed).catch(console.error);
  }
};