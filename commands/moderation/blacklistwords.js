const {
    getBlacklistWords,
    setBlacklistWords,
    addBlacklistWord,
  } = require("../../util/functions");
  
  module.exports = {
    name: "blacklistedwords",
    description: 'Blacklistedwords command',
    usage: '<add || list || remove> || <Palabra>',
    cooldown: 5,
    guildOnly: true,
    async execute(bot, message, args) {
      const option = args[0];
      const item = args[1];
      const guildId = message.guild.id;
      const blacklistWords = await getBlacklistWords(guildId);
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.channel.send(
        ":x: Tu no tienes permisos para usar este comando."
      );
    }
  
      if (!option) {
        return message.channel.send("Escribe un opción valida '`list`, `add`, `remove`'");
      }
  
      switch (option) {
        case "add": {
          if (blacklistWords === null || !blacklistWords) {
            setBlacklistWords(guildId, [item]);
          } else {
            addBlacklistWord(guildId, item);
          }
  
          return message.channel.send(`Se agrego la palabra **${item}** en las palabras prohibidas.`);
        }
        case "remove": {
          if (blacklistWords) {
            if (!blacklistWords.includes(item)) {
              return message.channel.send(
                `La palabra ${item} no existeen las palabras prohibidas.`
              );
            }
  
            const words = blacklistWords.filter(
              (w) => item.toLowerCase() !== w.toLowerCase()
            );
  
            setBlacklistWords(guildId, words);
  
            return message.channel.send(
              `Se removio correctamente la palabra **${item}** de las palabras prohibidas.`
            );
          } else {
            return message.channel.send("Esa palabra no esta en la lista.");
          }
        }
        case "list": {
          const words =
            blacklistWords !== null &&
            blacklistWords.map((w) => `\`${w}\``).join(", ");
          return message.channel.send(words || "No hay palabras en la lista.");
        }
        default: {
          return message.channel.send(`La opción ${option} no existe.`);
        }
      }
    },
  };