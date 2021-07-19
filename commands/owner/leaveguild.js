const config = require("../../config.json");

module.exports = {
  name: "leaveguild",
  description: 'Leaveguild command',
  usage: '<ID>',
  cooldown: 5,
  guildOnly: true,
  async execute(client, message, args) {

if(message.author.id !== config.ownerID) {
      return message.channel.send("No eres el creador del Bot.");
    }

    const guildId = args[0];

    if (!guildId) {
      return message.channel.send("Menciona la ID del servidor.");
    }

    const guild = client.guilds.cache.find((g) => g.id === guildId);

    if (!guild) {
      return message.channel.send("El servidor no existe.");
    }

    try {
      await guild.leave();
      message.channel.send(`El bot salio correctamente de: **${guild.name}**`);
    } catch (e) {
      console.error(e);
      return message.channel.send("An error occurred leaving that guild");
    }
  },
}