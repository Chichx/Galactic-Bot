const { MessageEmbed } = require("discord.js");
const { getAuditChannel } = require("../util/functions");

module.exports = {
  name: "channelDelete",
  async execute(client, channel) {
    const auditChannel = await getAuditChannel(channel.guild.id);

    // not enabled
    if (auditChannel === null || !auditChannel) return;

    // channel not found/deleted
    if (
      !channel.guild.channels.cache.some((ch) => ch.name === auditChannel.name)
    )
      return;

    let msg = "";
    if (channel.type === "category") {
      msg = `Categoria: **${channel.name}** fue borrado`;
    } else {
      msg = `Canal: **${channel.name}** fue borrado`;
    }

    const embed = new MessageEmbed()
      .setTitle("Canal Borrado")
      .setDescription(msg)
      .setColor("RED")
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setTimestamp();

    client.channels.cache.get(auditChannel.id).send({ embed });
  },
};