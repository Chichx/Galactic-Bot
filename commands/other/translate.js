const { MessageEmbed } = require("discord.js");
const translate = require("@k3rn31p4nic/google-translate-api");
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../../config.json");

module.exports = {
    name: "translate",
    description: 'Translate command',
    usage: '<Lenguaje> || <Texto>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
        const result = await translate(args.slice(1).join(" "), { to: args[0] });
    if (!args[0]) return message.reply(`Uso: ${(await prefixes.get(message.guild.id)) || PREFIX}translate <lenguaje> <texto>`);
    if (!args[1]) return message.reply(`Uso: ${(await prefixes.get(message.guild.id)) || PREFIX}translate <lenguaje> <texto>`);


        const embed = new MessageEmbed()
            .setDescription(result.text)
            .setColor("BLUE")
      .setTitle("Traductor")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setTimestamp()
      .setFooter(`Galactic Development`, 'https://i.imgur.com/rVaN5PZ.png')
      .setThumbnail('https://i.imgur.com/rVaN5PZ.png');

        message.channel.send(embed);
    }
};