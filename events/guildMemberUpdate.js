const { getAuditChannel } = require("../util/functions");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "guildMemberUpdate",
  async execute(client, newMember, oldMember) {
    if (!oldMember.guild) return;
    const auditChannel = await getAuditChannel(newMember.guild.id);
    const avatar = newMember.user.displayAvatarURL({ dynamic: true });

    // not enabled
    if (auditChannel === null || !auditChannel) return;

    const embed = new MessageEmbed()
      .setAuthor(`${newMember.user.tag}`, avatar)
      .setTimestamp()
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setColor("ORANGE");

    // Nickname change
    if (oldMember.nickname !== newMember.nickname) {
      // Get nickname log
      const oldNickname = oldMember.nickname || "`Ninguno`";
      const newNickname = newMember.nickname || "`Ninguno`";
      
      const embed1 = new MessageEmbed()
      embed.setTitle("Miembro actualizado: `Nickname`")
      embed.setDescription(`El **Nickname** de ${newMember} fue cambiado.`)
      embed.setThumbnail(avatar)
      embed.addField("Nickname viejo", `${newNickname}`)
     embed.addField("Nickname nuevo", `${oldNickname}`);

      // send message
      client.channels.cache.get(auditChannel.id).send({ embed });
    }

    // Role add
    if (oldMember.roles.cache.size > newMember.roles.cache.size) {
      // Get role log
      const role = newMember.roles.cache
        .difference(oldMember.roles.cache)
        .first();
        embed.setTitle("Miembro actualizado: `Rol Agregado`")
        embed.setThumbnail(avatar)
        embed.setDescription(`A ${newMember} le dieron el rol ${role}`);

      // send message
      client.channels.cache.get(auditChannel.id).send({ embed }).catch();
    }

    // Role remove
    if (oldMember.roles.cache.size < newMember.roles.cache.size) {
      // Get role log
      const role = oldMember.roles.cache
        .difference(newMember.roles.cache)
        .first();
      
        embed.setTitle("Member Update: `Role Remove`")
        embed.setThumbnail(avatar)
        embed.setDescription(`A ${newMember} le sacaron el rol ${role}`);

      // send message
      client.channels.cache.get(auditChannel.id).send({ embed });
    }
  },
};