const fs = require("fs");
const config = require("../config.json");

module.exports = {
  name: "pruning",
  description: 'Pruning command',
  usage: '',
  cooldown: 5,
  guildOnly: true,
  execute(client, message) {
    config.PRUNING = !config.PRUNING;

    fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.log(err);
        return message.channel.send("Hubo un error").catch(console.error);
      }

      return message.channel
        .send(`Message pruning is ${config.PRUNING ? "**Enabled**" : "**Disabled**"}`)
        .catch(console.error);
    });
  }
};
