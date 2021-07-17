const Discord = require("discord.js");
const Keyv = require("keyv");
const prefixes = new Keyv("sqlite://db.sqlite");
const { PREFIX } = require("../../config.json");

module.exports = {
    name: 'say',
    description: 'Say command',
    usage: '<Texto>',
    cooldown: 5,
    guildOnly: true,
    async execute(client, message, args) {
  if (!message.member.hasPermission("MANAGE_MESSAGES"))
    return message.reply("No tenes permiso para usar este comando.");

  let botmessage = args.join(" ");

    if (!args[0]) return message.reply(`Por favor escriba un texto\nFormato: \`${(await prefixes.get(message.guild.id)) || PREFIX}say {texto}\``);

  message.delete().catch();

  message.channel.send(botmessage);
}};
