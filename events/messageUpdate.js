const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { getAuditChannel } = require("../util/functions");

module.exports = {
  name: "messageUpdate",
  async execute(client, oldMessage, newMessage) {
	if(oldMessage.content === newMessage.content){
		return;
}
    if (!newMessage.guild) return;
    const auditChannel = await getAuditChannel(newMessage.guild.id);

    // not enabled
    if (auditChannel === null || !auditChannel) return;

    // channel not found/deleted
    if (
      !newMessage.guild.channels.cache.some((ch) => ch.name === auditChannel.name)
    )
      return;

    if (newMessage.author.id === client.user.id) return;

    const embed = new MessageEmbed()
      .setTitle(`Mensaje editado`)
      .addField("Autor", oldMessage.author)
      .addField("Canal", oldMessage.channel)
      .addField("Antes", oldMessage.content)
      .addField("Después", newMessage.content)
     .setThumbnail(oldMessage.author.avatarURL({ dynamic: true }))
      .setColor("ORANGE")
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setTimestamp();

    client.channels.cache.get(auditChannel.id).send({ embed });
  },
};