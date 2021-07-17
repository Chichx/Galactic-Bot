const { getWarningUsers, setWarningUsers } = require("../../util/functions");

module.exports = {
  name: "removeuserwarns",
  description: 'Removewarns command',
  usage: '<@Usuario>',
  cooldown: 5,
  guildOnly: true,
  async execute(bot, message, args) {
    if (!message.member.hasPermission("MANAGE_GUILD")) {
      return message.channel.send("No tienes permisos para usar este comando");
    }

    const guildId = message.guild.id;
    const member =
      message.guild.member(message.mentions.users.first()) ||
      message.guild.members.cache.get(args[1]);

    if (!member) {
      return message.channel.send("Menciona a un usuario valido!");
    }

    const warnings = await getWarningUsers(guildId);

    if (warnings === null) {
      return message.channel.send("No tiene warns.");
    }

    const filtered = warnings.filter((warn) => warn.user.id !== member.user.id);

    await setWarningUsers(guildId, filtered);

    return message.channel.send("Se le borraron correctamente todos los warns");
  },
};