const { MessageEmbed, version: djsversion } = require("discord.js");
const { version } = require("../../package.json");
const { moment } = require("moment");
const os = require("os");
const ms = require("ms");
module.exports = {
  name: "bot-info",
  description: 'Bot info command',
  usage: '',
  cooldown: 5,
  guildOnly: true,
  execute(client, message, args) {
    const uptime = require("pretty-ms")(message.client.uptime, { verbose:true})
    function formatBytes(bytes) {
      if (bytes === 0) return "0 Bytes";
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${
        sizes[i]
      }`;
    }

    let core = os.cpus()[0];
    let embed = new MessageEmbed()
      .setTitle(`Descripción de mí`)
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .addField("__Sobre mi__", [
        `**» Bot:** ${client.user.tag} (${client.user.id})`,
        `**» Sevidores:** ${client.guilds.cache.size.toLocaleString()}`,
        `**» Users:** ${client.guilds.cache
          .reduce((a, b) => a + b.memberCount, 0)
          .toLocaleString()}`,
        `**» Canales:** ${client.channels.cache.size.toLocaleString()}`,
        `**» Creación:** ${client.user.createdAt}`,
            ])
      .addField("__Developer Detalles__", [
        `**» Developer:** Chicho#1337`,
      ])
      .addField("__Sistema__", [
        `**» Node.js:** ${process.version}`,
        `**» Version:** v${version}`,
        `**» Discord.js:** v${djsversion}`,
      ])
      .addField("__ Hardware__", [
        `**» Platform:** ${process.platform}`,
        `**» Uptime:** ${ms(os.uptime() * 1000, { long: true })}`,
        `**» CPU:**`,
        `\u3000 Cores: ${os.cpus().length}`,
        `\u3000 Model: ${core.model}`,
        `\u3000 Speed: ${core.speed}MHz`,
        `**» Memoria:**`,
        `\u3000 Total: ${formatBytes(process.memoryUsage().heapTotal)}`,
        `\u3000 Usado: ${formatBytes(process.memoryUsage().heapUsed)}`,
        `\u3000 Tiempo prendido: ${uptime}`,
      ])
      .setThumbnail(client.user.avatarURL())
      .setColor("RANDOM")
      .setTimestamp();
    message.channel.send(embed);
  },
};