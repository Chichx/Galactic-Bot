const { BUGREPORTBOT } = require("../../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "botbug",
  description: 'Bug command',
  usage: '<Bug>',
  cooldown: 5,
  guildOnly: true,
  execute(client, message, args) {
    const bug = args.join(" ");

    if (!bug)
      return message.channel.send(
        "Por favor, especifica el bug del bot para que sea mas facil arreglarlo.");

    if (!BUGREPORTBOT || BUGREPORTBOT === "") return;

    const embed = new MessageEmbed()
      .setColor("RED")
      .setTitle(`${message.author.username} Reporto un Bug`, message.author.displayAvatarURL())
      .setDescription(`**Bug:** ${bug}\n\n**Nombre del Servidor:** ${message.guild.name}\n\n**Server ID:** ${message.guild.id}`)
      .setFooter(`Bug reportado por ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();

    client.channels.cache.get(BUGREPORTBOT).send(embed);

    message.channel.send("Tu **BUG** fue reportado correctamente al Owner del Bot. Gracias por Reportar!");
  },
};