const { canModifyQueue } = require("../util/GastonbotUtil");
const { MessageEmbed } = require("discord.js");


module.exports = {
  name: "loop",
  description: 'Loop command',
  usage: '',
  cooldown: 5,
  guildOnly: true,
  execute(client, message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("No hay nada reproduciendo.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    let loopEmbed = new MessageEmbed()
      .setTitle(`Reproducir nuevamente!`)
      .setDescription(`Loop ahora está ${queue.loop ? "**Activado**" : "**Desactivado**"}`)
      .setColor("GREEN")
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')  
      .setTimestamp()          
    return queue.textChannel.send(loopEmbed).catch(console.error);
  }
};