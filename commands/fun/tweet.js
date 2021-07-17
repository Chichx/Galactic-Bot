const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "tweet",
  description: 'Tweet command',
  usage: '<Texto>',
  cooldown: 5,
  guildOnly: true,
  async execute(bot, message, args) {
    const text = args.slice(1).join(' ');

    if(!args[0]){
        return message.channel.send(':x: Escribe un usuario que quieres que escriba el tweet!');
    }

    if (!text) return message.channel.send(":x: Escribe un texto valido!");

    const sendMsg = await message.channel.send("Generando la Imagen...");

    const data = await fetch(
      `https://nekobot.xyz/api/imagegen?type=tweet&username=${args[0]}&text=${text}`
    )
      .then((res) => res.json())
      .catch(() => {
        message.channel.send("Error! Intentalo mas tarde.");
      });

    sendMsg.delete();
    const embed = new MessageEmbed()
      .setTitle("Tweet!")
      .setColor("BLUE")
      .setImage(data.message)
      .setFooter(`Bot Created by Gaston#0001`, 'https://i.imgur.com/rVaN5PZ.png')
      .setTimestamp();

    message.channel.send({ embed });
  },
};