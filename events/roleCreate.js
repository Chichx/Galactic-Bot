const { MessageEmbed } = require("discord.js");
const { getAuditChannel } = require("../util/functions");

module.exports = {
  name: "roleCreate",
  async execute(client, role) {
    const auditChannel = await getAuditChannel(role.guild.id);

    // not enabled
    if (auditChannel === null || !auditChannel) return;

    // channel not found/deleted
    if (!role.guild.channels.cache.some((ch) => ch.name === auditChannel.name))
      return;

    const embed = new MessageEmbed()
      .setTitle("Nuevo rol creado")
      .setDescription(`Rol: **${role}** fue creado`)
      .setColor("GREEN")
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setTimestamp();

    client.channels.cache.get(auditChannel.id).send({ embed });
  },
};