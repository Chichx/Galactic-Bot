const { MessageEmbed } = require("discord.js");
const { getAuditChannel } = require("../util/functions");

module.exports = {
  name: "roleDelete",
  async execute(client, role) {
    if (!role.guild) return;
    const auditChannel = await getAuditChannel(role.guild.id);

    // not enabled
    if (auditChannel === null || !auditChannel) return;

    // channel not found/deleted
    if (!role.guild.channels.cache.some((ch) => ch.name === auditChannel.name))
      return;

    const embed = new MessageEmbed()
      .setTitle("Rol borrado")
      .setDescription(`Rol: **${role.name}** fue borrado`)
      .setColor("RED")
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setTimestamp();

    client.channels.cache.get(auditChannel.id).send({ embed });
  },
};