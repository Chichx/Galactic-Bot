const { canModifyQueue } = require("../util/GastonbotUtil");
const { MessageEmbed } = require("discord.js");


module.exports = {
  name: "shuffle",
  description: 'Shuffle command',
  usage: '',
  cooldown: 5,
  guildOnly: true,
  execute(client, message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("No hay queue.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    let altEmbed = new MessageEmbed()
      .setTitle(`Musica Aleatorea!`)
      .setDescription(`${message.author} 🔀 hizo que las canciones de la queue sean aleatoreas.`)
      .setColor("GREEN")
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')  
      .setTimestamp()          
    queue.textChannel.send(altEmbed).catch(console.error);
  }
};