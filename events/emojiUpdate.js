const { MessageEmbed } = require("discord.js");
const { getAuditChannel } = require("../util/functions");

module.exports = {
  name: "emojiUpdate",
  async execute(client, oldEm, newEm) {
    const auditChannel = await getAuditChannel(oldEm.guild.id);

    // not enabled
    if (auditChannel === null || !auditChannel) return;

    // channel not found/deleted
    if (!oldEm.guild.channels.cache.some((ch) => ch.name === auditChannel.name))
      return;

    let msg = "";

    if (oldEm.name !== newEm.name) {
      msg = `Emoji: **${oldEm.name}** fue renombrado a **${newEm.name}** (${newEm})`;
    } else {
      return;
    }

    const embed = new MessageEmbed()
      .setTitle("Emoji actualizado")
      .setDescription(msg)
      .setColor("ORANGE")
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setTimestamp();

    client.channels.cache.get(auditChannel.id).send({ embed });
  },
};