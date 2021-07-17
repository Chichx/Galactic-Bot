const { MessageEmbed } = require("discord.js");
const { getAuditChannel } = require("../util/functions");

module.exports = {
  name: "emojiCreate",
  async execute(client, emoji) {
    const auditChannel = await getAuditChannel(emoji.guild.id);

    // not enabled
    if (auditChannel === null || !auditChannel) return;

    // channel not found/deleted
    if (!emoji.guild.channels.cache.some((ch) => ch.name === auditChannel.name))
      return;

    const embed = new MessageEmbed()
      .setTitle("Nuevo emoji creado")
      .setDescription(`Emoji: **${emoji}** fue creado`)
      .setColor("GREEN")
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setTimestamp();

    client.channels.cache.get(auditChannel.id).send({ embed });
  },
};