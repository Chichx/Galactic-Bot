const { MessageEmbed } = require("discord.js");
const { getAuditChannel } = require("../util/functions");

module.exports = {
  name: "messageDelete",
  async execute(client, message, args) {
	if (message.author.bot) return;
    if (!message.guild) return;
    const auditChannel = await getAuditChannel(message.guild.id);

    // not enabled
    if (auditChannel === null || !auditChannel) return;

    // channel not found/deleted
    if (
      !message.guild.channels.cache.some((ch) => ch.name === auditChannel.name)
    )
      return;

    if (message.author.id === client.user.id) return;

    const embed = new MessageEmbed()
      .setTitle("Mensaje Borrado")
    .setThumbnail(message.author.avatarURL({ dynamic: true }))
    .addField("Miembro:", message.author)
    .addField("Canal:", message.channel)
    .addField("Mensaje:", message.content)
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setColor("RED")
      .setTimestamp();

    client.channels.cache.get(auditChannel.id).send({ embed });
  },
};