const { MessageEmbed } = require("discord.js");
const { getAuditChannel } = require("../util/functions");

module.exports = {
  name: "roleUpdate",
  async execute(client, oldRole, newRole) {
    if (!newRole.guild) return;
    const auditChannel = await getAuditChannel(oldRole.guild.id);

    // not enabled
    if (auditChannel === null || !auditChannel) return;

    // channel not found/deleted
    if (
      !oldRole.guild.channels.cache.some((ch) => ch.name === auditChannel.name)
    )
      return;

    let msg = "";
    if (oldRole.name !== newRole.name) {
      msg = `Rol: **${oldRole.name}** fue renombrado a **${newRole.name}** (${newRole})`;
    } else if (oldRole.color !== newRole.color) {
      msg = `Rol: **${newRole.name}**,  color: **${oldRole.color}** fue cambiado de color a **${newRole.color}** (${newRole})`;
    } else {
      return;
    }

    const embed = new MessageEmbed()
      .setTitle("Rol Actualizado")
      .setDescription(msg)
      .setColor("ORANGE")
      .setTimestamp();

    client.channels.cache.get(auditChannel.id).send({ embed });
  },
};