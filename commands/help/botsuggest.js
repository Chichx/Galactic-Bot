const { SUGERENCIABOT } = require("../../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "botsuggestion",
  description: 'Bot suggest command',
  usage: '<Sugerencia>',
  cooldown: 5,
  guildOnly: true,
  execute(client, message, args) {
    const sug = args.join(" ");

    if (!sug)
      return message.channel.send(
        "Por favor, especifica una sugerencia para que el Owner la tome en cuenta..");

    if (!SUGERENCIABOT || SUGERENCIABOT === "") return;

    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle(`${message.author.username} Añadió una sugerencia`, message.author.displayAvatarURL())
      .setDescription(`**Sugerencia:** ${sug}\n\n**Nombre del Servidor:** ${message.guild.name}\n\n**Server ID:** ${message.guild.id}`)
      .setFooter(`Sugerencia por ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();

    client.channels.cache.get(SUGERENCIABOT).send(embed);

    message.channel.send("Tu **SUGERENCIA** fue agregada a la lista correctamente para que el Owner del Bot la tome en cuenta. Gracias por Sugerir!");
  },
};