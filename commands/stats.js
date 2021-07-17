const { Client, MessageEmbed } = require("discord.js")
module.exports = {
  name: "stats",
  description: 'Stats command',
  usage: '',
  cooldown: 5,
  guildOnly: true,
  execute(client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    const uptime = require("pretty-ms")(message.client.uptime, { verbose:true})
    let status;
    let lup;
    const mbed = new MessageEmbed()
    .setTitle(`${message.client.user.username} estadisticas`)
    .setColor("GREEN")
    .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
    .setThumbnail('https://i.imgur.com/rVaN5PZ.png')
    .setTimestamp()
    .addField("Tiempo Prendido:", uptime)
    .addField("Conectado en", `${message.client.guilds.cache.size} servers`)
    .addField("Uso de memoria:", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
    if (!serverQueue) return message.channel.send(mbed).catch(console.error);
    if(serverQueue.playing === true) status = "Reproduciendo"
    if(serverQueue.playing === false) status = "Pausado"
    if(serverQueue.loop === true) lup = "Si"
    if(serverQueue.loop === false) lup = "No"
    mbed.addField("Musica", `Reproduciendo: ${serverQueue.songs[0].title}
En Lista: ${parseInt((serverQueue.songs.length) - 1)} canciones
Canal: ${serverQueue.channel.name}
Volumen: ${serverQueue.volume}%
Estado: ${status}
Reproccion automatica? ${lup}`)
    message.channel.send(mbed)
  }
}