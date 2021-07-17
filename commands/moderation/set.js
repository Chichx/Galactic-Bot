const {
  setAuditChannel,
  setLevelChannel,
  setWelcomeRole,
} = require("../../util/functions");

module.exports = {
  name: "set",
  description: 'Set command',
  usage: '<Option> || <@Canal>',
  cooldown: 5,
  guildOnly: true,
  async execute(client, message, args) {
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.reply(
        "No tienes los permisos para usar este comando."
      );

    const guildId = message.guild.id;
    const option = args[0];
    const item =
      message.mentions.channels.first() || message.mentions.roles.first();

    if (!option) return message.channel.send("Elige una opción valida. \`logs, mensajesniveles\`");
    if (!item)
      return message.channel.send("Elige un canal o rol valido.");

    switch (option.toLowerCase()) {
      case "logs":
        setAuditChannel(guildId, item);
        message.channel.send(
          `Los logs fueron activados. Logs activados en: ${item}`
        );
        break;
      case "mensajesniveles":
        setLevelChannel(guildId, item);
        message.channel.send(
          `Los niveles fueron activados. Niveles activados en: ${item}`
        );
        break;
      default:
        return message.channel.send(`\`${option}\` no es una opción`);
    }
  },
};