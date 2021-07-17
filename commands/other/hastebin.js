const hastebin = require("hastebin-gen");

module.exports = {
  name: "hastebin",
  description: 'Haste command',
  usage: '<extencion> || <codigo>',
  cooldown: 5,
  guildOnly: true,
  async execute(bot, message, args) {
    const extension = args[0];
    const code = args.slice(1).join(" ");

    if (!extension) {
      return message.channel.send(
        "Menciona una extención, Ejemplo: `js`, `py`, `html`, ..."
      );
    }

    if (!code) {
      return message.channel.send("Escribe un codigo.");
    }

    try {
      const haste = await hastebin(`${code}`, { extension: `${extension}` });

      message.channel.send(haste);
    } catch (e) {
      return message.channel.send(
        "Intentalo mas tarde."
      );
    }
  },
};