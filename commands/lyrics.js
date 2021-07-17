const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
  name: "lyrics",
  description: 'Lyrics command',
  usage: '',
  cooldown: 5,
  guildOnly: true,
  async execute(client, message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("No hay nada reproduciendo.").catch(console.error);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = `No se encontraron letras para ${queue.songs[0].title}.`;
    } catch (error) {
      lyrics = `No se encontraron letras para ${queue.songs[0].title}.`;
    }

    let lyricsEmbed = new MessageEmbed()
      .setTitle("Letras")
      .setDescription(lyrics)
      .setColor("#F8AA2A")
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  }
};
