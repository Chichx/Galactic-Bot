const { MessageEmbed } = require("discord.js");
const { getWelcomeChannel, getWelcomeRole } = require("../util/functions");

module.exports = {
  name: "guildMemberAdd",
  async execute(bot, member) {
    if (!member.guild.me.hasPermission("MANAGE_WEBHOOKS")) {
      return;
    }
    const welcomeChannel = await getWelcomeChannel(member.guild.id);
    const welcomeRole = await getWelcomeRole(member.guild.id);

    // not enabled
    if (welcomeRole !== null || welcomeRole) {
      member.roles.add(welcomeRole.id);
    }

    if (welcomeChannel !== null || welcomeChannel) {
      if (
        !member.guild.channels.cache.some(
          (ch) => ch.name === welcomeChannel.name
        )
      )
        return;

      const user = bot.users.cache.get(member.id);
      const guild = member.guild;
      const avatar = user.displayAvatarURL({ dynamic: true });

      const embed = new MessageEmbed()
        .setTitle(`Bienvenido a **${guild.name}**`)
        .setThumbnail(avatar)
        .setDescription(
          `
        **Nombre:** ${user.username}
        **Tag:** ${user.tag}
        **ID:** ${user.id}
        `
        )
        .setColor("GREEN")
        .setTimestamp()
        .setFooter(user.username, user.displayAvatarURL({ dynamic: true }));

      bot.channels.cache.get(welcomeChannel.id).send(embed);
    }
  },
};
