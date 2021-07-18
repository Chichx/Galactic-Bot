const { MessageEmbed } = require("discord.js");
const { getAuditChannel } = require("../util/functions");

module.exports = {
  name: "channelUpdate",
  async execute(client, oldChannel, newChannel) {
    const auditChannel = await getAuditChannel(oldChannel.guild.id);

    // not enabled
    if (auditChannel === null || !auditChannel) return;

    // channel not found/deleted
    if (
      !oldChannel.guild.channels.cache.some(
        (ch) => ch.name === auditChannel.name
      )
    )
      return;

    let msg = "";
    const type = oldChannel.type;

    if (type === "category") {
      if (oldChannel.name !== newChannel.name) {
        msg = `Categoria **${newChannel}** fue actualizado de \`${oldChannel.name}\` a \`${newChannel.name}\``;
      } else {
        return;
      }
    } else {
      if (oldChannel.name !== newChannel.name) {
        msg = `Canal **${oldChannel.name}** fue renombrado a ${newChannel}`;
      } else if (oldChannel.topic !== newChannel.topic) {
        msg = `Topic de canal ${newChannel} fue actualizado de \`${oldChannel.topic}\` a \`${newChannel.topic}\``;
      } else {
        return;
      }
    }

    const embed = new MessageEmbed()
      .setTitle("Canal actualizado")
      .setDescription(msg)
      .setColor("ORANGE")
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setTimestamp();

    client.channels.cache.get(auditChannel.id).send({ embed });
  },
};