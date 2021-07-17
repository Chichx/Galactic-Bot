const progressbar = require('string-progressbar');
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "nowplaying",
  description: 'NowPlaying command',
  usage: '',
  cooldown: 5,
  guildOnly: true,
  execute(client, message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("No hay nada reproduciendo.").catch(console.error);
    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;

    let nowPlaying = new MessageEmbed()
      .setTitle("Estas escuchando")
      .setDescription(`${song.title}\n${song.url}`)
      .setColor("#F8AA2A")
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setTimestamp()      
      .addField(
        "\u200b",
        new Date(seek * 1000).toISOString().substr(11, 8) +
          "[" +
          progressbar.splitBar(song.duration === 0 ? seek : song.duration, seek, 20)[0] +
          "]" +
          (song.duration == 0 ? " ◉ AHORA" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
        false
      );

    if (song.duration > 0)
      nowPlaying.setFooter("Tiempo restante: " + new Date(left * 1000).toISOString().substr(11, 8));

    return message.channel.send(nowPlaying);
  }
};